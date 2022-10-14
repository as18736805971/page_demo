import Vue from 'vue'
import '@babel/polyfill'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: localStorage.getItem('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 引用高德地图组件
import VueAMap from '@vuemap/vue-amap'
import '@vuemap/vue-amap/dist/style.css'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: 'bafe9a1934d7e5a7a96aa61ec0285b7d'
})

// 视频组件
import VueCoreVideoPlayer from 'vue-core-video-player'
Vue.use(VueCoreVideoPlayer)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
