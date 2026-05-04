<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  image:    { type: String, default: '/images/escalade/escalade-vue-plongeante-cordes-01.webp' },
  eyebrow:  { type: String, default: 'Le livre — accès libre' },
  title:    { type: String, default: 'L\'escalade en grandes voies' },
  subtitle: { type: String, default: 'Manips, sécurité, organisation de cordée. Pour les grimpeurs qui veulent quitter le sol pour de bon.' },
  primaryText: { type: String, default: 'Commencer la lecture' },
  primaryLink: { type: String, default: '/parties/partie1/chapitre-01' },
  secondaryText: { type: String, default: 'Voir le sommaire' },
  secondaryLink: { type: String, default: '/sommaire' },
})

const offset = ref(0)
let raf = null

function onScroll () {
  if (raf) return
  raf = requestAnimationFrame(() => {
    offset.value = Math.min(window.scrollY * 0.3, 200)
    raf = null
  })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <section class="hero-escalade" :style="{ '--bg': `url('${image}')` }">
    <div class="hero-escalade__bg" :style="{ transform: `translate3d(0, ${offset}px, 0) scale(1.06)` }" />
    <div class="hero-escalade__veil" />

    <div class="hero-escalade__content">
      <span class="hero-escalade__eyebrow">{{ eyebrow }}</span>
      <h1 class="hero-escalade__title">{{ title }}</h1>
      <p class="hero-escalade__subtitle">{{ subtitle }}</p>

      <div class="hero-escalade__cta">
        <a class="hero-escalade__btn hero-escalade__btn--primary" :href="primaryLink">
          {{ primaryText }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M13 5l7 7-7 7"/>
          </svg>
        </a>
        <a class="hero-escalade__btn hero-escalade__btn--ghost" :href="secondaryLink">
          {{ secondaryText }}
        </a>
      </div>

      <div class="hero-escalade__scroll" aria-hidden="true">
        <span>Faire défiler</span>
        <span class="hero-escalade__scroll-line"></span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-escalade {
  position: relative;
  height: clamp(560px, 92vh, 880px);
  width: 100%;
  margin: 0 calc(50% - 50vw);
  margin-top: calc(var(--vp-nav-height) * -1);
  overflow: hidden;
  color: #fff;
  display: flex;
  align-items: flex-end;
  isolation: isolate;
}

.hero-escalade__bg {
  position: absolute;
  inset: -10% 0;
  background-image: var(--bg);
  background-size: cover;
  background-position: center;
  z-index: -2;
  will-change: transform;
}

.hero-escalade__veil {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(180deg, rgba(15,25,34,0.35) 0%, rgba(15,25,34,0.15) 30%, rgba(15,25,34,0.85) 100%),
    radial-gradient(120% 70% at 30% 20%, rgba(214, 48, 49, 0.12), transparent 60%);
}

.hero-escalade__content {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px 96px;
  animation: heroFadeUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.hero-escalade__eyebrow {
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.78rem;
  font-weight: 600;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 6px 14px;
  border-radius: 100px;
  margin-bottom: 24px;
}

.hero-escalade__title {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(2.4rem, 6vw, 5rem);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -0.02em;
  margin: 0 0 18px;
  text-shadow: 0 2px 24px rgba(0,0,0,0.35);
  max-width: 14ch;
}

.hero-escalade__subtitle {
  font-size: clamp(1.05rem, 1.6vw, 1.35rem);
  line-height: 1.5;
  max-width: 56ch;
  margin: 0 0 36px;
  color: rgba(255,255,255,0.92);
  text-shadow: 0 1px 12px rgba(0,0,0,0.3);
}

.hero-escalade__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 60px;
}

.hero-escalade__btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 26px;
  border-radius: 100px;
  font-weight: 600;
  font-size: 0.98rem;
  text-decoration: none !important;
  transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
}

.hero-escalade__btn--primary {
  background: linear-gradient(135deg, #e74c3c 0%, #d63031 100%);
  color: #fff !important;
  box-shadow: 0 8px 28px rgba(214,48,49,0.5);
}

.hero-escalade__btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(214,48,49,0.65);
}

.hero-escalade__btn--ghost {
  background: rgba(255,255,255,0.08);
  color: #fff !important;
  border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.hero-escalade__btn--ghost:hover {
  background: rgba(255,255,255,0.16);
  transform: translateY(-2px);
}

.hero-escalade__scroll {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
}

.hero-escalade__scroll-line {
  display: inline-block;
  width: 56px;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.7), transparent);
  position: relative;
  overflow: hidden;
}

.hero-escalade__scroll-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 50%;
  height: 100%;
  background: rgba(255,255,255,1);
  animation: scrollSlide 2.4s ease-in-out infinite;
}

@keyframes scrollSlide {
  0%   { left: -50%; }
  100% { left: 100%; }
}

@keyframes heroFadeUp {
  0%   { opacity: 0; transform: translateY(28px); }
  100% { opacity: 1; transform: translateY(0); }
}

@media (max-width: 720px) {
  .hero-escalade {
    height: clamp(520px, 80vh, 720px);
  }
  .hero-escalade__content {
    padding: 0 20px 64px;
  }
  .hero-escalade__title {
    max-width: none;
  }
}
</style>
