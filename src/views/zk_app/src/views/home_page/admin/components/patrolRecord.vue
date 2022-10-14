<template>
  <div class="patrolRecord-main">
    <homeHeader title="巡查记录" :type="1" @viewAll="viewAll" />
    <el-scrollbar v-if="recordList.length>0" class="list-main">
      <div
        v-for="(item, index) in recordList"
        :key="index"
        class="list-item"
        :class="{'abnormallist': item.patrol_status === '0'}"
      >
        <div class="title-column">
          <div class="left">
            <img src="../../../../assets/images/avatardefault.png" alt class="avatardefault">
            <div class="des-wrapper">
              <div class="name">{{ item.user_name }}</div>
              <div class="time">{{ item.create_time | fgTime }}</div>
            </div>
          </div>
          <div class="right">
            <span v-show="item.patrol_status === '1'" class="normal-status">正常</span>
            <span v-show="item.patrol_status === '0'" class="abnormal-status">异常</span>
          </div>
        </div>
        <div class="inspection-name">
          <span class="title">巡查名称：</span>
          <span class="text">{{ item.patrol_name }}</span>
        </div>
        <img v-show="index === 0" src="../../../../assets/images/new.png" alt class="new">
      </div>
    </el-scrollbar>
    <div v-else class="spp-home-no-content">
      <div class="content">
        <img src="../../../../assets/images/home-no-content.png" alt class="not-found">
        <div class="text">暂无内容</div>
      </div>
    </div>
  </div>
</template>

<script>
import homeHeader from './homeHeader'
import { getPatrolreport } from '@/api/home_page'
export default {
  name: 'PatrolRecord',
  components: { homeHeader },
  props: {},
  data() {
    return {
      recordList: []
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 获取列表数据
    getData() {
      getPatrolreport().then(res => {
        this.recordList = res.data
      })
    },

    viewAll() {
      this.$router.push({ path: '/patro_ledger' })
    }
  }
}
</script>
<style lang="scss">
.patrolRecord-main {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .list-main {
    overflow-y: scroll;
    scrollbar-color: transparent transparent;
    scrollbar-track-color: transparent;
    -ms-scrollbar-track-color: transparent;
    .el-scrollbar__wrap {
      margin-right: 0 !important;
    }
  }
}
</style>
<style scoped lang='scss'>
.patrolRecord-main {
  height: 540px;
  background: #ffffff;
  border-radius: 4px;
  position: relative;
  .list-main {
    padding: 10px;
    padding-bottom: 0;
    height: calc(100% - 50px);
    overflow-y: auto;
    width: 100%;
    .list-item {
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(235, 240, 245, 1);
      box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.13);
      border-radius: 4px;
      height: 112px;
      padding: 10px;
      padding-bottom: 20px;
      margin-bottom: 15px;
      position: relative;
      .title-column {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          display: flex;
          align-items: center;
          .avatardefault {
            width: 40px;
          }
          .des-wrapper {
            margin-left: 10px;
            line-height: 18px;
            .name {
              color: #313233;
              font-size: 16px;
              font-weight: bold;
            }
            .time {
              color: #999999;
              font-size: 12px;
            }
          }
        }
        .right {
          font-size: 12px;
          color: #ffffff;
          margin-right: 10px;
          .normal-status,
          .abnormal-status {
            display: inline-block;
            width: 50px;
            height: 20px;
            border-radius: 2px;
            text-align: center;
            line-height: 20px;
          }
          .normal-status {
            background: rgba(77, 205, 112, 1);
          }
          .abnormal-status {
            background: #f75a53;
          }
        }
      }
      .inspection-name {
        font-size: 14px;
        line-height: 40px;
        .title {
          color: #999999;
        }
        .text {
          color: #333333;
        }
      }
      .new {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .abnormallist {
      background: rgba(255, 241, 240, 1);
    }
  }
}
</style>
