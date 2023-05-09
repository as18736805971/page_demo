<template>
  <div style="padding: 20px">
    <div class="input_item">
      <div class="input">
        <div class="item" v-for="item in 10" :key="item">
          哈哈<div class="icon">x</div>
        </div>
      </div>
      <div class="btn">选择</div>
    </div>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'videojs-contrib-hls'
import "@videojs/http-streaming"
import 'video.js/dist/video-js.css'

export default {
  name: "demo",
  data() {
    return {

    }
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
.input_item {
  display: flex;
  align-items: flex-start;
  .input {
    width: 300px;
    padding: 5px 5px 0 5px;
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #F8644E;
    border-radius: 4px;
    .item {
      display: flex;
      align-items: center;
      padding: 0 4px;
      color: #323338;
      font-size: 14px;
      border: 1px solid #4968FF;
      border-radius: 4px;
      margin-right: 4px;
      margin-bottom: 5px;
      .icon {
        width: 14px;
        height: 14px;
        margin-left: 4px;
        background: #F8644E;
        font-size: 12px;
        color: #ffffff;
        text-align: center;
        line-height: 10px;
        border-radius: 50%;
      }
    }
  }

  .btn {
    margin-left: 5px;
    width: 76px;
    height: 36px;
    background: #4968ff;
    border: 1px solid #4968ff;
    border-radius: 19px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    line-height: 36px;
  }
}
</style>
