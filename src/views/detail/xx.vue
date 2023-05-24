<template>
  <div></div>
</template>

<script>
export default {
  name: "xx",
  data() {
    return {
      form: {}
    }
  },
  created() {
    let aa = {
      title: '哈哈哈',
      desc: '来来来'
    }
    aa.name = '2222'

    this.form = aa

    this.form.name = '11111'

    console.log(this.form, '4444')
  }
}
</script>

<style scoped>

</style>
