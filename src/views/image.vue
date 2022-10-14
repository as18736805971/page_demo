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
      // let aa = await compressImg(file, {
      //   width: 800,
      //   quality: 0.75
      // })
      // console.log(aa, '压缩后')
      // return false
    },
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
