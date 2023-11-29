<template>
  <section>
    <crumbs />
    <section class="app-min-view">
      <keep-alive>
        <router-view :key="key" :include="cachedViews" />
      </keep-alive>
    </section>
  </section>
</template>

<script>
import Crumbs from '@/layout/components/crumbs.vue'
export default {
  name: 'AppMain',
  components: { Crumbs },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.no-menus {
  width: 100%;
}
.app-min-view {
  height: 100%;
  overflow: auto;
}
</style>
