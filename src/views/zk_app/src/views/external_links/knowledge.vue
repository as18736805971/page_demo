<template>
  <div class="detail_index">
    <template v-if="show">
      <h3>{{ info.title }}</h3>
      <div>
        <div class="left_txt">创建人员：{{ info.create_oper }}</div>
        <div class="right_txt">创建时间：{{ info.create_time | formatDate }}</div>
        <div style="clear:both" />
      </div>
      <div class="content" v-html="info.content" />
    </template>
    <template v-else>
      <div class="no-data">未查询到相关安全知识</div>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import { getAppId, getSign, getToken, nowTime } from '@/utils/auth'

export default {
  name: 'News',
  filters: {
    formatDate(val) {
      console.log(val, '544545')
      const pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/
      return val.replace(pattern, '$1-$2-$3 $4:$5:$6')
    }
  },
  data() {
    return {
      id: this.$route.query.id,
      info: {
        title: '',
        create_oper: '',
        create_time: '',
        content: ''
      },
      show: true
    }
  },
  created() {
    this.handleGetDetail()
  },
  methods: {
    handleGetDetail() {
      const that = this
      const data = {
        id: that.id
      }
      const url = process.env.VUE_APP_BASE_API + '/api/dd/article/detail'
      axios({
        method: 'post',
        url: url,
        data,
        transformRequest: [
          function(data) {
            data['app_id'] = getAppId()
            data['timestamp'] = nowTime()
            data['token'] = getToken()
            data['sign'] = getSign(data)
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
        const info = res.data
        if (Number(info.status) === 200) {
          document.getElementsByTagName('title')[0].innerText = info.data.title || '安全知识'
          that.info.title = info.data.title
          that.info.create_oper = info.data.create_oper
          that.info.create_time = info.data.create_time
          that.info.content = info.data.content
          that.show = true
        }
      }).catch(() => {
        that.$message({
          message: '数据请求失败',
          type: 'error',
          duration: 3000
        })
        that.show = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail_index {
  width: 100%;
  height: 100vh;
  padding: 2rem 3rem;
  background: #FFFFFF;
  overflow-y: auto;

  h3 {
    margin-top: 0;
    font-size: 4.5rem;
  }

  .left_txt {
    float: left;
    color: #666;
    font-size: 3rem;
  }

  .right_txt {
    float: right;
    color: #666;
    font-size: 3rem;
  }

  .content {
    font-size: 3rem;
    margin-bottom: 4rem;
  }

  .no-data {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    color: #666;
  }
}
</style>
