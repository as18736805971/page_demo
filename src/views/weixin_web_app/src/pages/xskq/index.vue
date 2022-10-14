<template>
  <div class="xskq_main">
    <calendar
      :default-date="defaultDatetime"
      :is-show-week-view="true"
      @confirm="dateConfirm"
      @weekshow="weekshow"
    ></calendar>
    <stuFirstLevel @get_stu="get_stu"></stuFirstLevel>
    <div class="kq_list" v-if="att_list.length > 0">
      <div
        class="kq_item"
        v-for="(item, index) in att_list"
        :key="index"
        @click="viewDetail(item.stu_att_id)"
      >
        <div class="position">{{ item.att_type | att_type }}打卡</div>
        <div class="time_des">
          {{ item.att_time | fgAccurateTime }}{{ item.inout_type | inout_type }}
        </div>
      </div>
    </div>
    <div class="have_no_data" v-else :class="{ month_no_data: !ifweek }">
      <img src="../../assets/no_data.png" alt="" class="no_data" />
      <p class="text">暂无内容</p>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";
import { Tool } from "../../common/Tool";
import calendar from "../../components/calendar";
import { httpFormPostMethod } from "@/common/HttpService";
import stuFirstLevel from "../../components/stuFirstLevel";
export default {
  name: "xskq",
  components: { calendar, stuFirstLevel },
  data: function () {
    return {
      att_list: [],
      defaultDatetime: new Date(),
      ifweek: true,
      date: "",
      stu_id: "",
      init_page: true,
    };
  },
  computed: {
    ...mapGetters(["includePage"]),
  },
  mounted() {
    this.UPDATE_INCLUDE_PAGE({
      pageName: "xskq",
    });
  },
  methods: {
    ...mapMutations(["UPDATE_INCLUDE_PAGE"]),
    get_stu(user) {
      this.stu_id = user.stu_id;
      this.att_list = [];
      this.get_att_list();
      this.init_page = false;
    },
    // 获取考勤列表
    get_att_list() {
      httpFormPostMethod("web/use/att/list", {
        stu_id: this.stu_id,
        att_type: "",
        start_time: this.date + "000000",
        end_time: this.date + "235959",
      }).then((res) => {
        if (res.data) {
          this.att_list = res.data.att_list;
        }
      });
    },
    // 查看考勤详情
    viewDetail(stu_att_id) {
      this.$router.push({
        path: "/xskq_detail",
        query: {
          stu_att_id: stu_att_id,
          stu_id: this.stu_id
        },
      });
    },
    dateConfirm(day) {
      this.date = day;
      if (!this.init_page) {
        this.get_att_list();
      }
    },
    weekshow(flag) {
      this.ifweek = flag;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.xskq_main {
  .kq_list {
    padding: 0 0.55rem;
    padding-bottom: 1.1rem;
    .kq_item {
      width: calc(100% - 1rem);
      margin-top: 1.1rem;
      margin-left: 1rem;
      height: 3rem;
      border-radius: 7px;
      background: #fff;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
      padding: 0.45rem;
      position: relative;
      .position {
        font-size: 0.65rem;
        color: #666666;
        margin-bottom: 0.2rem;
      }
      .time_des {
        font-weight: bold;
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
        height: 3.6rem;
        background: #ebebeb;
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
