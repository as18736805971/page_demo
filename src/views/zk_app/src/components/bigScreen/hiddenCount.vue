<template>
  <div class="hiddencount-main">
    <div class="data-statistics-chart">
      <div class="title-wrapper">
        <div class="left">数量</div>
        <div class="right">
          <div class="right-sign-common">
            <span class="num-sign" />
            <span class="num-text">重大隐患</span>
          </div>
          <div class="right-sign-common">
            <span class="num-sign" />
            <span class="num-text">一般隐患</span>
          </div>
        </div>
      </div>
      <div id="hiddencountChart" ref="hiddencountChart" />
    </div>
  </div>
</template>

<script>
import { getSchoolhidden } from '@/api/home_page'
import echarts from 'echarts'
export default {
  name: 'HiddenCount',
  props: {},
  data() {
    return {}
  },
  mounted() {
    this.getSchoolhidden()
    this.initHeight()
    // 实现自适应部分
    this.resizefun = () => {
      this.initHeight()
      echarts.init(document.getElementById('hiddencountChart')).resize()
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
      this.$refs.hiddencountChart.style.height =
        (window.innerHeight - 168) / 3 - 50 + 'px'
    },
    getSchoolhidden() {
      getSchoolhidden().then(res => {
        const general_count = res.data.map(item => {
          return item.general_count
        })
        const great_count = res.data.map(item => {
          return item.great_count
        })
        const scl_name = res.data.map(item => {
          return item.scl_name
        })
        const myChart = echarts.init(
          document.getElementById('hiddencountChart')
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
            data: scl_name,
            axisLine: {
              lineStyle: {
                // 设置x轴颜色
                color: 'rgba(255,255,255,0.5)'
              }
            },
            axisLabel: {
              show: true,
              rotate: -15,
              textStyle: {
                color: 'rgba(255,255,255,0.5)'
              },
              margin: 9
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
              name: '重大隐患',
              type: 'bar',
              barWidth: 5,
              barGap: '100%',
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(255, 92, 92, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(255, 92, 92, 0.3)'
                  }
                ])
              },
              data: great_count
            },
            {
              name: '一般隐患',
              type: 'bar',
              barWidth: 5,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(250, 191, 0, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(250, 191, 0, .3)'
                  }
                ])
              },
              data: general_count
            }
          ]
        })
      })
    }
  }
}
</script>
<style scoped lang='scss'>
.hiddencount-main {
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
            background: #fabf00;
            border-radius: 2px;
            display: inline-block;
            margin-right: 5px;
          }
          &:first-of-type {
            margin-right: 10px;
            .num-sign {
              background: #ff5c5c;
            }
          }
        }
      }
    }
  }
}
</style>
