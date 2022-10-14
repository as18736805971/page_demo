<template>
  <div class="riskprofile-main">
    <homeHeader title="风险构成" :type="1" @viewAll="viewAll" />
    <div class="riskprofile-list">
      <div id="riskProfileChart" style="height: 400px" />
      <div class="des">
        <div v-for="(item, index) in chartLsit" :key="index" class="des-item">
          <div class="title">
            <span class="characteristic" :style="{'background': item.color}" />
            <span>{{ item.title }}</span>
          </div>
          <span class="places">{{ item.count }}个</span>
          <span class="percent">{{ item.rate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import homeHeader from './homeHeader'
import { getRiskpointRank } from '@/api/home_page'
import echarts from 'echarts'
export default {
  name: 'RiskProfile',
  components: { homeHeader },
  props: {},
  data() {
    return {
      chartLsit: []
    }
  },
  mounted() {
    // 实现自适应部分
    this.resizefun = () => {
      echarts.init(document.getElementById('riskProfileChart')).resize()
    }
    window.addEventListener('resize', this.resizefun)
    this.getRiskpointRank()
  },
  // 移除事件监听
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  },
  methods: {
    getRiskpointRank() {
      getRiskpointRank().then(res => {
        this.chartLsit = [
          {
            title: '一级风险',
            count: res.data.one_count,
            rate: res.data.one_rank_rate,
            color: '#FF8A65'
          },
          {
            title: '二级风险',
            count: res.data.two_count,
            rate: res.data.two_rank_rate,
            color: '#FFCA28'
          },
          {
            title: '三级风险',
            count: res.data.three_count,
            rate: res.data.three_rank_rate,
            color: '#4DCD70'
          },
          {
            title: '四级风险',
            count: res.data.four_count,
            rate: res.data.four_rank_rate,
            color: '#29B6F6'
          }
        ]
        const myChart = echarts.init(
          document.getElementById('riskProfileChart')
        )
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          color: ['#FF8A65', '#FFCA28', '#4DCD70', '#29B6F6'],
          series: [
            {
              name: '风险构成',
              type: 'pie',
              radius: ['50%', '75%'],
              center: ['50%', '50%'],
              itemStyle: {
                normal: {
                  borderWidth: 5,
                  borderColor: '#fff'
                }
              },
              label: {
                normal: {
                  position: 'inner',
                  show: false
                }
              },
              data: [
                { value: res.data.one_count, name: '一级风险' },
                { value: res.data.two_count, name: '二级风险' },
                { value: res.data.three_count, name: '三级风险' },
                { value: res.data.four_count, name: '四级风险' }
              ]
            }
          ]
        })
      })
    },

    viewAll() {
      this.$router.push({ path: '/risk_list' })
    }
  }
}
</script>

<style scoped lang='scss'>
.riskprofile-main {
  height: 450px;
  background: #ffffff;
  border-radius: 4px;
  .riskprofile-list {
    display: flex;
    height: 400px;
    #riskProfileChart {
      flex: 6;
    }
    .des {
      flex: 4;
      padding: 120px 20px;
      .des-item {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #626466;
        line-height: 40px;
        .title {
          flex: 4;
          color: #313233;
          display: flex;
          align-items: center;
          .characteristic {
            width: 18px;
            height: 18px;
            border-radius: 4px;
            display: inline-block;
            margin-right: 10px;
          }
        }
        .places {
          flex: 3;
          text-align: right;
        }
        .percent {
          flex: 3;
          color: #939699;
          text-align: right;
        }
        .title,
        .places,
        .percent {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
