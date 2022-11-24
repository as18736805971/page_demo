import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/permission'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import BaseDialog from './components/BaseDialog'
import { AllDialog } from './components/BaseDialog'
Vue.prototype.$baseDialog = function (
    component,
    data = {},
    width = '50%',
    className = ''
) {
  let dialog = new BaseDialog(component)
  dialog.global('store', this.$store)
  dialog.data(data)
  dialog.width(width)
  dialog.size('default-size')
  dialog.className(className)
  return dialog
}
Vue.prototype.$baseDialogCloseAll = function () {
  for (let uid in AllDialog) {
    AllDialog[uid].close()
  }
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
