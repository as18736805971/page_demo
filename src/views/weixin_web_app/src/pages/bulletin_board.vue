<template>
  <div>
    <stuFirstLevel @get_stu="get_stu"></stuFirstLevel>
    <section class="bulletin_board" v-if="board_list.length > 0">
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
          :class="{ lastchild: index === board_list.length - 1 }"
          v-for="(item, index) in board_list"
          :key="index"
        >
          <div class="title">{{ item.title }}</div>
          <div class="content">{{ item.content }}</div>
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
      <img src="../assets/no_data.png" alt class="img" />
      <div class="text">暂无内容</div>
    </section>
  </div>
</template>
<script>
import { httpFormPostMethod } from "@/common/HttpService";
import stuFirstLevel from "@/components/stuFirstLevel";
export default {
  name: "bulletin_board",
  components: { stuFirstLevel },
  data: function () {
    return {
      scl_id: "",
      board_list: [],
      page_num: 1,
      page_size: 10,
      allLoaded: false,
    };
  },
  mounted() {},
  methods: {
    get_stu(user) {
      this.scl_id = user.scl_id;
      this.board_list = [];
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
      httpFormPostMethod("web/bulletin/paginate", {
        scl_id: this.scl_id,
        page_num: this.page_num,
        page_size: this.page_size,
      }).then((res) => {
        if (res.data.list.length > 0) {
          res.data.list.forEach((opt) => {
            this.board_list.push(opt);
          });
          if (fun) {
            fun(res.data);
          }
        }
      });
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
  },
};
</script>
<style lang="scss" scoped>
@import "../styles/mixin";
.bulletin_board {
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
      font-weight: bold;
      line-height: 1rem;
    }
    .content {
      color: #999999;
      margin-top: 0.3rem;
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
