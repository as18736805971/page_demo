<template>
  <div style="padding: 20px"></div>
</template>

<script>
export default {
  name: "demo",
  data() {
    return {
    }
  },
  mounted() {
    let type = this.handleTimeContrast('2023-05-19 11:30:00', '2023-05-19 08:00:00', '2023-05-20 11:00:00')
    console.log(type)
  },
  methods: {
    /*
     * 时间对比
     * time  当前时间
     * star  开始时间
     * end   结束时间
     * 未过期 1 已过期 2 跨天 3
     */
    handleTimeContrast(time, star, end) {
      if (end >= time) {
        if (this.handleDateContrast(star, end)) {
          return 1
        } else {
          return 3
        }
      } else {
        if (this.handleDateContrast(star, end)) {
          return 2
        } else {
          return 3
        }
      }
    },
    handleDateContrast(star, end) {
      let arr1 = star.split(' ')
      let arr2 = end.split(' ')
      return arr1[0] === arr2[0]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
