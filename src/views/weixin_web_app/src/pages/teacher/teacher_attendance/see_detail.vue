<template>
  <div class="see_detail">
    <template v-if="list.length !== 0">
      <div class="list_content" v-for="(item, index) in list" :key="index">
        <div class="list">
          <div class="title">姓名</div>
          <div class="desc">{{ tea_name }}</div>
        </div>
        <div class="list">
          <div class="title">刷卡时间</div>
          <div class="desc">{{ formatDate(item.att_time) }}</div>
        </div>
        <div class="list">
          <div class="title">进出类型</div>
          <div class="desc">{{ inout_type_name }}</div>
        </div>
        <div class="title_desc">考勤照片</div>
        <img class="img_photo" @click="seeImg('https://imgs.pajx.com.cn/' + item.tea_pic)" :src="'https://imgs.pajx.com.cn/' + item.tea_pic" :onerror="onerror" />
      </div>
    </template>
    <template v-else>
      <div class="no-data_list">
        <img class="no-img" :src="require('@/assets/no_data.png')">
        <div class="no-text">暂无数据</div>
      </div>
    </template>
  </div>
</template>

<script>
import { httpFormPostMethod } from '@/common/HttpService'
import { Tool } from "@/common/Tool";
export default {
  name: "see_detail",
  data() {
    return {
      tea_att_id: this.$route.query.tea_att_id,
      att_time: this.$route.query.att_time,
      tea_name: this.$route.query.tea_name,
      inout_type_name: this.$route.query.inout_type_name,
      list: [],
      onerror: 'this.src="' + require('@/assets/no-data.png') + '"'
    }
  },
  mounted() {
    this.handleGetInfo()
  },
  methods: {
    formatDate: Tool.formatDate,
    handleGetInfo() {
      httpFormPostMethod('use/att/tea/pic/info', {
        tea_att_id: this.tea_att_id,
        att_time: this.att_time
      }).then((res) => {
        this.list = res.data
      })
    },
    seeImg(url) {
      wx.previewImage({
        current: [url],
        urls: [url]
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.see_detail {
  width: 100%;
  padding: 0.5rem;

  .list_content {
    padding: 0.6rem;
    border-radius: 0.5rem;
    background: #ffffff;
    box-shadow: 0 0 0.2rem rgba(0, 0, 0, 0.1);
    margin-bottom: 0.5rem;
    font-size: 0.7rem;
  }

  .list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.3rem;

    .title {
      font-size: 0.7rem;
    }

    .desc {
      font-size: 0.7rem;
    }
  }

  .title_desc {
    margin-bottom: 0.3rem;
  }

  .img_photo {
    width: 7rem;
    height: 7rem;
    border-radius: 0.5rem;
    object-fit: contain;
  }
}

.no-data_list {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .no-img {
    height: 2rem;
    margin-bottom: 0.5rem;
  }

  .no-text {
    font-size: 0.6rem;
  }
}
</style>
