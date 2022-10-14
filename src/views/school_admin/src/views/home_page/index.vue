<template>
  <div class="app-container page-container right-side-dialog">
    <div class="home_bg_view">
      <img src="../../assets/images/home_bg.png" alt="" style="width: 100%;">
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style lang="scss">
.home_bg_view{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
}
</style>
