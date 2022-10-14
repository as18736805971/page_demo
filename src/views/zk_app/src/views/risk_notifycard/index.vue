<template>
  <div class="risknotifycard-main">
    <div class="risknotifycard-content">
      <div class="item-risknotifycard-content">
        <div class="title-wrapper">
          <div class="left">
            <span class="name">风险名称：</span>
            <span class="text">{{ cardInfo.risk_name }}</span>
          </div>
          <div v-for="(item, index) in cardInfo.video" :key="index" class="right">
            <span class="name">相关视频{{ index + 1 }}：</span>
            <span class="text" style="color: #3399ff" @click="view_video(item)">{{ item.video_name }}</span>
          </div>
        </div>
        <el-collapse v-model="activeName">
          <el-collapse-item :name="'collapse'" title="风险详情">
            <div class="item-content">
              <div class="risk_notifycard-item-list">
                <span class="name">项目潜在风险点:</span>
                <span
                  class="text"
                  v-html="cardInfo.potential_risk ? JSON.parse(cardInfo.potential_risk).replace(
                    /\n/g,
                    '<br>'
                  ) : ''"
                />
              </div>
              <div class="risk_notifycard-item-list">
                <span class="name">可能导致后果:</span>
                <span
                  class="text"
                  v-html="cardInfo.risk_result ? JSON.parse(cardInfo.risk_result).replace(
                    /\n/g,
                    '<br>'
                  ) : ''"
                />
              </div>
              <div class="risk_notifycard-item-list">
                <span class="name">风险评估类型:</span>
                <span class="text">{{ cardInfo.estimate_type_name }}</span>
              </div>
              <div class="risk_notifycard-item-list">
                <span class="name">风险等级:</span>
                <span class="text">{{ cardInfo.risk_rank_name }}</span>
              </div>
              <div class="risk_notifycard-item-list">
                <span class="name">管理措施：</span>
                <span class="text">{{ cardInfo.control_measure }}</span>
              </div>
              <div class="risk_notifycard-item-list">
                <span class="name">应急处理措施:</span>
                <span
                  class="text"
                  v-html="cardInfo.risk_emergency ? JSON.parse(cardInfo.risk_emergency).replace(
                    /\n/g,
                    '<br>'
                  ) : ''"
                />
              </div>
              <div class="risk_notifycard-item-list">
                <span class="name">工程技术措施:</span>
                <span class="text">{{ cardInfo.project_measure }}</span>
              </div>
              <div class="risk_notifycard-item-list">
                <span class="name">培训教育措施:</span>
                <span class="text">{{ cardInfo.education_measure }}</span>
              </div>
              <div class="risk_notifycard-item-list">
                <span class="name">个体防护措施:</span>
                <span class="text">{{ cardInfo.personal_measure }}</span>
              </div>
              <div class="risk_notifycard-item-list">
                <span class="name">管理层级:</span>
                <span class="text">{{ cardInfo.control_level_name }}</span>
              </div>
              <div class="risk_notifycard-item-list">
                <span class="name">责任部门:</span>
                <span class="text">{{ cardInfo.responsible_dept_name }}</span>
              </div>
              <div class="risk_notifycard-item-list">
                <span class="name">责任人:</span>
                <span class="text">{{ cardInfo.responsible_man_name }}</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div v-if="patrol_list.length !== 0" class="screening">
        <div class="search_tab">
          <span v-for="(item, index) in patrol_list" :key="index" :class="index === patrol_index ? 'active' : ''" @click.stop="handleTab(index)">{{ item.patrol_rate_name }}</span>
        </div>
        <div class="screening_item" @click="handleClick(patrol_list[patrol_index])">
          <div class="item-top">
            <img v-if="patrol_list[patrol_index].patrol_rate == '1'" class="left-img" :src="require('@/assets/icon/day_mark.png')">
            <img v-if="patrol_list[patrol_index].patrol_rate == '2'" class="left-img" :src="require('@/assets/icon/week_mark.png')">
            <img v-if="patrol_list[patrol_index].patrol_rate == '3'" class="left-img" :src="require('@/assets/icon/month_mark.png')">
            <img v-if="patrol_list[patrol_index].patrol_rate == '4'" class="left-img" :src="require('@/assets/icon/season_mark.png')">
            <img v-if="patrol_list[patrol_index].patrol_rate == '5'" class="left-img" :src="require('@/assets/icon/year_mark.png')">
            <div class="left-content">
              <div class="item-title">{{ patrol_list[patrol_index].patrol_name }}</div>
              <div class="item-block">
                <div class="block-txt">{{ patrol_list[patrol_index].patrol_rate_name }}</div>
              </div>
              <div class="item-desc">{{ patrol_list[patrol_index].patrol_content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNotifycard } from '@/api/risk_point'
import { nowTime } from '@/utils/auth'
import axios from 'axios'
import md5 from 'js-md5'
export default {
  name: 'RiskNotifyCard',
  data() {
    return {
      risk_no: this.$route.query.risk_no,
      sr_id: this.$route.query.sr_id,
      app_id: this.$route.query.app_id,
      token: this.$route.query.token,
      app_key: this.$route.query.app_key,
      cardInfo: {},
      activeName: '',
      patrol_index: 0,
      patrol_list: [],
      content_height: '20px',
      isiOS: false,
      isWeiXin: false
    }
  },
  created() {
    document.getElementsByTagName('title')[0].innerText = '风险详情'
    const metaList = document.getElementsByTagName('meta')
    metaList[3]['content'] =
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    this.isIos()
  },
  mounted() {
    this.getNotifycard()
  },
  methods: {
    // 获取风险类型
    getNotifycard() {
      getNotifycard(this.risk_no).then((res) => {
        this.cardInfo = res.data
        if (this.app_id && this.token) {
          this.handleGetPatrol()
        } else {
          this.activeName = 'collapse'
        }
      })
    },
    handleTab(index) {
      this.patrol_index = index
    },
    // 获取巡检信息列表
    handleGetPatrol() {
      const that = this
      const data = {
        risk_no: this.risk_no,
        sr_id: this.sr_id
      }
      const url = process.env.VUE_APP_BASE_API + '/api/dd/daily/patrol/info/h5/list'
      axios({
        method: 'post',
        url: url,
        data,
        transformRequest: [
          function(data) {
            data['app_id'] = that.app_id
            data['timestamp'] = nowTime()
            data['token'] = that.token
            data['sign'] = that.getSign(data)
            let ret = ''
            for (const it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            ret = ret.substr(0, ret.length - 1)
            return ret
          }
        ],
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        const list = res.data
        if (list.status == 200) {
          that.patrol_list = list.data
          if (that.patrol_list.length === 0) {
            that.activeName = 'collapse'
          } else {
            that.activeName = ''
          }
        } else {
          that.$message({
            message: list.message,
            type: 'error',
            duration: 3000
          })
          that.patrol_list = []
        }
      }).catch(() => {
        that.$message({
          message: '数据请求失败',
          type: 'error',
          duration: 3000
        })
        that.patrol_list = []
      })
    },
    isIos() {
      const height = window.innerHeight
      var u = navigator.userAgent
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      if (isiOS) {
        this.isiOS = true
        if (screen.height == 812 || screen.height == 896) {
          this.content_height = '40px'
        }
      }
    },
    handleClick(data) {
      const info = {
        patrol_id: data.patrol_id
      }
      if (this.isiOS) {
        // Ios 客户端调用方法
        window.webkit.messageHandlers.reportInspection.postMessage(info)
      } else {
        // Android 客户端调用方法
        back.reportInspection(JSON.stringify(info)) // APP这个对象名由安卓提供  data数据
      }
    },
    view_video(data) {
      this.$router.push({
        path: '/play_video',
        query: {
          video: JSON.stringify(data)
        }
      })
    },
    getSign(data) {
      const arr_key = Object.keys(data).sort()
      let str = ''
      arr_key.forEach(i => {
        data[i] = (data[i] == null ? '' : data[i])
        str += i + '=' + data[i]
      })
      str += this.app_key
      return md5(str)
    }
  }
}
</script>

<style lang="scss" scoped>
.risknotifycard-main {
  width: 100%;
  height: 100%;
  // background-color: #f4f5f9;
  background: #FFFFFF;

  .risknotifycard-head {
    height: 45px;
    font-size: 18px;
    text-align: center;
    line-height: 45px;
    background-color: #2e59c3;
    color: #ffffff;
    border-bottom: 1px solid #e1e6eb;
  }

  .risknotifycard-content {
    height: 100%;
    overflow-y: auto;
    font-size: 15px;
    color: rgba(0, 0, 0, 0.8);

    .item-risknotifycard-content {
      margin-top: 20px;
      &:first-of-type {
        margin-top: 0;
      }
    }
    .title-wrapper {
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      background: #ffffff;
      padding: 5px 18px;
      line-height: 30px;
      .left,
      .right {
        flex: 5;
        .name {
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
    .item-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width: 100%;
      font-size: 13px;
      .risk_notifycard-item-list {
        display: flex;
        margin-top: 10px;
        .name {
          width: 100px;
          text-align: left;
        }
        .text {
          width: calc(100% - 100px);
          color: rgba(0, 0, 0, 0.8);
          word-break: break-all;
        }
      }
    }
  }

  .screening {
    padding: 0 18px 10px;

    .search_tab{
      overflow-x: auto;
      white-space: nowrap;
      padding: 12px 12px 12px 0;
    }
    .search_tab span{
      display: inline-block;
      padding: 8px 16px;
      margin-right: 8px;
      background: #f0f2f5;
      border-radius: 5px;
    }
    .search_tab .active{
      color: #3272FF;
      background-color: #E3ECFF;
    }

    .screening_item {
      padding: 10px;
      border-radius: 10px;
      margin-bottom: 20px;
      background: #FFFFFF;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);

      .item-title {
        font-size: 16px;
        font-weight: bold;
        color: #2e2e2e;
        line-height: 18px;
        margin-bottom: 10px;
      }

      .item-top {
        display: flex;
        align-items: flex-start;

        .left-img {
          width: 30px;
          margin-right: 10px;
        }

        .left-content {
          .item-block {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 10px;

            .block-txt {
              font-size: 12px;
              height: 20px;
              padding: 0 10px;
              background: #e5f1fd;
              border-radius: 2px;
              color: #6cadd7;
              margin-right: 10px;
              line-height: 20px;
              text-align: center;
            }
          }
          .item-desc {
            font-size: 14px;
            line-height: 18px;
            color: #9a9a9a;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 575px) {
  .risk_notifycard-item-list {
    width: 100%;
  }
}
@media screen and (min-width: 576px) and (max-width: 767px) {
  .risk_notifycard-item-list {
    width: 50%;
  }
}
@media screen and (min-width: 768px) {
  .risk_notifycard-item-list {
    width: 33.33%;
  }
}
</style>

<style lang="scss">
.risknotifycard-main {
  .el-collapse .el-collapse-item__wrap {
    padding: 0 20px;
  }
  .el-collapse .el-collapse-item__content {
    padding-bottom: 10px;
  }
}
</style>
