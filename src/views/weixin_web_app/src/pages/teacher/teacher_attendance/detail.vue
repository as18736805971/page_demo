<template>
  <div class="attendance_detail">
    <div class="header">
      <img class="photo" :src="info.tea_avatar ? info.tea_avatar : require('@/assets/qqdh_photo.png')">
      <div class="name">{{ info.name }}</div>
    </div>

    <div class="content-list" v-if="list.length !== 0">
      <div class="list" v-for="(item, index) in list" :key="index">
        <div class="time_title flex-content">{{ item.att_time }}</div>
        <div class="list_item"  v-for="(vv, kk) in item.children" :key="kk" @click="handleJump(vv)">
          <div class="left-time">
            <div>{{ vv.format_time.split(' ')[0] | week }}</div>
            <div>{{ vv.format_time.split(' ')[1] }}</div>
          </div>
          <div class="line flex-content">
            <div class="yuan"></div>
            <template v-if="item.children.length > 1">
              <div class="line_txt" :class="kk === 0 ? 'top_line' : kk === item.children.length - 1 ? 'bottom_line' : 'center_line'"></div>
            </template>
          </div>
          <div class="right-time">
            <div class="desc_txt">
              {{ vv.desc }}
              <img class="see" :src="require('@/assets/see.png')">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-data_list">
      <img class="no-img" :src="require('@/assets/no_data.png')">
      <div class="no-text">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { httpFormPostMethod } from '@/common/HttpService'
import { Tool } from "@/common/Tool";
import moment from 'moment'
export default {
  name: "attendance_detail",
  data() {
    return {
      tea_id: this.$route.query.tea_id,
      att_time_start: this.$route.query.att_time_start,
      att_time_end: this.$route.query.att_time_end,
      info: {
        name: '',
        tea_avatar: ''
      },
      list: []
    }
  },
  filters: {
    week (value) {
      let day = moment(value).day()
      let str = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return str[day]
    }
  },
  mounted() {
    this.handleGetDetail()
  },
  methods: {
    handleGetDetail() {
      httpFormPostMethod('use/att/tea/infoList',{
        tea_id: this.tea_id,
        att_time_start: this.att_time_start,
        att_time_end: this.att_time_end
      }).then((res) => {
        let data = res.data
        this.info.name = data.name
        let date = this.handleDateSort(res.data.list || [])
        let arr = []
        date.map((item, index) => {
          arr.push({
            att_time: item,
            children: []
          })
          data.list.map((vv) => {
            vv.format_time = Tool.formatDate(vv.att_time)
            let pattern = /(\d{4})(\d{2})(\d{2})/;
            let att_time = vv.att_time ? vv.att_time.slice(0, 8) : ''
            if (item === att_time.replace(pattern, '$1-$2-$3')) {
              arr[index].children.push(vv)
            }
          })
        })
        this.list = arr
      })
    },
    handleDateSort(arr){
      let arr1 = []
      let pattern = /(\d{4})(\d{2})(\d{2})/;
      arr.map((item) => {
        item.old_time = item.att_time ? item.att_time.slice(0, 8) : ''
        if (arr1.indexOf(item.old_time.replace(pattern, '$1-$2-$3')) === -1) {
          arr1.push(item.old_time.replace(pattern, '$1-$2-$3'))
        }
      })
      arr1.sort(function(a,b) {
        return Date.parse(b.replace(/-/g, '/')) - Date.parse(a.replace(/-/g, '/'));
      })
      return arr1
    },
    handleJump(data) {
      this.$router.push({
        path: 'see_detail',
        query: {
          tea_att_id: data.tea_att_id,
          tea_name: data.tea_name,
          inout_type_name: data.inout_type_name,
          att_time: data.att_time
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.attendance_detail {
  width: 100%;

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 6rem;
    background: #ffffff;

    .photo {
      height: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .name {
      font-size: 0.7rem;
    }
  }

  .content-list {
    padding: 0.5rem 0.5rem 1rem 0.5rem;

    .time_title {
      height: 2rem;
      font-size: 0.9rem;
      color: #219bff;
    }

    .list_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 0.5rem;

      .left-time {
        width: 3rem;
      }

      .line {
        width: 1rem;
        height: 3rem;
        position: relative;

        .line_txt {
          position: absolute;
          width: 0.05rem;
          background: #3fbfff;
        }

        .top_line {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translate(-50%, 0);
          height: 50%;
        }

        .center_line {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          height: 132%;
        }

        .bottom_line {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translate(-50%, 0);
          height: 50%;
        }

        .yuan {
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 50%;
          background: #3fbfff;
        }
      }

      .right-time {
        position: relative;
        width: 13rem;
        height: 3rem;
        background: #3fbfff;
        border-radius: 0.4rem;
        padding: 0.5rem;
        line-height: 1.2rem;
        color: #ffffff;
        display: flex;
        align-items: center;

        .desc_txt {
          width: 11rem;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }

        .see {
          position: absolute;
          right: 0.4rem;
          top: 50%;
          transform: translate(0, -50%);
          width: 1rem;
          height: 1rem;
        }
      }
      .right-time:after {
        content: '';
        position: absolute;
        left: -0.4rem;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        border: 0.4rem solid transparent;
        border-right: 0.6rem solid #3fbfff;
      }
    }
  }

  .flex-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.no-data_list {
  height: calc(100vh - 6rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;

  .no-img {
    height: 2rem;
    margin-bottom: 0.5rem;
  }

  .no-text {
    font-size: 0.6rem;
  }
}
</style>
