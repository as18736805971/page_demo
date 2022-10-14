<template>
  <div class="play_video_main">
    <video id="video" :src="hls_url" width="100%" preload="auto" autoplay muted controls ref="video" class="play_video">
      您的浏览器不支持 video 视屏播放。
    </video>
  </div>
</template>
<script>
import Hls from "hls.js";
export default {
  name: "play_video",
  components: {},
  data: function () {
    return {
      hls: null,
      hls_url: this.$route.query.hls,
      timer: null
    };
  },
  mounted() {
    this.getStream(this.$route.query.hls);
  },
  beforeDestroy() {
    this.videoPause();
  },
  methods: {
    getStream(source) {
      if (Hls.isSupported()) {
        this.hls = new Hls({
          autoStartLoad: true,
          manifestLoadingTimeOut : 60000,
          manifestLoadingRetryDelay : 500,
          levelLoadingTimeOut : 60000,
          levelLoadingRetryDelay : 500,
          fragLoadingTimeOut : 60000,
          fragLoadingRetryDelay : 250,
          startFragPrefetch : true
        });
        this.hls.loadSource(source);
        this.hls.attachMedia(this.$refs.video);
        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.$refs.video.play();
        });
      } else if(this.$refs.video.canPlayType('application/vnd.apple.mpegurl')) {
        this.$refs.video.src = source
        this.$refs.video.play();
        this.$refs.video.oncanplay  = () => {
          console.log('clear timer')
          clearInterval(this.timer)
        }
        this.timer = setInterval(() => {
          console.log('retry')
          this.$refs.video.load()
        }, 15000)
      }
    },
    videoPause() {
      if (this.hls) {
        this.$refs.video.pause();
        this.hls.destroy();
        this.hls = null;
      }
      clearInterval(this.timer)
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.play_video_main {
  position: absolute;
  top: 0;
  bottom: 0;
  @include wh(100%, 100%);
  background: rgba(0,0,0,.8);
}
.play_video {
  @include ctblr();
}
video::-webkit-media-controls-mute-button { display: none !important;}
video::-internal-media-controls-overflow-button { display: none !important;}
</style>
