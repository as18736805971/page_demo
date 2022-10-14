<template>
  <div class="play_video">
    <template v-if="info.video_url">
      <div v-html="info.video_url" />
    </template>
    <template v-else>
      <div class="no-data">无视频播放地址</div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'PlayVideo',
  data() {
    return {
      info: this.$route.query.video
    }
  },
  created() {
    this.info = JSON.parse(this.info)
    document.getElementsByTagName('title')[0].innerText = this.info.video_name
  }
}
</script>

<style lang="scss" scoped>
.play_video {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: black;

  ::v-deep iframe {
    position: absolute !important;
    margin-top: 40% !important;
    width: 100% !important;
    min-height: 240px !important;
    border: none !important;
  }

  .no-data {
    position: absolute;
    width: 100%;
    height: 100vh;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
    background: #FFFFFF;
  }
}
</style>
