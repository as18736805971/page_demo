<template>
  <div>
    <video id="cameraMonitoringVideo" class="video-js vjs-default-skin" preload="auto">
      <source :src="video_url" type="application/x-mpegURL">
    </video>
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
      video_url: 'https://spp_xst.zmpajx.com/41599c8255350af563224e8a5b1197a6/hlsram/live23/index.m3u8'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.player = videojs('cameraMonitoringVideo', {
        bigPlayButton: false,
        textTrackDisplay: false,
        posterImage: true,
        errorDisplay: false,
        controlBar: true,
        muted: true //静音模式 、、 解决首次页面加载播放。
      }, function () {
        this.play() // 自动播放
      })
    })
  }
}
</script>

<style scoped>

</style>
