<template>
  <div class="article_detail">
    <iframe frameborder="0" scrolling="auto" :src="page_src"></iframe>
  </div>
</template>
<script>
export default {
  name: "article_detail",
  components: {},
  data: function () {
    return {
      page_src: this.$route.query.src,
    };
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.article_detail {
  iframe {
    position: absolute;
    top: 0;
    bottom: 0;
    @include wh(100%, 100%);
    overflow-y: auto;
  }
}
</style>
