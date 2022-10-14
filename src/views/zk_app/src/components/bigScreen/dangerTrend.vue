<template>
  <div class="dangertrend-main">
    <div class="data-statistics-chart">
      <div class="title-wrapper">
        <div class="left">数量</div>
        <div class="right">
          <div class="right-sign-common">
            <span class="num-sign" />
            <span class="num-text">隐患数</span>
          </div>
          <div class="right-sign-common">
            <span class="num-sign" />
            <span class="num-text">治理数</span>
          </div>
        </div>
      </div>
      <div v-if="type===1" id="statisticsChart" ref="statisticsChart" />
      <div v-if="type===2" id="statisticsChart" style="height: 257px" />
    </div>
  </div>
</template>

<script>
import { getYearhidden } from '@/api/home_page'
import echarts from 'echarts'
export default {
  name: 'DangerTrend',
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.getYearhidden()
    this.initHeight()
    // 实现自适应部分
    this.resizefun = () => {
      this.initHeight()
      echarts.init(document.getElementById('statisticsChart')).resize()
    }
    window.addEventListener('resize', this.resizefun)
  },
  // 移除事件监听
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  },
  methods: {
    initHeight() {
      if (this.type === 1) {
        this.$refs.statisticsChart.style.height =
          (window.innerHeight - 168) / 3 - 30 + 'px'
      }
    },
    getYearhidden() {
      getYearhidden().then(res => {
        const hidden_count = res.data.map(item => {
          return item.hidden_count
        })
        const treat_count = res.data.map(item => {
          return item.treat_count
        })
        const myChart = echarts.init(
          document.getElementById('statisticsChart')
        )
        myChart.setOption({
          grid: {
            top: '50px',
            left: '0',
            right: '20px',
            bottom: '30px',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月'
            ],
            axisLine: {
              lineStyle: {
                // 设置x轴颜色
                color: 'rgba(255,255,255,0.5)'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: 'rgba(255,255,255,0.5)'
              }
            },
            axisTick: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            boundaryGap: true,
            minInterval: 1,
            splitLine: {
              show: true,
              lineStyle: {
                type: 'solid',
                color: 'rgba(255,255,255,0.1)'
              }
            },
            axisLine: {
              lineStyle: {
                // 设置x轴颜色
                color: 'rgba(255,255,255,0.5)'
              }
            },
            axisLabel: {
              textStyle: {
                color: 'rgba(255,255,255,0.5)'
              }
            },
            axisTick: {
              show: false
            }
          },
          series: [
            {
              name: '隐患数',
              type: 'line',
              data: hidden_count,
              symbol: 'circle', // 拐点样式
              symbolSize: 5, // 拐点大小
              itemStyle: {
                normal: {
                  color: '#FF8D4F',
                  lineStyle: {
                    width: 2, // 折线宽度
                    color: '#FF8D4F' // 折线颜色
                  }
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(255, 141, 79, .2)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(255, 141, 79, .6)'
                    }
                  ])
                }
              }
            },
            {
              name: '治理数',
              type: 'line',
              data: treat_count,
              symbol: 'circle', // 拐点样式
              symbolSize: 5, // 拐点大小
              itemStyle: {
                normal: {
                  color: '#4DCD70',
                  lineStyle: {
                    width: 2, // 折线宽度
                    color: '#4DCD70' // 折线颜色
                  }
                }
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgba(77, 205, 112, .1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(77, 205, 112, .5)'
                    }
                  ])
                }
              }
            }
          ]
        })
      })
    }
  }
}
</script>
<style scoped lang='scss'>
.dangertrend-main {
  .data-statistics-chart {
    position: relative;
    .title-wrapper {
      display: flex;
      justify-content: space-between;
      position: absolute;
      top: 20px;
      align-items: center;
      width: calc(100% - 30px);
      font-size: 12px;
      height: 30px;
      left: 25px;
      color: rgba(255, 255, 255, 0.5);
      .right {
        display: flex;
        .right-sign-common {
          display: flex;
          align-items: center;
          .num-sign {
            width: 12px;
            height: 12px;
            background: #4dcd70;
            border-radius: 2px;
            display: inline-block;
            margin-right: 5px;
          }
          &:first-of-type {
            margin-right: 10px;
            .num-sign {
              background: rgba(255, 141, 79, 1);
            }
          }
        }
      }
    }
  }
}
</style>
