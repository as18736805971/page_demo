<template>
  <div class="index">
    <el-button @click="show = !show">按钮</el-button>

    <div v-if="show">
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{ height: '500px' }">
      <object type='application/x-vlc-plugin' id='vlc' events='True' width="720px" height="540px"
              pluginspage="http://www.videolan.org"
              codebase="http://downloads.videolan.org/pub/videolan/vlc-webplugins/2.0.6/npapi-vlc-2.0.6.tar.xz">
        <param name='mrl' value='rtsp://admin:a12345678@192.168.254.7:554/h264/ch33/main/av_stream' />
        <param name='volume' value='50' />
        <param name='autoplay' value='true' />
        <param name='loop' value='false' />
        <param name='fullscreen' value='false' />
      </object>
      </el-scrollbar>
    </div>


  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      show: false,
      play_list: []
    }
  },
  mounted() {
    this.handlePlayVideo('player', 'rtsp://admin:a12345678@192.168.254.7:554/h264/ch33/main/av_stream')
  },
  methods: {
    handlePlayVideo (id, url, type) {

    },
  },
};
</script>

<style lang="scss">
.index {
  width: 500px;
  height: 400px;
}
</style>

