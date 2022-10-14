<template>
  <div>
    <el-form ref="search_form" :inline="true" label-width="100px" style="display:flex; justify-content: space-between">
      <el-radio-group v-model="att_type" size="small" @change="drawChart()">
        <el-radio-button label="1">已考勤</el-radio-button>
        <el-radio-button label="2">未考勤</el-radio-button>
        <el-radio-button label="3">考勤率</el-radio-button>
      </el-radio-group>
      <el-form-item label="考勤月份：" style="margin-right:0">
        <el-date-picker v-model="month" type="month" placeholder="选择月份" @change="changeMonth()" />
      </el-form-item>
    </el-form>
    <div id="myChart" style="height:500px;" />
  </div>
</template>
<script>
import echarts from 'echarts'
import { getPajxAttMonth } from '@/api/pajx'
import { getDateString } from '@/utils/index'
export default {
  props: {},
  data() {
    return {
      att_type: '1',
      month: new Date(),
      att_data: [],
      att_max: 0,
      no_att_data: [],
      no_att_max: 0,
      att_rate_data: [],
      att_rate_max: 0,
      scl_list: [],
      days: [],
      lastDay: 0
    }
  },
  mounted() {
    document.getElementById('myChart').style.width = (document.getElementById('att_manager_tab').offsetWidth - 64) + 'px'
    this.getData()
  },
  methods: {
    getMonthLastDay: function() {
      let new_year = this.month.getFullYear()
      const month = this.month.getMonth()
      let new_month = month + 1
      if (month === 11) {
        new_month -= 11
        new_year++
      }
      const new_date = new Date(new_year, new_month, 1)
      return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate()
    },
    changeMonth: function() {
      this.getData()
    },
    getData: function() {
      this.att_data = []
      this.no_att_data = []
      this.att_rate_data = []
      this.scl_list = []
      this.days = []
      this.lastDay = this.getMonthLastDay()
      for (let i = 1; i <= this.lastDay; i++) {
        this.days.push(i + '日')
      }
      const month = getDateString(this.month, 'yyyyMM')
      getPajxAttMonth(month).then(res => {
        const data = res.data.pajx_data
        for (let i in data) {
          i = parseInt(i)
          this.scl_list.push(data[i].scl_name)
          const days_data = {}
          data[i].scl_att_num.forEach(item => {
            const day = parseInt(item.day_time.substring(6))
            days_data[day] = {
              total: data[i].scl_stu_num,
              att: item.hs_att_num
            }
          })
          for (let j in this.days) {
            j = parseInt(j)
            const att_tmp = [j, i, null]
            const no_att_tmp = [j, i, null]
            const rate_tmp = [j, i, null]
            const key = this.days[j].replace('日', '')
            if (days_data.hasOwnProperty(key)) {
              att_tmp[2] = days_data[key].att ? days_data[key].att : null
              this.att_max = att_tmp[2] > this.att_max ? att_tmp[2] : this.att_max
              no_att_tmp[2] = (days_data[key].total - days_data[key].att) ? (days_data[key].total - days_data[key].att) : null
              this.no_att_max = no_att_tmp[2] > this.no_att_max ? no_att_tmp[2] : this.no_att_max
              const r = (days_data[key].att / days_data[key].total).toFixed(4) * 100
              this.att_max = att_tmp[2] > this.att_max ? att_tmp[2] : this.att_max
              rate_tmp[2] = r || null
              this.att_rate_max = r > this.att_rate_max ? r : this.att_rate_max
            }
            this.att_data.push(att_tmp)
            this.no_att_data.push(no_att_tmp)
            this.att_rate_data.push(rate_tmp)
          }
        }
        let height = this.scl_list.length * 100
        if (height < 500) {
          height = 500
        }
        document.getElementById('myChart').style.height = height + 'px'
        this.drawChart()
      })
    },
    drawChart: function() {
      const myChart = echarts.init(document.getElementById('myChart'))
      const option = {
        tooltip: {
          position: 'top'
        },
        animation: false,
        grid: {
          height: '75%',
          top: '5%'
        },
        xAxis: {
          type: 'category',
          data: this.days,
          splitArea: {
            show: true
          }
        },
        yAxis: {
          type: 'category',
          data: this.scl_list,
          splitArea: {
            show: true
          }
        },
        visualMap: {
          min: 0,
          max: 10,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '0%',
          itemHeight: 500,
          inRange: {
            color: ['#73d3ff', '#1a42d8']
          }
        },
        series: [{
          name: '',
          type: 'heatmap',
          data: null,
          label: {
            show: true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
      switch (this.att_type) {
        case '1':
          option.series[0].data = this.att_data
          option.series[0].name = '考勤人数'
          option.visualMap.max = this.att_max
          break
        case '2':
          option.series[0].data = this.no_att_data
          option.series[0].name = '未考勤人数'
          option.visualMap.max = this.no_att_max
          break
        case '3':
          option.series[0].data = this.att_rate_data
          option.series[0].name = '考勤率'
          option.visualMap.max = this.att_rate_max
          break
      }
      // 绘制图表
      myChart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
