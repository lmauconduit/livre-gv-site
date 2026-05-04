import DefaultTheme from 'vitepress/theme'
import './custom.css'
import './mermaid.css'

import Layout         from './Layout.vue'
import HeroEscalade   from './components/HeroEscalade.vue'
import ChapitreHero   from './components/ChapitreHero.vue'
import PartieCard     from './components/PartieCard.vue'
import PartieGrid     from './components/PartieGrid.vue'
import Niveau         from './components/Niveau.vue'
import Stat           from './components/Stat.vue'
import StatGrid       from './components/StatGrid.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp ({ app }) {
    app.component('HeroEscalade',  HeroEscalade)
    app.component('ChapitreHero',  ChapitreHero)
    app.component('PartieCard',    PartieCard)
    app.component('PartieGrid',    PartieGrid)
    app.component('Niveau',        Niveau)
    app.component('Stat',          Stat)
    app.component('StatGrid',      StatGrid)
  }
}
