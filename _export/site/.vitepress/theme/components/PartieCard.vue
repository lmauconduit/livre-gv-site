<script setup>
defineProps({
  num:    { type: [String, Number], required: true },
  title:  { type: String, required: true },
  desc:   { type: String, default: '' },
  image:  { type: String, required: true },
  link:   { type: String, required: true },
  tag:    { type: String, default: '' },
})
</script>

<template>
  <a class="partie-card" :href="link">
    <div class="partie-card__media">
      <img :src="image" :alt="title" loading="lazy" />
      <span class="partie-card__num">P{{ num }}</span>
    </div>
    <div class="partie-card__body">
      <span v-if="tag" class="partie-card__tag">{{ tag }}</span>
      <h3 class="partie-card__title">{{ title }}</h3>
      <p v-if="desc" class="partie-card__desc">{{ desc }}</p>
      <span class="partie-card__cta">
        Lire la partie
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7"/>
        </svg>
      </span>
    </div>
  </a>
</template>

<style scoped>
.partie-card {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none !important;
  color: var(--vp-c-text-1);
  transition: transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.32s ease, border-color 0.32s ease;
  position: relative;
  height: 100%;
}

.partie-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 48px -16px rgba(10, 61, 98, 0.25);
  border-color: var(--vp-c-brand-1);
}

.partie-card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}

.partie-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.4s ease;
  filter: saturate(1.05);
}

.partie-card:hover .partie-card__media img {
  transform: scale(1.06);
  filter: saturate(1.15);
}

.partie-card__num {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(15,25,34,0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #fff;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  padding: 5px 10px;
  border-radius: 6px;
}

.partie-card__body {
  padding: 22px 22px 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.partie-card__tag {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-brand-1);
  margin-bottom: 10px;
}

.partie-card__title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.25;
  margin: 0 0 10px;
  color: var(--vp-c-text-1);
}

.partie-card__desc {
  font-size: 0.93rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  margin: 0 0 18px;
  flex: 1;
}

.partie-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--vp-c-brand-1);
  margin-top: auto;
  transition: gap 0.22s ease;
}

.partie-card:hover .partie-card__cta {
  gap: 10px;
}
</style>
