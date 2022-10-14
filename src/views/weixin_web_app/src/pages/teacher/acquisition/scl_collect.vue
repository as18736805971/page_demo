<template>
  <div class="scl_collect">
    <div class="tip-title">
      <div class="search_list">
        <img class="search_icon" :src="require('@/assets/search1.png')">
        <input type="text" v-model="search.name" class="input" placeholder="搜索姓名、手机号" @keyup.enter="handleGetData" @change="handleGetData" />
      </div>
      <div class="tab-list">
        <div class="item-tab" v-for="(item ,index) in tab_list" :key="index" @click="handleTab(index, item.type)">
          <div class="item" :class="index === activeIndex ? 'active_txt' : ''">
            {{ item.title }}
          </div>
          <div class="line" v-if="activeIndex === index"></div>
        </div>
      </div>
    </div>

    <div v-if="list.length !== 0" class="content-list">
      <div class="list-item" v-for="(item, index) in list" :key="index">
        <template v-if="item.photo_upload_flag == '0'">
          <label class="label-item" :for="'file' + index">
            <img class="photo" :src="item.faceurl || require('@/assets/person_photo.png')" />
            <div class="name_item">
              <div class="left_name">
                <div class="name">{{ item.stu_name }}</div>
                <div class="phone">{{ item.stu_no }}</div>
              </div>
              <div class="right_name">未上传</div>
            </div>
          </label>
          <input :id="'file' + index" style="display: none" type="file" :ref="'select_file'+ index" accept="image/jpeg" @change.stop="handlePortrait(item, index, 'select_file' + index)" />
        </template>
        <template v-else>
          <img class="photo" :src="item.faceurl || require('@/assets/person_photo.png')" />
          <div class="name_item">
            <div class="left_name">
              <div class="name">{{ item.stu_name }}</div>
              <div class="phone">{{ item.stu_no }}</div>
            </div>
            <div class="block_item">
              <img class="icon_add" :src="require('@/assets/upload.png')" />已上传
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-else class="no-data_list">
      <img class="no-img" :src="require('@/assets/no_data.png')">
      <div class="no-text">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { httpFormPostMethod, httpUploadFile } from '@/common/HttpService'
import { compressImg, Tool } from "@/common/Tool";
export default {
  name: "scl_collect",
  data() {
    return {
      gra_id: this.$route.query.gra_id,
      cls_id: this.$route.query.cls_id,
      search: {
        name: '',
        cls_id: '',
        photo_upload_flag: ''
      },
      activeIndex: 0,
      tab_list: [{
        title: '全部',
        type: ''
      },{
        title: '未上传',
        type: 0
      },{
        title: '已上传',
        type: 1
      }],
      list: []
    }
  },
  created() {
    this.search.cls_id = this.cls_id
  },
  mounted() {
    this.handleGetData()
  },
  methods: {
    handleTab(index, type) {
      this.activeIndex = index
      this.search.photo_upload_flag = type
      this.handleGetData()
    },
    handleGetData() {
      httpFormPostMethod('web/photocollection/getStuList', this.search).then((res) => {
        this.list = res.data || []
      })
    },
    async handlePortrait(data, index, name) {
      let file = this.$refs[name][0].files[0]
      if (file.type !== 'image/jpeg') {
        Tool.tip('请上传.jpg格式图片')
        return false
      }
      if (file) {
        Tool.loading('上传中...')
        let select_file = await compressImg(file, {
          width: 800,
          quality: 0.75
        })
        httpUploadFile('web/photocollection/uploadByStu', {
          stu_no: data.stu_no,
          img: select_file
        }).then(() => {
          httpFormPostMethod('web/photocollection/getByPhoto', {
            no: data.stu_no,
            flag: 1
          }).then((res) => {
            this.list[index].faceurl = res.data
            this.list[index].photo_upload_flag = '1'
            Tool.close()
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.scl_collect {
  width: 100%;
  height: 100vh;
  background: #ffffff;

  .tip-title {
    padding: 0.6rem 0.6rem 0.1rem;
    background: #f5f5f5;

    .search_list {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 0.2rem;
      height: 2rem;
      border-radius: 0.2rem;
      background: rgb(230, 231, 235);

      .search_icon {
        width: 1rem;
        height: 1rem;
        margin-right: 0.2rem;
      }

      .input {
        width: calc(100% - 1.5rem);
        height: 1.8rem;
        font-size: 0.7rem;
        background: rgb(230, 231, 235);
      }
    }

    .tab-list {
      height: 2.4rem;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .item-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 2rem;
        font-size: 0.7rem;
        font-weight: 400;
        color: #999999;

        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 1.8rem;
        }

        .line {
          width: 2.4rem;
          height: 0.1rem;
          background: #3297ff;
          border-radius: 0.05rem;
        }
      }

      .active_txt {
        font-size: 0.7rem;
        font-weight: 600;
        color: #333333;
      }
    }
  }

  .content-list {
    height: calc(100vh - 5.1rem);
    padding: 0 0.6rem;
    overflow-y: auto;
    background: #ffffff;

    .list-item {
      height: 3rem;
      display: flex;
      align-items: center;

      .label-item {
        width: 100%;
        height: 3rem;
        display: flex;
        align-items: center;
      }
    }

    .photo {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      margin-right: 0.5rem;
    }

    .name_item {
      width: calc(100% - 2rem);
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 0.05rem solid #f5f5f5;

      .left_name {
        .name {
          color: #333333;
          font-size: 0.75rem;
        }
        .phone {
          font-size: 0.6rem;
          color: rgb(162,162,162);
        }
      }

      .right_name {
        color: #999999;
        font-size: 0.65rem;
      }

      .block_item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1.2rem;
        padding: 0 0.4rem;
        border-radius: 0.2rem;
        background: #66C46D;
        color: #ffffff;
        font-size: 0.6rem;

        .icon_add {
          width: 0.6rem;
          height: 0.6rem;
          margin-right: 0.3rem;
        }
      }
    }
  }

  .no-data_list {
    height: calc(100vh - 5.1rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #ffffff;

    .no-img {
      height: 2rem;
      margin-bottom: 0.5rem;
    }

    .no-text {
      font-size: 0.6rem;
    }
  }

}
</style>
