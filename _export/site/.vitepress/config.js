import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Markdown-it plugin : remplace <<schema:fichier.mmd>> ou <<schema:fichier.mmd|preset>> par un bloc mermaid
function schemaIncludePlugin(md) {
  const originalParse = md.parse.bind(md)
  md.parse = (src, env) => {
    const processed = src.replace(/<<schema:([^>|]+)(?:\|[^>]+)?>>/g, (match, filename) => {
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

  // Tolérer les liens cassés (annexes, avant-propos, références internes) tant que tous les fichiers ne sont pas créés
  ignoreDeadLinks: true,

  srcDir: '../../',

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
    // Anciens fichiers de partie monolithiques — découpés en parties/partieN/chapitre-NN.md
    'Partie1-Decouvrir-la-Grande-Voie.md',
    'Partie2-Se-Preparer.md',
    'Partie3-Sorganiser-en-Cordee.md',
    'Partie4-Fondamentaux-Techniques.md',
    'Partie5-Maitriser-Relais-Assurage.md',
    'Partie6-Gerer-les-Situations.md',
    'Partie7-Lire-le-Terrain-et-Decider.md',
    'Partie8-Vers-lAutonomie.md',
  ],

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#d63031' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: "L'escalade en grandes voies" }],
    ['meta', { property: 'og:description', content: "Guide technique complet pour grimper en grandes voies." }],
  ],

  mermaid: {
    theme: 'neutral',
  },

  vite: {
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
          { text: 'P1 — Découvrir la grande voie', link: '/parties/partie1/chapitre-01' },
          { text: 'P2 — Se préparer',               link: '/parties/partie2/chapitre-04' },
          { text: 'P3 — S\'organiser en cordée',    link: '/parties/partie3/chapitre-08' },
          { text: 'P4 — Fondamentaux techniques',   link: '/parties/partie4/chapitre-11' },
          { text: 'P5 — Maîtriser relais et assurage', link: '/parties/partie5/chapitre-16' },
          { text: 'P6 — Gérer les situations',      link: '/parties/partie6/chapitre-20' },
          { text: 'P7 — Lire le terrain et décider', link: '/parties/partie7/chapitre-24' },
          { text: 'P8 — Vers l\'autonomie',         link: '/parties/partie8/chapitre-27' },
        ]
      },
    ],

    sidebar: [
      {
        text: '📖 Introduction',
        items: [
          { text: 'Avant-propos',         link: '/avant-propos' },
          { text: 'Sommaire complet',     link: '/sommaire' },
          { text: 'Comment lire ce livre', link: '/comment-lire' },
        ]
      },
      {
        text: 'Partie 1 — Découvrir la grande voie',
        collapsed: false,
        items: [
          { text: 'Ch.1 — Pourquoi grimper en grande voie', link: '/parties/partie1/chapitre-01' },
          { text: 'Ch.2 — Une autre façon de grimper',      link: '/parties/partie1/chapitre-02' },
          { text: 'Ch.3 — Avec quoi',                       link: '/parties/partie1/chapitre-03' },
        ]
      },
      {
        text: 'Partie 2 — Se préparer',
        collapsed: true,
        items: [
          { text: 'Ch.4 — Choisir sa voie',           link: '/parties/partie2/chapitre-04' },
          { text: 'Ch.5 — Le matériel de grande voie', link: '/parties/partie2/chapitre-05' },
          { text: 'Ch.6 — Préparer sa course',         link: '/parties/partie2/chapitre-06' },
          { text: 'Ch.7 — La chaîne de sécurité',      link: '/parties/partie2/chapitre-07' },
        ]
      },
      {
        text: 'Partie 3 — S\'organiser en cordée',
        collapsed: true,
        items: [
          { text: 'Ch.8 — Les rôles dans la cordée', link: '/parties/partie3/chapitre-08' },
          { text: 'Ch.9 — Communiquer en paroi',     link: '/parties/partie3/chapitre-09' },
          { text: 'Ch.10 — Stratégie de progression', link: '/parties/partie3/chapitre-10' },
        ]
      },
      {
        text: 'Partie 4 — Fondamentaux techniques',
        collapsed: true,
        items: [
          { text: 'Ch.11 — Les nœuds essentiels',    link: '/parties/partie4/chapitre-11' },
          { text: 'Ch.12 — Progresser en tête',       link: '/parties/partie4/chapitre-12' },
          { text: 'Ch.13 — Le relais simple',         link: '/parties/partie4/chapitre-13' },
          { text: 'Ch.14 — La descente en rappel',    link: '/parties/partie4/chapitre-14' },
          { text: 'Ch.15 — Les réchappes',            link: '/parties/partie4/chapitre-15' },
        ]
      },
      {
        text: 'Partie 5 — Maîtriser relais et assurage',
        collapsed: true,
        items: [
          { text: 'Ch.16 — Comprendre les relais',         link: '/parties/partie5/chapitre-16' },
          { text: 'Ch.17 — Les relais en pratique',         link: '/parties/partie5/chapitre-17' },
          { text: 'Ch.18 — Organiser un relais propre',     link: '/parties/partie5/chapitre-18' },
          { text: 'Ch.19 — Techniques d\'assurage avancées', link: '/parties/partie5/chapitre-19' },
        ]
      },
      {
        text: 'Partie 6 — Gérer les situations',
        collapsed: true,
        items: [
          { text: 'Ch.20 — Remontées sur corde',     link: '/parties/partie6/chapitre-20' },
          { text: 'Ch.21 — Les mouflages',            link: '/parties/partie6/chapitre-21' },
          { text: 'Ch.22 — Improviser sans matériel', link: '/parties/partie6/chapitre-22' },
          { text: 'Ch.23 — Gérer un rappel sur corde abîmée', link: '/parties/partie6/chapitre-23' },
        ]
      },
      {
        text: 'Partie 7 — Lire le terrain et décider',
        collapsed: true,
        items: [
          { text: 'Ch.24 — Lire le terrain',           link: '/parties/partie7/chapitre-24' },
          { text: 'Ch.25 — Les facteurs de décision',  link: '/parties/partie7/chapitre-25' },
          { text: 'Ch.26 — Premiers secours en paroi', link: '/parties/partie7/chapitre-26' },
        ]
      },
      {
        text: 'Partie 8 — Vers l\'autonomie',
        collapsed: true,
        items: [
          { text: 'Ch.27 — Construire sa progression', link: '/parties/partie8/chapitre-27' },
          { text: 'Ch.28 — Les erreurs classiques',     link: '/parties/partie8/chapitre-28' },
          { text: 'Ch.29 — Aide aux seconds',           link: '/parties/partie8/chapitre-29' },
        ]
      },
      {
        text: '📎 Annexes',
        collapsed: true,
        items: [
          { text: 'Glossaire',          link: '/annexes/glossaire' },
          { text: 'Check-lists',        link: '/annexes/checklists' },
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
