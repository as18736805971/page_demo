<template>
  <div class="eduSituation-main">
    <homeHeader :title="situationTitle" />
    <div v-if="type===1" id="eduDefectChart" style="height: 300px" />
    <div v-if="type===2" id="eduDrillChart" style="height: 300px" />
    <el-row v-if="type===1" :gutter="20">
      <el-col :span="12" style="text-align: center">
        <div class="num-item">
          <span>总隐患</span>
          <span>
            <span style="font-size: 32px;color: #666666;margin-right: 10px" class="spp-font">{{ handleObj.all_count }}</span>个
          </span>
        </div>
      </el-col>
      <el-col :span="12" style="text-align: center">
        <div class="num-item">
          <span>未处理</span>
          <span>
            <span
              style="font-size: 32px;color: #FF5F52;margin-right: 10px"
              class="spp-font"
            >{{ handleObj.nohandle_count }}</span>个
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="type===2" :gutter="20">
      <el-col :span="12" style="text-align: center">
        <div class="num-item">
          <span>演练学校</span>
          <span>
            <span
              style="font-size: 32px;color: #666666;margin-right: 10px"
              class="spp-font"
            >{{ trainObj.plan_school_count }}</span>所
          </span>
        </div>
      </el-col>
      <el-col :span="12" style="text-align: center">
        <div class="num-item">
          <span>演练次数</span>
          <span>
            <span style="font-size: 32px;color: #666666;margin-right: 10px" class="spp-font">{{ trainObj.plan_count }}</span>次
          </span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import homeHeader from './homeHeader'
import echarts from 'echarts'
import { gethandle, gettrain } from '@/api/home_page'
export default {
  name: 'EduSituation',
  components: { homeHeader },
  props: {
    type: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      handleObj: {},
      trainObj: {}
    }
  },
  computed: {
    situationTitle() {
      return this.type === 1 ? '隐患处理情况' : '应急演练情况'
    }
  },
  created() {
    if (this.type === 1) {
      this.drawEdudefectChart()
    } else if (this.type === 2) {
      this.drawEdudrillChart()
    }
    // 实现自适应部分
    this.resizefun = () => {
      echarts.init(document.getElementById('eduDefectChart')).resize()
      echarts.init(document.getElementById('eduDrillChart')).resize()
    }
    window.addEventListener('resize', this.resizefun)
  },
  // 移除事件监听
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  },
  methods: {
    // 隐患处理情况
    drawEdudefectChart() {
      gethandle().then(res => {
        this.handleObj = res.data
        const myChart = echarts.init(document.getElementById('eduDefectChart'))
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          color: ['#FF8A65', '#f0f2f5'],
          graphic: {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: res.data.handle_rate,
              fill: '#FF8A65',
              fontSize: 25
            }
          },
          series: [
            {
              name: '隐患处理情况',
              type: 'pie',
              radius: ['50%', '68%'],
              center: ['50%', '50%'],
              label: {
                normal: {
                  position: 'inner',
                  show: false
                }
              },
              data: [
                {
                  value: res.data.all_count - res.data.nohandle_count,
                  name: '已处理'
                },
                { value: res.data.nohandle_count, name: '未处理' }
              ]
            }
          ]
        })
      })
    },

    // 应急演练情况
    drawEdudrillChart() {
      gettrain().then(res => {
        this.trainObj = res.data
        const myChart = echarts.init(document.getElementById('eduDrillChart'))
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          color: ['#4DCD70', '#f0f2f5'],
          graphic: {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: res.data.plan_rate,
              fill: '#4DCD70',
              fontSize: 25
            }
          },
          series: [
            {
              name: '应急演练情况',
              type: 'pie',
              radius: ['50%', '72%'],
              center: ['50%', '50%'],
              label: {
                normal: {
                  position: 'inner',
                  show: false
                }
              },
              data: [
                { value: res.data.plan_school_count, name: '演练学校数量' },
                { value: res.data.plan_school_count / this.toPoint(res.data.plan_rate) - res.data.plan_school_count, name: '无演练学校数量' }
              ]
            }
          ]
        })
      })
    },

    toPoint(percent) {
      let str = percent.replace('%', '')
      str = str / 100
      return str
    }
  }
}
</script>
<style scoped lang='scss'>
.eduSituation-main {
  height: 450px;
  background: #ffffff;
  border-radius: 4px;
  .num-item {
    display: flex;
    flex-direction: column;
    font-size: 16px;
    color: #999999;
    line-height: 35px;
  }
}
</style>
