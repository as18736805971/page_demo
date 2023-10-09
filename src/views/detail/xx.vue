<template>
  <div class="card_list">
    <div class="top_item"></div>
    <div class="card_item">
      <div class="card_line"></div>
      <div class="item_blo" v-for="(item, index) in 5" :key="index">
        <div class="blo_top">
          <div class="img"></div>
          <div class="img_name">
            <div class="tit_name">学业水平</div>
            <div class="tit_time">2022-07-01 11:02:00</div>
          </div>
        </div>
        <div class="blo_con">
          <template v-if="index === 1">
            <div class="blo_tit">农村社会实践</div>
            <div class="blo_desc">组织单位：某某某实验小学</div>
            <div class="blo_desc">级别单位：学校</div>
            <div class="blo_desc">级别单位：学校</div>
            <div class="blo_desc">级别单位：学校</div>
          </template>
          <template v-else-if="index === 4">
            <div class="blo_tit">农村社会实践</div>
            <div class="blo_desc">组织单位：某某某实验小学</div>
            <div class="blo_desc">级别单位：学校</div>
            <div class="blo_desc">级别单位：学校</div>
          </template>
          <template v-else>
            <div class="blo_tit">农村社会实践</div>
            <div class="blo_desc">组织单位：某某某实验小学</div>
            <div class="blo_desc">级别单位：学校</div>
          </template>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "xx",
  data() {
    return {
      list: []
    }
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.card_list {
  padding: 16px;
  background: #F5F7FA;
  .top_item {
    width: 100%;
    height: 96px;
    background-image: linear-gradient(135deg, #3694FF 0%, #3272FF 100%);
    box-shadow: 0 4px 10px 0 #3272ff2e;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  .card_item {
    width: 100%;
    position: relative;
    .card_line {
      position: absolute;
      left: 11.5px;
      height: 100%;
      border-left: 1px dashed #E1E2E6;
    }
    .item_blo {
      .blo_top {
        height: 26px;
        font-weight: 500;
        font-size: 18px;
        color: #2C2E33;
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        .img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #FF8D56;
          margin-right: 10px;
          z-index: 22;
        }
        .img_name {
          width: calc(100% - 34px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          .tit_time {
            font-weight: 400;
            font-size: 12px;
            color: #909399;
          }
        }
      }
      .blo_con {
        margin-left: 34px;
        padding: 16px;
        background: #FFFFFF;
        box-shadow: 0 6px 24px 0 #2224290a;
        border-radius: 8px;
        margin-bottom: 20px;
        .blo_tit {
          height: 22px;
          font-weight: 500;
          font-size: 16px;
          color: #2C2E33;
        }
        .blo_desc {
          height: 20px;
          font-weight: 400;
          font-size: 14px;
          color: #5E6166;
          margin-top: 16px;
        }
      }
    }
    .item_blo:last-child {
      position: relative;
      z-index: 22;
      background: #F5F7FA;
    }
  }
}
</style>
