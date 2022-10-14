<template>
  <div class="attach-main-wrapper">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="附件" name="1">
        <div v-if="pic_list.length > 0" class="attachment-arapper">
          <div class="header">
            <img class="icon" src="../../assets/images/pic_group.png">
            <span class="icon_text">图片</span>
          </div>
          <el-row :gutter="38">
            <el-col
              v-for="(item, index) in pic_list"
              :key="index"
              :span="4"
              class="block"
              style="text-align: center"
            >
              <el-image
                class="pic"
                :src="item.attachment_url"
                fit="fill"
                @click="see_pic(item.attachment_url)"
              />
              <div v-if="editable" style="text-align: center; width: 100%">
                <el-button
                  type="text"
                  size="mini"
                  @click="deleteAttachment(item)"
                >删除</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-if="media_list.length > 0" class="attachment-arapper">
          <div class="header">
            <img class="icon" src="../../assets/images/media_group.png">
            <span class="icon_text">音视频</span>
          </div>
          <el-row :gutter="16">
            <el-col
              v-for="(item, index) in media_list"
              :key="index"
              :span="4"
              class="block"
              style="text-align: center"
            >
              <el-image
                v-if="item.attachment_ext == 'mp3'"
                class="pic"
                :src="require('../../assets/images/audio.png')"
                fit="fill"
                @click="play_audio(item.attachment_url)"
              />
              <el-image
                v-if="item.attachment_ext == 'mp4'"
                class="pic"
                :src="require('../../assets/images/video.png')"
                fit="fill"
                @click="play_video(item.attachment_url)"
              />
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.attachment_name + '.' + item.attachment_ext"
                placement="top"
              >
                <div class="file_name">{{ item.file_name }}</div>
              </el-tooltip>
              <div v-if="editable" style="text-align: center; width: 100%">
                <el-button
                  type="text"
                  size="mini"
                  @click="deleteAttachment(item)"
                >删除</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-if="doc_list.length > 0" class="attachment-arapper">
          <div class="header">
            <img class="icon" src="../../assets/images/doc_group.png">
            <span class="icon_text">文档</span>
          </div>
          <el-row :gutter="16">
            <el-col
              v-for="(item, index) in doc_list"
              :key="index"
              :span="4"
              class="block"
              style="text-align: center"
            >
              <el-image
                class="pic"
                :src="require('../../assets/images/doc.png')"
                fit="fill"
                @click="download_doc(item.attachment_url)"
              />
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.attachment_name + '.' + item.attachment_ext"
                placement="top"
              >
                <div class="file_name">{{ item.file_name }}</div>
              </el-tooltip>
              <div v-if="editable" style="text-align: center; width: 100%">
                <el-button
                  type="text"
                  size="mini"
                  @click="deleteAttachment(item)"
                >删除</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="[pic_url]"
    />
    <div
      v-if="showAudioViewer"
      class="el-image-viewer__wrapper"
      style="z-index: 2000"
    >
      <div class="el-image-viewer__mask" />
      <span
        class="el-image-viewer__btn el-image-viewer__close"
        @click="closeAudioViewer"
      >
        <i class="el-icon-circle-close" />
      </span>
      <div class="el-image-viewer__canvas">
        <audio :src="audio_url" controls="controls" />
      </div>
    </div>
    <div
      v-if="showVideoViewer"
      class="el-image-viewer__wrapper"
      style="z-index: 2000"
    >
      <div class="el-image-viewer__mask" />
      <span
        class="el-image-viewer__btn el-image-viewer__close"
        @click="closeVideoViewer"
      >
        <i class="el-icon-circle-close" />
      </span>
      <div class="el-image-viewer__canvas">
        <video style="height: 100%" :src="video_url" controls="controls" />
      </div>
    </div>
  </div>
</template>
<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
// import { getaccessKey } from '@/api/file_libray'
// import { client } from '@/utils/ali-oss'
export default {
  components: { ElImageViewer },
  props: {
    attachment: {
      required: true,
      type: Array
    },
    editable: {
      type: Boolean,
      default: () => false
    },
    isWatch: {
      type: Boolean,
      default: () => false
    },
    campus: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      pic_url: '',
      audio_url: '',
      video_url: '',
      activeNames: ['1'],
      pic_list: [],
      media_list: [],
      doc_list: [],
      pic_ext: ['jpg', 'jpeg', 'png', 'gif'],
      audio_ext: ['mp3'],
      video_ext: ['mp4'],
      showViewer: false,
      showAudioViewer: false,
      showVideoViewer: false,
      down_url: process.env.VUE_APP_BASE_API
    }
  },
  watch: {
    attachment() {
      if (this.isWatch) {
        this.formatData()
      }
    }
  },
  created() {
    this.formatData()
  },
  methods: {
    async formatData() {
      this.pic_list = []
      this.media_list = []
      this.doc_list = []
      // const { data } = await getaccessKey()
      this.attachment.forEach((item) => {
        item.file_name = this.getName(
          item.attachment_name,
          item.attachment_ext
        )
        if (this.pic_ext.includes(item.attachment_ext)) {
          this.pic_list.push(item)
        } else if (
          this.audio_ext.includes(item.attachment_ext) ||
          this.video_ext.includes(item.attachment_ext)
        ) {
          this.media_list.push(item)
        } else {
          this.doc_list.push(item)
        }
        if (!this.campus) {
          item.attachment_url = this.down_url + '/' + item.attachment_url
          // item.attachment_url = client(
          //   data.accesskeyid,
          //   data.accesskeysecret,
          //   data.securitytoken
          // ).signatureUrl(item.attachment_url)
        } else {
          item.attachment_url = this.down_url + '/' + item.attachment_sign
          // item.attachment_url = client(
          //   data.accesskeyid,
          //   data.accesskeysecret,
          //   data.securitytoken
          // ).signatureUrl(item.attachment_sign)
        }
      })
      this.$forceUpdate()
    },
    getName(name, ext) {
      let file_name = ''
      if (name.length > 8) {
        const start = name.substring(0, 5)
        const end = name.substring(name.length - 3, name.length)
        file_name = start + '...' + end + '.' + ext
      } else {
        file_name = name + '.' + ext
      }
      return file_name
    },
    deleteAttachment(item) {
      this.$emit('deleteAttachment', item)
    },
    see_pic(url) {
      this.pic_url = url
      this.showViewer = true
    },
    play_audio(url) {
      this.audio_url = url
      this.showAudioViewer = true
    },
    play_video(url) {
      this.video_url = url
      this.showVideoViewer = true
    },
    download_doc(url) {
      window.open(url)
    },
    closeViewer: function() {
      this.showViewer = false
    },
    closeAudioViewer: function() {
      this.showAudioViewer = false
    },
    closeVideoViewer: function() {
      this.showVideoViewer = false
    }
  }
}
</script>
<style lang="scss" scoped>
.attachment-arapper {
  margin-bottom: 10px;
}
.header {
  height: 20px;
  line-height: 20px;
  margin-bottom: 14px;
  .icon {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
  }
  .icon_text {
    margin-left: 10px;
  }
}
.file_name {
  text-align: center;
  width: 100%;
  word-wrap: break-word;
}
.pic {
  width: 70px;
  height: 70px;
  cursor: pointer;
}
</style>
<style lang="scss">
.attach-main-wrapper {
  .el-collapse .el-collapse-item__header {
    background: #f0f5fa;
  }
}
</style>
