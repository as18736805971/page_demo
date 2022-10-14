<template>
  <div class="attendance-manage">
    <el-row :gutter="24">
      <el-col :span="18">
        <div class="common-wrapper" :style="attendanceHeight">
          <div class="title">今日考勤详情</div>
          <div class="table-head table-item-tr">
            <span v-for="(item, index) in tableName" :key="index" class="item-wrapper">{{ item }}</span>
          </div>
          <div v-if="loadData" class="swiper-container">
            <div class="swiper-wrapper" :style="swiperHeight">
              <div v-for="(item,key) in attendanceInfoList" :key="key" class="swiper-slide">
                <div v-for="(opt,index) in item" :key="index" class="table-item-tr table-list">
                  <span class="item-wrapper">{{ index+1 }}</span>
                  <span class="item-wrapper">{{ opt.scl_name }}</span>
                  <span class="item-wrapper">{{ opt.all_stu_num }}</span>
                  <span class="item-wrapper">{{ opt.hs_stu_num }}</span>
                  <span class="item-wrapper">{{ opt.no_stu_num }}</span>
                  <span class="item-wrapper">{{ opt.att_stu_rate }}</span>
                  <span class="item-wrapper">
                    <span>{{ Math.abs(opt.day_rate) }}%</span>
                    <img v-show="opt.day_rate>0" src="../../../assets/images/rate-up.png" alt>
                    <img v-show="opt.day_rate<0" src="../../../assets/images/rate-down.png" alt>
                  </span>
                  <span class="item-wrapper">
                    <span>{{ Math.abs(opt.week_rate) }}%</span>
                    <img v-show="opt.week_rate>0" src="../../../assets/images/rate-up.png" alt>
                    <img v-show="opt.week_rate<0" src="../../../assets/images/rate-down.png" alt>
                  </span>
                  <!-- <span class="item-wrapper">
                    <span>{{ Math.abs(opt.month_rate) }}%</span>
                    <img v-show="opt.month_rate>0" src="../../../assets/images/rate-up.png" alt>
                    <img v-show="opt.month_rate<0" src="../../../assets/images/rate-down.png" alt>
                  </span> -->
                  <span class="item-wrapper">{{ parseTime(new Date(), '{y}-{m}-{d}') }}</span>
                </div>
              </div>
            </div>
          </div>
          <img class="bottom-left" src="../../../assets/images/bottom-left.png" alt>
          <img class="bottom-right" src="../../../assets/images/bottom-right.png" alt>
        </div>
        <div class="common-wrapper" style="height: 304px;margin-top: 24px">
          <div class="title">考勤率对比</div>
          <RateCompare v-if="loadData" />
          <img class="bottom-left" src="../../../assets/images/bottom-left.png" alt>
          <img class="bottom-right" src="../../../assets/images/bottom-right.png" alt>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="common-wrapper" style="height: 304px;margin-bottom: 24px">
          <div class="title">今日考勤</div>
          <div class="chart-main">
            <div id="attendanceChart" style="height: 240px;width: 65%;position: relative; left: -20px" />
            <div class="text-des">
              <div class="item-des">
                <img src="../../../assets/images/toal-num.png" alt class="image">
                <div class="des">
                  <span class="text">总人数（人）</span>
                  <span class="num spp-font">{{ numberObj.all_stu_num }}</span>
                </div>
              </div>
              <div class="item-des">
                <img src="../../../assets/images/attendance.png" alt class="image">
                <div class="des">
                  <span class="text">已考勤（人）</span>
                  <span class="num attendance spp-font">{{ numberObj.hs_stu_num }}</span>
                </div>
              </div>
              <div class="item-des">
                <img src="../../../assets/images/no-attendance.png" alt class="image">
                <div class="des">
                  <span class="text">未考勤（人）</span>
                  <span class="num noattendance spp-font">{{ numberObj.no_stu_num }}</span>
                </div>
              </div>
            </div>
          </div>
          <img class="bottom-left" src="../../../assets/images/bottom-left.png" alt>
          <img class="bottom-right" src="../../../assets/images/bottom-right.png" alt>
        </div>
        <DailyAttendance v-if="loadData" :sch-list="schList" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import DailyAttendance from '../components/daily_attendance'
