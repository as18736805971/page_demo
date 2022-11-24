<template>
  <div class="page">
    <el-button @click="handle()">按钮</el-button>
  </div>
</template>

<script>
export default {
  name: "Add",
  data() {
    return {
      edit: {},
      show: false
    }
  },
  created() {
    console.log(this.edit)
  },
  methods: {
    handle() {
      this.$baseDialogCloseAll()
    },
    onSubmit() {
      this.callBack && this.callBack()
    },
  }
}
</script>

<style scoped>

</style>
