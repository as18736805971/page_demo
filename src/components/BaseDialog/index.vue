<template>
  <el-dialog
      :title="title"
      :visible.sync="show"
      :width="width"
      :custom-class="className + ' ' + size"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @closed="closed"
  >
    <div ref="contentWapper" />
    <div v-if="footerShow" slot="footer" class="dialog-footer">
      <span class="spp-btn" @click="show = false">{{ cancel }}</span>
      <span class="spp-btn spp-btn-primary" @click="onSubmit()">{{ save }}</span>
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
      if (that.location === 'right') {
        document.getElementsByClassName('el-dialog__wrapper')[0].style.justifyContent = 'flex-end'
        document.getElementsByClassName('el-dialog')[0].style.borderRadius = '0px'
      } else if (that.location === 'screen') {
        document.getElementsByClassName('el-dialog')[0].style.borderRadius = '0px'
        document.getElementsByClassName('el-dialog__body')[0].style.padding = '0px'
      }
    })
  },
  destroyed() {
    delete AllDialog[this._uid]
  },
  methods: {
    closed() {
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
.el-dialog__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-dialog {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
  background: #ffffff !important;
  border-radius: 20px;
  box-shadow: 0 2px 20px 0 rgba(0,0,0,0.06) !important;
}

.el-dialog__header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px !important;
  flex-shrink: 0;
  height: 30px !important;

  .el-dialog__title {
    font-size: 20px !important;
    font-weight: 600 !important;
    color: #323338 !important;
  }

  .el-icon-close:before {
    background: url('~@/assets/images/close.png') no-repeat;
    content: '';
    display: block;
    width: 24px;
    height: 24px;
    background-size: 24px;
  }
}

.el-dialog__body {
  flex: 1;
  max-height: calc(100vh - 134px);
  overflow: auto;
  padding: 0 32px;
}

.el-dialog__body::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.el-dialog__body::-webkit-scrollbar-thumb {
  cursor: pointer;
  background-color: rgba(144,147,153,.3);
  transition: background-color .3s;
  border-radius: 6px;
}

.el-dialog__body::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144,147,153,.5);
}

.el-dialog__body::-webkit-scrollbar-track {
  border-radius: 6px;
  background: #ffffff;
}

.el-dialog__footer {
  flex-shrink: 0;
  height: 64px;
  padding: 10px 32px !important;
}

.dialog-footer {
  display: flex !important;
  align-items: center !important;
  justify-content: flex-end !important;
  font-size: 14px;
  font-weight: 400;

  .el-take-away {
    width: 76px;
    height: 36px;
    background: #ffffff;
    border: 1px solid #e6e7eb;
    border-radius: 19px;
    color: #696b70;
    line-height: 36px;
    text-align: center;
    margin-right: 22px;
    cursor: pointer;
  }

  .el-determine {
    width: 76px;
    height: 36px;
    background: #4968ff;
    border: 1px solid #4968ff;
    border-radius: 19px;
    color: #ffffff;
    line-height: 36px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
