<template>
  <div class="question_details">
    <div v-if="id === '1'">
      <div class="title">校视通视频无法观看</div>
      <div class="content">
        <p>1、首先请联系客服，确认是否开通了校视通业务。</p>
        <p>
          2、硬件设施问题，如学校网络故障、学校断电等，请联系客服，我们将为您排查解决。
        </p>
        <p class="tip">
          注释：校视通业务有一定的体验期，体验期内可以使用该功能，体验期结束后需开通该业务方能继续使用。
        </p>
        <p class="tip">
          客服热线：
          <span class="tel">400-1117-111</span>
        </p>
      </div>
    </div>
    <div v-if="id === '2'">
      <div class="title">如果手机号绑定了多个孩子，该如何使用？</div>
      <div class="content">
        <p>请在"我"的界面中选择"我的孩子"，切换不同孩子。</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "question_details",
  components: {},
  data: function () {
    return {
      id: this.$route.query.id,
    };
  },
  mounted() {
    console.log(this.id);
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.question_details {
  padding: 0.55rem;
  position: absolute;
  top: 0;
  bottom: 0;
  background: #fff;
  .title {
    font-size: 0.9rem;
    text-align: center;
    color: #333333;
    line-height: 1.2rem;
    padding-bottom: 0.7rem;
  }
  .content {
    font-size: 0.7rem;
    color: #666666;
    line-height: 1.1rem;
    .tip {
      margin-top: 1rem;
      .tel {
        color: #3399ff;
      }
    }
  }
}
</style>
