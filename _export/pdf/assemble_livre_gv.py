#!/usr/bin/env python3
"""Assemble le livre "L'escalade en grandes voies" en un PDF versionné.

Fonctionnalités :
- Concatène les fichiers d'intro + 8 parties (chacune avec ses chapitres) dans l'ordre défini
- Pré-processeur Mermaid : remplace les balises <<schema:nom.mmd|preset?>> par des images
  rendues depuis les fichiers _ressources/schemas/<nom>.mmd
- Supporte aussi les blocs ```mermaid inline dans les .md
- Génère le PDF via pandoc + XeLaTeX
- Versionnage automatique (v1, v2...)
"""

import os
import re
import subprocess
import sys
import hashlib
from datetime import date
from pathlib import Path

# Le script vit dans _export/pdf/ — PROJECT_DIR est 2 niveaux au-dessus
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPT_DIR.parent.parent
OUTPUT_DIR  = SCRIPT_DIR
SCHEMAS_DIR = PROJECT_DIR / "_ressources" / "schemas"
RENDERED_SCHEMAS_DIR = OUTPUT_DIR / "_schemas_rendered"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
SCHEMAS_DIR.mkdir(parents=True, exist_ok=True)
RENDERED_SCHEMAS_DIR.mkdir(parents=True, exist_ok=True)

MMDC = "/tmp/npm-global/node_modules/.bin/mmdc"
MERMAID_CONFIG = OUTPUT_DIR / "_mermaid_config.json"

# Structure du livre — depuis la migration 2026-05-05, 1 fichier .md par chapitre à la racine.
INTRO_FILES = [
    ("00-comment-lire.md", "Comment lire ce guide"),
]

PARTS_ORDER = [
    {
        "title": "Partie 1 — Découvrir la grande voie",
        "chapters": [
            "P1-Ch01-pourquoi-grimper.md",
            "P1-Ch02-une-autre-facon.md",
            "P1-Ch03-avec-quoi.md",
        ],
    },
    {
        "title": "Partie 2 — Se préparer",
        "chapters": [
            "P2-Ch04-choisir-sa-voie.md",
            "P2-Ch05-materiel.md",
            "P2-Ch06-preparer-sa-course.md",
            "P2-Ch07-chaine-de-securite.md",
        ],
    },
    {
        "title": "Partie 3 — S'organiser en cordée",
        "chapters": [
            "P3-Ch08-roles-cordee.md",
            "P3-Ch09-communiquer.md",
            "P3-Ch10-strategie-progression.md",
        ],
    },
    {
        "title": "Partie 4 — Les fondamentaux techniques",
        "chapters": [
            "P4-Ch11-noeuds.md",
            "P4-Ch12-progresser-en-tete.md",
            "P4-Ch13-relais-simple.md",
            "P4-Ch14-rappel.md",
            "P4-Ch15-rechappes.md",
        ],
    },
    {
        "title": "Partie 5 — Maîtriser les relais et l'assurage",
        "chapters": [
            "P5-Ch16-comprendre-relais.md",
            "P5-Ch17-relais-pratique.md",
            "P5-Ch18-relais-propre.md",
            "P5-Ch19-assurage-avance.md",
        ],
    },
    {
        "title": "Partie 6 — Gérer les situations",
        "chapters": [
            "P6-Ch20-remontees.md",
            "P6-Ch21-mouflages.md",
            "P6-Ch22-improviser.md",
            "P6-Ch23-corde-abimee.md",
        ],
    },
    {
        "title": "Partie 7 — Lire le terrain et décider",
        "chapters": [
            "P7-Ch24-lire-terrain.md",
            "P7-Ch25-facteurs-decision.md",
            "P7-Ch26-premiers-secours.md",
        ],
    },
    {
        "title": "Partie 8 — Vers l'autonomie",
        "chapters": [
            "P8-Ch27-construire-progression.md",
            "P8-Ch28-erreurs-classiques.md",
            "P8-Ch29-aide-seconds.md",
        ],
    },
]


def strip_frontmatter(content: str) -> str:
    """Retire le frontmatter YAML d'un fichier .md s'il est présent."""
    if content.startswith("---\n"):
        end = content.find("\n---\n", 4)
        if end != -1:
            return content[end + 5:].lstrip()
    return content


SCHEMA_SIZE_PRESETS = {
    "xs": {"width": "45%",  "height": "5cm"},
    "s":  {"width": "60%",  "height": "7cm"},
    "m":  {"width": "75%",  "height": "10cm"},
    "l":  {"width": "90%",  "height": "14cm"},
    "xl": {"width": "100%", "height": "18cm"},
}
DEFAULT_SCHEMA_SIZE = "m"


