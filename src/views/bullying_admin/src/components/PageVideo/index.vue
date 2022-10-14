<template>
  <vue-core-video-player
    ref="video"
    class="video-block"
    :src="videoPlayer.src"
    :title="videoPlayer.title"
    :autoplay="videoPlayer.autoplay"
    :loop="videoPlayer.loop"
  />
</template>

<script>
export default {
  name: 'Index',
  props: {
    videoPlayer: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
 .video-block {
   width: 100%;
   height: 570px;
 }
</style>
