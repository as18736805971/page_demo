<template>
  <div v-if="crumbs_list.length !== 0" class="crumbs">
    <div class="crumbs-txt">
      <div>{{ page_home.menu_name }}</div>
      <div class="line-g">/</div>
    </div>
    <div v-for="(item, index) in crumbs_list" :key="index" class="crumbs-txt">
      <div :class="index === crumbs_list.length - 1 ? 'crumbs-ac' : ''">{{ item.menu_name }}</div>
      <div v-if="index !== crumbs_list.length - 1" class="line-g">/</div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Crumbs',
  computed: {
    ...mapGetters(['page_home', 'crumbs_list'])
  }
}
</script>

<style lang="scss" scoped>
.crumbs {
  width: 100%;
  height: 40px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--font-text3);
  .crumbs-txt {
    display: flex;
    align-items: center;
  }
  .line-g {
    margin: 0 8px;
  }
  .crumbs-ac {
    color: var(--font-text1);
  }
}
</style>
