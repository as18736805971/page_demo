<template>
  <div class="play_video_main">
    <el-upload
        class="avatar-uploader"
        action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { compressImg } from '@/utils/tool.js'
export default {
  name: "play_video",
  components: {},
  data () {
    return {
      imageUrl: ''
    }
  },
  mounted() {
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(file, 'file')
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    async beforeAvatarUpload(file) {
      console.log(file, '压缩前')
      let aa = await compressImg(file, {
        width: 800,
        quality: 0.75
      })
      console.log(aa, '压缩后')
      this.imageUrl = aa
      return false
      // console.log(file, 'file')
      // let _this = this
      // return new Promise((resolve, reject) => {
      //   let isLt2M = file.size / 1024 / 1024 < 1 // 判定图片大小是否小于10MB
      //   if(!isLt2M) {
      //     reject()
      //   }
      //   let image = new Image(), resultBlob = '';
      //   image.src = URL.createObjectURL(file);
      //   image.onload = () => {
      //     // 调用方法获取blob格式，方法写在下边
      //     resultBlob = _this.compressUpload(image, file);
      //     console.log(resultBlob, 'resultBlob')
      //     this.toFormData(resultBlob)
      //     resolve(resultBlob)
      //   }
      //   image.onerror = () => {
      //     reject()
      //   }
      // })
    },
    /* 图片压缩方法-canvas压缩 */
    compressUpload(image, file) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      let { width } = image, { height } = image
      canvas.width = width
      canvas.height = height
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0, width, height)
      // 进行最小压缩0.1
      let compressData = canvas.toDataURL(file.type || 'image/jpeg', 0.6)
      // 压缩后调用方法进行base64转Blob，方法写在下边
      this.imageUrl = compressData
      let blobImg = this.dataURItoBlob(compressData)
      return blobImg
    },
    /* base64转Blob对象 */
    dataURItoBlob(data) {
      let byteString;
      if(data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(data.split(',')[1])
      }else {
        byteString = unescape(data.split(',')[1])
      }
      let mimeString = data
          .split(',')[0]
          .split(':')[1]
          .split(';')[0];
      let ia = new Uint8Array(byteString.length)
      for( let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ia], {type: mimeString})
    },
    toFormData(imageBlob) {
      let fileOfBlob = new File([imageBlob], '001.jpg'); // 重命名了
      console.log(fileOfBlob, 'fileOfBlob')
    }
  },
}
</script>

<style lang="scss" scoped>
.play_video_main {
  padding: 50px;
}

::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
