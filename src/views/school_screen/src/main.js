import Vue from 'vue'
import App from './App'
// import store from './store'
import router from './router'
import './icons'
import './utils/permission'

import Element from 'element-ui'
import './styles/element-variables.scss'
Vue.use(Element)

import * as echarts from 'echarts'
import 'echarts-gl'

// 引用高德地图组件
import VueAMap from '@vuemap/vue-amap'
import '@vuemap/vue-amap/dist/style.css'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '3e86388edfa660601a180ee909b40f0e',
  securityJsCode: '74b46234689598343896b6b9995457ce'
})

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
