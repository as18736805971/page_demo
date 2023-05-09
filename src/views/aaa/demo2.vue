<template>
  <div class="video">
    <easy-player id="play" style="width: 400px;height: 400px;" :videoUrl="hls_url" :live="true"></easy-player>
  </div>
</template>

<script>
import EasyPlayer from '@easydarwin/easyplayer'

export default {
  name: 'video-sel',
  components: { EasyPlayer },
  data () {
    return {
      hls_url: 'https://spp_xst.zmpajx.com/9eba79bfdd7163d890e6d7c48489b5f8/hlsram/live6/index.m3u8'
    }
  },
  mounted() {
    // this.handlePlayVideo('play', 'https://spp_xst.zmpajx.com/9eba79bfdd7163d890e6d7c48489b5f8/hlsram/live6/index.m3u8')
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.video_item {
  width: 400px;
  height: 400px;
}
</style>
