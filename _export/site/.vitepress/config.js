import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Markdown-it plugin : remplace <<schema:fichier.mmd>> par un bloc mermaid
// DOIT être dans markdown.config (pas un Vite plugin) pour s'exécuter avant le parsing
function schemaIncludePlugin(md) {
  const originalParse = md.parse.bind(md)
  md.parse = (src, env) => {
    const processed = src.replace(/<<schema:([^>]+)>>/g, (match, filename) => {
      // __dirname = _export/site/.vitepress/  →  ../../../_schemas = PJT LivreEscaladeGV/_schemas
      const schemaPath = path.join(__dirname, '..', '..', '..', '_ressources', 'schemas', filename.trim())
      try {
        const content = fs.readFileSync(schemaPath, 'utf-8')
        return '```mermaid\n' + content.trim() + '\n```'
      } catch (e) {
        return `> ⚠️ Schéma introuvable : \`${filename.trim()}\``
      }
    })
    return originalParse(processed, env)
  }
}

export default withMermaid(defineConfig({
  lang: 'fr-FR',
  title: "L'escalade en grandes voies",
  description: "Guide technique complet pour grimper en grandes voies — manips, sécurité, organisation de cordée, gestion des situations.",

  // srcDir pointe vers la racine du projet (../../ depuis _export/site/)
  srcDir: '../../',

  // Exclure les dossiers système et l'ancienne structure
  srcExclude: [
    'Editorial/**',
    '_archive/**',
    '_meta/**',
    '_rapports/**',
    '_skill/**',
    '_Doc/**',
    '_export/**',
    'livre-gv-site/**',
    'node_modules/**',
  ],

  // Réécriture des URLs : Partie1-...md → /parties/partie1
  rewrites: {
    'Partie1-Decouvrir-la-Grande-Voie.md': 'parties/partie1.md',
    'Partie2-Se-Preparer.md':               'parties/partie2.md',
    'Partie3-Sorganiser-en-Cordee.md':      'parties/partie3.md',
    'Partie4-Fondamentaux-Techniques.md':   'parties/partie4.md',
    'Partie5-Maitriser-Relais-Assurage.md': 'parties/partie5.md',
    'Partie6-Gerer-les-Situations.md':      'parties/partie6.md',
    'Partie7-Lire-le-Terrain-et-Decider.md':'parties/partie7.md',
    'Partie8-Vers-lAutonomie.md':           'parties/partie8.md',
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#c0392b' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: "L'escalade en grandes voies" }],
    ['meta', { property: 'og:description', content: "Guide technique complet pour grimper en grandes voies." }],
  ],

  mermaid: {
    theme: 'neutral',
  },

  vite: {
    // publicDir pointe vers _ressources/ à la racine du projet
    // → _ressources/images/manips/... servi à /images/manips/...
    // __dirname = _export/site/.vitepress → ../../.. = PJT LivreEscaladeGV
    publicDir: path.join(__dirname, '..', '..', '..', '_ressources'),
  },

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Accueil', link: '/' },
      { text: 'Sommaire', link: '/sommaire' },
      {
        text: 'Parties',
        items: [
          { text: 'P1 — Découvrir la grande voie', link: '/parties/partie1' },
          { text: 'P2 — Se préparer', link: '/parties/partie2' },
          { text: 'P3 — S\'organiser en cordée', link: '/parties/partie3' },
          { text: 'P4 — Fondamentaux techniques', link: '/parties/partie4' },
          { text: 'P5 — Maîtriser relais et assurage', link: '/parties/partie5' },
          { text: 'P6 — Gérer les situations', link: '/parties/partie6' },
          { text: 'P7 — Lire le terrain et décider', link: '/parties/partie7' },
          { text: 'P8 — Vers l\'autonomie', link: '/parties/partie8' },
        ]
      },
    ],

    sidebar: [
      {
        text: '📖 Introduction',
        items: [
          { text: 'Avant-propos', link: '/avant-propos' },
          { text: 'Sommaire complet', link: '/sommaire' },
          { text: 'Comment lire ce livre', link: '/comment-lire' },
        ]
      },
      {
        text: 'Partie 1 — Découvrir la grande voie',
        collapsed: false,
        items: [
          { text: 'Ch.1 — Pourquoi grimper en GV', link: '/parties/partie1#chapitre-1' },
        ]
      },
      {
        text: 'Partie 2 — Se préparer',
        collapsed: true,
        items: [
          { text: 'Ch.2 — Le matériel', link: '/parties/partie2#chapitre-2' },
          { text: 'Ch.3 — La préparation', link: '/parties/partie2#chapitre-3' },
          { text: 'Ch.4 — La chaîne de sécurité', link: '/parties/partie2#chapitre-4' },
        ]
      },
      {
        text: 'Partie 3 — S\'organiser en cordée',
        collapsed: true,
        items: [
          { text: 'Ch.5 — Les rôles en cordée', link: '/parties/partie3#chapitre-5' },
          { text: 'Ch.6 — La communication', link: '/parties/partie3#chapitre-6' },
          { text: 'Ch.7 — Stratégie de progression', link: '/parties/partie3#chapitre-7' },
        ]
      },
      {
        text: 'Partie 4 — Fondamentaux techniques',
        collapsed: true,
        items: [
          { text: 'Ch.8 — Les nœuds', link: '/parties/partie4#chapitre-8' },
          { text: 'Ch.9 — Progression en tête', link: '/parties/partie4#chapitre-9' },
          { text: 'Ch.10 — Construire les relais', link: '/parties/partie4#chapitre-10' },
          { text: 'Ch.11 — Le rappel', link: '/parties/partie4#chapitre-11' },
          { text: 'Ch.12 — La réchappe', link: '/parties/partie4#chapitre-12' },
        ]
      },
      {
        text: 'Partie 5 — Maîtriser relais et assurage',
        collapsed: true,
        items: [
          { text: 'Ch.13 — Relais naturels', link: '/parties/partie5#chapitre-13' },
          { text: 'Ch.14 — Relais sur spits', link: '/parties/partie5#chapitre-14' },
          { text: 'Ch.15 — Organisation au relais', link: '/parties/partie5#chapitre-15' },
          { text: 'Ch.16 — Assurage avancé', link: '/parties/partie5#chapitre-16' },
        ]
      },
      {
        text: 'Partie 6 — Gérer les situations',
        collapsed: true,
        items: [
          { text: 'Ch.17 — Remontées sur corde', link: '/parties/partie6#chapitre-17' },
          { text: 'Ch.18 — Mouflages', link: '/parties/partie6#chapitre-18' },
          { text: 'Ch.19 — Improvisation', link: '/parties/partie6#chapitre-19' },
          { text: 'Ch.20 — Corde abîmée', link: '/parties/partie6#chapitre-20' },
        ]
      },
      {
        text: 'Partie 7 — Lire le terrain et décider',
        collapsed: true,
        items: [
          { text: 'Ch.21 — Lecture du terrain', link: '/parties/partie7#chapitre-21' },
          { text: 'Ch.22 — Prise de décision', link: '/parties/partie7#chapitre-22' },
          { text: 'Ch.23 — Premiers secours', link: '/parties/partie7#chapitre-23' },
        ]
      },
      {
        text: 'Partie 8 — Vers l\'autonomie',
        collapsed: true,
        items: [
          { text: 'Ch.24 — Progresser', link: '/parties/partie8#chapitre-24' },
          { text: 'Ch.25 — Les erreurs fréquentes', link: '/parties/partie8#chapitre-25' },
          { text: 'Ch.26 — Aider les seconds', link: '/parties/partie8#chapitre-26' },
        ]
      },
      {
        text: '📎 Annexes',
        collapsed: true,
        items: [
          { text: 'Glossaire', link: '/annexes/glossaire' },
          { text: 'Check-lists', link: '/annexes/checklists' },
          { text: 'Aide-mémoire nœuds', link: '/annexes/noeuds' },
          { text: 'Tableaux de décision', link: '/annexes/decisions' },
        ]
      },
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Rechercher', buttonAriaLabel: 'Rechercher' },
              modal: {
                noResultsText: 'Aucun résultat pour',
                resetButtonTitle: 'Effacer',
                footer: { selectText: 'pour sélectionner', navigateText: 'pour naviguer' }
              }
            }
          }
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lmauconduit/livre-gv-site' }
    ],

    footer: {
      message: 'Contenu sous licence Creative Commons BY-NC-SA 4.0',
      copyright: '© 2026 — L\'escalade en grandes voies'
    },

    editLink: {
      pattern: 'https://github.com/lmauconduit/livre-gv-site/edit/main/:path',
      text: 'Suggérer une correction sur GitHub'
    },

    lastUpdated: { text: 'Mis à jour le' },
    docFooter: { prev: 'Chapitre précédent', next: 'Chapitre suivant' },
    outlineTitle: 'Sur cette page',
    returnToTopLabel: 'Retour en haut',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Thème',
  },

  markdown: {
    config(md) {
      schemaIncludePlugin(md)
    },
    container: {
      tipLabel: 'TERRAIN',
      warningLabel: 'RAPPEL',
      dangerLabel: '⚡ ALERTE',
      infoLabel: 'INFO',
      detailsLabel: 'Détails',
    }
  }
}))
