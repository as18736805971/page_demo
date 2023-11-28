import Vue from 'vue'
import Element from 'element-ui'
import * as filters from '@/filters'
import { Message, MessageBox } from 'element-ui'
import BaseDialog from '@/components/BaseDialog'
import BaseCoords from '@/components/BaseCoords/index.vue'
import { AllDialog } from '@/components/BaseDialog'
import 'element-ui/lib/theme-chalk/index.css'
import VueAMap from '@vuemap/vue-amap'
import '@vuemap/vue-amap/dist/style.css'
import SvgIcon from '@/components/SvgIcon/index.vue'
import BaseEditor from '@/components/BaseEditor/index.vue'

Vue.use(Element, {size: 'medium'})

// 引用高德地图组件
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '5e3f0ec9d5d7772f8a3e546be1a23a06'
})

// svg
Vue.component('SvgIcon', SvgIcon)
// 富文本编辑器
Vue.component('BaseEditor', BaseEditor)

/*
 * 引用全局过滤方法
 */
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* 全局弹框 */
Vue.prototype.$baseDialog = function(
  component,
  data = {},
  width = '50%',
  location = 'center',
  className = ''
) {
  const dialog = new BaseDialog(component)
  dialog.global('store', this.$store)
  dialog.data(data)
  dialog.width(width)
  dialog.location(location)
  dialog.size('default-size')
  dialog.className(className)
  return dialog
}

/* 关闭所有弹框 */
Vue.prototype.$baseDialogCloseAll = function() {
  for (const uid in AllDialog) {
    AllDialog[uid].close()
  }
}

/**
 * 全局选择坐标 (Object)
 *  icon   坐标图标地址
 *  center 中心坐标点 ['113.731372', '34.768085']
 */
Vue.prototype.$baseChooseCoords = function(object) {
  return this.$baseDialog(BaseCoords)
    .data(object || {})
    .title('选择坐标')
    .size('big-size')
    .show()
}

// 消息框消失时间
const messageDuration = 3000

/**
 * 全局信息提示
 * @param message 信息内容
 * @param type 类型 使用全局枚举筛选 MessageType.success
 */
Vue.prototype.$baseMessage = (message, type = 'success') => {
  return new Promise((resolve) => {
    Message({
      offset: 60,
      showClose: true,
      message: message,
      type: type,
      dangerouslyUseHTMLString: true,
      duration: messageDuration
    })
    setTimeout((_) => {
      resolve()
    }, messageDuration + 100)
  })
}

/* 全局Alert */
Vue.prototype.$baseAlert = (content, title = '温馨提示') => {
  return MessageBox.alert(content, title, {
    confirmButtonText: '确定',
    dangerouslyUseHTMLString: true
  })
}

/* 全局Confirm */
Vue.prototype.$baseConfirm = (
  content,
  title = '温馨提示',
  type = 'warning',
  confirmButtonText = '确定',
  cancelButtonText = '取消'
) => {
  return MessageBox.confirm(content, title || '温馨提示', {
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    closeOnClickModal: false,
    distinguishCancelAndClose: true,
    type: type
  })
}
