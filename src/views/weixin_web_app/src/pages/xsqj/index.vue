<template>
  <div class="xsqj_main">
    <div class="xsqj_top_tab">
      <span
        class="common_tab"
        @click="switch_tab(1)"
        :class="{ checkedtab: type === 1 }"
        >发起申请</span
      >
      <span
        class="common_tab"
        @click="switch_tab(2)"
        :class="{ checkedtab: type === 2 }"
        >请假记录</span
      >
    </div>
    <div class="fqsq_main" v-if="type === 1">
      <div class="fqsq_form">
        <div class="form_area form_area_required" @click="choice_stu">
          <span class="left">学生姓名</span>
          <span class="right" v-if="stu_obj.stu_name">{{
            stu_obj.stu_name
          }}</span>
          <span class="right right_text" v-else>选择请假学生</span>
          <img src="../../assets/arrow_right.png" alt="" class="arrow_right" />
          <img src="../../assets/required.png" alt="" class="required_img" />
        </div>
        <div class="form_area form_area_required" @click="choice_leave">
          <span class="left">请假类型</span>
          <span class="right" v-if="checkd_leavel.text">{{
            checkd_leavel.text
          }}</span>
          <span class="right right_text" v-else>选择请假类型</span>
          <img src="../../assets/arrow_right.png" alt="" class="arrow_right" />
          <img src="../../assets/required.png" alt="" class="required_img" />
        </div>
        <div class="form_area form_area_required" @click="choice_start">
          <span class="left">开始时间</span>
          <span class="right" v-if="begin_time">{{ begin_time }}</span>
          <span class="right right_text" v-else>请假开始时间</span>
          <img src="../../assets/arrow_right.png" alt="" class="arrow_right" />
          <img src="../../assets/required.png" alt="" class="required_img" />
        </div>
        <div
          class="form_area form_area_required form_margin0"
          @click="choice_end"
        >
          <span class="left">结束时间</span>
          <span class="right" v-if="end_time">{{ end_time }}</span>
          <span class="right right_text" v-else>请假结束时间</span>
          <img src="../../assets/arrow_right.png" alt="" class="arrow_right" />
          <img src="../../assets/required.png" alt="" class="required_img" />
        </div>
        <div
          class="form_area form_area_required form_margin0"
          @click="choice_quit"
        >
          <span class="left">离校时间</span>
          <span class="right" v-if="leave_time">{{ leave_time }}</span>
          <span class="right right_text" v-else>选择离校时间</span>
          <img src="../../assets/arrow_right.png" alt="" class="arrow_right" />
          <img src="../../assets/required.png" alt="" class="required_img" />
        </div>
        <div class="form_textarea">
          <div class="title">
            <span>请假事由</span>
            <img src="../../assets/required.png" alt="" class="required" />
          </div>
          <textarea
            rows="4"
            placeholder="输入请假事由"
            v-model="leave_reason"
            class="textarea"
          />
        </div>
        <div class="form_textarea">
          <div class="title">
            <span>审批人</span>
            <span class="des">(点击头像删除)</span>
            <img src="../../assets/required.png" alt="" class="required" />
          </div>
          <div class="approve_list">
            <div
              class="approve_item"
              v-for="(item, index) in approve_list"
              :key="index"
            >
              <!-- <img
                src="../../assets/person_photo.png"
                alt=""
                class="photo"
                @click="deleteApprove(index)"
              /> -->
              <div class="name_circle" @click="deleteApprove(index)">
                {{ item.tea_name | interceptName }}
              </div>
              <span class="name">{{ item.tea_name }}</span>
            </div>
            <div class="approve_item" @click="add_approve">
              <img src="../../assets/add_approve.png" alt="" class="photo" />
              <span class="name">添加</span>
            </div>
          </div>
        </div>
      </div>
      <div class="fqsq_btn">
        <mt-button size="large" type="primary" @click="addApprove"
          >提交</mt-button
        >
      </div>
    </div>
    <div class="qjjl_main" v-if="type === 2" ref="qjjl_list">
      <stuSecondLevel @get_stu="get_stu"></stuSecondLevel>
      <section class="qjjl_list" v-if="qjjl_list.length > 0">
        <mt-loadmore
          :auto-fill="false"
          bottomDropText="上拉加载"
          :bottom-method="loadBottom"
          :bottom-all-loaded="allLoaded"
          ref="loadmore"
          :bottomDistance="1"
        >
          <div>
            <div
              class="item-wrapper"
              v-for="(item, index) in qjjl_list"
              :key="index"
              @click="viewDetail(item.leave_id)"
            >
              <div class="top_wrapper">
                <div class="left_wrapper">
                  <span class="name">{{ item.stu_name }}的请假</span>
                  <span class="type">{{ item.leave_type_name }}</span>
                </div>
                <div class="status qjdhh" v-if="item.leave_status === '1'">
                  待审核
                </div>
                <div class="status qjshtg" v-if="item.leave_status === '2'">
                  审核通过
                </div>
                <div class="status qjshwtg" v-if="item.leave_status === '3'">
                  审核未通过
                </div>
                <div class="status qjqx" v-if="item.leave_status === '4'">
                  已撤销
                </div>
              </div>
              <div class="center_wrapper">
                <div class="center_item">
                  <span class="title">请假时间:</span>
                  <span class="content"
                    >{{ item.begin_time | fgTimeMin }}~{{
                      item.end_time | fgTimeMin
                    }}</span
                  >
                </div>
                <div class="center_item">
                  <span class="title">请假事由:</span>
                  <span class="content">{{ item.leave_reason }}</span>
                </div>
              </div>
              <div class="time_wrapper">{{ item.create_time | fgTime }}</div>
            </div>
          </div>
        </mt-loadmore>
        <div v-if="allLoaded" class="nomore-data">
          <span class="text">我是有底线的</span>
        </div>
      </section>
      <section v-else class="main-no-data">
        <img src="../../assets/no_data.png" alt class="img" />
        <div class="text">暂无数据</div>
      </section>
    </div>
    <!-- 选择请假类型 -->
    <mt-popup v-model="leave_type_visible" position="bottom">
      <div class="leave_visible">
        <div class="title">选择请假类型</div>
        <div
          class="leave_list"
          @click="check_leave(item, k)"
          v-for="(item, k) in leave_type"
          :key="k"
        >
          {{ item }}
        </div>
        <div class="cancel" @click="leave_type_visible = false">取消</div>
      </div>
    </mt-popup>
    <!-- 选择请假学生 -->
    <mt-popup v-model="stu_visible" position="bottom">
      <div class="leave_visible">
        <div class="title">选择请假学生</div>
        <div class="leave_list_main">
          <div
            class="leave_list"
            @click="check_stu(item)"
            v-for="(item, index) in stu_list"
            :key="index"
          >
            {{ item.stu_name }}
          </div>
        </div>

        <div class="cancel" @click="stu_visible = false">取消</div>
      </div>
    </mt-popup>
    <!-- 选择请假开始时间 -->
    <mt-datetime-picker
      class="pickerstart"
      ref="picker0"
      :startDate="new Date()"
      type="datetime"
      v-model="pickerStart"
      @confirm="confirm_start"
    >
    </mt-datetime-picker>
    <!-- 选择请假开始时间 -->
    <mt-datetime-picker
      class="pickerend"
      ref="picker1"
      :startDate="pickerStart"
      type="datetime"
      v-model="pickerEnd"
      @confirm="confirm_end"
    >
    </mt-datetime-picker>
    <!-- 选择请假开始时间 -->
    <mt-datetime-picker
      class="pickerquit"
      ref="picker2"
      :startDate="new Date()"
      type="datetime"
      v-model="pickerQuit"
      @confirm="confirm_quit"
    >
    </mt-datetime-picker>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from "vuex";
