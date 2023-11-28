<template>
  <router-view />
</template>

<style lang="scss">
/* 配置弹框尺寸 */
.small-size {
  width: 560px !important;
  height: 330px !important;
}
.default-size {
  width: 560px !important;
  height: 600px !important;
}
.big-size {
  width: 700px !important;
  height: 500px !important;
}
.table-size {
  width: 900px !important;
  height: 700px !important;
}
.screen-size {
  width: calc(100% - 138px) !important;
  height: calc(100vh - 80px) !important;
}
.full-screen {
  width: 100% !important;
  height: 100vh !important;
  border-radius: 0 !important;
}
.right-side {
  width: 720px !important;
  height: 100% !important;
  border-top-left-radius: 6px !important;
  border-bottom-left-radius: 6px !important;
}
/* 配置弹框尺寸 */
</style>
