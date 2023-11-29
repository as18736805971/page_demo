<template>
  <ul class="icon_index">
    <li
      v-for="(item, index) in icon_list"
      :key="index"
      :class="{ 'icon_active': item.url === icon_active }"
      @click="handleClick(item)"
    >
      <span class="span_center">
        <svg-icon class="svg" :name="item.url" />
        <span class="icon-name">{{ item.title }}</span>
      </span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      icon_active: '',
      icon_list: [{
        title: '首页',
        url: 'index'
      }, {
        title: '管理中心',
        url: 'management_center'
      }, {
        title: '智能设备',
        url: 'smart_devices'
      }, {
        title: '呼叫中心',
        url: 'call_center'
      }, {
        title: '服务中心',
        url: 'service_center'
      }, {
        title: '消息中心',
        url: 'message_center'
      }, {
        title: '数据中心',
        url: 'data_center'
      }]
    }
  },
  methods: {
    handleClick(item) {
      this.icon_active = item.url
      this.callBack && this.callBack(item)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/style/global.scss';

.icon_index {
  height: 600px;
  overflow-y: auto;
  list-style: none;
  padding: 0!important;
  border: 1px solid #eaeefb;
  border-radius: 4px;
  margin: 0;
  li {
    float: left;
    width: 16.77666%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    line-height: 120px;
    font-size: 13px;
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-right: -1px;
    margin-bottom: -1px;
    color: $--color-text-regular;
    cursor: pointer;
    .span_center {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .svg {
      display: block;
      font-size: 32px;
      margin-bottom: 15px;
      transition: color .15s linear;
    }
    span {
      line-height: normal;
      display: inline-block;
      vertical-align: middle;
      transition: color .15s linear;
    }
    .icon-name {
      display: inline-block;
      padding: 0 3px;
      height: 18px;
      line-height: 18px;
    }
  }
  li:hover {
    color: $--color-primary;
  }
  li:nth-child(6n) {
    border-right: none;
  }
  .icon_active {
    color: $--color-primary;
  }
}
.icon_index::-webkit-scrollbar {
  display: none;
}
</style>