import RateCompare from '../components/rate_compare'
import echarts from 'echarts'
import { getAttendanceInfo } from '@/utils/index'
import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'
import { parseTime } from '@/utils/index'
export default {
  components: {
    DailyAttendance,
    RateCompare
  },
  props: {},
  data() {
    return {
      tableName: [
        '序号',
        '学校名称',
        '人数',
        '已考勤',
        '未考勤',
        '考勤率',
        '日同比',
        '周同比',
        '日期'
      ],
      schList: [],
      attendanceInfoList: [],
      updateData: null,
      loadData: false,
      numberObj: {
        all_stu_num: 0,
        hs_stu_num: 0,
        no_stu_num: 0
      },
      attendanceHeight: {},
      swiperHeight: {}
    }
  },
  created() {
    this.getAttendanceInfo()
    this.initHeight()
    // 实现自适应部分
    this.resizefun = () => {
      this.initHeight()
      echarts.init(document.getElementById('attendanceChart')).resize()
    }
    window.addEventListener('resize', this.resizefun)
    this.updateData = setInterval(() => {
      this.loadData = false
      this.getAttendanceInfo()
    }, 1000 * 60 * 5)
  },
  mounted() {},
  // 移除事件监听
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
    if (this.updateData) {
      clearInterval(this.updateData)
    }
  },
  methods: {
    parseTime: parseTime,
    initHeight() {
      this.attendanceHeight = {
        height: window.innerHeight - 448 + 'px'
      }
      this.swiperHeight = {
        height: window.innerHeight - 548 + 'px'
      }
    },
    getAttendanceInfo() {
      getAttendanceInfo().then(res => {
        this.schList = res
        this.attendanceInfoList = this.interceptArray(res)
        this.loadData = true
        this.getTodayAttendance()
        setTimeout(() => {
          new Swiper('.swiper-container', {
            speed: 3000,
            autoplay: {
              disableOnInteraction: false, // 手动滑动之后不打断播放
              delay: 30000
            },
            direction: 'vertical',
            loop: this.attendanceInfoList.length > 1
          })
        }, 10)
      })
    },
    interceptArray(array) {
      let index = 0
      const newArray = []
      while (index < array.length) {
        newArray.push(array.slice(index, (index += 10)))
      }
      return newArray
    },
    // 今日考勤
    getTodayAttendance() {
      Object.assign(this.$data.numberObj, this.$options.data().numberObj)
      this.schList.forEach(item => {
        this.numberObj.all_stu_num += item.all_stu_num
        this.numberObj.hs_stu_num += item.hs_stu_num
        this.numberObj.no_stu_num += item.no_stu_num
      })
      const myChart = echarts.init(document.getElementById('attendanceChart'))
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: ['rgba(70, 235, 255, 1)', 'rgba(255,255,255,.1)'],
        graphic: {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text:
              parseFloat(
                this.numberObj.hs_stu_num / this.numberObj.all_stu_num
              ).toFixed(2) + '%',
            fill: '#28E094',
            fontSize: 24
          }
        },
        series: [
          {
            name: '今日考勤',
            type: 'pie',
            radius: ['50%', '75%'],
            center: ['50%', '50%'],
            roseType: 'radius',
            label: {
              normal: {
                position: 'inner',
                show: false
              }
            },
            data: [
              {
                value: this.numberObj.hs_stu_num,
                name: '已考勤'
              },
              { value: this.numberObj.no_stu_num, name: '未考勤' }
            ]
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.attendance-manage {
  .chart-main {
    position: relative;
    width: 100%;
    .text-des {
      position: absolute;
      top: 30px;
      right: 15px;
      .item-des {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        .image {
          margin-right: 10px;
          height: 32px;
        }
        .des {
          display: flex;
          flex-direction: column;
          .num {
            font-size: 28px;
          }
          .attendance {
            color: rgba(77, 205, 112, 1);
          }
          .noattendance {
            color: rgba(255, 141, 79, 1);
          }
          .text {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }
  .table-head {
    border: 1px solid rgba(235, 240, 245, 0.1);
    background: rgba(255, 255, 255, 0.04);
  }
  .table-item-tr {
    font-size: 14px;
    height: 49px;
    display: flex;
    align-items: center;
    height: 49px;
    border: 1px solid rgba(235, 240, 245, 0.1);
    .item-wrapper {
      width: 9%;
      height: 100%;
      line-height: 47px;
      border-right: 1px solid rgba(235, 240, 245, 0.1);
      text-indent: 16px;
      &:first-of-type {
        width: 62px;
      }
      &:last-of-type {
        width: 112px;
      }
      &:nth-child(2) {
        width: calc(46% - 174px);
      }
    }
  }
  .table-list {
    border-top: none;
  }
}
</style>
