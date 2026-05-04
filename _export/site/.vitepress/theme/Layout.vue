<script setup>
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ChapitreHero from './components/ChapitreHero.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()

const isChapter = computed(() => Boolean(frontmatter.value?.chapitre))

// ============================================================
// Lightbox schémas : intercepte les clics globaux pour gérer
// l'ouverture/fermeture du mode plein écran sur .schema-figure
// ============================================================
function handleClick (e) {
  const expandBtn = e.target.closest('.schema-figure__expand-btn')
  const figureFullscreen = e.target.closest('.schema-figure.is-fullscreen')

  // Clic sur le bouton agrandir (entrée fullscreen ou fermeture si déjà ouvert)
  if (expandBtn) {
    e.preventDefault()
    e.stopPropagation()
    const figure = expandBtn.closest('.schema-figure')
    if (!figure) return
    const isOpen = figure.classList.contains('is-fullscreen')
    if (isOpen) {
      closeFullscreen(figure)
    } else {
      openFullscreen(figure)
    }
    return
  }

  // Clic dans la zone d'overlay (en dehors du SVG, en mode fullscreen) → fermer
  if (figureFullscreen) {
    const isInteractive = e.target.closest('svg, .schema-figure__caption')
    if (!isInteractive) {
      closeFullscreen(figureFullscreen)
    }
  }
}

function handleKeydown (e) {
  if (e.key === 'Escape') {
    const open = document.querySelector('.schema-figure.is-fullscreen')
    if (open) closeFullscreen(open)
  }
}

function openFullscreen (fig) {
  fig.classList.add('is-fullscreen')
  document.body.classList.add('has-schema-fullscreen')
}

function closeFullscreen (fig) {
  fig.classList.remove('is-fullscreen')
  document.body.classList.remove('has-schema-fullscreen')
}

// Fermer si on change de page
function closeAllOnRouteChange () {
  const open = document.querySelector('.schema-figure.is-fullscreen')
  if (open) closeFullscreen(open)
}

onMounted(() => {
  document.addEventListener('click', handleClick)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClick)
  document.removeEventListener('keydown', handleKeydown)
})

// Ferme le fullscreen quand on change de chapitre
import { watch } from 'vue'
watch(() => route.path, closeAllOnRouteChange)
</script>

<template>
  <Layout>
    <template #doc-before>
      <ChapitreHero v-if="isChapter" />
    </template>
  </Layout>
</template>
