<template>
  <div class="pajx_index">
    <home v-if="indextype === 1"></home>
    <wenzhang v-if="indextype === 2"></wenzhang>
    <my v-if="indextype === 3"></my>
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
      <div class="foot_item" @click="check_type(2)">
        <img
          src="../assets/article_checked.png"
          alt=""
          v-if="indextype === 2"
          class="icon_img"
        />
        <img
          src="../assets/article.png"
          alt=""
          v-if="indextype !== 2"
          class="icon_img"
        />
        <span :class="{ checkd: indextype === 2 }">文章</span>
      </div>
      <div class="foot_item" @click="check_type(3)">
        <img
          src="../assets/my_checked.png"
          alt=""
          v-if="indextype === 3"
          class="icon_img"
        />
        <img
          src="../assets/my.png"
          alt=""
          v-if="indextype !== 3"
          class="icon_img"
        />
        <span :class="{ checkd: indextype === 3 }">我的</span>
      </div>
    </div>
  </div>
</template>
<script>
import home from "../components/home";
import wenzhang from "./article/index";
import my from "./my/index";
import { mapMutations, mapGetters } from "vuex";
export default {
  name: "index",
  components: { home, wenzhang, my },
  data: function () {
    return {};
  },
  computed: {
    ...mapGetters(["indextype", "includePage"]),
  },
  created() {},
  methods: {
    ...mapMutations(["UPDATE_INDEXTYPE", "UPDATE_INCLUDE_PAGE"]),
    check_type(type) {
      if (type === 2) {
        this.UPDATE_INCLUDE_PAGE({
          pageName: "index",
          sign: false,
        });
      }
      this.UPDATE_INDEXTYPE(type);
    }
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
