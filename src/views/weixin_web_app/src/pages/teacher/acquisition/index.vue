<template>
  <div class="img_list">
    <div class="item stu_bg" @click="handleStuJump()"></div>
    <div class="item tea_bg" @click="handleJump('tea_collect')"></div>
  </div>
</template>

<script>
export default {
  name: "img_list",
  data() {
    return {
      manager_flag: 0,
    }
  },
  created() {
  },
  methods: {
    handleJump(path) {
      this.$router.push({
        path: path
      })
    },
    handleStuJump() {
      this.$router.push({
        path: '/select_class',
        query: {
          type: 3
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.img_list {
  width: 100%;
  height: 100vh;
  background: #ffffff;
  padding: 0.6rem;

  .item {
    height: 8rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .stu_bg {
    background: url('../../../assets/menu_img/stu_bg.png') no-repeat;
    background-size: 100% 100%;
  }

  .tea_bg {
    background: url('../../../assets/menu_img/tea_bg.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
