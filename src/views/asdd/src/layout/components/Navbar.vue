<template>
  <div class="nav-header">
    <div class="nav-logo">
      <img src="@/assets/images/logo.png">智慧校园云平台
    </div>
    <div class="nav-info">
      <div class="nav-icon">
        <img src="@/assets/images/set_icon.png">
      </div>
      <div class="nav-user">
        <img class="portrait" src="@/assets/images/portrait.png">
        <div class="user-name">刘小花</div>
        <img class="down_arrow" src="@/assets/images/arrow_down.png">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      info: {}
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
@import "src/style/comm/mixins";
.nav-header {
  height: 56px;
  padding: 0 16px 0 20px;
  @include flex-between();
  .nav-logo {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: Bold;
    text-align: left;
    color: var(--font-text1);
    line-height: 30px;
    letter-spacing: 0.02px;
    img {
      width: 36px;
      height: 36px;
      margin-right: 10px;
    }
  }
  .nav-info {
    display: flex;
    align-items: center;
    .nav-icon {
      width: 32px;
      height: 32px;
      cursor: pointer;
      margin-left: 16px;
      @include flex-center();
      img {
        width: 20px;
        height: 20px;
      }
    }
    .nav-icon:hover {
      background: #f5f6fa;
      border-radius: 6px;
    }
    .nav-user {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 8px;
      cursor: pointer;
      margin-left: 8px;
      .portrait {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        margin-right: 8px;
      }
      .user-name {
        width: 55px;
        font-size: 14px;
        text-align: left;
        @include ellipsis();
        color: var(--font-text2);
      }
      .down_arrow {
        width: 12px;
        height: 12px;
        margin-left: 4px;
      }
    }
    .nav-user:hover {
      background: #f5f6fa;
      border-radius: 6px;
    }
  }
}
</style>
