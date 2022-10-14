<template>
  <div class="index_home">
    <div class="index_swiper">
      <mt-swipe>
        <mt-swipe-item>
          <img src="../../assets/banner_01.png" alt="" class="banner" />
        </mt-swipe-item>
      </mt-swipe>
    </div>
    <div class="index_main">
      <div class="index_menu">
        <div class="index_menu_main">
          <div class="menu_title">
            <span class="title">平安家校</span>
          </div>
          <div class="menu_list">
            <template v-if="area === 'ha'">
              <div class="menu_item" @click="jump_menu('school_letter')">
                <img src="../../assets/menu_img/xx.png" alt="" class="menu_img" />
                <span>校信</span>
              </div>
              <div class="menu_item" @click="manager_flag == 0 ? jump_menu1() : jump_menu('my_class')">
                <img src="../../assets/menu_img/bj.png" alt="" class="menu_img" />
                <span>我的班级</span>
              </div>
              <div class="menu_item" @click="manager_flag == 0 ? jump_menu2() : jump_menu('attendance')">
                <img src="../../assets/menu_img/attendance.png" alt="" class="menu_img" />
                <span>考勤</span>
              </div>
              <div class="menu_item" @click="jump_menu('ask_leave')">
                <img src="../../assets/menu_img/xsqj.png" alt="" class="menu_img" />
                <span>学生请假</span>
              </div>
              <div class="menu_item" @click="jump_menu('teacher_vision')">
                <img src="../../assets/menu_img/xst.png" alt="" class="menu_img" />
                <span>校视通</span>
              </div>
              <template v-if="show_credit">
                <div class="menu_item" @click="jump_out(integral_url)">
                  <img src="../../assets/menu_img/integral.png" alt="" class="menu_img" />
                  <span>积分商城</span>
                </div>
                <div class="menu_item" @click="jump_menu('integral')">
                  <img src="../../assets/menu_img/my_integral.png" alt="" class="menu_img" />
                  <span>我的积分</span>
                </div>
              </template>
            </template>
            <template v-else-if="area === 'sn'">
              <div class="menu_item" @click="jump_menu('school_letter')">
                <img src="../../assets/menu_img/xx.png" alt="" class="menu_img" />
                <span>校信</span>
              </div>
              <div class="menu_item" @click="manager_flag > 3 ? jump_menu1() : jump_menu('my_class')">
                <img src="../../assets/menu_img/bj.png" alt="" class="menu_img" />
                <span>我的班级</span>
              </div>
              <div class="menu_item" @click="manager_flag > 3 ? jump_menu2() : jump_menu('attendance')">
                <img src="../../assets/menu_img/attendance.png" alt="" class="menu_img" />
                <span>学生考勤</span>
              </div>
              <div class="menu_item" @click="jump_menu('ask_leave')">
                <img src="../../assets/menu_img/xsqj.png" alt="" class="menu_img" />
                <span>学生请假</span>
              </div>
              <div class="menu_item" @click="manager_flag > 3 ? handleJump('/homework') : handleJumpClass('select_class', 2)">
                <img src="../../assets/menu_img/zy.png" alt="" class="menu_img" />
                <span>作业</span>
              </div>
              <div class="menu_item" @click="manager_flag > 3 ? handleJump('/affection') : handleJumpClass('select_class', 1)">
                <img src="../../assets/menu_img/qqdh.png" alt="" class="menu_img" />
                <span>亲情电话</span>
              </div>
              <div class="menu_item" @click="jump_menu('teacher_attendance')">
                <img src="../../assets/menu_img/jskq.png" alt="" class="menu_img" />
                <span>教师考勤</span>
              </div>
              <div class="menu_item" @click="manager_flag > 3 ? handleJump('/scl_collect') : jump_menu('image_index')">
                <img src="../../assets/menu_img/tpcj.png" alt="" class="menu_img" />
                <span>照片采集</span>
              </div>
              <!--<div class="menu_item" @click="jump_out('ask_leave')">
                <img src="../../assets/menu_img/dcwj.png" alt="" class="menu_img" />
                <span>调查问卷</span>
              </div>-->
            </template>
            <template v-else>
              <div class="menu_item" @click="jump_menu('school_letter')">
                <img src="../../assets/menu_img/xx.png" alt="" class="menu_img" />
                <span>校信</span>
              </div>
              <div class="menu_item" @click="manager_flag > 3 ? jump_menu1() : jump_menu('my_class')">
                <img src="../../assets/menu_img/bj.png" alt="" class="menu_img" />
                <span>我的班级</span>
              </div>
              <div class="menu_item" @click="manager_flag > 3 ? jump_menu2() : jump_menu('attendance')">
                <img src="../../assets/menu_img/attendance.png" alt="" class="menu_img" />
                <span>学生考勤</span>
              </div>
              <div class="menu_item" @click="jump_menu('ask_leave')">
                <img src="../../assets/menu_img/xsqj.png" alt="" class="menu_img" />
                <span>学生请假</span>
              </div>
            </template>
            <div
                v-if="is_weixin"
                class="menu_item"
                @click="
                jump_out(
                  'https://wx.zm-teach.com/index.php/visitor/Login/getSessionKey'
                )
              "
            >
              <img src="../../assets/menu_img/fkdj.png" alt="" class="menu_img" />
              <span>访客登记</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 客服二维码 -->
    <img class="customer-service" @click="bounced_show = true" src="../../assets/service.png" />
    <div class="bounced" v-if="bounced_show">
      <div class="album-list">
        <div class="album">
          <div class="ellipse">
            <img class="ellipse-icon" src="../../assets/ellipse.png">
            <div class="ellipse-txt">专属客服</div>
          </div>
          <div class="album-item">
            <img class="ewm-icon" src="../../assets/teacher_ewm.png">
            <div class="ewm-txt">长按识别二维码，关注专属客服</div>
          </div>
        </div>
      </div>
      <div class="del-item">
        <img class="close-icon" @click.stop="bounced_show = false" src="../../assets/close1.png">
      </div>
    </div>
    <!-- 客服二维码 -->
  </div>
