<template>
  <div class="xsqj_detail">
    <div class="xsqj_main" :class="{ xsqj_have_revoke: oper_flag === '0' }">
      <div class="xsqj_top">
        <div class="top_des">
          <div class="top">
            <div class="left">
              <span class="name">{{ leave_info.stu_name }}的请假</span>
              <span class="type">{{ leave_info.leave_type_name }}</span>
            </div>
            <span class="status qjdhh" v-if="leave_info.leave_status === '1'"
              >待审核</span
            >
            <span class="status qjshtg" v-if="leave_info.leave_status === '2'">
              审核通过
            </span>
            <span class="status qjshwtg" v-if="leave_info.leave_status === '3'">
              审核未通过
            </span>
            <span class="status qjqx" v-if="leave_info.leave_status === '4'"
              >已撤销</span
            >
          </div>
          <div class="time">{{ leave_info.create_time | fgTimeMin }}</div>
        </div>
        <div class="bot_des">
          <div class="bot_item">
            <span class="left">开始时间：</span>
            <span class="right">{{ leave_info.begin_time | fgTimeMin }}</span>
          </div>
          <div class="bot_item">
            <span class="left">结束时间：</span>
            <span class="right">{{ leave_info.end_time | fgTimeMin }}</span>
          </div>
          <div class="bot_item">
            <span class="left">离开时间：</span>
            <span class="right">{{ leave_info.leave_time | fgTimeMin }}</span>
          </div>
          <div class="bot_item">
            <span class="left">返校时间：</span>
            <span class="right" v-if="leave_info.back_time">{{
              leave_info.back_time | fgTimeMin
            }}</span>
          </div>
          <div class="bot_item">
            <span class="left">请假事由：</span>
            <span class="right">{{ leave_info.leave_reason }}</span>
          </div>
        </div>
      </div>
      <div class="xsqj_spjd">
        <div class="title">审批进度</div>
        <div class="spjd_list">
          <div
            class="spjd_item"
            v-for="(item, index) in spjd_list"
            :key="index"
          >
            <div class="photo_wrapper name_circle">
              <span>{{ item.audit_user_name | interceptName }}</span>
              <img
                src="../../assets/agree.png"
                alt=""
                class="opinion"
                v-if="item.audit_status === '2' || item.me"
              />
              <img
                src="../../assets/reject.png"
                alt=""
                class="opinion"
                v-if="item.audit_status === '3'"
              />
            </div>
            <div class="center">
              <div class="top_des">
                <span class="name">{{ item.audit_user_name }}</span>
                <span class="status approval" v-if="item.audit_status === '1'"
                  >待审批</span
                >
                <span class="status" v-if="item.audit_status === '2'"
                  >已同意</span
                >
                <span class="status reject" v-if="item.audit_status === '3'"
                  >已拒绝</span
                >
              </div>
              <span class="remark">{{ item.audit_remark }}</span>
            </div>
            <span class="time" v-if="item.audit_time">{{
              item.audit_time | fgTimeMin
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <footer class="xsqj_revoke" v-if="oper_flag == '0'">
      <div class="btn" @click="revoke_sxqj">
        <img src="../../assets/revoke.png" alt="" class="revoke_img" />
        <span>撤销</span>
      </div>
    </footer>
  </div>
</template>
<script>
import { Tool } from "../../common/Tool";
import { httpFormPostMethod } from "@/common/HttpService";
import { mapMutations, mapGetters } from "vuex";
export default {
  name: "xsqj_detail",
  components: {},
  data: function () {
    return {
      spjd_list: [],
      leave_info: {},
      oper_flag: -1
    };
  },
  mounted() {
    this.get_detail();
  },
  computed: {
    ...mapGetters(["includePage"]),
  },
  methods: {
    ...mapMutations(["UPDATE_INCLUDE_PAGE"]),
    // 撤销请假
    revoke_sxqj() {
      Tool.alert(
        "您确定要撤销该条请假信息吗？撤销后不可恢复。",
        "撤销提示",
        true,
        () => {
          httpFormPostMethod("web/stu/leave/cancel", {
            leave_id: this.$route.query.leave_id,
          }).then((res) => {
            this.get_detail();
            this.UPDATE_INCLUDE_PAGE({
              pageName: "xsqj",
              sign: false,
            });
          });
        }
      );
    },
    // 获取请假详情
    get_detail() {
      this.spjd_list = [];
      httpFormPostMethod("web/stu/leave/detail", {
        leave_id: this.$route.query.leave_id,
      }).then((res) => {
        this.spjd_list = res.data.check_info_list;
        this.spjd_list.unshift({
          audit_user_name: res.data.leave_info.stu_name,
          audit_remark: "发起申请",
          me: true,
        });
        this.leave_info = res.data.leave_info;
        this.oper_flag = res.data.oper_flag;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.xsqj_detail {
  .xsqj_main {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    overflow-y: auto;
  }
  .xsqj_have_revoke {
    bottom: 2.9rem;
  }
  .xsqj_top {
    padding: 0 0.7rem;
    background: #fff;
    .top_des {
      padding: 0.45rem 0 0.55rem 0;
      border-bottom: 1px solid #f0f2f5;
      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          display: flex;
          align-items: center;
          .name {
            font-size: 0.8rem;
            font-weight: bold;
            color: #2c2e33;
            margin-right: 0.35rem;
          }
          .type {
            padding: 0.05rem 0.25rem;
            background: #e5f2ff;
            border-radius: 2px;
            color: #3399ff;
            font-size: 0.6rem;
          }
        }
        .status {
          font-size: 0.65rem;
        }
      }
      .time {
        color: #c4c7cc;
        margin-top: 0.2rem;
        font-size: 0.6rem;
      }
    }
    .bot_des {
      padding: 0.55rem 0;
      .bot_item {
        font-size: 0.65rem;
        line-height: 1rem;
        display: flex;
        margin-bottom: 0.1rem;
        .left {
          color: #909399;
        }
        .right {
          color: #2c2e33;
          width: calc(100% - 3.25rem);
        }
      }
    }
  }
  .xsqj_spjd {
    .title {
      color: #909399;
      font-size: 0.65rem;
      padding: 0.35rem 0.7rem;
    }
    .spjd_list {
      background: #fff;
      padding: 0.7rem;
      .spjd_item {
        display: flex;
        position: relative;
        margin-bottom: 1.5rem;
        &::after {
          content: url("../../assets/arrow_bot.png");
          position: absolute;
          bottom: -1.15rem;
          left: 0.78rem;
        }
        &:last-of-type {
          margin-bottom: 0;
          &::after {
            content: "";
          }
        }
        .photo_wrapper {
          @include wh(2.15rem, 2.15rem);
          position: relative;
          .person_photo {
            @include wh(2.15rem, 2.15rem);
          }
          .opinion {
            @include wh(0.65rem, 0.65rem);
            position: absolute;
            right: 0;
            bottom: 0;
          }
        }
        .name_circle {
          background: rgb(50, 150, 250);
          border-radius: 50%;
          color: #ffffff;
          font-size: 0.6rem;
          text-align: center;
          line-height: 2.15rem;
        }
        .center {
          margin-left: 0.45rem;
          display: flex;
          flex-direction: column;
          .name {
            font-size: 0.7rem;
            color: #2c2e33;
          }
          .status {
            font-size: 0.6rem;
            padding: 0.05rem 0.2rem;
            color: #fff;
            background: #66c46d;
            border-radius: 2px;
            margin-left: 0.35rem;
          }
          .approval {
            background: #f98700;
          }
          .reject {
            background: #f0644d;
          }
          .remark {
            margin-top: 0.15rem;
            color: #909399;
            font-size: 0.65rem;
          }
        }
        .time {
          position: absolute;
          right: 0;
          top: 0;
          font-size: 0.6rem;
          color: #c4c7cc;
        }
      }
    }
  }
  .xsqj_revoke {
    position: fixed;
    bottom: 0;
    @include wh(100%, 2.9rem);
    padding: 0.35rem 0.7rem;
    background: #fff;
    .btn {
      width: 100%;
      height: 100%;
      border: 1px solid #ebebeb;
      border-radius: 5px;
      color: #5e6166;
      font-size: 0.6rem;
      display: flex;
      justify-content: center;
      align-items: center;
      .revoke_img {
        @include wh(1.1rem, 1.1rem);
        margin-right: 0.35rem;
      }
    }
  }
}
</style>
