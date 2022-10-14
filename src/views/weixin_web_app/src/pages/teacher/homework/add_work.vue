<template>
  <div class="add-work">
    <div class="top_title" @click="show_select = !show_select">
      {{ select_name ? select_name : '科目' }}
      <img class="bot" src="../../../assets/bot.png">
    </div>

    <div class="float" v-if="show_select">
      <div class="float-mask" @click="show_select = false"></div>
      <div class="block_list">
        <div class="block_item" v-for="(item, key, index) in subjects" :key="index" @click.stop="handleTab(item, key)">{{ item }}</div>
      </div>
    </div>

    <div class="desc">
      <textarea class="textarea" v-model="hw_content" placeholder="添加文字描述"></textarea>
      <div class="img_list">
        <template v-if="img_list.length !== 0">
          <img class="img_item" v-for="(item, index) in img_list" :key="index" :src="pic_url + item" @click.stop="handleDelImg(index)" />
        </template>
        <div v-if="img_list.length < 9" class="add_img">
          <label for="file">
            <img class="add_icon" src="../../../assets/add_img.png">
          </label>
          <input id="file" style="display: none" type="file" ref="select_file" accept="image/jpeg" @change.stop="handlePortrait" />
        </div>
      </div>
    </div>

    <div class="btn" @click="handleAddWork()">发送</div>
  </div>
</template>

<script>
import {httpFormPostMethod, uploadQinuImage} from "@/common/HttpService"
import {compressImg, Tool} from "@/common/Tool"
import { pic_url } from "@/common/env";
export default {
  name: "addWork",
  data() {
    return {
      show_select: false,
      select_name: '',
      select_id: '',
      subjects: {},
      hw_content: '',
      upload_token: '',
      img_list: [],
      pic_url: pic_url
    }
  },
  mounted() {
    this.handleSubjects()
    this.handleToken()
  },
  methods: {
    handleSubjects() {
      httpFormPostMethod('sys/dic/child/sclSubject', {}).then((res) => {
        this.subjects = res.data
      })
    },
    handleTab(item, key) {
      this.select_id = key
      this.select_name = item
      this.show_select = false
    },
    handleDelImg(index) {
      this.img_list.splice(index, 1)
    },
    handleAddWork() {
      if (this.select_id === '') {
        Tool.tip('请选择科目')
        return false
      }
      httpFormPostMethod('web/new/homework/save', {
        hw_subject: this.select_name,
        hw_content: this.hw_content,
        pic: JSON.stringify(this.img_list)
      }).then(() => {
        Tool.tip('发布成功')
        setTimeout(() => {
          this.$router.push({
            path: 'homework'
          })
        }, 500)
      })
    },
    handleToken() {
      httpFormPostMethod('app/upload/qntoken', {}).then((res) => {
        this.upload_token = res.data.upload_token
      })
    },
    async handlePortrait() {
      if (this.$refs.select_file.files[0].type !== 'image/jpeg') {
        Tool.tip('请上传.jpg格式图片')
        return false
      }
      if (this.img_list.length > 9 ) {
        Tool.tip('最多选择9张照片')
        return false
      }
      Tool.loading('上传中...')
      let select_file = await compressImg(this.$refs.select_file.files[0], {
        width: 800,
        quality: 0.75
      })
      uploadQinuImage(select_file, this.upload_token).then((res) => {
        this.img_list.push(res)
        Tool.close()
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.add-work {
  width: 100%;
  height: 100vh;

  .top_title {
    position: relative;
    height: 2.5rem;
    color: #219bff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    background: #ffffff;
    margin-bottom: 0.5rem;

    .bot {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 1rem;
      height: 1rem;
    }
  }

  .float {
    position: fixed;
    top: 2.5rem;
    left: 0;
    width: 100%;
    height: calc(100vh - 2.5rem);
    z-index: 9999;

    .float-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgb(0,0,0, 0.3);
    }

    .block_list {
      position: absolute;
      top: 0;
      width: 100%;
      padding: 0.6rem;
      display: flex;
      align-items: flex-start;
      flex-wrap: wrap;
      background: #FAFAFA;

      .block_item {
        height: 1.5rem;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        border: 0.05rem solid #0089ff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
      }
    }
  }

  .desc {
    padding: 0.6rem;
    background: #ffffff;

    .textarea {
      width: 100%;
      height: 6rem;
      font-size: 0.7rem;
      margin-bottom: 0.5rem;
    }

    .img_list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .img_item {
        width: 4rem;
        height: 4rem;
        margin-right: 0.5rem;
        margin-bottom: 0.2rem;
      }

      .img_item:nth-child(4n) {
        margin-right: 0;
      }

      .add_img {
        width: 4rem;
        height: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0.05rem dashed #c6c6c6;
        margin-right: 1rem;
        margin-bottom: 0.2rem;

        .add_icon {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
  }

  .btn {
    width: 80%;
    margin: 2rem auto;
    height: 2.4rem;
    background: #219bff;
    color: #ffffff;
    font-size: 0.9rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
