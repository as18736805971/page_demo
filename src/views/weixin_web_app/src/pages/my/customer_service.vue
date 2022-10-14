<template>
  <div class="customer_service">
    <div class="customer_top">
      <a class="top_item" href="tel:4001117111">
        <img src="../../assets/customer_tel.png" alt="" class="customer_img" />
        <span class="tel_text">客服电话</span>
        <span class="text">8:30-18:00</span>
      </a>
      <div class="top_item">
        <img src="../../assets/vx.png" alt="" class="customer_img" />
        <span class="tel_text">微信号</span>
        <span class="text">欢迎搜索关注留言</span>
      </div>
    </div>
    <div class="customer_bot">
      <div class="bot_item" @click="viewDetail(1)">
        <span>校视通视频无法观看？</span>
        <img src="../../assets/arrow_right.png" alt="" class="arrow_right" />
      </div>
      <div class="bot_item" @click="viewDetail(2)">
        <span>如果手机号绑定了多个孩子，该如何使用？</span>
        <img src="../../assets/arrow_right.png" alt="" class="arrow_right" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "customer_service",
  components: {},
  data: function () {
    return {};
  },
  mounted() {},
  methods: {
    viewDetail(id) {
      this.$router.push({
        path: "/question_details",
        query: {
          id: id
        }
      })
    }
  },
};
</script>
<style lang="scss" scoped>
@import "../../styles/mixin";
.customer_service {
  padding: 0.55rem;
  .customer_top {
    display: flex;
    .top_item {
      width: 50%;
      margin-right: 0.55rem;
      padding: 0.7rem 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #fff;
      border-radius: 7px;
      box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
      color: #333333;
      .customer_img {
        @include wh(3.25rem, 3.25rem);
        padding-bottom: 0.75rem;
      }
      .tel_text {
        font-size: 0.8rem;
        margin-bottom: 0.25rem;
      }
      .text {
        color: #999999;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  .customer_bot {
    background: #ffffff;
    border-radius: 7px;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.06);
    margin-top: .55rem;
    .bot_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 0.7rem;
      border-bottom: 1px solid #F0F2F5;
      .arrow_right {
        @include wh(1.1rem, 1.1rem);
      }
      &:last-of-type {
        border-bottom: none;
      }
    }
  }
}
</style>
