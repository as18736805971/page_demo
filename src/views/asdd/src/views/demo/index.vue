<template>
  <div class="demo_index">
    <div class="comm-btn" @click="handleInterface()">调用接口</div>
    <div class="comm-btn comm-btn-primary" @click="handleUpdate(null)">添加</div>
    <div class="comm-btn comm-btn-success" @click="handleUpdate({ id: 10 })">编辑</div>
    <div class="comm-btn comm-btn-error" @click="handleSelCoords()">选择坐标</div>
    <div class="comm-btn comm-btn-primary" @click="handleSelIcons()">选择图标</div>
    <div class="comm-btn comm-btn-success" @click="handleRight()">右侧弹框</div>
    <div class="comm-btn comm-btn-error" @click="handleCenter()">中间弹框</div>
    <div class="comm-btn comm-btn-primary" @click="handleFullCenter()">全屏弹框</div>
    <div v-permission="'/api/zm/pos/serviceCount'" class="comm-btn comm-btn-primary">按钮</div>
    <div class="comm-btn comm-btn-primary" @click="handleColor()">更换颜色</div>
    <el-button type="primary">哈哈</el-button>
    <el-button type="success">哈哈</el-button>
  </div>
</template>

<script>
import { getCode } from '@/api/login'
export default {
  name: 'Login',
  data() {
    return {
      desc: ''
    }
  },
  methods: {
    /**
     * 接口调用
     */
    handleInterface() {
      getCode({ account: '13200000001', sms_code: '000000' }).then((res) => {
        console.log(res, '返回数据')
      })
    },
    /**
     * 默认弹框
     */
    handleUpdate(data) {
      this.$baseDialog(import('./add.vue'))
        .data(data ? { id: data.id } : {})
        .title(data ? '编辑' : '添加')
        .then(() => {})
        .show()
    },
    /**
     * 选择坐标 (Object)
     *  icon    坐标图标地址
     *  center  中心坐标点
     */
    handleSelCoords() {
      this.$baseChooseCoords({ center: ['113.731372', '34.768085'] })
        .then((res) => {
          console.log(res, '坐标')
        })
    },
    /**
     * 选择图标
     */
    handleSelIcons() {
      this.$baseDialog(import('@/components/BaseIcon/index.vue'))
        .title('选择图标')
        .size('table-size')
        .then((res) => {
          console.log(res, '选择图标')
        })
        .noFooter()
        .show()
    },
    /**
     * 右侧弹框
     */
    handleRight() {
      this.$baseDialog(import('./add.vue'))
        .title('右侧弹框')
        .location('right')
        .className('right-side')
        .then(() => {})
        .show()
    },
    /**
     * 中间弹框
     */
    handleCenter() {
      this.$baseDialog(import('./add.vue'))
        .title('中间弹框')
        .location('screen')
        .size('screen-size')
        .then(() => {})
        .noFooter()
        .modal()
        .show()
    },
    /**
     * 全屏弹框
     */
    handleFullCenter() {
      this.$baseDialog(import('./add.vue'))
        .title('全屏弹框')
        .location('full')
        .size('full-screen')
        .then(() => {})
        .noFooter()
        .modal()
        .show()
    },
    handleColor() {
      document.getElementsByTagName(
        'body'
      )[0].className = `vab-theme-green`
      // document.documentElement.style.setProperty('--theme-color', '#fa8c16')
    }
  }
}
</script>

<style lang="scss" scoped>
.demo_index {
  padding: 10px;
  //background: var(--color-bg);
  //background: $base-theme-color;
}
</style>
