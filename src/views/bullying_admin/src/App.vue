<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  /* 配置弹框尺寸 */
  .default-small-size {
    width: 560px !important;
    height: 200px !important;
  }
  .default-size {
    width: 560px !important;
    height: 600px !important;
  }
  .default-big-size {
    width: 704px !important;
    height: 500px !important;
  }
  .default-table-size {
    width: 900px !important;
    height: 700px !important;
  }
  /* 配置弹框尺寸 */
</style>
