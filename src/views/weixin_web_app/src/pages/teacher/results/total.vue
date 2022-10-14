<template>
  <div class="total_index">
    <div class="top_title" @click="show_select = !show_select">
      {{ select_name ? select_name : '科目' }}
      <img class="bot" src="../../../assets/bot.png">
    </div>
    <div class="float" v-if="show_select">
      <div class="float-mask" @click="show_select = false"></div>
      <div class="block_list">
        <div class="block_item" v-for="(item, key, index) in tab_list" :key="index" @click.stop="handleTab(item, key)">{{ item }}</div>
      </div>
    </div>

    <div class="list_content">
      <div class="list-item" v-for="(item, index) in 10" :key="index">
        <div class="left-item">
          李伟
        </div>
        <div class="right-item">
          205.2
          <img class="icon" :src="require('@/assets/arrow_right.png')">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "total_index",
  data() {
    return {
      show_select: false,
      select_name: '',
      tab_list: ['总分', '语文', '数学']
    }
  },
  mounted() {
  },
  methods: {
    handleTab(item, key) {}
  }
}
</script>

<style lang="scss" scoped>
.total_index {
  width: 100%;

  .top_title {
    position: relative;
    height: 2.5rem;
    color: #219bff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    background: #ffffff;

    .bot {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 1rem;
      height: 1rem;
    }
  }

  .float {
    position: fixed;
    top: 2.5rem;
    left: 0;
    width: 100%;
    height: calc(100vh - 2.5rem);
    z-index: 9999;

    .float-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgb(0,0,0, 0.3);
    }

    .block_list {
      position: absolute;
      top: 0;
      width: 100%;
      padding: 0.6rem;
      display: flex;
      align-items: flex-start;
      flex-wrap: wrap;
      background: #FAFAFA;

      .block_item {
        height: 1.5rem;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        border: 0.05rem solid #0089ff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
      }
    }
  }

  .list_content {
    background: #ffffff;

    .list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 2.4rem;
      padding: 0 0.6rem;
      border-bottom: 0.05rem solid #f5f5f5;

      .left-item {
        font-size: 0.8rem;
        color: #333333;
      }

      .right-item {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 0.7rem;
        color: #333333;

        .icon {
          width: 1.2rem;
          height: 1.2rem;
        }
      }
    }
    .list-item:last-child {
      border-bottom: none;
    }
  }
}
</style>
