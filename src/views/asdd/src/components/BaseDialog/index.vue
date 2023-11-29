<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    :width="width"
    :custom-class="className + ' ' + size"
    :close-on-click-modal="modalShow"
    :destroy-on-close="true"
    @closed="closed"
  >
    <div ref="contentWapper" />
    <div v-if="footerShow" slot="footer" class="dialog-footer">
      <span class="comm-btn" @click="show = false">{{ cancel }}</span>
      <span class="comm-btn comm-btn-primary" @click="onSubmit()">{{ save }}</span>
    </div>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
import { AllDialog } from './index'
export default {
  data() {
    return {
      footerShow: true, // 是否显示底部footer
      show: false, // 是否显示
      title: '', // 弹窗标题
      width: '50%', // 弹窗宽度
      location: 'center', // 弹窗位置
      component: null, // 弹窗展示的内部组件
      data: {}, // 传递给内部组件的数据
      className: '', // 弹窗的扩展类名
      modalShow: false,
      global: {},
      size: '',
      save: '',
      cancel: ''
    }
  },
  watch: {},
  created() {
    AllDialog[this._uid] = this
  },
  mounted() {
    if (!this.component) {
      return
    }
    // 动态挂载内部需要展示的组件
    const that = this
    this.$nextTick(function() {
      const tmpl = Vue.extend(that.component)
      const opt = {
        data: that.data
      }
      for (const k in that.global) {
        opt[k] = that.global[k]
      }
      that.vm = new tmpl(opt).$mount(that.$refs.contentWapper)
      that.vm.callBack = that.callBack
      that.vm.closeBack = that.closeBack
      const length = document.getElementsByClassName('el-dialog__wrapper').length || 0
      if (that.location === 'right') {
        document.getElementsByClassName('el-dialog__wrapper')[length - 1].style.justifyContent = 'flex-end'
        document.getElementsByClassName('el-dialog')[length - 1].style.borderRadius = '0px'
      } else if (that.location === 'screen') {
        document.getElementsByClassName('el-dialog__body')[length - 1].style.padding = '0px'
      } else if (that.location === 'full') {
        document.getElementsByClassName('el-dialog')[length - 1].style.borderRadius = '0px'
        document.getElementsByClassName('el-dialog__body')[length - 1].style.padding = '0px'
      }
    })
  },
  destroyed() {
    delete AllDialog[this._uid]
  },
  methods: {
    closed() {
      this.vm.closeBack()
      this.vm.$destroy()
      this.$el.remove()
      this.$destroy()
    },
    close() {
      this.show = false
    },
    /**
     * 点击确定时的方法, 调用内部组件的onSubmit方法
     */
    onSubmit() {
      this.vm.onSubmit && this.vm.onSubmit()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  border-radius: 6px;
}
</style>
