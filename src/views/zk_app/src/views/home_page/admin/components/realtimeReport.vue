<template>
  <div class="realtimereport-main">
    <homeHeader title="隐患实时上报" :type="1" @viewAll="viewAll" />
    <el-scrollbar v-if="recordList.length > 0" class="list-main">
      <div v-for="(item, index) in recordList" :key="index">
        <div class="title">{{ formatDateTime(item.create_time) }}</div>
        <div class="list-item">
          <div class="item-title single-hidden">{{ item.scl_name }}</div>
          <div class="item-content multiple-hidden">{{ item.hd_desc }}</div>
          <div class="list-bottom">
            <div class="item-bottom">
              <span class="left">隐患等级：</span>
              <span v-if="item.hd_level==='1'" class="right">一般隐患</span>
              <span v-if="item.hd_level==='2'" class="right">重大隐患</span>
            </div>
            <div class="item-bottom">
              <span class="left">处理进度：</span>
              <span class="handel-right">{{ item.hd_status|dangerStatus }}</span>
            </div>
          </div>
          <img v-show="index === 0" src="../../../../assets/images/new.png" alt class="new">
        </div>
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
import { getListeduDanger } from '@/api/home_page'
import { formatDateTime } from '@/utils/index'
export default {
  name: 'RealtimeReport',
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
    formatDateTime: formatDateTime,
    // 获取列表数据
    getData() {
      getListeduDanger().then(res => {
        this.recordList = res.data
      })
    },

    viewAll() {
      this.$router.push({ path: '/manage_ledger' })
    }
  }
}
</script>
<style lang="scss">
.realtimereport-main {
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
.realtimereport-main {
  height: 540px;
  background: #ffffff;
  border-radius: 4px;
  position: relative;
  .list-main {
    padding: 0 10px;
    padding-bottom: 20px;
    height: calc(100% - 50px);
    overflow-y: auto;
    width: 100%;
    .title {
      color: #999999;
      font-size: 12px;
      padding: 10px 0;
      text-align: center;
    }
    .list-item {
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(235, 240, 245, 1);
      box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.13);
      border-radius: 4px;
      height: 112px;
      padding: 10px;
      padding-bottom: 20px;
      position: relative;
      .item-title {
        color: #666666;
        font-size: 12px;
      }
      .item-content {
        color: #333333;
        font-size: 14px;
        height: 37px;
        line-height: 18px;
        -webkit-line-clamp: 2;
        margin: 8px 0 15px 0;
      }
      .new {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .list-bottom {
      font-size: 12px;
      display: flex;
      .item-bottom {
        flex: 5;
        .left {
          color: #999999;
        }
        .right {
          color: #ff5f52;
        }
        .handel-right {
          color: #f76d02;
        }
      }
    }
  }
}
</style>
