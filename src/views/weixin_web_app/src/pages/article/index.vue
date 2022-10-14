<template>
  <div>
    <section class="article_tab" v-if="tab_list.length > 0">
      <span
        class="tab_item"
        v-for="(item, index) in tab_list"
        :key="index"
        :class="{ checkedtab: item.id === cid }"
        @click="choice_tab(item.id)"
        >{{ item.cname }}</span
      >
    </section>
    <section
      class="article_list"
      ref="articleRef"
      v-if="article_list.length > 0"
    >
      <mt-loadmore
        :auto-fill="false"
        bottomDropText="上拉加载"
        :bottom-method="loadBottom"
        :bottom-all-loaded="allLoaded"
        ref="loadmore"
        :bottomDistance="1"
      >
        <div
          class="item-wrapper"
          v-for="(item, index) in article_list"
          :key="index"
          @click="viewDetail(item.htmlpage)"
        >
          <div class="left_wrapper">
            <img :src="item.cover_img_url" alt="" class="img_wrapper" />
          </div>
          <div class="right_wrapper">
            <p class="title">
              {{ item.title }}
            </p>
            <p class="content">
              {{ item.abstract }}
            </p>
            <p class="bot_des">
              <span>{{ item.create_time | getLocalTime }}</span>
              <span>
                <span>{{ item.view_num }}阅读量</span>
                <span class="fabulous">{{ item.support_num }}赞</span>
              </span>
            </p>
          </div>
        </div>
      </mt-loadmore>
      <div v-if="allLoaded" class="nomore-data">
        <span class="text">我是有底线的</span>
      </div>
    </section>
    <section v-else class="main-no-data">
      <img src="../../assets/no_data.png" alt class="img" />
      <div class="text">暂无内容</div>
    </section>
  </div>
</template>
<script>
import { httpFormPostMethod } from "@/common/HttpService";
import { mapMutations, mapGetters } from "vuex";
export default {
  name: "wenzhang",
  components: {},
  data: function () {
    return {
      article_list: [],
      page_num: 1,
      page_size: 10,
      allLoaded: false,
      cid: -1,
      tab_list: [],
    };
  },
  computed: {
    ...mapGetters(["includePage"]),
  },
  mounted() {
    this.get_type();
    this.UPDATE_INCLUDE_PAGE({
      pageName: "index",
    });
  },
  activated() {
    this.$refs.articleRef.scrollTop = sessionStorage.scrollPosition;
  },
  methods: {
    ...mapMutations(["UPDATE_INCLUDE_PAGE"]),
    get_type() {
      httpFormPostMethod("app/paclass/type", {}).then((res) => {
        this.tab_list = res.data;
        this.cid = this.tab_list[0].id;
        this.getList((lt) => {
          if (lt.length < this.page_size) {
            this.allLoaded = true;
          }
        });
      });
    },
    // 选择tab栏
    choice_tab(id) {
      this.cid = id;
      this.article_list = [];
      this.page_num = 1;
      this.allLoaded = false;
      this.getList((lt) => {
        if (lt.length < this.page_size) {
          this.allLoaded = true;
        }
      });
    },
    // 获取文章列表
    getList(fun) {
      httpFormPostMethod("app/paclass/list", {
        cid: this.cid,
        page_num: this.page_num,
      }).then(
        (res) => {
          if (res.data.length) {
            res.data.forEach((opt) => {
              this.article_list.push(opt);
            });
            if (fun) {
              fun(res.data);
            }
          }
        },
        function () {}
      );
    },
    // 上拉加载
    loadBottom: function () {
      this.page_num++;
      this.getList((lt) => {
        this.$refs.loadmore.onBottomLoaded();
        if (lt.length < this.page_size) {
          this.allLoaded = true;
        }
      });
    },
    // 查看详情
    viewDetail(htmlpage) {
      sessionStorage.scrollPosition = this.$refs.articleRef.scrollTop;
      this.$router.push({
        path: "/article_detail",
        query: { src: htmlpage },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.article_tab {
  overflow-x: auto;
  display: flex;
  color: #999999;
  flex-wrap: nowrap;
  overflow-x: auto;
  white-space: nowrap;
  padding: 0.55rem 0.7rem;
  background: #fff;
  .tab_item {
    margin-right: 1.45rem;
    &:last-of-type {
      padding-right: 0.7rem;
    }
  }
  .checkedtab {
    color: #3399ff;
    font-weight: bold;
  }
}
.article_list {
  position: absolute;
  top: 2.05rem;
  bottom: 2.2rem;
  width: 100%;
  overflow-y: auto;
  .item-wrapper {
    width: 100%;
    background: #ffffff;
    padding: 0.7rem;
    border-top: 1px solid #f5f5f5;
    display: flex;
    .left_wrapper {
      .img_wrapper {
        @include wh(5.45rem, 5.45rem);
        border-radius: 4px;
      }
    }
    .right_wrapper {
      margin-left: 0.7rem;
      .title {
        line-height: 1rem;
        @include omit(2);
      }
      .content {
        line-height: 0.9rem;
        color: #999999;
        margin-top: 0.2rem;
        @include omit(2);
      }
      .bot_des {
        margin-top: 0.6rem;
        display: flex;
        justify-content: space-between;
        color: #cccccc;
        font-size: 0.6rem;
        .fabulous {
          margin-left: 0.45rem;
        }
      }
    }
  }
}
</style>
