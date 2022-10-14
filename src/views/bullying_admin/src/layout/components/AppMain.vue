<template>
  <section class="app-main">
    <!-- <breadcrumb v-if="key !== '/home_page'" id="breadcrumb-container" class="breadcrumb-container" /> -->
    <keep-alive :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>
  </section>
</template>

<script>
// import Breadcrumb from '@/components/Breadcrumb'
export default {
  name: 'AppMain',
  // components: {
  //   Breadcrumb
  // },
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
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 0px);
  }

  .fixed-header+.app-main {
    padding-top: 63px;
    background: #fff;
    border-left: 1px solid #e6e7eb;
  }
}
</style>

<style lang="scss">
// 这里说是可以修复elementUI弹窗右侧出现滚动条的bug，但是暂时没有触发，先注释掉
// .el-popup-parent--hidden {
//   .fixed-header {
//     padding-right: 15px;
//   }
// }
</style>
