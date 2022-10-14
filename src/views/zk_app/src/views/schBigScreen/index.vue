<template>
  <div class="sch-bigscreen bigscreen-main">
    <div class="bigscreen-menu" :class="{ openmenuwidth: openMenuSign }">
      <div v-if="openMenuSign">
        <img src="../../assets/images/big-screen-logo.png" alt class="logo">
        <div class="menu-wrapper">
          <div class="item-wrapper">
            <img
              src="../../assets/images/security-situation.png"
              alt
              class="image"
            >
            <span>安全态势</span>
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
        <div class="title">{{ orgName }}安全防控指挥平台</div>
        <div class="date">{{ parseTime(date, "{y}-{m}-{d} {h}:{i}") }}</div>
      </div>
      <div class="main-content">
        <el-row :gutter="24">
          <el-col :span="setLayout[0]">
            <div
              class="schscreen-main-wrapper common-wrapper-right common-wrapper"
              :style="screenStyle"
            >
              <div
                v-for="(item, index) in patrol_point"
                :key="index"
                class="item-wrapper"
              >
                <div class="schtb-common">
                  <div style="position: relative" class="schtb-common-child">
                    <img
                      src="../../assets/images/dp_xcd.png"
                      alt
                      class="image"
                    >
                    {{ item.scmo_name }}
                  </div>
                  <div class="schtb-main-right">
                    <div class="schtb-wrapper-top">
                      <div class="left">
                        <el-progress
                          :show-text="false"
                          :stroke-width="6"
                          :percentage="item.rateNum ? Number(item.rateNum) : 0"
                          color="#FDE35B"
                          class="schtb-progress"
                          style="transform: rotate(-90deg); width: 85px"
                        />
                      </div>
                      <div class="right">
                        <div class="right-top-text">
                          <span class="num spp-font color2">{{
                            item.has_checked
                          }}</span>
                          <span>{{
                            item.scmo_name === "隐患处理" ? "未处理" : "已巡查"
                          }}</span>
                        </div>
                        <div class="right-bottom-text">
                          <span class="num spp-font color1">{{
                            item.need_check
                          }}</span>
                          <span>{{
                            item.scmo_name === "隐患处理" ? "总隐患" : "需巡查"
                          }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="schtb-wrapper-bottom">
                      <span>
                        处理率:
                        <span class="color3">{{ item.rateNum }}%</span>
                      </span>
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
            <!-- 巡检记录 -->
            <div
              class="common-wrapper-right common-wrapper"
              :style="patrolHeight"
            >
              <div class="title">巡检记录</div>
              <el-scrollbar
                v-if="recordList.length > 0"
                class="patrol-record-list small-scrollbar"
                :style="patrolScrollHeight"
              >
                <vue-seamless-scroll
                  v-if="loadStatus"
                  :data="recordList"
                  :class-option="classOption"
                >
                  <div
                    v-for="(item, index) in recordList"
                    :key="index"
                    class="patrol-record-item"
                  >
                    <div class="record-item-common record-item-top">
                      <div class="left">
                        <img
                          class="avatardefault"
                          src="../../assets/images/avatardefault.png"
                          alt
                        >
                        <span class="name">{{ item.user_name }}</span>
                      </div>
                      <div class="time">{{ item.create_time | fgTime }}</div>
                    </div>
                    <div class="record-item-common record-item-bottom">
                      <div class="left">{{ item.patrol_name }}</div>
                      <div
                        v-if="item.patrol_status === '1'"
                        class="status normal"
                      >
                        正常
                      </div>
                      <div
                        v-if="item.patrol_status === '0'"
                        class="status abnormal"
                      >
                        异常
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
          <el-col :span="setLayout[1]">
            <div :style="threeviewHeight" class="threeviewdisplay">
              <plan-img :height="threeHight" :url="url" />
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
              <div class="common-wrapper-right common-wrapper">
                <div class="title">隐患数据统计</div>
                <dangerTrend v-if="loadStatus" :type="2" />
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
              <div class="common-wrapper-right common-wrapper">
                <div class="title">风险构成</div>
                <div class="risk-constitution">
                  <div class="left-constitution">
                    <div id="riskProfileChart" style="height: 240px" />
                  </div>
                  <div v-if="!pajx" class="right-constitution">
                    <div
                      v-for="(item, index) in chartLsit"
                      :key="index"
                      class="des-item"
                    >
                      <div class="left">
                        <div class="sign" :style="{ background: item.color }" />
                        <div class="text">{{ item.title }}</div>
                      </div>
                      <div class="right">{{ item.rate }}</div>
                    </div>
                  </div>
                  <div v-else class="right-constitution small-screen">
                    <div
                      v-for="(item, index) in chartLsit"
                      :key="index"
                      class="des-item"
                    >
                      <div class="left">
                        <div class="sign" :style="{ background: item.color }" />
                        <div class="text" style="font-size: 12px">
                          {{ item.title }}
                        </div>
                      </div>
                      <div class="right" style="font-size: 12px">
                        {{ item.rate }}
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
          </el-col>
          <el-col :span="setLayout[2]">
            <dangerRank v-if="loadStatus" />
            <div
              class="hidden-report common-wrapper"
              :style="hiddenReportHeight"
            >
              <div class="title">隐患列表</div>
              <el-scrollbar
                v-if="hiddenList.length > 0"
                class="report-list small-scrollbar"
                :style="hiddenReportScrollHeight"
              >
                <vue-seamless-scroll
                  v-if="loadStatus"
                  :data="hiddenList"
                  :class-option="hiddenOption"
                >
                  <div
                    v-for="(item, index) in hiddenList"
                    :key="index"
                    class="report-item"
                  >
                    <div class="time">
                      <span>{{ formatDateTime(item.create_time) }}</span>
                    </div>
                    <div class="report-content">
                      <div class="report-title">
                        <span>{{ item.create_user_name }}</span>
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
                          class="left left_pos"
                          style="color: rgba(255, 255, 255, 0.5)"
                        >隐患位置：</span>
                        <span
                          class="hd_position multiple-hidden"
                          style="-webkit-line-clamp: 2"
                        >{{ item.hd_position }}</span>
                      </div>
                      <div class="report-bottom">
                        <div class="item-bottom">
                          <span class="left">隐患等级：</span>
                          <span
                            v-if="item.hd_level === '1'"
                            class="right yiban"
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
          <!--<el-col v-if="pajx" :span="setLayout[3]">
            <div
              class="common-wrapper-right common-wrapper attendance-statistics"
            >
              <div class="title">考勤统计</div>
              <div class="attendance-content">
                <div class="statistics-wrapper">
                  <div class="statistics-top">
                    <img
                      src="../../assets/images/have_attendance.png"
                      alt
                      class="statistics-img"
                    >
                    <div class="num-content">
                      <span class="statistics-title">已考勤(人)</span>
                      <span
                        class="statistics-num spp-font"
                        style="color: #4dcd70"
                      >{{ attendanceObj.att_count }}</span>
                    </div>
                  </div>
                  <div class="statistics-top">
                    <img
                      src="../../assets/images/live_in.png"
                      alt
                      class="statistics-img"
                    >
                    <div class="num-content">
                      <span class="statistics-title">住校(人)</span>
                      <span class="statistics-num spp-font">{{
                        attendanceObj.dorm_count
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="statistics-wrapper">
                  <div class="statistics-top">
                    <img
                      src="../../assets/images/no_attendance.png"
                      alt
                      class="statistics-img"
                    >
                    <div class="num-content">
                      <span class="statistics-title">未考勤(人)</span>
                      <span
                        class="statistics-num spp-font"
                        style="color: #ff8a65"
                      >{{ attendanceObj.no_att }}</span>
                    </div>
                  </div>
                  <div class="statistics-top">
                    <img
                      src="../../assets/images/day_read.png"
                      alt
                      class="statistics-img"
                    >
                    <div class="num-content">
                      <span class="statistics-title">走读(人)</span>
                      <span class="statistics-num spp-font">{{
                        attendanceObj.gate_count
                      }}</span>
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
            <realtimeAttendance />
          </el-col>-->
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import {
  gethandle,
  getPatrolreport,
  getRiskpointRank,
  getAttPreview,
  getSchoolScmo,
  getStatistic,
  getStatisticsPatrolType
} from '@/api/home_page'
import { paginate } from '@/api/government'
import { getSchoolModel } from '@/api/risk_map'
import echarts from 'echarts'
import dangerRank from '@/components/bigScreen/dangerRank'
import dangerTrend from '@/components/bigScreen/dangerTrend'
import PlanImg from '@/components/Threeview/plan_img'
import { parseTime, formatDateTime } from '@/utils/index'
import { mapGetters } from 'vuex'
import vueSeamlessScroll from 'vue-seamless-scroll'
export default {
  name: 'SchBigScreen',
  components: {
    dangerRank,
    dangerTrend,
    vueSeamlessScroll,
    PlanImg
  },
  data() {
    return {
      openMenuSign: false,
      recordList: [],
      date: new Date(),
      timer: {},
      chartLsit: [],
      hiddenList: [],
      three_id: 'index_three',
      url: '',
      patrolHeight: {},
      patrolScrollHeight: {},
      threeviewHeight: {},
      threeHight: '',
      hiddenReportHeight: {},
      hiddenReportScrollHeight: {},
      pajx: false,
      setLayout: [6, 12, 6],
      screenStyle: {},
      attendanceObj: {},
      loadStatus: false,
      patrol_point: []
    }
  },
  computed: {
    ...mapGetters(['orgName', 'functionList']),
    classOption() {
      return {
        step: 0.4
      }
    },
    hiddenOption() {
      return {
        step: 0.4,
        limitMoveNum: 3
      }
    }
  },
  created() {
    if (
      this.functionList.includes('A46001') ||
      this.functionList.includes('A47001')
    ) {
      this.pajx = true
      this.setLayout = [6, 12, 6, 5]
      // this.getAttPreview()
    }
    this.initializePage()
    this.initHeight()
    this.timer = setInterval(() => {
      this.date = new Date() // 修改数据date
    }, 1000)
    // 实现自适应部分
    this.resizefun = () => {
      echarts.init(document.getElementById('riskProfileChart')).resize()
      this.initHeight()
    }
    this.updateData = setInterval(() => {
      this.loadStatus = false
      this.refreshRequire()
      if (this.pajx) {
        // this.getAttPreview()
      }
    }, 1000 * 60 * 3)
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
    // 初始化页面
    initializePage() {
      this.refreshRequire()
      this.getSchoolModel()
    },
    // 需要刷新的数据
    refreshRequire() {
      this.getSchoolScmo()
      this.getRiskpointRank()
      this.getPatrolreport()
      this.getHiddenList()
    },
    initHeight() {
      this.patrolHeight = {
        height: window.innerHeight - 444 + 'px',
        'margin-top': '20px'
      }
      this.patrolScrollHeight = {
        height: window.innerHeight - 490 + 'px'
      }
      this.threeviewHeight = {
        height: window.innerHeight - 448 + 'px'
      }
      this.threeHight = window.innerHeight - 448
      this.hiddenReportHeight = {
        height: (window.innerHeight - 144) / 2 + 'px'
      }
      this.hiddenReportScrollHeight = {
        height: (window.innerHeight - 144) / 2 - 57 + 'px'
      }
      if (this.pajx) {
        if (window.innerWidth < 1400 && window.innerWidth >= 1300) {
          this.screenStyle = {
            padding: 0,
            'padding-left': '3px'
          }
        }
      }
    },

    // 获取考勤统计信息
    getAttPreview() {
      getAttPreview().then((res) => {
        this.attendanceObj = res.data.pajx_result.data
      })
    },

    // 获取巡查点统计信息
    getSchoolScmo() {
      this.patrol_point = []
      getSchoolScmo().then((res) => {
        if (res.data.length > 0) {
          res.data.forEach((item, index) => {
            if (index < 4) {
              this.patrol_point.push({
                scmo_name: item.scmo_name
              })
              if (item.scmo_code === '99997') {
                this.getStatistic(1, index)
              } else if (item.scmo_code === '99998') {
                this.getStatistic(2, index)
              } else if (item.scmo_code === '99999') {
                this.getStatistic(3, index)
              } else if (item.scmo_code === '99996') {
                this.gethandle(index)
              } else {
                this.getStatisticsPatrolType(item.scmo_code, index)
              }
            }
          })
        } else {
          this.patrol_point = [
            {
              scmo_name: '隐患处理'
            },
            {
              scmo_name: '日巡检'
            },
            {
              scmo_name: '周巡检'
            },
            {
              scmo_name: '月巡检'
            }
          ]
          this.gethandle(0)
          this.getStatistic(1, 1)
          this.getStatistic(2, 2)
          this.getStatistic(3, 3)
        }
      })
    },

    getStatisticsPatrolType(scmo_code, index) {
      getStatisticsPatrolType(scmo_code).then((res) => {
        if (res.data.need_check === 0 || res.data.need_check === '0') {
          res.data.rateNum = '0.00'
        } else {
          res.data.rateNum = (
            (res.data.has_checked / res.data.need_check) *
            100
          ).toFixed(2)
        }
        Object.assign(this.patrol_point[index], res.data)
      })
    },

    // 巡检点巡查统计
    getStatistic(id, index) {
      getStatistic(id).then((res) => {
        res.data.has_checked = res.data.dp_count
        res.data.need_check = res.data.all_count
        if (res.data.need_check === 0 || res.data.need_check === '0') {
          res.data.rateNum = '0.00'
        } else {
          res.data.rateNum = (
            (res.data.has_checked / res.data.need_check) *
            100
          ).toFixed(2)
        }

        Object.assign(this.patrol_point[index], res.data)
      })
    },

    // 隐患处理统计
    gethandle(index) {
      gethandle().then((res) => {
        res.data.has_checked = res.data.nohandle_count
        res.data.need_check = res.data.all_count
        res.data.rateNum = parseFloat(res.data.handle_rate)
        Object.assign(this.patrol_point[index], res.data)
      })
    },

    getSchoolModel: function() {
      getSchoolModel().then((response) => {
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
    showMenu: function() {
      this.openMenuSign = !this.openMenuSign
    },

    // 获取巡检记录列表数据
    getPatrolreport() {
      getPatrolreport().then((res) => {
        this.loadStatus = true
        this.recordList = res.data
      })
    },

    // 获取隐患列表数据
    getHiddenList() {
      paginate('', '', '', '', '', '', 1, 10).then((res) => {
        this.loadStatus = true
        this.hiddenList = res.data.list
      })
    },

    getRiskpointRank() {
      getRiskpointRank().then((res) => {
        this.chartLsit = [
          {
            title: '一级风险',
            count: res.data.one_count,
            rate: res.data.one_rank_rate,
            color: '#FF7171'
          },
          {
            title: '二级风险',
            count: res.data.two_count,
            rate: res.data.two_rank_rate,
            color: '#FF8854'
          },
          {
            title: '三级风险',
            count: res.data.three_count,
            rate: res.data.three_rank_rate,
            color: '#CCB143'
          },
          {
            title: '四级风险',
            count: res.data.four_count,
            rate: res.data.four_rank_rate,
            color: '#54D1FF'
          }
        ]
        const myChart = echarts.init(
          document.getElementById('riskProfileChart')
        )
        myChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
            position: ['40%', '50%']
          },
          color: ['#FF7171', '#FF8854', '#CCB143', '#54D1FF'],
          series: [
            {
              name: '风险构成',
              type: 'pie',
              radius: ['50%', '80%'],
              center: ['50%', '50%'],
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
    }
  }
}
</script>
<style lang="scss" scoped>
.sch-bigscreen {
  .bigscreen-container {
    .main-content {
      .threeviewdisplay {
        position: relative;
        width: 100%;
        &:after {
          content: url("../../assets/images/top-left.png");
          position: absolute;
          top: 0;
          left: 0;
        }
        &:before {
          content: url("../../assets/images/top-right.png");
          position: absolute;
          top: 0;
          right: 0;
          z-index: 100;
        }
        .bottom-left {
          position: absolute;
          bottom: 0;
          left: 0;
        }
        .bottom-right {
          position: absolute;
          bottom: 0;
          right: 0;
        }
      }
      .small-scrollbar {
        overflow-y: auto;
      }
      .common-wrapper-right {
        height: 304px;
        overflow: hidden;
        .patrol-record-list {
          margin-top: 5px;
          .patrol-record-item {
            height: 106px;
            background: rgba(22, 241, 255, 0.1);
            padding: 10px 0;
            margin-bottom: 20px;
            border: 1px solid rgba(22, 241, 255, 0.5);
            border-radius: 4px;
            .record-item-common {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 0 20px;
              height: 43px;
            }
            .record-item-top {
              color: rgba(255, 255, 255, 0.5);
              .left {
                display: flex;
                align-items: center;
                .avatardefault {
                  width: 29px;
                }
                .name {
                  font-size: 16px;
                  margin-left: 10px;
                }
              }
              .time {
                font-size: 14px;
              }
            }
            .record-item-bottom {
              .left {
                font-size: 18px;
              }
              .status {
                width: 50px;
                height: 20px;
                border-radius: 2px;
                font-size: 12px;
                text-align: center;
                line-height: 20px;
              }
              .normal {
                background: #4dcd70;
              }
              .abnormal {
                background: #f15f5f;
              }
            }
          }
        }
        .risk-constitution {
          width: calc(100% + 40px);
          margin-left: -20px;
          height: 221px;
          display: flex;
          .left-constitution,
          .right-constitution {
            flex: 5;
          }
          .right-constitution {
            font-size: 14px;
            color: #ffffff;
            margin-right: 30px;
            padding: 40px 0;
            .des-item {
              display: flex;
              align-items: center;
              justify-content: space-between;
              line-height: 40px;
              .left {
                display: flex;
                align-items: center;
                .sign {
                  width: 12px;
                  height: 12px;
                  border-radius: 4px;
                  margin-right: 10px;
                }
              }
            }
          }
          .small-screen {
            margin-right: 8px;
          }
        }
      }
      .schscreen-main-wrapper {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .item-wrapper {
          height: 144px;
          width: 50%;
          &:nth-child(1),
          &:nth-child(2) {
            border-bottom: 1px solid rgba(107, 246, 255, 0.1);
          }
          .schtb-common {
            height: 112px;
            margin: 16px 0;
            display: flex;
            .color1 {
              color: #ffffff;
            }
            .color2 {
              color: #fde35b;
            }
            .color3 {
              color: #6bf6ff;
            }
            .schtb-wrapper-top {
              display: flex;
              .left {
                font-size: 12px;
                position: relative;
                width: 27px;
                .schtb-progress {
                  position: absolute;
                  left: -30px;
                  top: 45px;
                }
              }
              .right {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.5);
                .num {
                  font-size: 24px;
                }
              }
            }
            .right-top-text,
            .right-bottom-text,
            .schtb-main-right {
              display: flex;
              flex-direction: column;
            }
            .schtb-wrapper-bottom {
              margin-top: 6px;
              margin-left: 8px;
              font-size: 12px;
            }
            .right-top-text {
              margin-top: 3px;
            }
            .right-bottom-text {
              margin-top: 8px;
            }
          }
        }
      }
    }
    .attendance-statistics {
      .attendance-content {
        padding: 2rem 0;
        display: flex;
        .statistics-wrapper {
          flex: 5;
          display: flex;
          flex-direction: column;
          position: relative;
          .statistics-top {
            display: flex;
            align-items: center;
            color: #68d6ff;
            .statistics-img {
              width: 2.5rem;
            }
            .num-content {
              display: flex;
              flex-direction: column;
              margin-left: 0.5rem;
            }
            .statistics-title {
              font-size: 0.8rem;
              color: rgba(255, 255, 255, 0.5);
            }
            .statistics-num {
              font-size: 1.5rem;
            }
            &:first-of-type {
              padding-bottom: 1rem;
            }
            &:last-of-type {
              padding-top: 1rem;
            }
          }
          &:first-of-type {
            border-right: 1px solid rgba(107, 246, 255, 0.1);
            padding-right: 0.5rem;
          }
          &:last-of-type {
            padding-left: 0.5rem;
          }
          &:before {
            content: "";
            width: 100%;
            height: 1px;
            background: rgba(107, 246, 255, 1);
            opacity: 0.1;
            position: absolute;
            top: 50%;
            margin: auto;
            left: 0;
          }
        }
      }
    }
  }
}
.schtb-common-child {
  width: 57px;
  height: 112px;
  position: relative;
  text-align: center;
  writing-mode: vertical-lr; /*从左向右 从右向左是 writing-mode: vertical-rl;*/
  writing-mode: tb-lr; /*IE浏览器的从左向右 从右向左是 writing-mode: tb-rl；*/
  display: flex;
  flex-direction: column;
  justify-content: center;
  letter-spacing: 2px;
  .image {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
@media screen and (min-width: 1300px) and (max-width: 1500px) {
  .schtb-common-child {
    width: 38px;
    height: 90px;
    position: absolute;
    top: 50%;
    margin-top: -45px;
  }
}
@media screen and (min-width: 1300px) and (max-width: 1500px) {
  .report-bottom {
    font-size: 12px !important;
    .left_pos {
      width: 60px !important;
    }
    .hd_position {
      width: calc(100% - 60px) !important;
    }
  }
  .report-content {
    padding: 0 10px !important;
  }
}
@media screen and (min-width: 1300px) and (max-width: 1400px) {
  .common-wrapper-right {
    .small-screen {
      margin-right: 0 !important;
    }
  }
}
</style>
