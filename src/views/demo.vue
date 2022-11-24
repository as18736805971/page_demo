<template>
  <div class="page">
    <el-button @click="handleAdd()">按钮</el-button>
  </div>
</template>

<script>
export default {
  name: "demo",
  data() {
    return {
      show: false
    }
  },
  methods: {
    handleAdd() {
      this.$baseDialog(import('./detail/add'), { edit: { id: 10 }})
      .title('诶嘿')
      .then((res) => {
        console.log(res)
      }).show()
    }
  }
}
</script>

<style scoped>

</style>
