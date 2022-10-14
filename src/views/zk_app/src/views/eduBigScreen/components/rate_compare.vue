<template>
  <div class="dangertrend-main">
    <div class="data-statistics-chart">
      <div class="title-wrapper">
        <div class="left">考勤率</div>
        <div class="right">
          <div class="right-sign-common">
            <span class="num-sign" />
            <span class="num-text">昨日</span>
          </div>
          <div class="right-sign-common">
            <span class="num-sign" />
            <span class="num-text">今日</span>
          </div>
        </div>
      </div>
      <div id="attendancerateChart" style="height: 257px" />
    </div>
  </div>
</template>

<script>
import { getPajxHourlist } from '@/api/home_page'
import echarts from 'echarts'
import { getDateString } from '@/utils/index'
export default {
  name: 'RateCompare',
  props: {},
  data() {
    return {}
  },
  mounted() {
    this.getPajxHourlist()
    // 实现自适应部分
    this.resizefun = () => {
      echarts.init(document.getElementById('attendancerateChart')).resize()
    }
    window.addEventListener('resize', this.resizefun)
  },
  // 移除事件监听
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  },
  methods: {
    getPajxHourlist() {
      getPajxHourlist(getDateString(new Date(), 'yyyyMMdd')).then(res => {
        const today_att_num = res.data.pajx_data.map(item => {
          return item.today_att_num
        })
        const yesterday_att_num = res.data.pajx_data.map(item => {
          return item.yesterday_att_num
        })
        const xAxis_data = res.data.pajx_data.map(item => {
          return item.hour_time
        })
        const myChart = echarts.init(
          document.getElementById('attendancerateChart')
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
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxis_data,
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
              name: '昨日',
              type: 'line',
              data: yesterday_att_num,
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
              name: '今日',
              type: 'line',
              data: today_att_num,
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
