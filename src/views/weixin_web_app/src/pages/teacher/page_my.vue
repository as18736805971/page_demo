<template>
  <div class="my_main">
    <div class="switch">
      <div class="switch-btn" @click="handleJump()">
        <img class="switch-icon" src="../../assets/switch.png">切换角色
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "page_my",
    components: {},
    data() {
      return {
      }
    },
    mounted() {
    },
    methods: {
      handleJump() {
        this.$router.push({
          path: 'switch_roles'
        })
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
      border: 1px dashed rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      .add_stu {
        @include wh(2.2rem, 2.2rem);
        position: absolute;
        top: 0.6rem;
        left: 50%;
        transform: translate(-50%, 0);
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
