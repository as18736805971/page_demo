<template>
  <div class="tzgg_detail">
    <p class="title">{{ notice_detail.notice_title }}</p>
    <p class="time">
      {{ notice_detail.create_time | fgTime }}
    </p>
    <p class="content" v-html="setHtml()"></p>
  </div>
</template>
<script>
import { httpFormPostMethod } from "@/common/HttpService";
export default {
  name: "tzgg_detail",
  components: {},
  data: function () {
    return {
      notice_detail: {},
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    // 获取通知公告详情
    getDetail() {
      httpFormPostMethod("web/notice/detail", {
        notice_id: this.$route.query.notice_id,
      }).then((res) => {
        this.notice_detail = res.data;
      });
    },
    // html处理
    setHtml: function () {
      if (this.notice_detail.notice_content) {
        return this.notice_detail.notice_content
          .replace(this.html ? /&(?!#?\w+;)/g : /&/g, "&amp;")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;nbsp;/g, " ")
          .replace(/&nbsp;/g, " ");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.tzgg_detail {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  padding: 0.9rem;
  background: #fff;
  overflow-y: auto;
  .title {
    text-align: center;
    font-size: 0.9rem;
  }
  .time {
    text-align: center;
    font-size: 0.6rem;
    color: #999999;
    margin-top: 0.55rem;
  }
  .content {
    margin-top: 0.9rem;
  }
}
</style>
