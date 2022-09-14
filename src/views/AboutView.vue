<template>
  <div class="about">
    <el-button @click="percentage += 10">按钮</el-button>
    <div class="btn">
      <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" status="success"></el-progress>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      timer: null,
      total: 100,
      progress: 0,
      percentage: 0
    }
  },
  created() {
    this.handleProgress()
  },
  methods: {
    handleProgress() {
      this.progress += 10
      this.percentage = Number(
          ((Number(this.progress) / this.total) * 100).toFixed(2)
      )
      if (Number(this.progress) === this.total) {
        this.clearTimer()
      } else {
        this.timer = setTimeout(() => {
          this.handleProgress()
        }, 300)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  margin: 20px 20px;
  padding: 20px;
  width: 250px;
  height: 100px;
  background: #F8644E;
}
</style>
