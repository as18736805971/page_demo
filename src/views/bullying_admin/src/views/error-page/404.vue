<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/images/404.png" alt="404">
      </div>
      <div class="bullshit">
        抱歉，您的页面不见了！
      </div>
      <div class="back_btn">
        <span class="spp-btn" @click="back">返回主页</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  methods: {
    back() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style lang="scss" scoped>
.wscn-http404-container{
  margin-top: 100px;

}
.wscn-http404 {
  margin:auto;
  width: 1200px;
  padding: 0 50px;
  text-align: center;
  .bullshit {
    margin-top: 32px;
    font-size: 16px;
    color: #939699;
  }
  .back_btn{
    margin-top: 32px;
  }
}
</style>
