<template>
  <div class="aaa">
    <div class="active" id="liqiud"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import "echarts-liquidfill";

export default {
  name: "demo5",
  data() {
    return {
      option: {
        backgroundColor: "#0e2147", // 背景颜色
        title: {
          show: true,
          text: '刷卡率',
          x: '45%',
          y: '20%',
          z: 10,
          textAlign: 'center',
          textStyle: {
            color: '#9fb9ff',
            fontSize: 14,
            fontWeight: 500
          },
        },
        series: [{
          name: '刷卡率',
          type: 'liquidFill',
          radius: '100%',
          center: ['50%', '50%'],
          data: [{
            value: [20 / 100],
            label: {
              position: ['50%', '65%'],
              textStyle:{
                color: '#ffffff',
                fontSize: 22,
              },
              formatter: `20%`,
              show: true,
            }
          }],
          color: [
            {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: 1,
                  color: ['rgba(197,221,255,0.79)'],
                },
                {
                  offset: 0,
                  color: ['rgba(148,199,255,0.20)'],
                }
              ],
            }
          ],
          backgroundStyle: {
            color: 'transparent'
          },
          outline: {
            borderDistance: 0,
            itemStyle: {
              borderWidth: 1,
              borderColor: '#40b2fc',
            }
          },
        }]
      }
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart(){
      let myLiuqiud = echarts.init(document.getElementById("liqiud"))
      myLiuqiud.setOption(this.option)
    }
  }
}
</script>

<style scoped>
.aaa {
  display: flex;
  align-items: center;
  justify-content: center;
}
.active {
  margin-top: 10px;
  width: 94px;
  height: 94px;
  /*background: transparent;*/
}
</style>
