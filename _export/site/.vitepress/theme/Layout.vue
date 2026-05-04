<script setup>
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ChapitreHero from './components/ChapitreHero.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()

const isChapter = computed(() => Boolean(frontmatter.value?.chapitre))

// ============================================================
// Toggle agrandissement des schémas via le bouton ⤢ / ✕
// L'agrandissement reste in-flow (max-width 100%, SVG plus grand).
// ============================================================
function handleClick (e) {
  const expandBtn = e.target.closest('.schema-figure__expand-btn')
  if (!expandBtn) return
  e.preventDefault()
  const figure = expandBtn.closest('.schema-figure')
  if (!figure) return
  figure.classList.toggle('is-fullscreen')
}

function closeAllOnRouteChange () {
  document.querySelectorAll('.schema-figure.is-fullscreen').forEach(f => {
    f.classList.remove('is-fullscreen')
  })
}

onMounted(() => {
  document.addEventListener('click', handleClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClick)
})

watch(() => route.path, closeAllOnRouteChange)
</script>

<template>
  <Layout>
    <template #doc-before>
      <ChapitreHero v-if="isChapter" />
    </template>
  </Layout>
</template>
