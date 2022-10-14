<template>
  <div class="realtimeattendance-main common-wrapper-right common-wrapper" :style="height">
    <div class="title">实时考勤</div>
    <el-scrollbar
      v-if="realtimeList.length>0"
      class="small-scrollbar list-wrapper"
      :style="scrollHeight"
    >
      <vue-seamless-scroll v-if="loadStatus" :data="realtimeList" :class-option="classOption">
        <el-timeline>
          <el-timeline-item v-for="(item, index) in realtimeList" :key="index">
            <img
              v-show="item.inout_type === '0'"
              src="../../../assets/images/adopt.png"
              alt
              class="image"
            >
            <img
              v-show="item.inout_type === '1'"
              src="../../../assets/images/get-sch.png"
              alt
              class="image"
            >
            <img
              v-show="item.inout_type === '2'"
              src="../../../assets/images/exit-sch.png"
              alt
              class="image"
            >
            <div class="content">
              <div class="time">{{ item.att_time }}</div>
              <div class="detail">
                <img
                  v-if="item.pic"
                  :src="VUE_APP_PAJX_IMG_URL + item.pic.split(',')[0]"
                  alt
                  class="img"
                >
                <img v-if="item.avatar && !item.pic" :src="item.avatar" alt class="img">
                <img
                  v-if="!item.avatar && !item.pic"
                  src="../../../assets/images/attendance_avatardefault.png"
                  alt
                  class="img"
                >

                <div class="text">
                  <div class="top">
                    <span class="name">({{ item.cls_show_name }}){{ item.stu_name }}</span>
                  </div>
                  <div class="center">
                    <span v-show="item.inout_type === '0'">通过</span>
                    <span v-show="item.inout_type === '1'">进</span>
                    <span v-show="item.inout_type === '2'">出</span>
                    <span v-show="item.att_type === '0'">校门</span>
                    <span v-show="item.att_type === '1'">宿舍</span>
                  </div>
                  <div class="bottom">
                    <span>体温：</span>
                    <span v-if="item.temperature&&item.temperature!=='0'&&item.temperature!=='0.0'" class="temperature">
                      {{ item.temperature }}
                      &#176;
                    </span>
                    <span v-else>---</span>
                  </div>
                </div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </vue-seamless-scroll>
    </el-scrollbar>
    <div v-else class="spp-no-content">
      <div class="content">
        <img src="../../../assets/images/no-content.png" alt class="not-found">
        <div class="text">暂无内容</div>
      </div>
    </div>
    <img class="bottom-left" src="../../../assets/images/bottom-left.png" alt>
    <img class="bottom-right" src="../../../assets/images/bottom-right.png" alt>
  </div>
</template>

<script>
import { getAttRealtime } from '@/api/home_page'
import vueSeamlessScroll from 'vue-seamless-scroll'
export default {
  name: 'RealTimeAttendance',
  components: {
    vueSeamlessScroll
  },
  props: {},
  data() {
    return {
      height: {},
      scrollHeight: {},
      VUE_APP_PAJX_IMG_URL: process.env.VUE_APP_PAJX_IMG_URL,
      realtimeList: [],
      loadStatus: false
    }
  },
  computed: {
    classOption() {
      return {
        step: 0.4
      }
    }
  },
  mounted() {
    this.initHeight()
    this.getAttRealtime()
    // 实现自适应部分
    this.resizefun = () => {
      this.initHeight()
    }
    this.updateData = setInterval(() => {
      this.loadStatus = false
      this.getAttRealtime()
    }, 1000 * 60 * 3)
    window.addEventListener('resize', this.resizefun)
  },
  beforeDestroy() {
    if (this.updateData) {
      clearInterval(this.updateData)
    }
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  },
  methods: {
    initHeight() {
      this.height = {
        height: window.innerHeight - 448 + 'px'
      }
      this.scrollHeight = {
        height: window.innerHeight - 495 + 'px'
      }
    },
    getAttRealtime() {
      getAttRealtime().then(res => {
        this.loadStatus = true
        this.realtimeList = res.data.pajx_result.data
        this.realtimeList.forEach(item => {
          item.att_time =
            item.att_time.substring(8, 10) +
            ':' +
            item.att_time.substring(10, 12) +
            ':' +
            item.att_time.substring(12, 14)
        })
      })
    }
  }
}
</script>
<style scoped lang='scss'>
.realtimeattendance-main {
  margin-top: 24px;
  .list-wrapper {
    padding: 10px 0 15px 5px;
    .image {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1000;
    }
    .content {
      margin-left: 10px;
      margin-top: 5px;
      .time {
        font-size: 14px;
        color: #ffffff;
      }
      .detail {
        margin: 10px 0;
        height: 80px;
        width: 100%;
        background: rgba(214, 214, 214, 0);
        border: 1px solid rgba(22, 241, 255, 0.5);
        border-radius: 4px;
        padding: 5px;
        display: flex;
        align-items: center;
        .img {
          width: 64px;
          height: 64px;
        }
        .image {
          background-size: cover;
          background-repeat: no-repeat;
        }
        .text {
          color: #ffffff;
          padding-left: 10px;
          line-height: 20px;
          .name {
            color: #16f1ff;
          }
          .temperature {
            color: #ff8a65;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1300px) and (max-width: 1600px) {
  .realtimeattendance-main {
    .list-wrapper {
      .detail {
        font-size: 12px;
      }
    }
  }
}
</style>
<style lang="scss">
.realtimeattendance-main {
  .el-timeline-item__node--normal {
    display: none;
  }
  .el-timeline-item__tail {
    border-left: 1px dashed rgba(255, 255, 255, 0.3);
    left: 13px;
  }
  .el-timeline-item {
    padding-bottom: 3px;
  }
}
</style>
