<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
html,
body {
  height: 100vh;
  color: #fff;
  font-size: 16px;
  margin: 0;
  padding: 0;
}

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
