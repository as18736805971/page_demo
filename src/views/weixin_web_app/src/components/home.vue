<template>
  <div class="index_home">
    <div class="index_swiper">
      <mt-swipe>
        <mt-swipe-item>
          <img src="../assets/banner_01.png" alt="" class="banner" />
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <div class="index_main">
      <div class="index_notice">
        <div class="notice_left">
          <img
            src="../assets/bulletin_board.png"
            alt=""
            class="bulletin_board"
          />
        </div>
        <span class="notice_text">
          <ul :class="{ notice_anim: animate == true }">
            <li
              v-for="(item, index) in notice_list"
              :key="index"
              class="text_li"
              @click="jump_menu('/bulletin_board')"
            >
              {{ item.content }}
            </li>
          </ul>
        </span>
        <img src="../assets/arrow_right.png" alt="" class="arrow_right" />
      </div>

      <div class="index_menu">
        <div class="index_menu_main">
          <div class="menu_title">
            <span class="title">平安家校</span>
          </div>
          <div class="menu_list">
            <div class="menu_item" @click="jump_menu('xskq')">
              <img src="../assets/menu_img/xskq.png" alt="" class="menu_img" />
              <span>学生考勤</span>
            </div>
            <div class="menu_item" @click="jump_menu('qqdh')">
              <img src="../assets/menu_img/qqdh.png" alt="" class="menu_img" />
              <span>亲情电话</span>
            </div>
            <div class="menu_item" @click="jump_menu('tzgg_list')">
              <img src="../assets/menu_img/tzgg.png" alt="" class="menu_img" />
              <span>通知公告</span>
            </div>
            <div class="menu_item" @click="jump_menu('sch_vision')">
              <img src="../assets/menu_img/xst.png" alt="" class="menu_img" />
              <span>校视通</span>
            </div>
            <div class="menu_item" @click="jump_menu('zy')">
              <img src="../assets/menu_img/zy.png" alt="" class="menu_img" />
              <span>作业</span>
            </div>
            <div class="menu_item" @click="jump_menu('xsqj')">
              <img src="../assets/menu_img/xsqj.png" alt="" class="menu_img" />
              <span>学生请假</span>
            </div>
            <div
              v-if="is_weixin"
              class="menu_item"
              @click="
                jump_out(
                  'https://wx.zm-teach.com/index.php/visitor/Login/getSessionKey'
                )
              "
            >
              <img src="../assets/menu_img/fkdj.png" alt="" class="menu_img" />
              <span>访客登记</span>
            </div>
            <div
              class="menu_item"
              v-if="is_weixin"
              @click="jump_out('http://app.pajx.com.cn/app_router/')"
            >
              <img
                src="../assets/menu_img/download_app.png"
                alt=""
                class="menu_img"
              />
              <span>APP下载</span>
            </div>
            <div
              v-if="area === 'ha' || area === 'sc'"
              class="menu_item"
              @click="jump_stu_card"
            >
              <img
                src="../assets/menu_img/stu_card.png"
                alt=""
                class="menu_img"
              />
              <span>智能学生卡</span>
            </div>
            <div v-if="area === 'sc'" class="menu_item" @click="jump_xqfx">
              <img src="../assets/menu_img/xqfx.png" alt="" class="menu_img" />
              <span>学情分析</span>
            </div>
          </div>
        </div>

        <div v-if="is_weixin && area !== 'sc'" class="index_menu_main">
          <div class="menu_title menu_title_nofirst">
            <span class="line"></span>
            <span class="title">云校付</span>
          </div>
          <div class="menu_list">
            <div
              class="menu_item"
              @click="
                jump_out('https://wx.zm-teach.com/index.php/card/Web/index')
              "
            >
              <img src="../assets/menu_img/fkcz.png" alt="" class="menu_img" />
              <span>饭卡充值</span>
            </div>
            <!-- <div
              class="menu_item"
              @click="
                jump_out('https://wx.zm-teach.com/index.php/card/Web/index')
              "
            >
              <img src="../assets/menu_img/dhcz.png" alt="" class="menu_img" />
              <span>电话充值</span>
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 客服二维码 -->
    <img class="customer-service" @click="bounced_show = true" src="../assets/service.png" />
    <div class="bounced" v-if="bounced_show">
      <div class="album-list">
        <div class="album">
          <div class="ellipse">
            <img class="ellipse-icon" src="../assets/ellipse.png">
            <div class="ellipse-txt">专属客服</div>
          </div>
          <div class="album-item">
            <img class="ewm-icon" src="../assets/parents_ewm.png">
            <div class="ewm-txt">长按识别二维码，关注专属客服</div>
          </div>
        </div>
      </div>
      <div class="del-item">
        <img class="close-icon" @click.stop="bounced_show = false" src="../assets/close1.png">
      </div>
    </div>
    <!-- 客服二维码 -->
  </div>
