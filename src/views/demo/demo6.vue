<template>
  <div class="page">
    <div class="area" id="area"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-gl'
import henan from '../../utils/henan.json'

export default {
  name: "demo6",
  data() {
    return {
    }
  },
  mounted() {
    this.$nextTick(() => {
      const myChart = echarts.init(document.getElementById('area'))
      let data = henan
      echarts.registerMap('henan', data)
      let option = {
        // 图表主标题
        title: {
          // 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
          top: 25,
          // 值: 'left', 'center', 'right' 同上
          left: 'center',
          // 文本样式
          textStyle: {
            // 字体大小
            fontSize: 25,
            // 字体粗细
            fontWeight: 650,
            // 字体颜色
            color: '#fff'
          }
        },
        // 提示框组件
        tooltip: {
          // // 触发类型, 数据项图形触发
          // trigger: 'item',
          // // 使用函数模板，传入的数据值 ——> value: number | Array
          // formatter: function (val) {
          //   return val.data.name + '<br>人口数量: ' + val.data.value + '万'
          // }
        },
        // visualMap: {
        //   show: false,
        //   min: 3, //指定 visualMapContinuous 组件的允许的最小值。
        //   max: 10, //指定 visualMapContinuous 组件的允许的最大值
        //   inRange: {
        //     color: ["#008FFF"],
        //   },
        //   calculable: true, //是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
        // },
        series: [
          {
            // 类型
            type: 'map3D',
            // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
            map: 'henan',
            // 地图类型
            mapType: 'province',
            environment: '#7B68EE',// 环境贴图。
            // 地面颜色
            groundPlane: {
              show: true,
              color: '#FF6347'
            },
            viewControl: {
              projection: 'perspective',
              autoRotate: true
            },
            colorMaterial: {
              detailTexture: 'HTMLCanvasElement'
            },
            regionHeight: 2, //模型的高度
            // 是否开启鼠标缩放和平移漫游 默认不开启
            // 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
            roam: false,
            // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
            top: 70,
            // 图形上的文本标签
            label: {
              show: true // 是否显示对应地名
            },
            regions: [{
              name: '中原区',
              regionHeight: 4
            }],
            // 地图区域的多边形 图形样式
            itemStyle: {
              // 地图区域的颜色 如果设置了visualMap, 这个属性将不起作用
              areaColor: '#7B68EE',
              // color: '#7B68EE',
              // 描边线宽 为 0 时无描边
              borderWidth: 0.5,
              // 图形的描边颜色 支持的颜色格式同 color
              borderColor: '#000',
              // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
              borderType: 'solid'
            },
            // 高亮状态
            emphasis: {
              // 文本标签
              label: {
                // 是否显示标签
                show: true,
                // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
                color: '#fff'
              },
              // 图形样式
              itemStyle: {
                // 地图区域的颜色
                areaColor: '#FF6347',
                color: '#7B68EE'
              }
            },
            // 地图系列中的数据内容数组，数组项可以为单个数值
            data: []
          }
        ]
      }
      myChart.setOption(option, true)
      window.onresize = () => {
        setTimeout(() => {
          myChart.resize()
        }, 50)
      }
    })
  },
  methods: {

  }
}
</script>

<style scoped>
.page {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}
.area {
  width: 700px;
  height: 600px;
  background: #b9ead2;
}
</style>
