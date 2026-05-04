<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ChapitreHero from './components/ChapitreHero.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()

// Le hero ne s'affiche que sur les pages de chapitre (frontmatter.chapitre défini)
const isChapter = computed(() => Boolean(frontmatter.value?.chapitre))
</script>

<template>
  <Layout>
    <template #doc-before>
      <ChapitreHero v-if="isChapter" />
    </template>
  </Layout>
</template>