import { Tool } from "../../common/Tool";
import { httpFormPostMethod } from "@/common/HttpService";
import stuSecondLevel from "../../components/stuSecondLevel";
import { decrypt } from "@/common/auth";
export default {
  name: "xsqj",
  components: { stuSecondLevel },
  data: function () {
    return {
      type: 1,
      qjjl_list: [],
      page_num: 1,
      page_size: 10,
      allLoaded: false,
      leave_type_visible: false,
      stu_visible: false,
      leave_reason: "",
      stu_list: JSON.parse(decrypt(sessionStorage.getItem("roles"))),
      stu_obj: {
        stu_name: "",
        scl_id: "",
        cls_id: "",
        stu_id: "",
      },
      leave_type: {},
      checkd_leavel: {
        type: "",
        text: "",
      },
      begin_time: "",
      end_time: "",
      leave_time: "",
      pickerStart: new Date(),
      pickerEnd: "",
      pickerQuit: new Date(),
      approve_list: [],
      stu_name: "",
      stu_id: "",
    };
  },
  computed: {
    ...mapGetters(["includePage", "check_user"]),
  },
  mounted() {
    this.UPDATE_INCLUDE_PAGE({
      pageName: "xsqj",
    });
    this.UPDATE_CHECK_USER({});
    this.get_leave_type();
    this.get_stu_info();
  },
  activated() {
    if (this.type === 2) {
      this.$refs.qjjl_list.scrollTop = sessionStorage.scrollPosition;
    } else {
      const tea_id = this.approve_list.map((opt) => {
        return opt.tea_id;
      });
      if (
        tea_id.indexOf(this.check_user.tea_id) === -1 &&
        this.check_user.tea_id
      ) {
        this.approve_list.push(this.check_user);
      }
    }
  },
  methods: {
    ...mapMutations(["UPDATE_INCLUDE_PAGE", "UPDATE_CHECK_USER"]),
    switch_tab(type) {
      this.type = type;
      if (this.type === 2) {
        this.qjjl_list = [];
      }
    },
    // 获取当前学生
    get_stu(user) {
      this.qjjl_list = [];
      this.stu_name = user.stu_name;
      this.stu_id = user.stu_id;
      this.page_num = 1;
      this.allLoaded = false;
      this.getList((lt) => {
        if (lt.lastPage) {
          this.allLoaded = true;
        }
      });
    },
    // 获取请假类型
    get_leave_type() {
      httpFormPostMethod("sys/dic/child/leaveType", {}).then((res) => {
        this.leave_type = res.data;
      });
    },
    // 获取学生信息
    get_stu_info() {
      if (this.stu_list.length > 0) {
        this.stu_obj = {
          stu_name: this.stu_list[0].stu_name,
          scl_id: this.stu_list[0].scl_id,
          cls_id: this.stu_list[0].cls_id,
          stu_id: this.stu_list[0].stu_id,
        };
        this.get_cls_mgr();
      }
    },
    // 选择请假学生
    choice_stu() {
      this.stu_visible = true;
    },
    // 确定选中的学生
    check_stu(user) {
      this.stu_obj = {
        stu_name: user.stu_name,
        scl_id: user.scl_id,
        cls_id: user.cls_id,
        stu_id: user.stu_id,
      };
      this.get_cls_mgr();
      this.stu_visible = false;
    },
    // 获取请假记录列表
    getList(fun) {
      httpFormPostMethod("web/stu/leave/paginate", {
        stu_id: this.stu_id,
        page_num: this.page_num,
        page_size: this.page_size,
      }).then((res) => {
        if (res.data.list) {
          res.data.list.forEach((opt) => {
            this.qjjl_list.push(opt);
          });
          if (fun) {
            fun(res.data);
          }
        }
      });
    },
    // 上拉加载
    loadBottom: function () {
      this.page_num++;
      this.getList((lt) => {
        this.$refs.loadmore.onBottomLoaded();
        if (lt.lastPage) {
          this.allLoaded = true;
        }
      });
    },
    // 查看详情
    viewDetail(leave_id) {
      sessionStorage.scrollPosition = this.$refs.qjjl_list.scrollTop;
      this.$router.push({
        path: "/xsqj_detail",
        query: {
          leave_id: leave_id,
        },
      });
    },
    // 选择请假类型
    choice_leave() {
      this.leave_type_visible = true;
    },
    // 确定请假类型
    check_leave(item, k) {
      this.checkd_leavel = {
        type: k,
        text: item,
      };
      this.leave_type_visible = false;
    },
    // 选择请假开始时间
    choice_start() {
      this.$refs.picker0.open();
    },
    // 选择请假开始时间
    choice_end() {
      if (!this.begin_time) {
        Tool.tip("请先选择请假开始时间");
        return;
      }
      this.$refs.picker1.open();
    },
    // 选择离校时间
    choice_quit() {
      this.$refs.picker2.open();
    },
    // 确认请假开始时间
    confirm_start() {
      this.begin_time = Tool.formate(this.pickerStart, "yyyy/MM/dd hh:mm");
      this.pickerEnd = JSON.parse(JSON.stringify(this.pickerStart));
    },
    // 确认请假结束时间
    confirm_end() {
      this.end_time = Tool.formate(this.pickerEnd, "yyyy/MM/dd hh:mm");
    },
    // 确认离校时间
    confirm_quit() {
      this.leave_time = Tool.formate(this.pickerQuit, "yyyy/MM/dd hh:mm");
    },
    // 获取班主任信息
    get_cls_mgr() {
      this.approve_list = [];
      httpFormPostMethod("web/stu/leave/cls/mgr", {
        scl_id: this.stu_obj.scl_id,
        cls_id: this.stu_obj.cls_id,
      }).then((res) => {
        if (res.data) {
          this.approve_list = [
            {
              tea_id: res.data.tea_id,
              tea_name: res.data.tea_name,
            },
          ];
        }
      });
    },
    // 删除审批人
    deleteApprove(index) {
      this.approve_list.splice(index, 1);
      this.UPDATE_CHECK_USER({});
    },
    // 添加审批人
    add_approve() {
      this.$router.push({
        path: "/mail_list",
        query: {
          scl_id: this.stu_obj.scl_id,
        },
      });
    },
    // 提交请假申请
    addApprove() {
      if (!this.checkd_leavel.type) {
        Tool.tip("请选择请假类型");
        return;
      }
      if (!this.begin_time) {
        Tool.tip("请选择请假开始时间");
        return;
      }
      if (!this.end_time) {
        Tool.tip("请选择请假结束时间");
        return;
      }
      if (!this.leave_time) {
        Tool.tip("请选择离校时间");
        return;
      }
      if (!this.leave_reason) {
        Tool.tip("请输入请假事由");
        return;
      }
      const tea_id = this.approve_list.map((item) => {
        return item.tea_id;
      });
      if (tea_id.length === 0) {
        Tool.tip("请选择审批人");
        return;
      }
      httpFormPostMethod("web/stu/leave/save", {
        scl_id: this.stu_obj.scl_id,
        stu_id: this.stu_obj.stu_id,
        leave_type: this.checkd_leavel.type,
        begin_time: Tool.formate(this.begin_time, "yyyyMMddhhmmss"),
        end_time: Tool.formate(this.end_time, "yyyyMMddhhmmss"),
        leave_time: Tool.formate(this.leave_time, "yyyyMMddhhmmss"),
        leave_reason: this.leave_reason,
        check_user_id: tea_id.join(","),
      }).then((res) => {
        this.switch_tab(2);
        Tool.tip("提交成功");
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.qjjl_main {
  .qjjl_list {
    padding: 0.55rem;
    padding-top: 0;
    position: absolute;
    width: 100%;
    top: 5.1rem;
    bottom: 0;
    overflow-y: auto;
    .item-wrapper {
      @include wh(100%, 5.95rem);
      background: #ffffff;
      border-radius: 7px;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
      margin-bottom: 0.55rem;
      padding: 0.55rem 0.7rem;
      &:last-of-type {
        margin-bottom: 0;
      }
      .top_wrapper {
        display: flex;
        justify-content: space-between;
        .left_wrapper {
          display: flex;
          align-items: center;
          .name {
            font-weight: bold;
            margin-right: 0.35rem;
          }
          .type {
            padding: 0.05rem 0.25rem;
            background: #e5f2ff;
            border-radius: 2px;
            color: #3399ff;
          }
        }
        .status {
          font-size: 0.65rem;
        }
      }
      .center_wrapper {
        padding: 0.55rem 0;
        .center_item {
          display: flex;
          align-items: center;
          font-size: 0.65rem;
          line-height: 0.9rem;
          .title {
            color: #999999;
          }
          &:last-of-type {
            margin-top: 0.2rem;
            .content {
              width: calc(100% - 2.8rem);
              @include omit();
            }
          }
        }
      }
      .time_wrapper {
        color: #cccccc;
        font-size: 0.6rem;
      }
    }
  }
}
.fqsq_main {
  .fqsq_form {
    position: absolute;
    top: 2.15rem;
    bottom: 2.9rem;
    width: 100%;
    overflow-y: auto;
    .form_area {
      display: flex;
      justify-content: space-between;
      padding: 0.6rem 0.7rem;
      background: #fff;
      margin-top: 0.45rem;
      font-size: 0.7rem;
      .left {
        color: #666666;
      }
      .right_text {
        color: #cccccc;
      }
    }
    .form_area_required {
      position: relative;
      .right {
        margin-right: 1.1rem;
      }
      .arrow_right {
        position: absolute;
        right: 0.5rem;
        @include wh(1.1rem, 1.1rem);
      }
      .required_img {
        position: absolute;
        @include wh(0.3rem, 0.35rem);
        left: 0.3rem;
        top: 0.95rem;
      }
    }
    .form_margin0 {
      margin-top: 0;
      border-top: 1px solid #f0f2f5;
    }
    .form_textarea {
      margin-top: 0.45rem;
      padding: 0.55rem 0.7rem;
      background: #fff;
      .textarea {
        width: 100%;
        font-size: 0.7rem;
        padding-top: 0.55rem;
      }
      .title {
        color: #666666;
        position: relative;
        .required {
          @include wh(0.3rem, 0.35rem);
          position: absolute;
          left: -0.4rem;
          top: 0.35rem;
        }
        .des {
          color: #909399;
          font-size: 0.6rem;
        }
      }
      .approve_list {
        display: flex;
        flex-wrap: wrap;
        padding-top: 0.7rem;
        .approve_item {
          display: flex;
          flex-direction: column;
          margin-right: 1.6rem;
          margin-bottom: 0.35rem;
          position: relative;
          text-align: center;
          word-break: break-all;
          &::after {
            content: url("../../assets/arrow_right.png");
            transform: scale(0.5);
            position: absolute;
            right: -1.9rem;
            top: 0;
          }
          &:nth-child(5n) {
            margin-right: 0;
            &::after {
              content: "";
            }
          }
          &:last-of-type {
            margin-right: 0;
            &::after {
              content: "";
            }
          }
          .photo {
            @include wh(2.15rem, 2.15rem);
          }
          .name_circle {
            @include wh(2.15rem, 2.15rem);
            background: rgb(50, 150, 250);
            border-radius: 50%;
            color: #ffffff;
            font-size: 0.6rem;
            text-align: center;
            line-height: 2.15rem;
          }
          .name {
            @include omit();
            width: 2.15rem;
            font-size: 0.65rem;
            margin-top: 0.2rem;
            color: #5e6166;
          }
        }
      }
    }
  }
  .fqsq_btn {
    position: fixed;
    bottom: 0;
    @include wh(100%, 2.9rem);
    background: #fff;
    padding: 0.35rem 0.7rem;
  }
}
.main-no-data {
  @include ctblr();
  margin-top: -1.25rem;
  font-size: 0.7rem;
  text-align: center;
  .text {
    line-height: 2rem;
  }
}
.leave_visible {
  width: 100%;
  border-radius: 7px 7px 0px 0px;
  text-align: center;
  .title {
    font-size: 0.65rem;
    color: #999999;
    padding: 9px 0;
    background: #fff;
    border-radius: 7px 7px 0px 0px;
  }
  .leave_list_main {
    max-height: 13.2rem;
    overflow-y: auto;
  }
  .leave_list {
    background: #fff;
    padding: 0.6rem 0;
    border-top: 1px solid #f0f2f5;
  }
  .cancel {
    margin-top: 0.45rem;
    padding: 0.6rem 0;
    background: #fff;
  }
}
.xsqj_top_tab {
  width: 100%;
  height: 2.15rem;
  background: #ffffff;
  display: flex;
  text-align: center;
  align-items: center;
  .common_tab {
    flex: 1;
    color: #999999;
  }
  .checkedtab {
    color: #333333;
    font-weight: bold;
    position: relative;
    &:after {
      content: "";
      width: 0.9rem;
      height: 0.1rem;
      background: #3399ff;
      border-radius: 1px;
      position: absolute;
      bottom: -0.5rem;
      left: 50%;
      margin-left: -0.45rem;
    }
  }
}
</style>
<style lang="scss">
.xsqj_main {
  .mint-popup-bottom {
    width: 100% !important;
    background: #f5f7fa;
    border-radius: 7px 7px 0px 0px;
  }
  .mint-datetime-picker {
    background: #fff;
    .picker-item {
      color: #999999;
      font-size: 0.7rem;
    }
    .picker-selected {
      color: #333333;
    }
    .picker-toolbar {
      display: flex;
      justify-content: space-between;
      &::after {
        position: absolute;
        content: "开始时间";
        color: #999999;
        font-size: 0.65rem;
        left: 50%;
        margin-left: -1.3rem;
        top: 10px;
      }
    }
    .mint-datetime-action {
      width: auto;
      padding: 0 0.7rem;
      font-size: 0.7rem;
    }
    .mint-datetime-cancel {
      color: #666666;
    }
    .mint-datetime-confirm {
      color: #3399ff;
    }
  }
  .pickerend {
    .picker-toolbar {
      &::after {
        content: "结束时间";
      }
    }
  }
  .pickerquit {
    .picker-toolbar {
      &::after {
        content: "离校时间";
      }
    }
  }
  .mint-button--primary {
    background: #3399ff;
    border-radius: 5px;
    .mint-button-text {
      font-size: 0.7rem;
    }
  }
}
</style>
