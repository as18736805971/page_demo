<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { decrypt, encrypt, getAppVersion, getDevice, getNonce, getRandomKey, getRsaCode, getSign, getToken, nowTime } from '@/utils/auth'

export default {
  name: 'App',
  data() {
    return {
      websocket: null,
      timer: null
    }
  },
  watch: {
    '$route'(to, from) {
      if (to.path !== '/login' && to.path !== '/role') {
        if (!this.websocket) {
          setTimeout((res) => {
            this.openWebsocket()
          }, 1000)
        } else {
          if (Number(this.websocket.readyState) !== 1) {
            this.openWebsocket()
          }
        }
      } else {
        if (this.websocket) {
          this.websocket.close()
        }
        this.websocket = null
        clearTimeout(this.timer)
        this.timer = null
      }
    }
  },
  methods: {
    // WebSocket 使用
    openWebsocket() {
      // console.log('WebSocket开始连接!!!!!!!!!!!!!!!!!!!')
      // 判断当前浏览器是否支持WebSocket
      if (Number(JSON.parse(decrypt(sessionStorage.getItem('login_role'))).login_user_type) === 3) {
        if ('WebSocket' in window) {
          var app_id = process.env.VUE_APP_ID
          var scl_id = JSON.parse(decrypt(sessionStorage.getItem('login_role'))).scl_id
          var random = getRandomKey(32)
          // connectId = appId + ":" + sclId + ":" + random + ":" + 客户端类型
          var connect_id = app_id + ':' + scl_id + ':' + random + ':APP_WEB_SCL'
          var formdata = {}
          formdata.timestamp = nowTime()
          formdata.token = getToken()
          formdata.app_version = getAppVersion()
          formdata.device = getDevice()
          formdata['sign'] = getSign(formdata)
          var aes_key = getNonce()
          var data = encodeURIComponent(encrypt(JSON.stringify(formdata), aes_key))
          var encrypt_key = encodeURIComponent(getRsaCode(aes_key))
          var url = process.env.VUE_APP_BASE_HOST + '/websocket/webScl' + '?connect_id=' + connect_id + '&data=' +
            encodeURIComponent(data) +
            '&encrypt_key=' + encodeURIComponent(encrypt_key) + '&app_id=' + app_id
          this.websocket = new WebSocket(url)
          this.websocket.onopen = this.websocketonopen
          this.websocket.onerror = this.websocketonerror
          this.websocket.onmessage = this.websocketonmessage
          this.websocket.onclose = this.websocketclose
        } else {
          // alert('当前浏览器不支持websocket')
        }
      } else {
        if (this.websocket) {
          this.websocket.close()
        }
        this.websocket = null
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    // WebSocket连接成功
    websocketonopen() {
      clearTimeout(this.timer)
      this.timer = null
      // console.log('WebSocket连接成功!!!!!!!!!!!!!!!!!!!')
    },
    // 接收后端返回的数据   对数据进行处理渲染
    async websocketonmessage(event) {
      var res = JSON.parse(event.data)
      // console.log(event.data, '获得消息')
      // 自定义全局监听事件
      window.dispatchEvent(new CustomEvent('onmessageWS', {
        detail: {
          cmd: res.cmd,
          data: JSON.parse(decrypt(decodeURIComponent(res.data.data)))
        }
      }))
    },
    // 连接建立失败重连
    websocketonerror(event) {
      if (Number(this.websocket.readyState) === 1) {
        clearTimeout(this.timer)
        this.timer = null
      } else {
        // console.log('WebSocket失败重连!!!!!!!!!!!!!!!!!!!')
        this.timer = setTimeout((res) => {
          this.openWebsocket()
        }, 1000)
      }
    },
    // 关闭连接
    websocketclose(event) {
      if (this.$route.path !== '/login' && this.$route.path !== '/role') {
        if (Number(this.websocket.readyState) === 1) {
          clearTimeout(this.timer)
          this.timer = null
        } else {
          // console.log('WebSocket关闭连接!!!!!!!!!!!!!!!!!!!')
          this.timer = setTimeout((res) => {
            this.openWebsocket()
          }, 1000)
        }
      }
    }
  }
}
</script>
