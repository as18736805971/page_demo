<template>
  <div class="centercolumn-main">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="center-list">
          <homeHeader title="隐患" :type="2" @getDate="getDate" />
          <div class="des-wrapper">
            <div class="title">今日上报隐患</div>
            <div class="des">
              <span class="left spp-font">{{ danger.today_count }}</span>
              <img src="../../../../assets/images/hidden_danger.png" alt>
            </div>
          </div>
          <div class="bottom-column">
            <span>隐患日同比：</span>
            <span>{{ danger.up_count }}个</span>
            <img
              v-show="danger.up_count>0"
              src="../../../../assets/images/rise.png"
              alt
              class="image"
            >
            <img
              v-show="danger.up_count<0"
              src="../../../../assets/images/decline.png"
              alt
              class="image"
            >
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="center-list">
          <homeHeader title="巡查点" :type="2" @getDate="getDate" />
          <div class="des-wrapper">
            <div class="title">今日已巡查/需巡查</div>
            <div class="des">
              <span class="left">
                <span class="patrol-molecule spp-font">{{ patrolPoint.dp_count }}</span>
                <span class="denominator spp-font">/{{ patrolPoint.all_count }}</span>
              </span>
              <img src="../../../../assets/images/patrol_point.png" alt>
            </div>
          </div>
          <div class="bottom-column">
            <span>完成率：</span>
            <span>{{ patrolPoint.patrol_rate }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="center-list">
          <homeHeader title="隐患处理" :type="4" />
          <div class="des-wrapper">
            <div class="title">未处理/总隐患</div>
            <div class="des">
              <span class="left">
                <span class="defect-molecule spp-font">{{ handle.nohandle_count }}</span>
                <span class="denominator spp-font">/{{ handle.all_count }}</span>
              </span>
              <img src="../../../../assets/images/defect_treat.png" alt>
            </div>
          </div>
          <div class="bottom-column">
            <span>处理率：</span>
            <span>{{ handle.handle_rate }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="center-list">
          <homeHeader title="园区人数" :type="4" />
          <div class="des-wrapper">
            <div class="title">园区成员总数</div>
            <div class="des">
              <span class="left visitor spp-font">{{ sclInfo.scl_tea_num + sclInfo.scl_stu_num }}</span>
              <img src="../../../../assets/images/visitor.png" alt>
            </div>
          </div>
          <div class="bottom-column">
            <span>管理人员：</span>
            <span>{{ sclInfo.scl_tea_num }}</span>
            <span style="margin-left: 30px">园区成员：</span>
            <span>{{ sclInfo.scl_stu_num }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import homeHeader from './homeHeader'
import { gethandle, getStatistic, getDangerToday } from '@/api/home_page'
import { getSclInfo } from '@/api/school'
export default {
  name: 'CenterColumn',
  components: { homeHeader },
  props: {},
  data() {
    return {
      date: '',
      danger: {}, // 上报隐患统计
      patrolPoint: {}, // 巡查点统计
      handle: {}, // 隐患处理
      sclInfo: {}
    }
  },
  created() {
    this.getDangerToday()
    this.getStatistic()
    this.gethandle()
    this.getSclInfo()
  },
  methods: {
    // 今日上报隐患统计
    getDangerToday() {
      getDangerToday(this.date).then(res => {
        this.danger = res.data
      })
    },

    // 巡检点巡查统计
    getStatistic() {
      getStatistic(this.date).then(res => {
        this.patrolPoint = res.data
      })
    },

    // 隐患处理统计
    gethandle() {
      gethandle().then(res => {
        this.handle = res.data
      })
    },

    // 师生数量统计
    getSclInfo() {
      getSclInfo().then(res => {
        this.sclInfo = res.data
      })
    },

    // 获取子组件传来的时间
    getDate(value) {
      this.date = value.date
      switch (value.title) {
        case '巡查点':
          this.getStatistic()
          break
        case '隐患':
          this.getDangerToday()
          break
      }
    }
  }
}
</script>
<style scoped lang='scss'>
.centercolumn-main {
  .center-list {
    width: 100%;
    height: 200px;
    background: #ffffff;
    border-radius: 4px;
    margin: 20px 0;
    .des-wrapper {
      padding: 15px 16px 0 16px;
      .title {
        color: #626466;
        font-size: 14px;
      }
      .des {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #ebf0f5;
        .left {
          font-size: 40px;
          color: #ff8a65;
          .patrol-molecule {
            color: #4dcd70;
          }
          .denominator {
            color: #313233;
            font-size: 24px;
          }
          .defect-molecule {
            color: #7986cb;
          }
        }
        .visitor {
          color: #ffca28;
        }
      }
    }
    .bottom-column {
      padding: 0 16px;
      height: 48px;
      line-height: 48px;
      font-size: 14px;
      color: #626466;
      .image {
        position: relative;
        top: -2px;
      }
    }
  }
}
</style>