def ensure_mermaid_config():
    if not MERMAID_CONFIG.exists():
        MERMAID_CONFIG.write_text("""{
  "theme": "default",
  "themeVariables": {
    "fontFamily": "Liberation Sans, Arial, sans-serif",
    "fontSize": "16px",
    "primaryColor": "#FEF3C7",
    "primaryTextColor": "#78350F",
    "primaryBorderColor": "#D97706",
    "lineColor": "#475569",
    "secondaryColor": "#FFF7ED",
    "tertiaryColor": "#FAFAF9"
  },
  "flowchart": { "htmlLabels": true, "curve": "basis" }
}
""", encoding="utf-8")


def render_mermaid(mmd_source: str, out_png: Path) -> bool:
    tmp_mmd = out_png.with_suffix(".mmd")
    tmp_mmd.write_text(mmd_source, encoding="utf-8")
    cmd = [MMDC, "-i", str(tmp_mmd), "-o", str(out_png),
           "-c", str(MERMAID_CONFIG), "--backgroundColor", "white", "--scale", "2"]
    env = {**os.environ, "TMPDIR": "/tmp", "TEMP": "/tmp", "TMP": "/tmp"}
    for k in ("USERPROFILE", "APPDATA", "LOCALAPPDATA"):
        env.pop(k, None)
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=60, env=env)
    if result.returncode != 0:
        print(f"[ERREUR Mermaid] {out_png.name} :", result.stderr[-500:], file=sys.stderr)
        return False
    return True


def substitute_schema_tags(content: str, chapter_filename: str) -> str:
    pattern = re.compile(r"<<schema:([^>|]+)(?:\|([^>]+))?>>")
    def replacer(match):
        schema_filename = match.group(1).strip()
        size_key = (match.group(2) or DEFAULT_SCHEMA_SIZE).strip().lower()
        schema_name = schema_filename.rsplit(".", 1)[0]
        mmd_file = SCHEMAS_DIR / schema_filename
        png_file = RENDERED_SCHEMAS_DIR / f"{schema_name}.png"
        if not mmd_file.exists():
            print(f"[WARN] Schéma introuvable : {mmd_file}", file=sys.stderr)
            return f"*[Schéma manquant : `{schema_filename}`]*"
        if size_key not in SCHEMA_SIZE_PRESETS:
            size_key = DEFAULT_SCHEMA_SIZE
        size = SCHEMA_SIZE_PRESETS[size_key]
        need_render = not png_file.exists() or mmd_file.stat().st_mtime > png_file.stat().st_mtime
        if need_render:
            print(f"[RENDU] {schema_filename} → {png_file.name}")
            mmd_content = mmd_file.read_text(encoding="utf-8")
            if not render_mermaid(mmd_content, png_file):
                return f"*[Erreur de rendu : `{schema_name}`]*"
        w_str = size['width'].rstrip('%')
        h_str = size['height']
        w_latex = f"{float(w_str)/100}\\linewidth"
        latex = ("\\begin{center}\n"
                 f"\\includegraphics[width={w_latex},height={h_str}]{{{png_file}}}\n"
                 "\\end{center}")
        return f"\n\n```{{=latex}}\n{latex}\n```\n\n"
    return pattern.sub(replacer, content)


def substitute_inline_mermaid(content: str, chapter_filename: str) -> str:
    pattern = re.compile(r"^```mermaid\s*\n(.*?)\n```\s*$", re.DOTALL | re.MULTILINE)
    def replacer(match):
        mmd_code = match.group(1)
        h = hashlib.sha1(mmd_code.encode()).hexdigest()[:10]
        basename = f"{Path(chapter_filename).stem}-inline-{h}"
        png_file = RENDERED_SCHEMAS_DIR / f"{basename}.png"
        if not png_file.exists():
            print(f"[RENDU inline] {basename}")
            if not render_mermaid(mmd_code, png_file):
                return match.group(0)
        return f"\n\n![]({png_file}){{ width=80% }}\n\n"
    return pattern.sub(replacer, content)


def detect_next_version():
    existing = []
    for f in OUTPUT_DIR.glob("livre-gv_v*.pdf"):
        m = re.match(r"livre-gv_v(\d+)\.pdf", f.name)
        if m:
            existing.append(int(m.group(1)))
    return max(existing) + 1 if existing else 1


