<template>
  <div class="my_main">
    <div class="switch">
      <div class="switch-btn" @click="handleJump('https://wx.zm-teach.com/index.php/web/app_login/new_enter')">
        <img src="../../assets/switch.png" alt="" class="switch-icon" />切换角色
      </div>
    </div>
    <div
      class="scan_wrapper"
      v-if="area === 'ha' || (area === 'sn' && is_weixin)"
    >
      <div class="scan_main" @click="scan_code">
        <img src="../../assets/add_stu.png" alt="" class="add_stu" />
        <span class="add_stu_text">扫描一校一码添加学生</span>
      </div>
    </div>
    <div class="menu_title menu_title_nofirst">
      <div class="menu_title_nofirst_left">
        <span class="line"></span>
        <span class="title">孩子列表</span>
      </div>
      <span class="menu_title_nofirst_right" @click="unbind" v-if="is_weixin"
        >解除微信绑定</span
      >
    </div>
    <div class="role_list">
      <div
        class="role_item"
        v-for="(item, index) in roles"
        :key="index"
        :class="{
          role_item_open: item.biz_open_flag == 0 && area === 'ha' && is_weixin,
          role_item_bit: area === 'sn',
        }"
      >
        <div class="left_photo" :class="{ checked_role: item.checked }">
          <img
            :src="item.user_photo_path || ''"
            alt=""
            class="person_photo"
            :onerror="errorImg"
          />
        </div>
        <div class="des_wrapper">
          <span class="name">{{ item.stu_name }}</span>
          <div class="center_wrapper">
            <span class="item_wrapper">年级:{{ item.gra_show_name }}年级</span>
            <span class="item_wrapper">班级:{{ item.cls_show_name }}</span>
          </div>
          <span class="sch">{{ item.scl_name }}</span>
        </div>
        <div class="bot_control" v-if="area === 'ha' && is_weixin">
          <div v-if="item.biz_open_flag != 1">
            <div v-if="item.biz_channel != -1 && item.biz_channel != 3">
              <span class="control_wrapper" @click="open_business(item.stu_id)"
                >开通业务</span
              >
            </div>
          </div>
        </div>
        <div class="bot_control" v-if="area === 'sn'">
          <img
            src="../../assets/bit_by_bit.png"
            alt=""
            class="bit_by_bit"
            @click="open_bit_visible(item)"
          />
        </div>
        <span class="biz_open_flag">
          <div v-if="area !== 'ha'">
            <div
              class="item_flag open"
              v-if="item.biz_open_flag == 1 || item.biz_open_flag == 2"
            >
              <img
                src="../../assets/open_business.png"
                alt=""
                class="flag_img"
              />
              <span>已开通业务</span>
            </div>
            <div class="item_flag close" v-else>
              <img
                src="../../assets/not_open_business.png"
                alt=""
                class="flag_img"
              />
              <span>未开通业务</span>
            </div>
          </div>
          <div v-else>
            <div v-if="item.biz_open_flag == 1">
              <div class="item_flag open">
                <img
                  src="../../assets/open_business.png"
                  alt=""
                  class="flag_img"
                />
                <span v-if="item.biz_channel == -1">共享业务</span>
                <span v-else>已开通业务</span>
              </div>
            </div>
            <div v-else>
              <div
                class="item_flag close"
                v-if="item.biz_channel != -1 && item.biz_channel != 3"
              >
                <img.
                  src="../../assets/not_open_business.png"
                  alt=""
                  class="flag_img"
                />
                <span>未开通业务</span>
              </div>
            </div>
          </div>
          <!-- <div class="item_flag close" v-else-if="item.biz_open_flag == 2">
            <span>体验期</span>
          </div> -->
        </span>
      </div>
    </div>
    <mt-popup
      v-model="bit_control_visible"
      position="bottom"
      style="width: 100%"
    >
      <div class="bit_by_control">
        <div class="control_item" @click="bit_open_business">开通业务</div>
        <div class="control_item" @click="bit_edit_business">修改</div>
        <div class="control_item" @click="bit_control_visible = false">
          取消
        </div>
      </div>
    </mt-popup>
  </div>