</template>

<script>
  import { mapMutations, mapGetters } from "vuex";
  import {
    setToken,
    getToken,
  } from "@/common/auth";
  import {httpFormPostMethod} from "@/common/HttpService";
  export default {
    name: "page_home",
    data: function () {
      return {
        manager_flag: 0,
        is_weixin: false,
        show_credit: false, // 积分商城显示
        bounced_show: false, // 客服二维码
        integral_url: '',
        area: this.$route.query.area || sessionStorage.getItem('area'), // 地区标识 ha 河南 sc四川 sn陕西
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
          }
        } else {
          setToken(this.$route.query.token);
          sessionStorage.setItem("client_type", this.$route.query.client_type || 1); // 1家长端 2教师端
          sessionStorage.setItem("area", this.$route.query.area);
          sessionStorage.setItem("openid", this.$route.query.openid);
        }
      } else {
        // 5.两个都没有时跳转链接获取token
        window.location.href = 'https://wx.zm-teach.com/index.php/web/app_login/new_enter'
      }
      const ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        this.is_weixin = true;
      } else {
        this.is_weixin = false;
      }
      this.handleGetUserType()
      if (this.area === 'ha') {
        this.handleDetection()
      }
    },
    mounted() {
      this.UPDATE_INCLUDE_PAGE({
        pageName: 'school_letter_add',
        sign: false,
      });
      this.UPDATE_INCLUDE_PAGE({
        pageName: 'ask_leave',
        sign: false,
      });
      this.UPDATE_INCLUDE_PAGE({
        pageName: 'select_student',
        sign: false,
      });
      this.UPDATE_INCLUDE_PAGE({
        pageName: 'select_teacher',
        sign: false,
      });
      this.UPDATE_INCLUDE_PAGE({
        pageName: 'teacher_vision',
        sign: false,
      });
      this.UPDATE_INCLUDE_PAGE({
        pageName: 'select_class',
        sign: false,
      });
    },
    methods: {
      ...mapMutations(["UPDATE_INCLUDE_PAGE"]),
      // 菜单跳转
      jump_menu(path) {
        this.$router.push(path);
      },
      // 直接跳转至班级
      jump_menu1() {
        let info = JSON.parse(sessionStorage.getItem('teacherUser'))
        this.$router.push({
          path: 'class_details',
          query: {
            gra_id: info.gra_id,
            cls_id: info.cls_id,
            gra_name: info.gra_name,
            cls_name: info.cls_name,
          }
        });
      },
      // 直接跳转至考勤班级
      jump_menu2() {
        let info = JSON.parse(sessionStorage.getItem('teacherUser'))
        this.$router.push({
          path: 'attendance',
          query: {
            gra_id: info.gra_id || '',
            cls_id: info.cls_id || '',
          }
        });
      },
      // 携带年级/班级跳转
      handleJump(path) {
        let info = JSON.parse(sessionStorage.getItem('teacherUser'))
        this.$router.push({
          path: path,
          query: {
            gra_id: info.gra_id,
            cls_id: info.cls_id,
            gra_name: info.gra_name,
            cls_name: info.cls_name,
          }
        });
      },
      // 跳转班级 携带类型 1亲情电话 2作业
      handleJumpClass(path, type) {
        this.$router.push({
          path: path,
          query: {
            type: type,
          }
        });
      },
      // 跳转外部链接z
      jump_out(url) {
        window.location.href = url;
      },
      // 请求用户类型
      handleGetUserType() {
        httpFormPostMethod('web/tea/login/token', {}).then((res) => {
          if (this.area === 'ha') {
            // 河南 用户登陆类型 0-普通教职工(直接班级)，1-积分管理员，2-普通管理员(年级/班级)，3-宿舍管理员(没班级)
            sessionStorage.setItem('manager_flag', res.data.manager_flag || '')
            this.manager_flag = res.data.manager_flag
            this.show_credit = res.data.show_credit || false
            if (res.data.manager_flag == 0) {
              let info = {
                gra_id: res.data.gra_id || '',
                cls_id: res.data.cls_id || '',
                gra_name: res.data.gra_name || '',
                cls_name: res.data.cls_name || '',
              }
              sessionStorage.setItem('teacherUser', JSON.stringify(info))
            }
          } else {
            // 四川 用户登陆类型 1.系统管理员2.积分管理员3.普通管理员4.班主任5.任课教师6.司机8.宿舍管理员9.楼栋管理员
            // 陕西 用户登陆类型 1.系统管理员2.积分管理员3.普通管理员4.班主任5.任课教师6.司机8.宿舍管理员9.楼栋管理员
            sessionStorage.setItem('manager_flag', res.data.role_flag || '')
            this.manager_flag = res.data.role_flag
            if (res.data.role_flag > 3) {
              let info = {
                gra_id: res.data.gra_id || '',
                cls_id: res.data.cls_id || '',
                gra_name: res.data.gra_name || '',
                cls_name: res.data.cls_name || '',
                scl_id: res.data.scl_id,
              }
              sessionStorage.setItem('teacherUser', JSON.stringify(info))
            }
            if (this.area === 'sn') {
              sessionStorage.setItem('scl_id', res.data.scl_id)
            }
          }
        })
      },
      // 获取积分商城链接
      handleGetLink() {
        httpFormPostMethod('web/tea/creditmall',{}, false, null, true).then((res) => {
          if (res.status == 200) {
            this.integral_url = res.data.url || ''
          } else {
            this.handleDetection()
          }
        })
      },
      handleDetection() {
        httpFormPostMethod('web/tea/user/reg', {
          openid: sessionStorage.getItem('openid')
        }).then(() => {
          this.handleGetLink()
        })
      }
    },
  };
</script>

<style lang="scss" scoped>
  @import "../../styles/mixin";
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
