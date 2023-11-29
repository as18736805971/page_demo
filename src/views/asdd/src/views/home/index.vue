<template>
  <div class="home_index">
    <div>
      <div class="h1_tit"><div class="h1_line" />智慧教务</div>
      <div class="h2_tit">基础教务</div>
      <div class="menu_list">
        <div v-for="(item, index) in 10" :key="index" class="menu_item">
          <div class="item_block" />
          <div class="item_title">
            <div class="item_name">学校管理</div>
            <div class="item_desc">学校信息添加修改</div>
          </div>
        </div>
      </div>
      <div class="h2_tit">迎新管理</div>
      <div class="menu_list">
        <div v-for="(item, index) in 10" :key="index" class="menu_item">
          <div class="item_block" />
          <div class="item_title">
            <div class="item_name">学校管理</div>
            <div class="item_desc">学校信息添加修改</div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="h1_tit"><div class="h1_line" />智慧教务</div>
      <div class="h2_tit">基础教务</div>
      <div class="menu_list">
        <div v-for="(item, index) in 10" :key="index" class="menu_item">
          <div class="item_block" />
          <div class="item_title">
            <div class="item_name">学校管理</div>
            <div class="item_desc">学校信息添加修改</div>
          </div>
        </div>
      </div>
      <div class="h2_tit">迎新管理</div>
      <div class="menu_list">
        <div v-for="(item, index) in 10" :key="index" class="menu_item">
          <div class="item_block" />
          <div class="item_title">
            <div class="item_name">学校管理</div>
            <div class="item_desc">学校信息添加修改</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'HomeIndex',
  data() {
    return {
      menus: {}
    }
  },
  computed: {
    ...mapGetters(['model'])
  },
  mounted() {
    const menus = JSON.parse(JSON.stringify(this.model))
    this.menus = menus.length !== 0 ? menus.splice(1) : menus
    console.log(this.menus, '3333')
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
@import "src/style/comm/mixins";
.home_index {
  padding: 32px 48px;
  .h1_tit {
    height: 28px;
    font-size: 20px;
    text-align: left;
    color: var(--font-text1);
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    .h1_line {
      width: 3px;
      height: 20px;
      margin-right: 8px;
      background: var(--theme-color);
    }
  }
  .h2_tit {
    height: 22px;
    font-size: 16px;
    color: var(--font-text1);
    line-height: 22px;
    margin-bottom: 10px;
    margin-top: 12px;
  }
  .menu_list {
    display: flex;
    flex-wrap: wrap;
    .menu_item {
      width: 212px;
      height: 82px;
      background: var(--theme-bg);
      border-radius: 8px;
      margin-right: 12px;
      margin-bottom: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .item_block {
        width: 50px;
        height: 50px;
        background: #45dd6f;
        border-radius: 8px;
        margin-right: 10px;
      }
      .item_title {
        width: calc(212px - 92px);
        height: 100%;
        .item_name {
          height: 20px;
          font-size: 16px;
          text-align: left;
          color: var(--font-text1);
          line-height: 20px;
          @include ellipsis();
          margin-bottom: 8px;
        }
        .item_desc {
          height: 18px;
          font-size: 12px;
          text-align: left;
          color: var(--font-text3);
          line-height: 18px;
          @include ellipsis();
        }
      }
    }
  }
}
</style>
