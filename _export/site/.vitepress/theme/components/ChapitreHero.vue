<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()

// Mapping partie -> image d'ambiance (mêmes photos que PartieGrid)
const PARTIE_IMAGES = {
  1: '/images/escalade/escalade-vue-plongeante-paroi-01.webp',
  2: '/images/escalade/escalade-relais-cordes-01.webp',
  3: '/images/escalade/escalade-cordee-en-paroi-01.webp',
  4: '/images/escalade/escalade-relais-debut-longueur-01.webp',
  5: '/images/escalade/escalade-relais-verdon-01.webp',
  6: '/images/escalade/escalade-second-en-montee-01.webp',
  7: '/images/escalade/escalade-pilier-verdon-01.webp',
  8: '/images/escalade/escalade-sommet-vue-verdon-01.webp',
}

const PARTIE_TITLES = {
  1: 'Découvrir la grande voie',
  2: 'Se préparer',
  3: "S'organiser en cordée",
  4: 'Fondamentaux techniques',
  5: 'Maîtriser relais et assurage',
  6: 'Gérer les situations',
  7: 'Lire le terrain et décider',
  8: "Vers l'autonomie",
}

const partieNum = computed(() => frontmatter.value?.partie || 1)
const chapitreNum = computed(() => frontmatter.value?.chapitre || '')
const image = computed(() => PARTIE_IMAGES[partieNum.value] || PARTIE_IMAGES[1])
const partieTitle = computed(() => PARTIE_TITLES[partieNum.value] || '')

// Titre du chapitre : prend frontmatter.title, ou utilise le H1/H2 par défaut
const chapTitle = computed(() => {
  const t = frontmatter.value?.title || ''
  // Enlever "Ch.N — " du début si présent
  return t.replace(/^Ch\.\d+\s*[—–-]\s*/, '')
})

const niveau = computed(() => frontmatter.value?.niveau)
</script>

<template>
  <section class="chapitre-hero" :style="{ '--bg': `url('${image}')` }">
    <div class="chapitre-hero__bg" />
    <div class="chapitre-hero__veil" />

    <div class="chapitre-hero__content">
      <div class="chapitre-hero__eyebrow">
        <span class="chapitre-hero__partie-num">P{{ partieNum }}</span>
        <span class="chapitre-hero__partie-title">{{ partieTitle }}</span>
      </div>
      <h1 class="chapitre-hero__title">
        <span class="chapitre-hero__chap-num">Chapitre {{ chapitreNum }}</span>
        <span class="chapitre-hero__chap-text">{{ chapTitle }}</span>
        <span v-if="niveau" :class="['chapitre-hero__niveau', `chapitre-hero__niveau--${niveau}`]">[{{ niveau }}]</span>
      </h1>
    </div>
  </section>
</template>

<style scoped>
.chapitre-hero {
  position: relative;
  width: 100%;
  height: clamp(220px, 36vw, 340px);
  overflow: hidden;
  margin-bottom: 40px;
  border-radius: 14px;
  isolation: isolate;
  color: #fff;
  display: flex;
  align-items: flex-end;
  animation: chapHeroFadeUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.chapitre-hero__bg {
  position: absolute;
  inset: 0;
  background-image: var(--bg);
  background-size: cover;
  background-position: center;
  z-index: -2;
}

.chapitre-hero__veil {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(180deg, rgba(15,25,34,0.25) 0%, rgba(15,25,34,0.45) 60%, rgba(15,25,34,0.85) 100%),
    radial-gradient(120% 70% at 30% 20%, rgba(214, 48, 49, 0.10), transparent 60%);
}

.chapitre-hero__content {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0 32px 28px;
}

.chapitre-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.22);
  padding: 5px 14px 5px 6px;
  border-radius: 100px;
  margin-bottom: 18px;
  font-size: 0.78rem;
  letter-spacing: 0.02em;
}

.chapitre-hero__partie-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--gv-rouge), var(--gv-rouge-dark));
  color: #fff;
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  width: 28px;
  height: 22px;
  border-radius: 100px;
  letter-spacing: 0.02em;
}

.chapitre-hero__partie-title {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.74rem;
  color: rgba(255,255,255,0.88);
}

.chapitre-hero__title {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(1.6rem, 3.6vw, 2.6rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.015em;
  margin: 0;
  text-shadow: 0 2px 16px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  gap: 4px;
  /* override du h1 du vp-doc */
  border-bottom: none !important;
  padding-bottom: 0 !important;
}

.chapitre-hero__title::after {
  display: none !important;
}

.chapitre-hero__chap-num {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.7);
}

.chapitre-hero__chap-text {
  display: block;
  max-width: 22ch;
}

.chapitre-hero__niveau {
  display: inline-flex;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 100px;
  margin-top: 12px;
  align-self: flex-start;
  letter-spacing: 0.04em;
}

.chapitre-hero__niveau--T { background: rgba(0,168,132,0.85); color: #fff; }
.chapitre-hero__niveau--A { background: rgba(230,126,34,0.85); color: #fff; }
.chapitre-hero__niveau--R { background: rgba(125,95,200,0.85); color: #fff; }

@keyframes chapHeroFadeUp {
  0% { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
}

@media (max-width: 720px) {
  .chapitre-hero {
    height: 220px;
    margin-bottom: 32px;
    border-radius: 10px;
  }
  .chapitre-hero__content {
    padding: 0 20px 20px;
  }
  .chapitre-hero__title {
    font-size: 1.5rem;
  }
}
</style>
