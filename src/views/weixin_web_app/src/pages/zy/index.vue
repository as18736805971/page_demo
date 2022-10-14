<template>
  <div class="zy_main">
    <calendar
      :default-date="defaultDatetime"
      :is-show-week-view="true"
      @confirm="dateConfirm"
      @weekshow="weekshow"
    ></calendar>
    <stuFirstLevel @get_stu="get_stu"></stuFirstLevel>
    <div class="zy_list" v-if="zy_list.length > 0">
      <div class="zy_item" v-for="(item, index) in zy_list" :key="index">
        <div class="top_des">
          <img
            :src="item.avatar"
            :onerror="errorImg"
            class="person_photo"
            alt=""
          />
          <div class="des">
            <p class="name">{{ item.nick_name }}</p>
            <span
              class="subject yw_subject"
              v-if="item.hw_subject === '语文'"
              >{{ item.hw_subject }}</span
            >
            <span
              class="subject sx_subject"
              v-else-if="item.hw_subject === '数学'"
              >{{ item.hw_subject }}</span
            >
            <span
              class="subject yy_subject"
              v-else-if="item.hw_subject === '英语'"
              >{{ item.hw_subject }}</span
            >
            <span
              class="subject wl_subject"
              v-else-if="item.hw_subject === '物理'"
              >{{ item.hw_subject }}</span
            >
            <span
              class="subject hx_subject"
              v-else-if="item.hw_subject === '化学'"
              >{{ item.hw_subject }}</span
            >
            <span
              class="subject sw_subject"
              v-else-if="item.hw_subject === '生物'"
              >{{ item.hw_subject }}</span
            >
            <span
              class="subject zz_subject"
              v-else-if="item.hw_subject === '政治'"
              >{{ item.hw_subject }}</span
            >
            <span
              class="subject dl_subject"
              v-else-if="item.hw_subject === '地理'"
              >{{ item.hw_subject }}</span
            >
            <span
              class="subject ls_subject"
              v-else-if="item.hw_subject === '历史'"
              >{{ item.hw_subject }}</span
            >
            <span
              class="subject music_subject"
              v-else-if="item.hw_subject === '音乐'"
              >{{ item.hw_subject }}</span
            >
            <span
              class="subject ms_subject"
              v-else-if="item.hw_subject === '美术'"
              >{{ item.hw_subject }}</span
            >
            <span class="subject other_subject" v-else>{{
              item.hw_subject
            }}</span>
          </div>
        </div>
        <div class="content">{{ item.hw_content }}</div>
        <div class="img_list">
          <img
            :src="pic_url + opt"
            alt=""
            class="zy_img"
            v-for="(opt, key) in item.pic_list"
            :preview="index"
            :key="key"
          />
        </div>
        <div class="time">{{ item.create_time | fgTimeMin }}</div>
      </div>
    </div>
    <div class="have_no_data" v-else :class="{ month_no_data: !ifweek }">
      <img src="../../assets/no_data.png" alt="" class="no_data" />
      <p class="text">暂无内容</p>
    </div>
  </div>
</template>
<script>
import { pic_url } from "@/common/env";
import calendar from "../../components/calendar";
import stuFirstLevel from "../../components/stuFirstLevel";
import { httpFormPostMethod } from "@/common/HttpService";
export default {
  name: "zy",
  components: { calendar, stuFirstLevel },
  data: function () {
    return {
      zy_list: [],
      defaultDatetime: new Date(),
      pic_url: pic_url,
      errorImg: 'this.src="' + require("../../assets/person_photo.png") + '"',
      flag_sign: true,
      ifweek: true,
      date: "",
      scl_id: "",
      cls_id: "",
      init_page: true,
    };
  },
  mounted() {
    //图片游览按返回键退出游览
    this.$preview.on("imageLoadComplete", (e, item) => {
      let _preview = this.$preview.self;
      let lookUrl = window.location.href;
      if (lookUrl.indexOf("&look") === -1) {
        lookUrl = window.location.href + "&look";
        window.history.pushState(null, null, lookUrl);
      }
      this.flag_sign = true;
      _preview.listen("close", () => {
        if (window.location.href.indexOf("&look") !== -1 && this.flag_sign) {
          this.flag_sign = false;
          window.history.back();
        }
      });
      window.onhashchange = function () {
        if (_preview !== null && _preview !== undefined) {
          _preview.close();
          _preview = null;
        }
      };
    });
  },
  methods: {
    dateConfirm(date) {
      this.date = date;
      if (!this.init_page) {
        this.get_home_work();
      }
    },
    get_stu(user) {
      this.scl_id = user.scl_id;
      this.cls_id = user.cls_id;
      this.get_home_work();
      this.init_page = false;
    },
    // 获取作业
    get_home_work() {
      httpFormPostMethod("web/new/homework/list", {
        scl_id: this.scl_id,
        cls_id: this.cls_id,
        date: this.date,
      }).then((res) => {
        this.zy_list = res.data;
        this.$previewRefresh();
      });
    },
    weekshow(flag) {
      this.ifweek = flag;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.zy_main {
  .zy_list {
    padding: 0.55rem;
    .zy_item {
      width: 100%;
      background: #ffffff;
      border-radius: 7px;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
      padding: 0.7rem;
      margin-bottom: 0.55rem;
      &:last-of-type {
        margin-bottom: 0;
      }
      .top_des {
        display: flex;
        align-items: center;
        .person_photo {
          @include wh(1.8rem, 1.8rem);
        }
        .des {
          margin-left: 0.35rem;
          .name {
            font-size: 0.65rem;
            color: #666666;
          }
          .subject {
            margin-top: 0.15rem;
            font-size: 0.6rem;
            padding: 0.05rem 0.25rem;
            border-radius: 2px;
            text-align: center;
            display: inline-block;
          }
          .yw_subject {
            background: #e5f2ff;
            color: #3399ff;
          }
          .sx_subject {
            background: #fff4e8;
            color: #f98700;
          }
          .yy_subject {
            background: rgba(255, 85, 85, 0.2);
            color: rgb(255, 85, 85);
          }
          .wl_subject {
            background: rgba(249, 135, 0, 0.2);
            color: rgb(249, 135, 0);
          }
          .hx_subject {
            background: rgba(255, 184, 59, 0.2);
            color: rgb(255, 184, 59);
          }
          .sw_subject {
            background: rgba(102, 196, 109, 0.2);
            color: rgb(102, 196, 109);
          }
          .zz_subject {
            background: rgba(55, 209, 154, 0.2);
            color: rgb(55, 209, 154);
          }
          .dl_subject {
            background: rgba(52, 208, 242, 0.2);
            color: rgb(52, 208, 242);
          }
          .ls_subject {
            background: rgba(51, 153, 255, 0.2);
            color: rgb(51, 153, 255);
          }
          .music_subject {
            background: rgba(118, 111, 255, 0.2);
            color: rgb(118, 111, 255);
          }
          .ms_subject {
            background: rgba(187, 79, 255, 0.2);
            color: rgb(187, 79, 255);
          }
          .other_subject {
            background: rgba(240, 115, 204, 0.2);
            color: rgb(240, 115, 204);
          }
        }
      }
      .content {
        margin: 0.7rem 0;
        word-break: break-all;
      }
      .img_list {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 0.35rem;
        .zy_img {
          width: 33.33%;
          margin-right: 0.35rem;
          @include wh(5.15rem, 5.15rem);
          margin-bottom: 0.35rem;
          &:nth-child(3n) {
            margin-right: 0;
          }
        }
      }
      .time {
        font-size: 0.6rem;
        color: #999999;
      }
    }
  }
}
</style>
