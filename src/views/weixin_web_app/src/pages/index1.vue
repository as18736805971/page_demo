<template>
  <div class="pajx_index">
    <page-home v-if="indextype === 1"></page-home>
    <page-my v-if="indextype === 2"></page-my>

    <!-- 底部导航 -->
    <div class="index_foot">
      <div class="foot_item" @click="check_type(1)">
        <img
            src="../assets/home_checked.png"
            alt=""
            v-if="indextype === 1"
            class="icon_img"
        />
        <img
            src="../assets/home.png"
            alt=""
            v-if="indextype !== 1"
            class="icon_img"
        />
        <span :class="{ checkd: indextype === 1 }">首页</span>
      </div>
      <div class="foot_item" @click="jump_out('https://wx.zm-teach.com/index.php/web/app_login/new_enter')">
        <img
            src="../assets/my_checked.png"
            alt=""
            v-if="indextype === 2"
            class="icon_img"
        />
        <img
            src="../assets/my.png"
            alt=""
            v-if="indextype !== 2"
            class="icon_img"
        />
        <span :class="{ checkd: indextype === 2 }">我的</span>
      </div>
    </div>
    <!-- 底部导航 -->
  </div>
</template>

<script>
  import PageHome from './teacher/page_home'
  import PageMy from './teacher/page_my'
  import { httpFormPostMethod } from '@/common/HttpService'
  import { mapMutations, mapGetters } from "vuex"

  export default {
    name: 'page_index',
    components: { PageHome, PageMy },
    data () {
      return {}
    },
    computed: {
      ...mapGetters(['indextype']),
    },
    methods: {
      ...mapMutations(['UPDATE_INDEXTYPE', 'UPDATE_INCLUDE_PAGE']),
      // 切换底部导航
      check_type(type) {
        this.UPDATE_INDEXTYPE(type);
      },
      // 跳转外部链接
      jump_out(url) {
        window.location.href = url
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import "../styles/mixin";
  .pajx_index {
    .index_foot {
      position: fixed;
      bottom: 0;
      @include wh(100%, 2.2rem);
      background: #fff;
      display: flex;
      .foot_item {
        flex: 1;
        align-items: center;
        display: flex;
        flex-direction: column;
        font-size: 0.6rem;
        color: #666666;
        align-items: center;
        justify-content: center;
        .checkd {
          color: #3399ff;
        }
        .icon_img {
          @include wh(0.9rem, 1rem);
        }
      }
    }
  }
</style>
