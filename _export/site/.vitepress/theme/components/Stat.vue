<script setup>
defineProps({
  num:    { type: [String, Number], required: true },
  label:  { type: String, required: true },
  hint:   { type: String, default: '' },
})
</script>

<template>
  <div class="stat">
    <div class="stat__num">{{ num }}</div>
    <div class="stat__label">{{ label }}</div>
    <div v-if="hint" class="stat__hint">{{ hint }}</div>
  </div>
</template>

<style scoped>
.stat {
  text-align: left;
  padding: 24px 4px;
}

.stat__num {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(2.6rem, 5vw, 3.6rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--vp-c-brand-1), #0a3d62);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.dark .stat__num {
  background: linear-gradient(135deg, #ff6b6b, #5dade2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat__label {
  font-weight: 600;
  font-size: 0.98rem;
  color: var(--vp-c-text-1);
}

.stat__hint {
  font-size: 0.86rem;
  color: var(--vp-c-text-2);
  margin-top: 4px;
}
</style>
