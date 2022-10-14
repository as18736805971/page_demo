<template>
  <div class="results_index">
    <div class="results_item" v-for="(item, index) in 10" :key="index">
      <div class="left-item">
        <img class="icon" :src="require('@/assets/results.png')">
        会考
      </div>
      <div class="right-item">2022-01-21</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "results_index",
  data() {
    return {}
  },
  mounted() {
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.results_index {
  width: 100%;
  /*height: 100vh;*/
  /*overflow-y: auto;*/

  .results_item {
    padding: 0 0.6rem;
    background: #ffffff;
    border-bottom: 0.05rem solid #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 3rem;

    .left-item {
      display: flex;
      align-items: center;

      .icon {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.3rem;
      }

      .txt {
        font-size: 0.7rem;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .right-item {
      width: 4rem;
      margin-left: 0.3rem;
      font-size: 0.6rem;
      color: #333333;
      text-align: right;
    }
  }

  .results_item:last-child {
    border-bottom: none;
  }
}
</style>
