import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/config'
import './utils/permission'

import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

// import VideoPlayer from 'vue-video-player'
// require('video.js/dist/video-js.css')
// require('vue-video-player/src/custom-theme.css')
// Vue.use(VideoPlayer)
// const hls = require('videojs-contrib-hls')
// Vue.use(hls)

import BaiduMap from 'vue-baidu-map-v3'
Vue.use(BaiduMap, {
  ak: 'B6f231e9da2aad1f23cce74400698550'
})

// 引用高德地图组件
import VueAMap from '@vuemap/vue-amap'
import '@vuemap/vue-amap/dist/style.css'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '3e86388edfa660601a180ee909b40f0e',
  securityJsCode: '74b46234689598343896b6b9995457ce',
  plugins: ['AMap.DistrictSearch', 'AMap.DistrictLayer', 'AMap.PlaceSearch']
})

import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'

Vue.use(VXETable)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
