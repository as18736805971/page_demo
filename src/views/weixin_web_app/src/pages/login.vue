<template>
  <div class="login_main">
    <div class="login_top">
      <img src="../assets/pajx_logo.png" alt="" class="pajx_logo" />
    </div>
    <div class="login_center">
      <div class="mobile_wrapper">
        <input
          type="number"
          placeholder="手机号"
          v-model="account"
          class="mobile_input"
          maxlength="11"
          @input="account_change"
        />
        <img src="../assets/input_tel.png" alt="" class="input_img" />
      </div>
      <div
        class="mobile_wrapper"
        v-if="area_list.length > 1"
        @click="area_visible = true"
      >
        <span class="span_wrapper">
          <span v-if="!area" style="color: #cccccc">请选择登录省份</span>
          <span v-else>{{ disting_area(area) }}</span>
        </span>
        <img src="../assets/input_area.png" alt="" class="input_img" />
        <img src="../assets/arrow_bot.png" alt="" class="arrow_bot" />
      </div>
      <div class="verify_wrapper">
        <input
          type="number"
          v-model="sms_code"
          placeholder="请输入验证码"
          class="verify_input"
        />
        <img src="../assets/verify_input.png" alt="" class="input_img" />
        <span class="getcode code" v-show="!time" @click="getVertifyCode"
          >获取验证码</span
        >
        <span v-show="time" class="code-get-text code"
          >{{ time }}秒后重新获取</span
        >
      </div>
    </div>
    <div class="login_bot">
      <mt-button size="large" type="primary" @click="login_pajx"
        >登录</mt-button
      >
    </div>
    <!-- 选择请假类型 -->
    <mt-popup v-model="area_visible" position="bottom">
      <div class="area_visible">
        <div class="title">选择省份</div>
        <div
          class="leave_list"
          @click="choice_area(item)"
          v-for="(item, index) in area_list"
          :key="index"
        >
          {{ disting_area(item) }}
        </div>
        <div class="cancel" @click="area_visible = false">取消</div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import { httpFormPostMethod } from "../common/HttpService";
import { Tool } from "../common/Tool";
import { setCookie, getCookie } from "@/common/support";
export default {
  name: "login",
  data: function () {
    return {
      time: 0,
      account: "",
      sms_code: "",
      area: "",
      area_list: [],
      area_visible: false,
    };
  },
  created() {
    this.account = getCookie("account");
    if (
      this.account === undefined ||
      this.account == null ||
      this.account === ""
    ) {
      this.account = "";
    }
  },
  mounted() {},
  methods: {
    // 获取验证码
    getVertifyCode() {
      const myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
      if (!this.account) {
        Tool.tip("手机号不能为空");
        return;
      }
      if (!myreg.test(this.account)) {
        Tool.tip("请输入正确的手机号");
        return;
      }
      if (!this.area) {
        Tool.tip("请选择登录省份");
        return;
      }
      httpFormPostMethod("login/logsms", {
        account: this.account,
      }).then((res) => {
        Tool.tip("发送成功");
        this.time = 60;
        this.timer = setInterval(this.countDown, 1000);
      });
    },

    // 获取验证码倒计时处理
    countDown() {
      if (this.time <= 0) {
        clearInterval(this.timer);
      } else {
        this.time--;
      }
    },
    account_change() {
      if (this.account.length === 11) {
        this.area_list = [];
        httpFormPostMethod(
          "WX/checkPhoneArea",
          { fam_phone: this.account },
          true,
          "http://app.pajx.com.cn/app_api_v4/index.php/Houtai/"
        ).then((res) => {
          let area_list = res.data.map((item) => {
            return item.area;
          });
          let area = Array.from(new Set(area_list));
          if (area.length === 0) {
            Tool.tip("手机号不存在");
          } else if (area.length === 1) {
            this.area = area[0];
            sessionStorage.area = this.area;
          } else {
            this.area_list = area;
          }
        });
      }
    },

    // 登录
    login_pajx() {
      if (!this.account) {
        Tool.tip("手机号不能为空");
        return;
      }
      if (!this.sms_code) {
        Tool.tip("请输入验证码");
        return;
      }
      if (this.sms_code.length !== 6) {
        Tool.tip("验证码为6位");
        return;
      }
      httpFormPostMethod("web/fam/login", {
        account: this.account,
        sms_code: this.sms_code,
      }).then((res) => {
        this.$router.replace({
          path: "/",
          query: { token: res.data.token, area: this.area },
        });
      });
    },

    choice_area(area) {
      this.area = area;
      sessionStorage.area = this.area;
      this.area_visible = false;
    },

    disting_area(area) {
      switch (area) {
        case "ha":
          return "河南";
        case "he":
          return "河北";
        case "sn":
          return "陕西";
        case "sc":
          return "四川";
        case "sd":
          return "山东";
        default:
          return "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../styles/mixin";
.login_main {
  position: absolute;
  @include wh(100%, 100%);
  background: url("../assets/login_bg.png");
  background-size: 100% 100%;
  .login_top {
    text-align: center;
    .pajx_logo {
      margin: 2.6rem 0 0.7rem 0;
      @include wh(4.55rem, 4.55rem);
    }
    .title {
      font-size: 1.1rem;
      font-weight: bold;
    }
  }
  .login_center {
    width: calc(100% - 2.9rem);
    margin-top: 3rem;
    margin-left: 1.45rem;
    // height: 7.6rem;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
    .mobile_wrapper {
      border-bottom: 1px solid #f0f2f5;
      position: relative;
      .mobile_input {
        width: 100%;
        padding: 0.75rem;
        padding-left: 2.3rem;
        font-size: 0.7rem;
        border-radius: 7px;
      }
      .span_wrapper {
        display: inline-block;
        height: 2.5rem;
        line-height: 2.5rem;
        padding-left: 2.35rem;
      }
      .arrow_bot {
        position: absolute;
        top: 0.95rem;
        right: 0.8rem;
      }
    }
    .verify_wrapper {
      position: relative;
      .verify_input {
        width: calc(100% - 6rem);
        padding: 0.75rem;
        padding-left: 2.3rem;
        font-size: 0.7rem;
      }
      .code {
        position: absolute;
        right: 0.75rem;
        top: 0.75rem;
      }
      .getcode {
        color: #3399ff;
      }
      .code-get-text {
        color: #939699;
      }
    }
    .input_img {
      @include wh(1.1rem, 1.1rem);
      position: absolute;
      left: 0.75rem;
      top: 0.625rem;
    }
  }
  .login_bot {
    padding: 0 1.45rem;
    margin-top: 1.8rem;
  }
}
.area_visible {
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
</style>
<style lang="scss">
.login_bot {
  .mint-button--primary {
    border-radius: 4px;
  }
}
.login_main {
  .mint-popup-bottom {
    width: 100% !important;
    background: #f5f7fa;
    border-radius: 7px 7px 0px 0px;
  }
}
</style>
