<template>
  <section>
    <router-view :key="key" />
    <!--    <keep-alive>-->
    <!--      <router-view :key="key" />-->
    <!--    </keep-alive>-->
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
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
</style>
