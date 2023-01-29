<template>
  <div class="page-index">
   <div class="block_item">
     <div id="bubble" class="bubble"></div>
   </div>
  </div>
</template>

<script>
import * as echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/graph'

export default {
  name: "demo2",
  data() {
    return {

    }
  },
  mounted() {
    let data = [
      {label: '高血压', amount: 12, type: 1},
      {label: '高血糖', amount: 8, type: 1},
      {label: '体温过高', amount: 6, type: 2},
      {label: '心率不齐', amount: 6, type: 1},
      {label: '心跳', amount: 6, type: 2},
      {label: '运动', amount: 6, type: 1},
      {label: '体温过低', amount: 6, type: 1}
    ]
    this.initBubbleChart(data, ['label', 'amount'], 'bubble')
  },
  methods: {
    // 入参说明:
    // 1. data 原始气泡数据，是一个对象数组，形如[{name: '可乐', amount: 49}]
    // 2. format 数组依次指定气泡中展示的名称以及影响气泡大小的数据值, 形如['name', 'amount']
    // 3. dom 气泡图绘制所需要的dom id名
    initBubbleChart (data = [], format = [], dom) {
      let [maxValue, temp] = [0, []]
      data.forEach(item => {
        temp.push(item[format[1]])
      })
      maxValue = Math.max.apply(null, temp)
      // 气泡数据
      let bubbleData  = []
      // 气泡基础大小
      let basicSize = 70
      // 节点之间的斥力因子,值越大,气泡间距越大
      let repulsion = 380
      // 根据气泡数量配置基础大小和斥力因子（以实际情况进行适当调整，使气泡合理分布）
      if (data.length >= 5 && data.length < 10) {
        basicSize = 50
        repulsion = 230
      }
      if (data.length >= 10 && data.length < 20) {
        basicSize = 40
        repulsion = 150
      } else if (data.length >= 20) {
        basicSize = 30
        repulsion = 75
      }
      // 填充气泡数据数组bubbleData
      for (let item of data) {
        // 气泡大小设置
        let size = (item[format[1]] * basicSize * 2) / maxValue
        if (size < basicSize) size = basicSize
        // 气泡颜色
        let color = new echarts.graphic.LinearGradient(0, 0, 0, 1,
        [
          {offset: 0, color: 'rgba(0, 118, 160, 0.24)'},
          {offset: 1, color: 'rgba(0, 75, 102, 0.40)'}
        ])
        let color1 = new echarts.graphic.LinearGradient(0, 0, 0, 1,
        [
          {offset: 0, color: 'rgba(255, 163, 117, 0.24)'},
          {offset: 1, color: 'rgba(173, 58, 0, 0.40)'}
        ])
        bubbleData.push({
          "name": item[format[0]],
          "value": item[format[1]],
          "symbolSize": size,
          "draggable": true,
          "itemStyle": {
            "normal": {
              "color": Number(item.type) === 1 ? color : color1,
              "borderColor": Number(item.type) === 1 ? '#3BCCFF' : '#FBAB81'
            },
          }
        })
      }

      let bubbleId = document.getElementById(dom)
      let bubbleChart = echarts.init(bubbleId)
      let bubbleOptions = {
        backgroundColor: '#fff',
        animationEasingUpdate: 'bounceIn',
        series: [{
          type: 'graph',
          layout: 'force',
          force: {
            repulsion: repulsion,
            edgeLength: 10
          },
          label: {
            show: true,
            position: 'inside',
            color: '#fff',
            fontSize: 12,
            formatter: function (params) {
              let res = params.data.name + params.data.value + '分'
              return res
            },
          },
          // 是否开启鼠标缩放和平移漫游
          roam: false,
          // label: {
          //   normal: {
          //     show: true,
          //     color: '#fff'
          //   }
          // },
          data: bubbleData
        }]
      }
      bubbleChart.setOption(bubbleOptions)
    }
  }
}
</script>

<style lang="scss" scoped>
.page-index {
  background: #3BCCFF;
}

.block_item {
  width: 420px;
  height: 307px;
  background: linear-gradient(180deg,rgba(198,236,255,0.04), rgba(122,211,255,0.10));
  box-shadow: 0 0 6px 0 rgba(5,29,50,0.26);
  backdrop-filter: blur(2px);
  border: 1px solid #dadada
}

.bubble {
  width: 100%;
  height: 307px;
  backdrop-filter: blur(2px);
}
</style>
