<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
html,
body {
  height: 100vh;
  color: #000;
  font-size: 16px;
  margin: 0;
  padding: 0;
}

.page-index {
  width: 100%;
  height: 100vh;
}
.page-con {
  padding: 20px;
}

/* 配置弹框尺寸 */
.default-small-size {
  width: 560px !important;
  height: 200px !important;
}
.default-in-size {
  width: 560px !important;
  height: 300px !important;
}
.default-size {
  width: 560px !important;
  height: 600px !important;
}
.default-big-size {
  width: 704px !important;
  height: 500px !important;
}
.default-height-size {
  width: 650px !important;
  height: 750px !important;
}
.default-table-size {
  width: 900px !important;
  height: 700px !important;
}
.default-screen-size {
  width: 100% !important;
  height: 100vh !important;
}
.default-right-side {
  width: 720px !important;
  height: 100% !important;
  border-top-left-radius: 20px !important;
  border-bottom-left-radius: 20px !important;
}
/* 配置弹框尺寸 */
</style>
