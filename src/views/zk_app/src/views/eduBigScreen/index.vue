<template>
  <div class="eduBureau-bigscreen bigscreen-main">
    <div class="bigscreen-menu" :class="{ openmenuwidth: openMenuSign }">
      <div v-if="openMenuSign">
        <img src="../../assets/images/big-screen-logo.png" alt class="logo">
        <div class="menu-wrapper">
          <div class="item-wrapper" @click="choiceType('hidden')">
            <img
              v-if="type === 'hidden'"
              src="../../assets/images/hidden-manage-check.png"
              alt
              class="image"
            >
            <img
              v-else
              src="../../assets/images/hidden-manage-nocheck.png"
              alt
              class="image"
            >
            <span
              :class="{ checktext: type === 'hidden' }"
              class="text"
            >隐患管理</span>
          </div>
          <div class="item-wrapper" @click="choiceType('checkwork')">
            <img
              v-if="type === 'checkwork'"
              src="../../assets/images/checkwork-check.png"
              alt
              class="image"
            >
            <img
              v-else
              src="../../assets/images/checkwork-nocheck.png"
              alt
              class="image"
            >
            <span
              :class="{ checktext: type === 'checkwork' }"
              class="text"
            >考勤管理</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bigscreen-container" :class="{ openmenu: openMenuSign }">
      <div class="extend-menu">
        <img
          v-show="!openMenuSign"
          src="../../assets/images/big-screen-right.png"
          alt
          @click="showMenu"
        >
        <img
          v-show="openMenuSign"
          src="../../assets/images/big-screen-left.png"
          alt
          @click="showMenu"
        >
      </div>
      <div class="top-wrapper">
        <div class="title">周口市教体局总平台</div>
        <div class="date">{{ parseTime(date, "{y}-{m}-{d} {h}:{i}") }}</div>
      </div>
      <div v-if="type === 'hidden'" class="main-content">
        <el-row :gutter="24">
          <el-col :span="6">
            <!-- 本年度隐患排名 -->
            <!-- <dangerRank v-if="loadStatus" /> -->
            <!-- 各校每日巡检完成统计 -->
            <inspectionStatistics v-if="loadStatus" />
            <!-- 隐患实时上报 -->
            <div
              class="hidden-report common-wrapper"
              :style="hiddenReportHeight"
            >
              <div class="title">隐患实时上报</div>
              <el-scrollbar
                v-if="recordList.length > 0"
                class="report-list small-scrollbar"
                :style="hiddenReportScrollHeight"
              >
                <vue-seamless-scroll
                  :data="recordList"
                  :class-option="classOption"
                >
                  <div
                    v-for="(item, index) in recordList"
                    :key="index"
                    class="report-item"
                  >
                    <div class="time">
                      <span>{{ formatDateTime(item.create_time) }}</span>
                    </div>
                    <div class="report-content">
                      <div class="report-title">
                        <span>{{ item.scl_name }}</span>
                        <img
                          v-if="index === 0"
                          src="../../assets/images/bigscreen-new.png"
                          alt
                        >
                      </div>
                      <div class="report-text multiple-hidden">
                        {{ item.hd_desc }}
                      </div>
                      <div class="report-bottom" style="margin-top: 10px">
                        <span
                          class="left"
                          style="color: rgba(255, 255, 255, 0.5)"
                        >隐患位置：</span>
                        <span>{{ item.hd_position }}</span>
                      </div>
                      <div class="report-bottom">
                        <div class="item-bottom">
                          <span class="left">隐患等级：</span>
                          <span
                            v-if="item.hd_level === '1'"
                            class="right"
                          >一般隐患</span>
                          <span
                            v-else-if="item.hd_level === '2'"
                            class="right"
                          >重大隐患</span>
                          <span
                            v-else
                            class="right"
                            style="color: #ffffff"
                          >暂未分级</span>
                        </div>
                        <div class="item-bottom">
                          <span class="left">处理进度：</span>
                          <span class="handel-right">{{
                            item.hd_status | dangerStatus
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </vue-seamless-scroll>
              </el-scrollbar>
              <div v-else class="spp-no-content">
                <div class="content">
                  <img
                    src="../../assets/images/no-content.png"
                    alt
                    class="not-found"
                  >
                  <div class="text">暂无内容</div>
                </div>
              </div>
              <img
                class="bottom-left"
                src="../../assets/images/bottom-left.png"
                alt
              >
              <img
                class="bottom-right"
                src="../../assets/images/bottom-right.png"
                alt
              >
            </div>
          </el-col>
          <el-col :span="12">
            <div class="common-wrapper" style="padding: 0">
              <mapDisplay
                style="
                  width: 100%;
                  border-radius: 4px;
                  border: 1px solid rgba(146, 195, 255, 0.1);
                "
                :style="mapDisplayHeight"
              />
              <img
                class="bottom-left"
                src="../../assets/images/bottom-left.png"
                alt
              >
              <img
                class="bottom-right"
                src="../../assets/images/bottom-right.png"
                alt
              >
            </div>

            <el-col :span="12" style="padding-left: 0; margin-top: 24px">
              <div
                class="common-wrapper-right common-wrapper"
                :style="centerWrapper"
              >
                <div class="title">隐患处理情况</div>
                <div class="chart-main">
                  <div id="hiddenhandle" style="height: 240px; width: 70%" />
                  <div class="text-des">
                    <div class="text">总隐患</div>
                    <div style="margin-top: 16px">
                      <span
                        style="
                          font-size: 32px;
                          margin-right: 5px;
                          color: #ffdc50;
                        "
                        class="spp-font"
                      >{{ handleObj.all_count }}</span>
                      <span>个</span>
                    </div>
                    <div class="text" style="margin-top: 44px">未处理</div>
                    <div style="margin-top: 16px">
                      <span
                        style="
                          font-size: 32px;
                          color: #ff5f52;
                          margin-right: 5px;
                        "
                        class="spp-font"
                      >{{ handleObj.nohandle_count }}</span>
                      <span>个</span>
                    </div>
                  </div>
                </div>
                <img
                  class="bottom-left"
                  src="../../assets/images/bottom-left.png"
                  alt
                >
                <img
                  class="bottom-right"
                  src="../../assets/images/bottom-right.png"
                  alt
                >
              </div>
            </el-col>
            <el-col :span="12" style="padding-right: 0; margin-top: 24px">
              <div
                class="common-wrapper-right common-wrapper"
                :style="centerWrapper"
              >
                <div class="title">隐患排查情况</div>
                <div class="troubleshooting">
                  <el-progress
                    :show-text="false"
                    :stroke-width="14"
                    :percentage="patrolPoint.rateNum"
                    color="#FABF00"
                  />
                  <div class="text" :style="{ left: patrolPoint.patrol_rate }">
                    <span
                      style="font-size: 24px; color: #fabf00"
                      class="spp-font"
                    >{{ patrolPoint.patrol_rate }}</span>
                    <span
                      style="
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.5);
                        padding: 3px 0;
                      "
                    >完成率</span>
                    <img
                      src="../../assets/images/triangle.png"
                      alt
                      class="triangle"
                    >
                  </div>
                </div>
                <div class="troubleshooting-des">
                  <div class="des-item">
                    <span style="line-height: 30px">总检查点</span>
                    <span>
                      <span
                        style="
                          font-size: 32px;
                          color: #ffdc50;
                          margin-right: 10px;
                          font-weight: bold;
                        "
                        class="spp-font"
                      >{{ patrolPoint.all_count }}</span>个
                    </span>
                  </div>
                  <div class="des-item">
                    <span style="line-height: 30px">问题点</span>
                    <span>
                      <span
                        style="
                          font-size: 32px;
                          color: #ff5f52;
                          margin-right: 10px;
                          font-weight: bold;
                        "
                        class="spp-font"
                      >{{ patrolPoint.exception_count }}</span>个
                    </span>
                  </div>
                </div>
                <img
                  class="bottom-left"
                  src="../../assets/images/bottom-left.png"
                  alt
                >
                <img
                  class="bottom-right"
                  src="../../assets/images/bottom-right.png"
                  alt
                >
              </div>
            </el-col>
          </el-col>
          <el-col :span="6">
            <div
              class="common-wrapper-right common-wrapper"
              style="margin-bottom: 24px"
              :style="rightWrapper"
            >
              <div class="title">隐患数量统计</div>
              <hiddenCount v-if="loadStatus" />
              <img
                class="bottom-left"
                src="../../assets/images/bottom-left.png"
                alt
              >
              <img
                class="bottom-right"
                src="../../assets/images/bottom-right.png"
                alt
              >
            </div>
            <div
              class="common-wrapper-right common-wrapper"
              style="margin-bottom: 24px"
              :style="rightWrapper"
            >
              <div class="title">隐患变化趋势</div>
              <dangerTrend v-if="loadStatus" />
              <img
                class="bottom-left"
                src="../../assets/images/bottom-left.png"
                alt
              >
              <img
                class="bottom-right"
                src="../../assets/images/bottom-right.png"
                alt
              >
            </div>

            <div
              class="common-wrapper-right common-wrapper"
              style="overflow: hidden"
              :style="rightWrapper"
            >
              <div class="title">巡检完成排行</div>
              <div class="swiper-container">
                <div class="swiper-wrapper">
                  <div
                    v-for="(item, key) in completion_rate"
                    :key="key"
                    class="swiper-slide"
                    style="margin-top: 10px"
                  >
                    <div
                      v-for="(opt, index) in item"
                      :key="index"
                      class="completion_rate_main"
                    >
                      <div class="completion_rate_item">
                        <div class="completion_rate_title single-hidden">
                          {{ opt.scl_name }}
                        </div>
                        <el-progress
                          :percentage="parseFloat(opt.ratio)"
                          :stroke-width="10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <img
                class="bottom-left"
                src="../../assets/images/bottom-left.png"
                alt
              >
              <img
                class="bottom-right"
                src="../../assets/images/bottom-right.png"
                alt
              >
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="type === 'checkwork'" class="main-content">
        <AttendanceManage />
      </div>
    </div>
  </div>
</template>

<script>
import {
  gethandle,
  gettrain,
  getListeduDanger,
  getStatistic,
  getStatisticTrain
} from '@/api/home_page'
import mapDisplay from '@/components/BaiduMap/display'
// import dangerRank from '@/components/bigScreen/dangerRank'
import inspectionStatistics from '@/components/bigScreen/inspectionStatistics'
import dangerTrend from '@/components/bigScreen/dangerTrend'
import hiddenCount from '@/components/bigScreen/hiddenCount'
import AttendanceManage from './components/attendance_manage'
import vueSeamlessScroll from 'vue-seamless-scroll'
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { parseTime, formatDateTime } from '@/utils/index'
import Swiper from 'swiper'
import 'swiper/swiper-bundle.css'
export default {
  name: 'EduBigScreen',
  components: {
    mapDisplay,
    dangerTrend,
    hiddenCount,
    AttendanceManage,
    inspectionStatistics,
    vueSeamlessScroll
  },
  data() {
    return {
      type: 'hidden',
      openMenuSign: false,
      recordList: [],
      handleObj: {},
      trainObj: {},
      patrolPoint: {},
      date: new Date(),
      timer: {},
      hiddenReportHeight: {},
      hiddenReportScrollHeight: {},
      rightWrapper: {},
      centerWrapper: {},
      mapDisplayHeight: {},
      loadStatus: false,
      completion_rate: []
    }
  },
  computed: {
    ...mapGetters(['orgName']),
    classOption() {
      return {
        step: 0.4,
        limitMoveNum: 3
      }
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.date = new Date() // 修改数据date
    }, 1000)
    this.initializePage()
    this.initHeight()
    this.refreshData()
    // 实现自适应部分
    this.resizefun = () => {
      echarts.init(document.getElementById('hiddenhandle')).resize()
      echarts.init(document.getElementById('drillChart')).resize()
      this.initHeight()
    }
    window.addEventListener('resize', this.resizefun)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
    if (this.updateData) {
      clearInterval(this.updateData)
    }
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  },
  methods: {
    parseTime: parseTime,
    formatDateTime: formatDateTime,
    refreshData() {
      this.updateData = setInterval(() => {
        this.loadStatus = false
        this.initializePage()
      }, 1000 * 60 * 3)
    },
    // 初始化页面
    initializePage() {
      setTimeout(() => {
        this.loadStatus = true
      }, 10)
      this.drawEdudefectChart()
      this.drawEdudrillChart()
      this.getData()
      this.getStatisticTrain()
      this.getStatistic()
    },
    initHeight() {
      this.hiddenReportHeight = {
        height: (window.innerHeight - 144) / 2 + 'px'
      }
      this.hiddenReportScrollHeight = {
        height: (window.innerHeight - 144) / 2 - 57 + 'px'
      }
      this.rightWrapper = {
        height: (window.innerHeight - 168) / 3 + 'px'
      }
      this.mapDisplayHeight = {
        height: ((window.innerHeight - 135) * 2) / 3 + 'px'
      }
      this.centerWrapper = {
        height: (window.innerHeight - 168) / 3 + 'px'
      }
    },
    choiceType(type) {
      this.type = type
      if (this.type === 'hidden') {
        this.refreshData()
        this.drawEdudefectChart()
        this.drawEdudrillChart()
      } else {
        if (this.updateData) {
          clearInterval(this.updateData)
        }
      }
    },
    showMenu: function() {
      this.openMenuSign = !this.openMenuSign
    },

    // 获取隐患实时上报列表数据
    getData() {
      getListeduDanger().then((res) => {
        this.recordList = res.data
      })
    },

    // 隐患处理情况
    drawEdudefectChart() {
      gethandle().then((res) => {
        this.handleObj = res.data
        const myChart = echarts.init(document.getElementById('hiddenhandle'))
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          color: ['#28E094', 'rgba(255,255,255,.1)'],
          graphic: {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: res.data.handle_rate,
              fill: '#28E094',
              fontSize: 24
            }
          },
          series: [
            {
              name: '隐患处理情况',
              type: 'pie',
              radius: ['50%', '80%'],
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
                  value: res.data.all_count - res.data.nohandle_count,
                  name: '已处理',
                  color: 'yellow'
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
      gettrain().then((res) => {
        this.trainObj = res.data
        const myChart = echarts.init(document.getElementById('drillChart'))
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          color: ['#00BFF3', 'rgba(255,255,255,.1)'],
          graphic: {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: res.data.plan_rate,
              fill: '#00BFF3',
              fontSize: 25
            }
          },
          series: [
            {
              name: '应急演练情况',
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
                { value: res.data.plan_school_count, name: '演练学校数量' },
                {
                  value:
                    res.data.plan_school_count /
                      this.toPoint(res.data.plan_rate) -
                    res.data.plan_school_count,
                  name: '无演练学校数量'
                }
              ]
            }
          ]
        })
      })
    },

    // 隐患排查情况
    getStatistic() {
      getStatistic().then((res) => {
        this.patrolPoint = res.data
        this.patrolPoint.rateNum = Number(
          this.patrolPoint.patrol_rate.replace('%', '')
        )
      })
    },

    // 各校巡检完成率排行
    getStatisticTrain() {
      getStatisticTrain().then((res) => {
        res.data.forEach((item) => {
          item.ratio = (item.ratio * 100).toFixed(2)
        })
        this.completion_rate = this.slice_arr(res.data, 5)
        setTimeout(() => {
          new Swiper('.swiper-container', {
            speed: 3000,
            autoplay: true, // 等同于以下设置
            loop: this.completion_rate.length > 1,
            direction: 'horizontal'
          })
        }, 10)
      })
    },

    // 数组等分
    slice_arr(arr, len) {
      var arr_len = arr.length
      var pages = []
      for (let i = 0; i < arr_len; i += len) {
        pages.push(arr.slice(i, len + i))
      }
      return pages
    },

    toPoint(percent) {
      let str = percent.replace('%', '')
      str = str / 100
      return str
    }
  }
}
</script>
<style lang="scss">
.eduBureau-bigscreen {
  .el-progress-bar__inner {
    background: linear-gradient(
      90deg,
      rgba(255, 221, 30, 1),
      rgba(255, 132, 11, 1)
    );
  }
}
.completion_rate_main {
  .el-progress-bar__inner {
    background: linear-gradient(90deg, #0089d8, #46ebff);
    position: relative;
  }
  .el-progress-bar__outer {
    background: rgba(255, 255, 255, 0.2);
  }
  .el-progress__text {
    position: absolute;
    font-size: 16px;
    color: #46ebff;
    right: 0;
    top: 2px;
  }
  .el-progress-bar {
    padding-right: 60px;
  }
}
</style>
<style lang="scss" scoped>
.eduBureau-bigscreen {
  .bigscreen-container {
    .main-content {
      .common-wrapper-right {
        height: 304px;
        .chart-main {
          position: relative;
          width: 100%;
          .text-des {
            position: absolute;
            top: 30px;
            right: 40px;
            .text {
              font-size: 16px;
              color: rgba(255, 255, 255, 0.5);
            }
          }
        }
        .troubleshooting {
          margin-top: 28%;
          position: relative;
          .text {
            position: absolute;
            top: -65px;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-left: -20px;
            .triangle {
              width: 13px;
            }
          }
        }
        .troubleshooting-des {
          display: flex;
          align-items: center;
          position: absolute;
          width: 100%;
          margin-left: -20px;
          bottom: 10%;
          .des-item {
            flex: 5;
            text-align: center;
            display: flex;
            flex-direction: column;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }
}
.completion_rate_main {
  .completion_rate_item {
    position: relative;
    padding-bottom: 6px;
    margin-bottom: 6px;
    .completion_rate_title {
      font-size: 16px;
      margin-bottom: 7px;
    }
    &:last-of-type {
      margin-bottom: 0;
    }
  }
}
@media screen and (min-width: 1300px) and (max-width: 1500px) {
  .report-bottom {
    font-size: 12px !important;
  }
  .report-content {
    padding: 0 10px !important;
  }
}
</style>
