<template>
  <div class="uploadfile-main">
    <el-upload
      action
      :limit="limitNum"
      :accept="accept"
      :http-request="uploadFile"
      :on-remove="handleRemove"
      :on-change="handleUploadFileChange"
      :file-list="fileSelected"
      :show-file-list="showFile"
    >
      <span class="spp-btn spp-btn-primary">
        <svg-icon icon-class="upload-file" />点击上传
      </span>
      <div slot="tip" class="el-upload__tip">{{ slotTip }}</div>
    </el-upload>
  </div>
</template>

<script>
import { uploadFileUrl } from '@/utils'
export default {
  name: 'Uploadfile',
  props: {
    slotTip: {
      type: String,
      default: '上传附件不超过20MB'
    },
    accept: {
      type: String,
      default:
        '.jpg, .jpeg, .png, .gif, .mp3, .mp4, .doc, .docx, .xls, xlsx, ppt, pptx, pdf, txt, csv'
    },
    limit: {
      type: Boolean,
      default: false
    },
    showFile: {
      type: Boolean,
      default: true
    },
    fileList: {
      type: Array,
      default: () => []
    },
    limitNum: {
      type: Number,
      default: 500
    }
  },
  data() {
    return {
      fileSelected: [],
      files: {}
    }
  },
  created() {
    this.fileSelected = this.fileList
  },
  mounted() {},
  methods: {
    async uploadFile({ file }) {
      if (this.accept === '.mp3') {
        if (file.type !== 'audio/mpeg') {
          this.$message({
            type: 'error',
            message: '只能上传mp3类型文件'
          })
          this.onRemove(file)
          return
        }
      }
      if (file.size / 1024 / 1024 > 20) {
        this.$message({
          type: 'error',
          message: '上传的文件超过20M'
        })
        this.onRemove(file)
        return
      }
      if (file.size / 1024 / 1024 > 5 && this.slotTip === '上传图片不超过5M') {
        this.$message({
          type: 'error',
          message: '上传的图片超过5M'
        })
        this.onRemove(file)
        return
      }
      const data = {
        upload_code: '105'
      }
      uploadFileUrl('/api/assist/upload', data, file).then((res) => {
        this.files[file.uid] = {
          attachment_url: res.data.upload_path,
          attachment_name: file.name.substring(0, file.name.indexOf('.')),
          attachment_ext: file.name.substring(
            file.name.indexOf('.') + 1,
            file.name.length
          )
        }
        this.$emit('getFileList', this.files)
        this.$emit('getFile', this.files[file.uid])
      })
    },
    handleRemove(file, fileList) {
      delete this.files[file.uid]
      this.$emit('getFileList', this.files)
    },
    handleUploadFileChange(file, fileList) {
      if (this.limit) {
        delete this.files[fileList[0].uid]
        this.fileSelected = fileList.slice(-1)
        this.$emit('getFileList', this.files)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
