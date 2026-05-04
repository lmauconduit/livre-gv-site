<script setup>
import Stat from './Stat.vue'
</script>

<template>
  <div class="stat-grid">
    <Stat num="27" label="chapitres" hint="organisés en progression pédagogique" />
    <Stat num="8" label="parties" hint="de la découverte à l'autonomie" />
    <Stat num="3" label="niveaux de lecture" hint="[T] tronc commun · [A] approfondissement · [R] référence" />
    <Stat num="100%" label="accès libre" hint="gratuit, sans publicité, licence Creative Commons" />
  </div>
</template>

<style scoped>
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px 28px;
  margin: 32px 0 48px;
  padding: 32px 28px;
  background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.stat-grid::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(0,168,132,0.12), transparent 70%);
  pointer-events: none;
}
</style>
