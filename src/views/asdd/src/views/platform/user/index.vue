<template>
  <div @click="aaa()">用户{{ a }}</div>
</template>

<script>
export default {
  data() {
    return {
      a: 1
    }
  },
  methods: {
    aaa() {
      this.a = this.a += 1
    }
  }
}
</script>

<style scoped lang="scss">

</style>
