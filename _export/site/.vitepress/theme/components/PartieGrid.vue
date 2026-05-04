<script setup>
import PartieCard from './PartieCard.vue'

const parties = [
  { num: 1, title: 'Découvrir la grande voie', tag: 'Mise en route',
    desc: 'Pourquoi la GV change tout, ce qui la distingue de la couenne, ce qu\'il faut pour s\'y mettre.',
    image: '/images/escalade/escalade-vue-plongeante-paroi-01.webp',
    link: '/parties/partie1/chapitre-01' },
  { num: 2, title: 'Se préparer', tag: 'Le matos, la chaîne',
    desc: 'Choisir une voie à sa portée, le matériel, la préparation, la chaîne de sécurité.',
    image: '/images/escalade/escalade-relais-cordes-01.webp',
    link: '/parties/partie2/chapitre-04' },
  { num: 3, title: 'S\'organiser en cordée', tag: 'Travailler à deux',
    desc: 'Rôles, communication, stratégie de progression — la cordée comme système.',
    image: '/images/escalade/escalade-cordee-en-paroi-01.webp',
    link: '/parties/partie3/chapitre-08' },
  { num: 4, title: 'Fondamentaux techniques', tag: 'Le cœur du livre',
    desc: 'Nœuds, progression en tête, relais, rappel, réchappe — les manips qu\'on doit maîtriser.',
    image: '/images/escalade/escalade-relais-debut-longueur-01.webp',
    link: '/parties/partie4/chapitre-11' },
  { num: 5, title: 'Maîtriser relais et assurage', tag: 'Le détail qui change tout',
    desc: 'Construction de relais, organisation, assurage avancé. La précision compte.',
    image: '/images/escalade/escalade-relais-verdon-01.webp',
    link: '/parties/partie5/chapitre-16' },
  { num: 6, title: 'Gérer les situations', tag: 'Quand ça déborde',
    desc: 'Remontées sur corde, mouflages, improvisation, corde abîmée. Sortir de la mauvaise passe.',
    image: '/images/escalade/escalade-second-en-montee-01.webp',
    link: '/parties/partie6/chapitre-20' },
  { num: 7, title: 'Lire le terrain et décider', tag: 'Tête haute',
    desc: 'Lecture du relief, prise de décision, premiers secours. Garder une longueur d\'avance.',
    image: '/images/escalade/escalade-pilier-verdon-01.webp',
    link: '/parties/partie7/chapitre-24' },
  { num: 8, title: 'Vers l\'autonomie', tag: 'Faire route seul',
    desc: 'Progresser, éviter les erreurs fréquentes, accompagner ses seconds.',
    image: '/images/escalade/escalade-sommet-vue-verdon-01.webp',
    link: '/parties/partie8/chapitre-27' },
]
</script>

<template>
  <div class="partie-grid">
    <PartieCard v-for="p in parties" :key="p.num" v-bind="p" />
  </div>
</template>

<style scoped>
.partie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 22px;
  margin: 32px 0 56px;
}

@media (min-width: 900px) {
  