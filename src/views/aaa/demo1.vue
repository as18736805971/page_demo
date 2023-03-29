<template>
  <!-- data-xxx可实现CSS attr(data-xxx)获取值 -->
  <div class="circular" :style="style"></div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      // 进度
      percent: '30%',
      // 底色
      chartColor: '#E6A23C',
      // 进度色
      chartProgressColor: '#F56C6C',
      // 进度宽度
      progressWidth: '50px'
    }
  },
  computed: {
    style () {
      return {
        '--percent': this.percent,
        '--chartColor': this.chartColor,
        '--chartProgressColor': this.chartProgressColor,
        '--progressWidth': this.progressWidth
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.circular {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  position: relative;
  // 实现饼状图
  background-image: conic-gradient(
          var(--chartProgressColor) var(--percent),
          var(--chartColor) var(--percent)
  );
  // background: conic-gradient(deeppink 0 30%, yellowgreen 0 70%, red 0 80%, teal 0 100%);
  // 实现环形图
  &::after {
    // 获取template中声明的变量
    content: ' ';
    background: #fff;
    width: calc(70px - var(--progressWidth));
    height: calc(70px - var(--progressWidth));
    border-radius: 50%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: #333;
  }
}
</style>