</template>
<script>
import { httpFormPostMethod } from "../common/HttpService";
import { mapMutations, mapGetters } from "vuex";
import {
  setToken,
  getToken,
  encrypt,
  decrypt,
  nowTime,
  getSign,
  encryption,
} from "@/common/auth";
export default {
  name: "home",
  data: function () {
    return {
      animate: false,
      notice_list: [],
      is_weixin: false,
      area: sessionStorage.area || this.$route.query.area,
      bounced_show: false, // 客服二维码
    };
  },
  computed: {
    ...mapGetters(["includePage"]),
  },
  created() {
    // 1.从地址栏获取token
    if (this.$route.query.token) {
      // 2.地址栏有token但sessionStorage里没有 token
      if (getToken() && this.$route.query.token) {
        // 3.从地址栏获取token和sessionStorage里的token不一致
        if (this.$route.query.token !== getToken()) {
          setToken(this.$route.query.token);
          sessionStorage.setItem("client_type", this.$route.query.client_type || 1); // 1家长端 2教师端
          sessionStorage.setItem("area", this.$route.query.area);
          sessionStorage.setItem("openid", this.$route.query.openid);
          this.init_fam();
        } else {
          // 4.地址栏和sessionStorage 都存在token
          try {
            this.get_roll(JSON.parse(decrypt(sessionStorage.getItem("roles"))));
          } catch (err) {
            this.init_fam()
            this.get_roll(JSON.parse(decrypt(sessionStorage.getItem("roles"))));
          }
        }
      } else {
        setToken(this.$route.query.token)
        sessionStorage.setItem("client_type", this.$route.query.client_type || 1); // 1家长端 2教师端
        sessionStorage.setItem("area", this.$route.query.area);
        sessionStorage.setItem("openid", this.$route.query.openid);
        this.init_fam();
      }
    } else {
      // 5.两个都没有时跳转链接获取token
      window.location.href = 'https://wx.zm-teach.com/index.php/web/app_login/new_enter'
    }

    // if (!getToken() && this.$route.query.token) {
    //   setToken(this.$route.query.token);
    //   sessionStorage.setItem("area", this.$route.query.area);
    //   sessionStorage.setItem("openid", this.$route.query.openid);
    //   this.init_fam();
    // } else {
    //   this.get_roll(JSON.parse(decrypt(sessionStorage.getItem("roles"))));
    // }

    const ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      this.is_weixin = true;
    } else {
      this.is_weixin = false;
    }
  },
  mounted() {
    this.UPDATE_INCLUDE_PAGE({
      pageName: "xsqj",
      sign: false,
    });
    this.UPDATE_INCLUDE_PAGE({
      pageName: "sch_vision",
      sign: false,
    });
    this.UPDATE_INCLUDE_PAGE({
      pageName: "xskq",
      sign: false,
    });
    this.UPDATE_INCLUDE_PAGE({
      pageName: "tzgg_list",
      sign: false,
    });
  },
  methods: {
    ...mapMutations(["UPDATE_INCLUDE_PAGE"]),
    // 菜单跳转
    jump_menu(path) {
      this.$router.push(path);
    },
    // 跳转外部链接
    jump_out(url) {
      window.location.href = url;
    },
    // 跳转智能学生卡
    jump_stu_card() {
      if (this.area === "ha") {
        window.location.href =
          "https://app.pajx.com.cn/app_api_v4/index.php/WebApi/Ecard/wxCardLogin?token=" +
          getToken() +
          "&app_id=" +
          "d430ced51790d858d6fcc30b89eea39d" +
          "&timestamp=" +
          nowTime() +
          "&sign=" +
          getSign({
            token: getToken(),
            app_id: "d430ced51790d858d6fcc30b89eea39d",
            timestamp: nowTime(),
          });
      } else {
        httpFormPostMethod("login/userInfo", {}).then((res) => {
          const encrypted_phone = encryption(
            res.data[0].user_phone,
            "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDO067zlSi9BjX0rS5Uh+efYdsjZHsMSiYsm4JDhLUuxFz4+9dRVNVYwSFddGf0MGYiMWeMr1ahzgbRULw7WiTAkd3YN09fSRGcXHnMuejKmN+Osg9nPo3r34ilJ8ndceUk77ImYHyduSeKFyhaq3JfxwyDJQAJQfb+bcO6ePIgowIDAQAB"
          );
          window.location.href =
            "http://app.pajx.com.cn/app_api_v4/index.php/kecard/index/appLoginSc?encypted=" +
            encodeURIComponent(encrypted_phone);
        });
      }
    },
    // 跳转学情分析
    jump_xqfx() {
      httpFormPostMethod("learning/situation/analysis/token", {
        client: "student",
      }).then((res) => {
        window.location.href = res.data;
      });
    },
    // 初始化家长信息
    init_fam() {
      httpFormPostMethod("web/fam/init", {}, false).then((res) => {
        this.get_stu_info();
      });
    },
    // 获取学生信息
    get_stu_info() {
      httpFormPostMethod("web/fam/stu/info", {}, false).then((res) => {
        sessionStorage.setItem("roles", encrypt(JSON.stringify(res.data)));
        this.get_roll(res.data);
      });
    },
    // 获取公告列表
    get_roll(user) {
      let scl_id = user.map((item) => {
        return item.scl_id;
      });
      httpFormPostMethod("web/bulletin/roll", {
        scl_id: Array.from(new Set(scl_id)).join(","),
      }).then((res) => {
        this.notice_list = res.data;
        if (this.notice_list.length > 1) {
          setInterval(this.scroll, 5000);
        }
      });
    },
    scroll() {
      this.animate = true; // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
      setTimeout(() => {
        //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
        this.notice_list.push(this.notice_list[0]); // 将数组的第一个元素添加到数组的
        this.notice_list.shift(); //删除数组的第一个元素
        this.animate = false; // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      }, 500);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../styles/mixin";
.notice_anim {
  transition: all 0.5s;
  margin-top: -1.1rem;
}
.index_home {
  position: absolute;
  top: 0;
  width: 100%;
  bottom: 2.2rem;
  overflow-y: auto;
  .index_swiper {
    @include wh(100%, 7.35rem);
    background: linear-gradient(180deg, #ffffff, rgba(255, 255, 255, 0));
    padding: 0.55rem;
    .banner {
      @include wh(100%, 100%);
    }
  }
  .index_main {
    padding: 0 0.6rem;
    .index_notice {
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
      display: flex;
      padding: 0.45rem 0;
      .notice_left {
        padding: 0 10px;
        position: relative;
        &::after {
          content: "";
          @include wh(0.05rem, 0.7rem);
          background: #e1e4eb;
          position: absolute;
          right: 0;
          top: 0.15rem;
        }
        .bulletin_board {
          position: relative;
          top: 0.1rem;
          @include wh(2.25rem, 0.7rem);
        }
      }
      .notice_text {
        font-size: 0.65rem;
        color: #2c2e33;
        padding-left: 0.7rem;
        width: calc(100% - 5.3rem);
        overflow: hidden;
        height: 1.1rem;
        line-height: 1.1rem;
        .text_li {
          @include omit();
        }
      }
      .arrow_right {
        position: relative;
        top: 0.05rem;
        @include wh(1.1rem, 1.1rem);
      }
    }
    .index_menu {
      .index_menu_main {
        background: #fff;
        margin-top: 0.6rem;
        border-radius: 8px;
        box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
      }
      .menu_title {
        display: flex;
        align-items: center;
        padding: 0.7rem 0.6rem;
        .title {
          font-size: 0.8rem;
          font-weight: bold;
        }
      }
      .menu_list {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        .menu_item {
          width: calc(25% - 0.42rem);
          margin-right: 0.55rem;
          margin-bottom: 1.2rem;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 0.7rem;
          &:nth-child(4n) {
            margin-right: 0;
          }
          .menu_img {
            margin: 0 0 0.7rem 0;
            @include wh(2.2rem, 2.2rem);
          }
        }
      }
    }
  }
}

.customer-service {
  position: fixed;
  right: 0.8rem;
  bottom: 3.25rem;
  width: 3.6rem;
  height: 3.6rem;
  z-index: 99;
}
.bounced {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  transition: .5s;
  z-index: 9999;

  .album-list {
    position: absolute;
    left: 50%;
    top: 4rem;
    transform: translate(-50%, 0%);
    width: 18.3rem;
    height: 16rem;
    padding: 0 1.2rem;

    .album {
      width: 100%;
      height: 16rem;
      background: #ffffff;
      border-radius: 0.5rem;
      overflow: hidden;

      .ellipse {
        position: relative;
        width: 100%;
        height: 3rem;

        .ellipse-icon {
          width: 100%;
          height: 3rem;
        }

        .ellipse-txt {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-size: 1rem;
          font-weight: 500;
          color: #ffffff;
        }
      }

      .album-item {
        width: 100%;
        height: 13rem;
        background: #ffffff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .ewm-icon {
          width: 8rem;
          height: 8rem;
        }

        .ewm-txt {
          margin-top: 1.2rem;
          font-size: 0.7rem;
          font-weight: 400;
          color: #5e6166;
        }
      }
    }
  }

  .del-item {
    position: absolute;
    left: 50%;
    top: 22rem;
    transform: translate(-50%, 0%);
    display: flex;
    align-items: center;
    justify-content: center;

    .close-icon {
      width: 2.4rem;
      height: 2.4rem;
    }
  }
}
</style>
