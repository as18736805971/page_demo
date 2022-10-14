<template>
  <div class="hiddentrouble-main">
    <homeHeader :title="hiddenTitle" :type="3" @getDate="getDate" />
    <el-row :gutter="20">
      <el-col :span="18" style="padding-left:26px">
        <div class="hiddendanger-title">隐患统计</div>
        <div id="hiddenDangerChart" style="height: 400px" />
      </el-col>
      <el-col :span="6" style="padding-right: 30px;">
        <div style="position: relative;height: 450px">
          <div class="hiddendanger-title">
            <div class="title-left">
              <span>隐患排名</span>
              <span style="color:#999999;font-size:12px">（单位：次）</span>
            </div>
            <div v-if="user_type==='1'" class="choiceoption">
              <span
                class="choice-item"
                :class="{'choiceactive': choiceActive==='2'}"
                @click="choiceType('2')"
              >学校</span>
              <span
                class="choice-item"
                :class="{'choiceactive': choiceActive==='1'}"
                @click="choiceType('1')"
              >类型</span>
            </div>
          </div>
          <div v-if="rankList.length>0" class="rank-list">
            <div v-for="(item, index) in rankList" :key="index" class="rank-item">
              <div
                class="index"
                :class="{'firstitem':index === 0, 'seconditem':index===1, 'thirditem': index===2}"
              >{{ index+1 }}</div>
              <div class="title" :class="{'aheadtitle': index<3}">{{ item.name }}</div>
              <div class="num">{{ item.hidden_count }}</div>
            </div>
          </div>
          <div v-else class="spp-home-no-content">
            <div class="content">
              <img src="../../../../assets/images/home-no-content.png" alt class="not-found">
              <div class="text">暂无内容</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import homeHeader from './homeHeader'
import echarts from 'echarts'
import { getYearhidden, getDangerRank } from '@/api/home_page'
import { mapGetters } from 'vuex'
export default {
  name: 'HiddenDanger',
  components: { homeHeader },
  props: {},
  data() {
    return {
      rankList: [],
      choiceActive: '2',
      date: ''
    }
  },
  computed: {
    ...mapGetters(['user_type']),
    hiddenTitle() {
      return this.user_type === '1' ? '全省校园隐患统计' : '隐患统计'
    }
  },
  mounted() {
    //  实现自适应部分
    this.resizefun = () => {
      echarts.init(document.getElementById('hiddenDangerChart')).resize()
    }
    window.addEventListener('resize', this.resizefun)
    this.choiceActive = this.user_type === '1' ? '2' : '1'
    this.getYearhidden()
    this.getDangerRank()
  },
  //  移除事件监听
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  },
  methods: {
    getYearhidden() {
      getYearhidden(this.date).then(res => {
        const data = res.data.map(item => {
          return item.hidden_count
        })
        const myChart = echarts.init(
          document.getElementById('hiddenDangerChart')
        )
        myChart.setOption({
          color: ['#3399FF'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'line' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: '3%',
            left: '0',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
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
              axisTick: {
                show: false
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#626466'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#C4C8CC'
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dashed',
                  color: '#E6EBF0'
                }
              },
              axisLine: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: '#626466'
                }
              },
              axisTick: {
                show: false
              }
            }
          ],
          series: [
            {
              name: '隐患数据统计',
              type: 'bar',
              barWidth: '40%',
              data: data
            }
          ]
        })
      })
    },

    getDangerRank() {
      getDangerRank(this.date, this.choiceActive).then(res => {
        this.rankList = res.data
      })
    },

    getDate(value) {
      this.date = value.date
      this.getYearhidden()
      this.getDangerRank()
    },

    choiceType(type) {
      this.choiceActive = type
      this.getDangerRank()
    }
  }
}
</script>

<style lang="scss" scoped>
.hiddentrouble-main {
  height: 500px;
  background: #ffffff;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 4px;
  .hiddendanger-title {
    padding: 16px 0;
    color: #313233;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .choiceoption {
      height: 34px;
      line-height: 34px;
      display: flex;
    }
    .choice-item {
      width: 56px;
      height: 34px;
      text-align: center;
      cursor: pointer;
      border: 1px solid rgba(220, 225, 229, 1);
      &:first-of-type {
        border-right: none;
        border-radius: 4px 0px 0px 4px;
      }
      &:last-of-type {
        border-radius: 0px 4px 4px 0px;
      }
    }
    .choiceactive {
      background: #3399ff;
      color: #ffffff;
    }
  }
  .rank-list {
    .rank-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 48px;
      .index {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        text-align: center;
        line-height: 26px;
        color: #626466;
        background: #ebedf0;
      }
      .firstitem {
        background: rgba(255, 138, 101, 1);
        color: #ffffff;
      }
      .seconditem {
        background: #ffca28;
        color: #ffffff;
      }
      .thirditem {
        background: #29b6f6;
        color: #ffffff;
      }
      .title {
        width: calc(100% - 100px);
        margin-left: 10px;
        color: #626466;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .aheadtitle {
        color: #313233;
      }
      .num {
        width: 50px;
        color: #626466;
        text-align: right;
      }
    }
  }
}
</style>
