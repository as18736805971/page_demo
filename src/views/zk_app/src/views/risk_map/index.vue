<template>
  <div class="app-container page-container col_bg">
    <el-tabs v-model="activeName">
      <el-tab-pane ref="three_container" label="3D四色图" name="first">
        <plan-img :height="height" :url="url" />
      </el-tab-pane>
      <el-tab-pane label="风险比较四色图" name="second">
        <div id="myChart" :style="{height: height + 'px'}" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getRiskRank, getSchoolModel } from '@/api/risk_map'
import PlanImg from '@/components/Threeview/plan_img'
import echarts from 'echarts'
export default {
  name: 'RiskMap',
  components: { PlanImg },
  data() {
    return {
      activeName: 'first',
      three_id: 'three_test',
      url: '',
      height: window.innerHeight - 235,
      mapping: {
        1: 4,
        2: 3,
        3: 2,
        4: 1
      }
    }
  },
  created() {
    this.getSchoolModel()
  },
  mounted() {
    document.getElementById('myChart').style.width = document.getElementById('three_container').offsetWidth + 'px'
    this.drawChart()
  },
  methods: {
    getSchoolModel: function() {
      getSchoolModel().then(response => {
        if (response.data.scl_model && response.data.scl_model !== '') {
          this.url = process.env.VUE_APP_BASE_API + '/' + response.data.scl_model
        }
        // this.url = {
        //   url: response.data.scl_model,
        //   cam_init_x: response.data.model_cam_init_x,
        //   cam_init_y: response.data.model_cam_init_y,
        //   cam_init_z: response.data.model_cam_init_z
        // }
      })
    },
    drawChart: function() {
      getRiskRank(30).then(response => {
        const data = response.data
        const risk_name = []
        const risk_rank_score = []
        data.forEach(item => {
          risk_name.push(item.activity_name)
          risk_rank_score.push(item.risk_rank_score)
        })
        const myChart = echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          title: { text: '风险四色比较图' },
          tooltip: {
            trigger: 'axis',
            formatter(params) {
              const y = params[0].data
              let risk_text = ''
              if (y > 320) {
                risk_text = '重大风险'
              } else if (y <= 320 && y > 160) {
                risk_text = '较大风险'
              } else if (y <= 160 && y > 70) {
                risk_text = '一般风险'
              } else {
                risk_text = '低风险'
              }
              for (const x in params) {
                return params[x].name + '<br><b>' + risk_text + '</b>'
              }
            }
          },
          xAxis: {
            data: risk_name
          },
          yAxis: {},
          color: function(param) {
            const index_color = param.value
            if (index_color > 320) {
              return '#f00'
            } else if (index_color <= 320 && index_color > 160) {
              return '#FF6100'
            } else if (index_color <= 160 && index_color > 70) {
              return '#ff0'
            } else {
              return '#00f'
            }
          },
          series: [{
            name: '风险等级',
            type: 'bar',
            data: risk_rank_score
          }]
        })
      })
    }
  }
}
</script>