</template>
<script>
import { httpFormPostMethod } from "../../common/HttpService";
import { mapMutations } from "vuex";
import { decrypt } from "@/common/auth";
import { Tool } from "../../common/Tool";
export default {
  name: "index",
  components: {},
  data: function () {
    return {
      roles: JSON.parse(decrypt(sessionStorage.getItem("roles"))),
      errorImg: 'this.src="' + require("../../assets/person_photo.png") + '"',
      area: sessionStorage.getItem("area"),
      is_weixin: false,
      bit_control_visible: false,
      checked_role: {},
    };
  },
  mounted() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      this.is_weixin = true;
    } else {
      this.is_weixin = false;
    }
    if (this.area === "ha" || this.area === "sn" && this.is_weixin) {
      let url = location.href.split("#")[0];
      httpFormPostMethod(
        "get_sign_package",
        {
          url: url,
        },
        true,
        "https://wx.zm-teach.com/index.php/web/Api/"
      ).then((res) => {
        wx.config({
          debug: false,
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: ["scanQRCode"],
        });
      });
    }
  },
  methods: {
    ...mapMutations(["UPDATE_INDEXTYPE"]),
    open_business(stu_id) {
      window.location.href =
        "https://wx.zm-teach.com/index.php/web/Osoc/biz_stu?stu_id=" + stu_id;
    },
    open_bit_visible(item) {
      this.checked_role = item;
      this.bit_control_visible = true;
    },
    // 业务开通
    bit_open_business() {
      window.location.href =
        "https://sn.pajx.com.cn/yingxin_sn/member_pay.html?from=wx&stu_id=" +
        this.checked_role.stu_id +
        "&scl_id=" +
        this.checked_role.scl_id +
        "&openid=" +
        sessionStorage.openid;
    },
    // 修改
    bit_edit_business() {
      window.location.href =
        "https://sn.pajx.com.cn/yingxin_sn/add_or_edit.html?from=wx&type=edit&stu_id=" +
        this.checked_role.stu_id +
        "&scl_id=" +
        this.checked_role.scl_id +
        "&openid=" +
        sessionStorage.openid;
    },
    unbind() {
      window.location.href =
        "http://wx.zm-teach.com/index.php/web/unbind/index";
    },
    scan_code() {
      let self = this;
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr;
          var params = self.getQueryString(result);
          if (!params.hasOwnProperty("area")) {
            var query = "";
            for (var i in params) {
              query += i + "=" + params[i] + "&";
            }
            query = query.substr(0, query.length - 1);
            if (self.area === "ha") {
              window.location.href =
                "https://wx.zm-teach.com/index.php/web/Osoc/index?" + query;
            }
            if (self.area === "sn") {
              window.location.href =
                "https://sn.pajx.com.cn/yingxin_sn/add_or_edit.html?type=add&from=wx&openid=" +
                sessionStorage.openid +
                "%" +
                query;
            }
          } else {
            Tool.tip("暂不支持该二维码");
          }
        },
      });
    },
    getQueryString(url) {
      let strs = [];
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(url.indexOf("?") + 1, url.length);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    },
    handleJump(url) {
      window.location.href = url
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.my_main {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 2.2rem;
  overflow-y: auto;
  .menu_title {
    display: flex;
    align-items: center;
    padding: 0.7rem 0.55rem;
    .line {
      @include wh(0.2rem, 0.8rem);
      background: #3399ff;
      border-radius: 2px;
    }
    .title {
      font-size: 0.8rem;
      margin-left: 0.35rem;
    }
  }
  .menu_title_nofirst {
    justify-content: space-between;
    .menu_title_nofirst_left {
      display: flex;
      align-items: center;
    }
    .menu_title_nofirst_right {
      font-size: 0.7rem;
      color: #f98700;
    }
  }
  .role_list {
    padding: 0 0.55rem;
    .role_item {
      padding: 0.7rem;
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 7px;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
      position: relative;
      margin-bottom: 0.55rem;
      .left_photo {
        position: relative;
        .person_photo {
          @include wh(2.9rem, 2.9rem);
          border-radius: 50%;
        }
      }
      .checked_role {
        &::after {
          content: "当前选中";
          position: absolute;
          left: 0.15rem;
          bottom: 0;
          font-size: 0.6rem;
          padding: 0.1rem;
          background: #66c46d;
          border-radius: 1px;
          color: #fff;
        }
      }
      .des_wrapper {
        display: flex;
        flex-direction: column;
        margin-left: 0.45rem;
        .name {
          font-size: 0.7rem;
          line-height: 0.95rem;
          margin-bottom: 0.35rem;
        }
        .center_wrapper {
          font-size: 0.6rem;
          margin-bottom: 0.3rem;
          .item_wrapper {
            padding: 0.1rem 0.25rem;
            background: #f0f2f5;
            border-radius: 2px;
            color: #909399;
          }
        }
        .sch {
          font-size: 0.65rem;
          color: #999999;
        }
      }
      .bot_control {
        position: absolute;
        bottom: 0.5rem;
        right: 0.7rem;
        .control_wrapper {
          font-size: 0.65rem;
          color: #3399ff;
          padding: 0.25rem 0.35rem;
          border: 1px solid #3399ff;
          border-radius: 5px;
        }
        .bit_by_bit {
          @include wh(1.1rem, 1.1rem);
        }
      }
      .biz_open_flag {
        .item_flag {
          position: absolute;
          right: 0.7rem;
          top: 0.7rem;
          display: flex;
          align-items: center;
        }
        .flag_img {
          @include wh(0.65rem, 0.65rem);
          margin-right: 0.2rem;
        }
        .open {
          color: #66c46d;
        }
        .close {
          color: #999999;
        }
      }
    }
    .role_item_open {
      padding-bottom: 2.55rem;
    }
    .role_item_bit {
      padding-bottom: 2rem;
    }
  }
  .scan_wrapper {
    @include wh(100%, 6rem);
    padding: 0.6rem;
    background: #3399ff;
    .scan_main {
      position: relative;
      @include wh(100%, 100%);
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      .add_stu {
        @include wh(2.2rem, 2.2rem);
        position: absolute;
        top: 0.6rem;
        left: 50%;
        transform: translate(-50%, 0);
        // margin-left: -1.1rem;
      }
      .add_stu_text {
        position: absolute;
        top: 3.25rem;
        left: 50%;
        width: calc(100% - 1.2rem);
        text-align: center;
        font-size: 0.7rem;
        color: #fff;
        transform: translate(-50%, 0);
      }
    }
  }
  .bit_by_control {
    font-size: 0.7rem;
    text-align: center;
    background: #f5f7fa;
    .control_item {
      padding: 0.6rem 0;
      background: #fff;
      &:nth-child(2) {
        border-top: 1px solid #f0f2f5;
        margin-bottom: 0.45rem;
      }
    }
  }
  .switch {
    width: 100%;
    padding: 0.8rem 0.6rem 0;
    background: #3399ff;

    .switch-btn {
      width: 100%;
      height: 2.4rem;
      background: rgba(255,255,255,0.10);
      border: 0.05rem solid rgba(255,255,255,0.20);
      border-radius: 0.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 400;
      color: #ffffff;

      .switch-icon {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.3rem;
      }
    }
  }
}
</style>
