<template>
  <div class="details">
    <template v-if="show_page">
      <template v-if="type == 1">
        <div class="school-top between" >
          <div class="school-top-left">
            <img class="icon-send" src="../../../assets/qqdh_photo.png">
            <div class="send-txt">{{ tea_name }}</div>
          </div>
          <div class="date-time">{{ info.create_time | dateFormat }}</div>
        </div>
      </template>

      <template v-else>
        <div class="my-school-top" >
          <div class="date-time">发送对象：{{ info.notice_scope == 2 ? '教师' : '学生' }}</div>
          <div class="date-time" v-if="area === 'ha'">是否发送短信：{{ info.is_sms == 0 ? '否' : '是' }}</div>
        </div>
        <div class="my-school-top">
          <div class="date-time">发送时间：{{ info.create_time | dateFormat }}</div>
        </div>
      </template>


      <div class="details-desc">{{ info.notice_content }}</div>
    </template>
  </div>
</template>

<script>
  import { httpFormPostMethod } from "@/common/HttpService"
  export default {
    name: "school_details",
    data() {
      return {
        type: this.$route.query.type || 1, // // 1 校信详情 2 我发送的校信详情
        notice_id: this.$route.query.notice_id || '',
        tea_name: this.$route.query.tea_name || '',
        area: sessionStorage.getItem('area'),
        info: {
          create_time: '',
          notice_content: '',
          notice_title: '',
          is_sms: 0,
          notice_scope: 1,
          tea_pic: ''
        },
        show_page: false
      }
    },
    filters: {
      dateFormat (value) {
        let pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
        return value.replace(pattern, '$1-$2-$3 $4:$5:$6');
      }
    },
    created() {
      window.document.title = this.$route.query.type == 2 ? '我发送的详情' : '校信详情'
      this.handleGetInfo()
    },
    methods: {
      handleGetInfo() {
        httpFormPostMethod('web/campus/teaMyCampusInfo', {
          notice_id: this.notice_id
        }).then((res) => {
          this.info = {...this.info, ...res.data}
          this.show_page = true
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/mixin';

  .details {
    .between {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .school-top {
      width: 100%;
      height: 2rem;
      background: #f5f7fa;
      padding: 0.4rem 0.8rem;

      .school-top-left {
        display: flex;
        align-items: center;
        .icon-send {
          width: 1.2rem;
          height: 1.2rem;
          margin-right: 0.4rem;
        }

        .send-txt {
          height: 1.2rem;
          font-size: 0.7rem;
          font-weight: 400;
          color: #40a9fe;
          line-height: 1.2rem;
        }
      }

      .date-time {
        height: 0.85rem;
        font-size: 0.6rem;
        font-weight: 400;
        text-align: right;
        color: #b3b3b3;
        line-height: 0.85rem;
      }
    }

    .my-school-top {
      width: 100%;
      height: 1.8rem;
      background: #f5f7fa;
      padding: 0.55rem 0.8rem;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .date-time {
        width: 9rem;
        height: 0.85rem;
        font-size: 0.6rem;
        font-weight: 400;
        color: #999999;
        line-height: 0.85rem;
      }

      .date-time:first-child {
        margin-right: 1rem;
      }
    }

    .details-desc {
      width: 100%;
      height: calc(100vh - 2rem);
      background: #ffffff;
      overflow-y: auto;
      font-size: 0.9rem;
      font-weight: 400;
      color: #333333;
      line-height: 1.8rem;
      padding: 0.45rem 0.8rem;
    }
  }
</style>
