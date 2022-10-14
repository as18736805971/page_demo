<template>
  <div class="daily-attendance-main">
    <div class="attendance common-wrapper" :style="attendanceHeight">
      <div class="title">日考勤排行</div>
      <div v-if="schList.length > 0" class="rank-list">
        <div class="list-item list-title">
          <div class="ranking">排名</div>
          <div class="school-name">学校名称</div>
          <div class="num">考勤率</div>
        </div>
        <el-scrollbar class="small-scrollbar" :style="scrollHeight">
          <div v-for="(item, index) in schList" :key="index" class="list-item">
            <div class="ranking">
              <span
                class="index"
                :class="{'firstitem':index === 0, 'seconditem':index===1, 'thirditem': index===2}"
              >{{ index+1 }}</span>
            </div>
            <div class="school-name single-hidden">{{ item.scl_name }}</div>
            <div class="num">{{ item.att_stu_rate }}</div>
          </div>
        </el-scrollbar>
      </div>
      <div v-else class="spp-no-content">
        <div class="content">
          <img src="../../../assets/images/no-content.png" alt class="not-found">
          <div class="text">暂无内容</div>
        </div>
      </div>
      <img class="bottom-left" src="../../../assets/images/bottom-left.png" alt>
      <img class="bottom-right" src="../../../assets/images/bottom-right.png" alt>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DailyAttendance',
  props: {
    schList: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      attendanceHeight: {},
      scrollHeight: {}
    }
  },
  mounted() {
    this.initHeight()
    this.resizefun = () => {
      this.initHeight()
    }
    window.addEventListener('resize', this.resizefun)
    this.schList.sort((a, b) => {
      return parseFloat(b.att_stu_rate) - parseFloat(a.att_stu_rate)
    })
  },
  // 移除事件监听
  beforeDestroy() {
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  },
  methods: {
    initHeight() {
      this.attendanceHeight = {
        height: window.innerHeight - 448 + 'px'
      }
      this.scrollHeight = {
        height: window.innerHeight - 549 + 'px'
      }
    }
  }
}
</script>
<style scoped lang='scss'>
.daily-attendance-main {
  .attendance {
    height: 632px;
    .rank-list {
      font-size: 14px;
      .small-scrollbar {
        overflow-y: auto;
      }
      .list-item {
        display: flex;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        height: 54px;
        align-items: center;
        .ranking {
          width: 50px;
        }
        .index {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: inline-block;
          text-align: center;
          line-height: 26px;
        }
        .firstitem {
          background: rgba(255, 141, 79, 1);
          color: #ffffff;
        }
        .seconditem {
          background: rgba(255, 183, 28, 1);
          color: #ffffff;
        }
        .thirditem {
          background: rgba(0, 191, 243, 1);
          color: #ffffff;
        }
        .school-name {
          width: calc(100% - 100px);
        }
        .num {
          width: 70px;
          text-align: center;
        }
      }
      .list-title {
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}
</style>
