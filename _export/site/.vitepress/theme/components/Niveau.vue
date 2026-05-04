<script setup>
const props = defineProps({
  type: { type: String, required: true, validator: v => ['T', 'A', 'R'].includes(v) }
})

const labels = {
  T: 'Tronc commun',
  A: 'Approfondissement',
  R: 'Référence',
}
</script>

<template>
  <span :class="['niveau', `niveau--${type}`]">
    <span class="niveau__letter">[{{ type }}]</span>
    <span class="niveau__label">{{ labels[type] }}</span>
  </span>
</template>

<style scoped>
.niveau {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 4px 10px 4px 8px;
  border-radius: 100px;
  letter-spacing: 0.02em;
  vertical-align: middle;
}

.niveau__letter {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-weight: 700;
  font-size: 0.72rem;
}

.niveau--T {
  background: rgba(0, 168, 132, 0.14);
  color: #007a5e;
}

.niveau--A {
  background: rgba(230, 126, 34, 0.16);
  color: #b85b10;
}

.niveau--R {
  background: rgba(125, 95, 200, 0.16);
  color: #5a3fa0;
}

.dark .niveau--T { background: rgba(0, 168, 132, 0.22); color: #6deec8; }
.dark .niveau--A { background: rgba(230, 126, 34, 0.22); color: #ffba75; }
.dark .niveau--R { background: rgba(155, 130, 230, 0.22); color: #c8b5ff; }
</style>
