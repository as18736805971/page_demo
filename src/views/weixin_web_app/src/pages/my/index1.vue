<template>
  <div class="my_main">
    <div class="top_wrapper">
      <img
        :src="role_obj.avatar"
        :onerror="errorImg"
        class="person_photo"
        alt=""
      />
      <div class="right">
        <span class="name"
          >{{ role_obj.user_name }}{{ role_obj.fam_name }}</span
        >
        <span class="name_type">家长</span>
      </div>
    </div>
    <div class="center_wrapper">
      <div class="main_func">
        <div class="func_item" @click="jump_page('/role')">
          <div class="left">
            <img src="../../assets/my_child.png" alt="" class="icon" />
            <span>我的孩子</span>
          </div>
          <div class="right">
            <span>{{ role_obj.user_name }}</span>
            <img
              src="../../assets/arrow_right.png"
              alt=""
              class="arrow_right"
            />
          </div>
        </div>
        <div class="func_item" @click="jump_page('/customer_service')">
          <div class="left">
            <img src="../../assets/service_center.png" alt="" class="icon" />
            <span>客服中心</span>
          </div>
          <div class="right">
            <img
              src="../../assets/arrow_right.png"
              alt=""
              class="arrow_right"
            />
          </div>
        </div>
        <div class="func_item" @click="jump_page('/system_setting')">
          <div class="left">
            <img src="../../assets/my_child.png" alt="" class="icon" />
            <span>系统设置</span>
          </div>
          <div class="right">
            <img
              src="../../assets/arrow_right.png"
              alt=""
              class="arrow_right"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { decrypt, getToken } from "@/common/auth";
export default {
  name: "my",
  components: {},
  data: function () {
    return {
      role_obj: JSON.parse(decrypt(getToken())),
      errorImg: 'this.src="' + require("../../assets/person_photo.png") + '"',
    };
  },
  mounted() {},
  methods: {
    jump_page(path) {
      this.$router.push(path);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.my_main {
  .top_wrapper {
    padding: 1.45rem 0.7rem;
    background: #3399ff;
    display: flex;
    align-items: center;
    .person_photo {
      @include wh(2.9rem, 2.9rem);
      margin-right: 0.45rem;
    }
    .right {
      display: flex;
      flex-direction: column;
      color: #fff;
      .name {
        font-size: 0.8rem;
      }
      .name_type {
        margin-top: 0.45rem;
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
  .center_wrapper {
    padding: 0.55rem;
    .main_func {
      background: #fff;
      border-radius: 7px;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
      .func_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.7rem;
        border-bottom: 1px solid #f0f2f5;
        &:last-of-type {
          border-bottom: none;
        }
        .left {
          display: flex;
          align-items: center;
          .icon {
            @include wh(1.1rem, 1.1rem);
            margin-right: 0.45rem;
          }
        }
        .right {
          color: #999999;
          display: flex;
          align-items: center;
          .arrow_right {
            @include wh(1.1rem, 1.1rem);
          }
        }
      }
    }
  }
}
</style>
