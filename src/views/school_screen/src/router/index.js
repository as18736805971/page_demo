import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import Rtsp from '@/views/rtsp'
import Login from '@/views/login'
import Audio from '@/views/audio'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/screen_login',
      name: 'login',
      component: Login
    },
    {
      path: '/screen_index',
      name: 'index',
      component: Index
    },
    {
      path: '/screen_rtsp',
      name: 'rtsp',
      component: Rtsp
    },
    {
      path: '/audio_index',
      name: 'audio',
      component: Audio
    },
    {
      path: '*',
      name: 'login',
      component: Login
    }
  ]
})
