<template>
  <div class="attendance-detail">
    <div class="detail-title">
      <div class="avatardefault">
        <img src="../../../assets/images/avatardefault.png" alt class="image">
      </div>
      <div class="detail">
        <div class="name">{{ detailObj.stu_name }}</div>
        <div class="des">
          <div v-if="type===1" class="item-wrapper">
            <span class="title">年级：</span>
            <span>{{ detailObj.gra_name }}年级</span>
          </div>
          <div v-if="type===1" class="item-wrapper">
            <span class="title">班级：</span>
            <span>{{ detailObj.cls_name }}</span>
          </div>
          <div v-if="type===2" class="item-wrapper">
            <span class="title">宿舍楼：</span>
            <span>{{ detailObj.bld_show_name }}</span>
          </div>
          <div v-if="type===2" class="item-wrapper">
            <span class="title">房间：</span>
            <span>{{ detailObj.dor_show_name }}</span>
          </div>
          <div class="item-wrapper">
            <span class="title">卡号：</span>
            <span>{{ detailObj.stu_no }}</span>
          </div>
        </div>
      </div>
    </div>
    <el-scrollbar class="detail-main">
      <div v-for="(item, index) in detailData" :key="index" class="detail-timeline">
        <div class="detail-time">{{ item.time }}</div>
        <el-timeline>
          <el-timeline-item v-for="(opt, key) in item.records" :key="key" color="#3399FF">
            <div class="info">
              <div class="left">
                <img
                  v-show="opt.inout_type === '0'"
                  src="../../../assets/images/adopt.png"
                  alt
                  class="image"
                >
                <img
                  v-show="opt.inout_type === '2'"
                  src="../../../assets/images/exit-sch.png"
                  alt
                  class="image"
                >
                <img
                  v-show="opt.inout_type === '1'"
                  src="../../../assets/images/get-sch.png"
                  alt
                  class="image"
                >
              </div>
              <div class="right">
                <span class="text">
                  <span v-show="opt.inout_type === '0'" class="get-into">通过</span>
                  <span v-show="opt.inout_type === '1'" class="get-into">进入</span>
                  <span v-show="opt.inout_type === '2'" class="exit">出</span>
                  <span v-if="type===1">校门</span>
                  <span v-if="type===2">宿舍</span>
                </span>
                <span class="num">
                  <span v-if="opt.temperature && opt.temperature!=='0' && opt.temperature!=='0.0'">温度：{{ opt.temperature }}&#176;</span>
                  <span v-if="opt.face_match_ratio">识别率：{{ opt.face_match_ratio }}</span>
                </span>
              </div>
            </div>
            <div class="photo">
              <img v-if="opt.face_pic" :src="VUE_APP_PAJX_IMG_URL + opt.face_pic" alt class="img" @click="seePic(VUE_APP_PAJX_IMG_URL + opt.face_pic)">
              <img v-if="opt.snap_pic" :src="VUE_APP_PAJX_IMG_URL + opt.snap_pic" alt class="img" @click="seePic(VUE_APP_PAJX_IMG_URL + opt.snap_pic)">
            </div>
            <span class="time">{{ opt.att_specific_time }}</span>
          </el-timeline-item>
        </el-timeline>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page_num"
        :limit.sync="page_size"
        @pagination="getDetail"
      />
    </el-scrollbar>
    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[pic_url]" />
  </div>
</template>
<script>
import { stuDetail } from '@/api/campus_attendance'
import { uniqueArr } from '@/utils'
import Pagination from '@/components/Pagination'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  components: { Pagination, ElImageViewer },
  props: {
    detailObj: {
      type: Object,
      required: true
    },
    choiceTime: {
      type: Object,
      required: true
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      detailData: [],
      page_num: 1,
      page_size: 10,
      total: 0,
      VUE_APP_PAJX_IMG_URL: process.env.VUE_APP_PAJX_IMG_URL,
      showViewer: false,
      pic_url: ''
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      stuDetail(
        this.detailObj.stu_id,
        this.choiceTime.start_time,
        this.choiceTime.end_time,
        this.page_num,
        this.page_size
      ).then(res => {
        this.detailData = []
        if (res.data.pajx_result.data.data.length > 0) {
          this.total = parseInt(res.data.pajx_result.data.total)
          res.data.pajx_result.data.data.forEach(opt => {
            opt.att_day_time =
              opt.att_time.substring(0, 4) +
              '-' +
              opt.att_time.substring(4, 6) +
              '-' +
              opt.att_time.substring(6, 8)
            opt.att_specific_time =
              opt.att_time.substring(8, 10) +
              ':' +
              opt.att_time.substring(10, 12) +
              ':' +
              opt.att_time.substring(12, 14)
          })
          let att_day = res.data.pajx_result.data.data.map(opt => {
            return opt.att_day_time
          })
          att_day = uniqueArr(att_day)
          att_day.forEach(opt => {
            const records = []
            res.data.pajx_result.data.data.forEach(item => {
              if (item.att_day_time === opt) {
                records.push(item)
              }
            })
            this.detailData.push({
              time: opt,
              records: records
            })
          })
        }
      })
    },

    seePic(url) {
      this.pic_url = url
      this.showViewer = true
    },

    closeViewer() {
      this.showViewer = false
    }
  }
}
</script>
<style lang="scss" scoped>
.attendance-detail {
  height: 100%;
  .detail-title {
    height: 110px;
    background: rgba(51, 153, 255, 1);
    box-shadow: 0px 6px 8px 0px rgba(51, 153, 255, 0.4);
    border-radius: 4px;
    display: flex;
    padding: 27px 20px;
    .avatardefault {
      .image {
        width: 56px;
        height: 56px;
      }
    }
    .detail {
      color: #ffffff;
      margin-left: 20px;
      .name {
        height: 40px;
        font-size: 18px;
        font-weight: bold;
      }
      .des {
        display: flex;
        align-items: center;
        font-size: 14px;
        .item-wrapper {
          margin-right: 50px;
          .title {
            color: rgba(255, 255, 255, 0.5);
          }
        }
      }
    }
  }
  .detail-main {
    height: calc(100% - 110px);
    overflow: auto;
    .detail-timeline {
      .detail-time {
        font-size: 16px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        padding: 10px 0 20px 0;
      }
      .el-timeline {
        margin-left: 83px;
      }
      .time {
        position: absolute;
        top: 0;
        left: -83px;
        color: #999999;
        font-size: 14px;
      }
      .photo {
        .img {
          width: 110px;
          height: 110px;
          cursor: pointer;
        }
      }
      .info {
        display: flex;
        position: relative;
        top: -6px;
        align-items: center;
        .left {
          height: 28px;
          .image {
            width: 28px;
          }
        }
        .right {
          display: flex;
          flex-direction: column;
          margin-left: 15px;
          .text {
            font-size: 14px;
            line-height: 22px;
            .get-into {
              color: #4dcd70;
            }
            .exit {
              color: #f98700;
            }
          }
          .num {
            font-size: 13px;
            color: #999999;
            margin-top: 6px;
          }
        }
      }
      &:first-of-type {
        margin-top: 20px;
      }
    }
  }
}
</style>
<style lang="scss">
.attendance-detail {
  .el-timeline-item__tail {
    border-left: 1px dashed #dfe4ed;
    left: 4px;
  }
  .el-timeline-item {
    &:last-of-type {
      padding-bottom: 0;
    }
  }
  .el-progress-bar__outer {
    background: rgba(255, 255, 255, 0.5);
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .detail-main {
    .el-scrollbar__wrap {
      margin-right: 0 !important;
    }
  }
}
</style>
