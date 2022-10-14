<template>
  <div>
    <span class="audio_content" @click="play_audio">广播内容.mp3</span>
    <div v-if="showAudioViewer" class="el-image-viewer__wrapper" style="z-index: 2000;">
      <div class="el-image-viewer__mask" />
      <span class="el-image-viewer__btn el-image-viewer__close" @click="showAudioViewer = false">
        <i class="el-icon-circle-close" />
      </span>
      <div class="el-image-viewer__canvas">
        <audio :src="audioAli" controls="controls" />
      </div>
    </div>
  </div>
</template>

<script>
import { getaccessKey } from '@/api/file_libray'
import { client } from '@/utils/ali-oss'
export default {
  props: {
    audioSrc: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      showAudioViewer: false,
      audioAli: ''
    }
  },
  created() {
    getaccessKey().then(res => {
      this.audioAli = client(
        res.data.accesskeyid,
        res.data.accesskeysecret,
        res.data.securitytoken
      ).signatureUrl(this.audioSrc)
    })
  },
  methods: {
    play_audio() {
      this.showAudioViewer = true
    }
  }
}
</script>
<style lang="scss" scoped>
  .audio_content{
    color: #3399FF;
    cursor: pointer;
  }
</style>
