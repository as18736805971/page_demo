import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 引入 EChart 主模块
let echarts = require('echarts/lib/echarts')
// 引入图表
require('echarts/lib/chart/graph');

Vue.prototype.$chart = echarts

import BaseDialog from '../components/BaseDialog/index.vue'
import { AllDialog } from '../components/BaseDialog/index'
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
