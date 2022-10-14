<template>
  <div>
    <stuFirstLevel @get_stu="get_stu"></stuFirstLevel>
    <section class="tzgg_list" ref="tzggRef" v-if="tzgg_list.length > 0">
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
          :class="{ lastchild: index === tzgg_list.length - 1 }"
          v-for="(item, index) in tzgg_list"
          :key="index"
          @click="viewDetail(item.notice_id)"
        >
          <div class="title">{{ item.notice_title }}</div>
          <div class="time">
            {{ item.create_time | fgTime }}
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
import stuFirstLevel from "../../components/stuFirstLevel";
import { mapMutations, mapGetters } from "vuex";
export default {
  name: "tzgg_list",
  components: { stuFirstLevel },
  data: function () {
    return {
      stu_id: "",
      tzgg_list: [],
      page_num: 1,
      page_size: 10,
      allLoaded: false,
    };
  },
  computed: {
    ...mapGetters(["includePage"]),
  },
  activated() {
    this.$refs.tzggRef.scrollTop = sessionStorage.scrollPosition;
  },
  mounted() {
    this.UPDATE_INCLUDE_PAGE({
      pageName: "tzgg_list",
    });
  },
  methods: {
    ...mapMutations(["UPDATE_INCLUDE_PAGE"]),
    get_stu(user) {
      this.stu_id = user.stu_id;
      this.tzgg_list = [];
      this.page_num = 1;
      this.allLoaded = false;
      this.getList((lt) => {
        if (lt.lastPage) {
          this.allLoaded = true;
        }
      });
    },
    // 获取通知公告列表
    getList(fun) {
      httpFormPostMethod("web/notice/my/receive", {
        stu_id: this.stu_id,
        page_num: this.page_num,
        page_size: this.page_size,
      }).then(
        (res) => {
          if (res.data.list) {
            res.data.list.forEach((opt) => {
              this.tzgg_list.push(opt);
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
        if (lt.lastPage) {
          this.allLoaded = true;
        }
      });
    },
    // 查看详情
    viewDetail(notice_id) {
      sessionStorage.scrollPosition = this.$refs.tzggRef.scrollTop;
      this.$router.push({
        path: "/tzgg_detail",
        query: { notice_id: notice_id },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.tzgg_list {
  padding: 0.55rem;
  position: absolute;
  top: 2.05rem;
  bottom: 0;
  width: 100%;
  overflow-y: auto;
  .item-wrapper {
    padding: 0.55rem 0.7rem;
    width: 100%;
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
    margin-bottom: 0.7rem;
    .title {
      line-height: 0.95rem;
    }
    .time {
      margin-top: 0.7rem;
      font-size: 0.6rem;
      color: #999999;
    }
  }
  .lastchild {
    margin-bottom: 0;
  }
}
</style>