def build_assembled_markdown(version):
    today = date.today().strftime("%d %B %Y").replace(
        "January", "janvier").replace("February", "février").replace("March", "mars").replace(
        "April", "avril").replace("May", "mai").replace("June", "juin").replace(
        "July", "juillet").replace("August", "août").replace("September", "septembre").replace(
        "October", "octobre").replace("November", "novembre").replace("December", "décembre")

    parts = [f"""---
title: "L'escalade en grandes voies"
subtitle: "Guide technique pour la cordée autonome"
author: "Ludovic Mauconduit"
date: "{today}"
version: "v{version}"
documentclass: report
papersize: a4
geometry: margin=2.5cm
fontsize: 11pt
mainfont: "Liberation Serif"
sansfont: "Liberation Sans"
monofont: "Liberation Mono"
lang: fr
toc: true
toc-depth: 2
numbersections: false
colorlinks: true
linkcolor: "BrickRed"
urlcolor: "BrickRed"
toccolor: "black"
header-includes: |
    \\usepackage{{fancyhdr}}
    \\pagestyle{{fancy}}
    \\fancyhead[L]{{\\textit{{L'escalade en grandes voies}}}}
    \\fancyhead[R]{{v{version}}}
    \\fancyfoot[C]{{\\thepage}}
    \\renewcommand{{\\headrulewidth}}{{0.4pt}}
    \\usepackage{{fvextra}}
    \\DefineVerbatimEnvironment{{Highlighting}}{{Verbatim}}{{breaklines,commandchars=\\\\\\{{\\}},fontsize=\\footnotesize}}
    \\usepackage{{framed}}
    \\definecolor{{shadecolor}}{{RGB}}{{248,249,250}}
    \\usepackage{{graphicx}}
    \\setkeys{{Gin}}{{keepaspectratio=true}}
---

"""]

    # 1. Fichiers d'introduction
    for filename, chapter_title in INTRO_FILES:
        filepath = PROJECT_DIR / filename
        if not filepath.exists():
            print(f"[WARN] Fichier intro manquant : {filename}", file=sys.stderr)
            continue
        content = strip_frontmatter(filepath.read_text(encoding="utf-8"))
        lines = content.splitlines()
        if lines and lines[0].startswith("# "):
            lines[0] = f"# {chapter_title}"
        elif not any(l.startswith("# ") for l in lines[:3]):
            lines.insert(0, f"# {chapter_title}\n")
        content = "\n".join(lines)
        content = substitute_schema_tags(content, filename)
        content = substitute_inline_mermaid(content, filename)
        parts.append("\n\n\\newpage\n\n")
        parts.append(content)

    # 2. Parties — H1 par partie + H2 par chapitre (TOC propre)
    for part in PARTS_ORDER:
        parts.append("\n\n\\newpage\n\n")
        parts.append(f"# {part['title']}\n")
        for filename in part["chapters"]:
            filepath = PROJECT_DIR / filename
            if not filepath.exists():
                print(f"[WARN] Chapitre manquant : {filename}", file=sys.stderr)
                continue
            content = strip_frontmatter(filepath.read_text(encoding="utf-8"))
            content = substitute_schema_tags(content, filename)
            content = substitute_inline_mermaid(content, filename)
            parts.append("\n\n\\newpage\n\n")
            parts.append(content)

    return "\n".join(parts)


def main():
    ensure_mermaid_config()
    version = detect_next_version()
    print(f"[INFO] Génération v{version}")
    md_content = build_assembled_markdown(version)
    tmp_md = OUTPUT_DIR / f"livre-gv_v{version}.md"
    tmp_md.write_text(md_content, encoding="utf-8")
    print(f"[INFO] Markdown assemblé : {tmp_md} ({len(md_content.split())} mots)")
    pdf_path = OUTPUT_DIR / f"livre-gv_v{version}.pdf"
    cmd = ["pandoc", str(tmp_md), "-o", str(pdf_path),
           "--pdf-engine=xelatex", "--toc", "--toc-depth=2", "-V", "classoption=openany"]
    print(f"[INFO] Commande : {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("[ERREUR] Pandoc a échoué")
        print("STDOUT:", result.stdout[-2000:])
        print("STDERR:", result.stderr[-2000:])
        sys.exit(1)
    size_kb = pdf_path.stat().st_size / 1024
    print(f"[OK] PDF généré : {pdf_path} ({size_kb:.0f} Ko)")


if __name__ == "__main__":
    main()
