<template>
  <div class="trend_line" id="trend_line"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "demo10",
  data() {
    return {
      trend_line: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
        color: ['#3ba0ff'],
        grid: {
          top: '10px',
          left: '0',
          right: '0',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(255,255,255,0.60)'
            }
          },
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.20)'
            }
          },
          data: ['03/07', '03/08', '03/09', '03/10', '03/11', '03/12', '03/13']
        },
        yAxis: {
          type: 'value',
          minInterval: 2,
          axisLabel: {
            show: true,
            textStyle: {
              color: 'rgba(255,255,255,0.60)'
            }
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.20)'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.20)'
            }
          },
          axisTick: {
            show: false,
            alignWithLabel: true
          }
        },
        series: [{
          name: '事件数量',
          type: 'line',
          stack: 'Total',
          label: {
            show: true,
            color: '#59afff',
            position: 'top'
          },
          data: [5, 3, 5, 2, 4, 5, 2],
          lineStyle: {
            width: 2
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(59,160,255,0.61)'
              },
              {
                offset: 1,
                color: 'rgba(59,160,255,0.00)'
              }
            ])
          }
        }]
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.handleGetData()
    })
  },
  methods: {
    // 请求接口
    handleGetData() {
      const dome = document.getElementById('trend_line')
      const myChart = echarts.init(dome)
      this.trend_line.xAxis.data = ['哈哈', '哈哈', '哈哈', '哈哈', '哈哈', '哈哈', '哈哈']
      this.trend_line.series[0].data = [10, 20, 30, 40, 30, 20, 10]
      myChart.setOption(this.trend_line, true)
      window.onresize = () => {
        setTimeout(() => {
          myChart.resize()
        }, 50)
      }
    }
  }
}
</script>

<style scoped>
.trend_line {
  width: 500px;
  height: 500px;
}
</style>
