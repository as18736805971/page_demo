<template>
  <div class="qqdh_main">
    <calendar
      :default-date="defaultDatetime"
      :is-show-week-view="true"
      @confirm="dateConfirm"
      @weekshow="weekshow"
    ></calendar>
    <stuFirstLevel @get_stu="get_stu"></stuFirstLevel>
    <div class="qqdh_list" v-if="qqdh_list.length > 0">
      <div class="qqdh_item" v-for="(item, index) in qqdh_list" :key="index">
        <div class="item_top">
          <div class="left">
            <img
              :src="avatar || ''"
              :onerror="errorImg"
              alt=""
              class="qqdh_photo"
            />
            <span class="name">{{ item.stu_name }}去电</span>
          </div>
          <div class="time">{{ item.call_time | fgTimeMin }}</div>
        </div>
        <div class="tel">{{ item.call_number }}</div>
        <div class="thsc">{{ item.call_long | formatSeconds }}</div>
      </div>
    </div>
    <div class="have_no_data" v-else :class="{ month_no_data: !ifweek }">
      <img src="../../assets/no_data.png" alt="" class="no_data" />
      <p class="text">暂无内容</p>
    </div>
  </div>
</template>
<script>
import calendar from "@/components/calendar";
import { httpFormPostMethod } from "@/common/HttpService";
import stuFirstLevel from "../../components/stuFirstLevel";
export default {
  name: "qqdh",
  components: { calendar, stuFirstLevel },
  data: function () {
    return {
      avatar: "",
      qqdh_list: [],
      defaultDatetime: new Date(),
      errorImg: 'this.src="' + require("../../assets/qqdh_photo.png") + '"',
      ifweek: true,
      date: "",
      stu_id: "",
      init_page: true,
    };
  },
  mounted() {},
  methods: {
    dateConfirm(date) {
      this.date = date;
      if (!this.init_page) {
        this.get_stu_tel();
      }
    },
    get_stu(user) {
      this.stu_id = user.stu_id;
      this.avatar = user.user_photo_path;
      this.get_stu_tel();
      this.init_page = false;
    },
    // 获取亲情电话
    get_stu_tel() {
      httpFormPostMethod("web/use/tel/list", {
        stu_id: this.stu_id,
        date: this.date,
      }).then((res) => {
        this.qqdh_list = res.data;
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
.qqdh_main {
  .qqdh_list {
    padding: 0 0.55rem;
    margin-top: 1.1rem;
    .qqdh_item {
      width: calc(100% - 1rem);
      margin-bottom: 1.1rem;
      margin-left: 1rem;
      border-radius: 7px;
      background: #fff;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
      padding: 0.55rem;
      position: relative;
      .item_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.45rem;
        .left {
          display: flex;
          align-items: center;
          .qqdh_photo {
            @include wh(1.1rem, 1.1rem);
            border-radius: 50%;
          }
          .name {
            color: #666666;
            font-size: 0.65rem;
            padding-left: 0.45rem;
          }
        }
        .time {
          font-size: 0.6rem;
          color: #666666;
        }
      }
      .tel {
        font-size: 0.8rem;
        line-height: 1.15rem;
        margin-bottom: 0.2rem;
        color: #5184b6;
      }
      .thsc {
        font-size: 0.65rem;
        color: #999999;
      }
      &::before {
        content: "";
        width: 11px;
        height: 11px;
        background: #3399ff;
        border-radius: 50%;
        position: absolute;
        left: -1rem;
        top: 1.2rem;
      }
      &::after {
        content: "";
        width: 2px;
        height: 5.55rem;
        background: #EBEBEB;
        border-radius: 4px;
        position: absolute;
        left: -0.77rem;
        top: 1.75rem;
      }
      &:last-of-type {
        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
