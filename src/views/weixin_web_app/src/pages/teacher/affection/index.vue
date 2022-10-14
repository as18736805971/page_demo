<template>
  <div class="affection_index">
    <div class="header">
      <div class="text">{{ cls_name }}班</div>
      <div class="select_date" @click="handleSelectDate()">
        {{ call_time_start }}<img class="top_icon" src="../../../assets/top.png">
      </div>
    </div>

    <div class="content-list" v-if="list.length !== 0">
      <div class="list" v-for="(item, index) in list" :key="index">
        <div class="list_title">
          <div class="left-time"></div>
          <div class="line flex-content">
            <div class="yuan"></div>
            <div class="line_txt" :class="index === 0 ? 'top_line' : 'center_line'"></div>
          </div>
          <div class="right-time">
            <div class="time_day flex-content">{{ item.time }}日</div>
          </div>
        </div>
        <div class="list_item" v-for="(vv, kk) in item.children" :key="kk">
          <div class="left-time">{{ vv.time }}</div>
          <div class="line flex-content">
            <div class="yuan"></div>
            <template v-if="list.length - 1 === index && item.children.length -1 === kk">
              <div class="line_txt bottom_line"></div>
            </template>
            <template v-else>
              <div class="line_txt center_line"></div>
            </template>
          </div>
          <div class="right-date">
            <!-- 家长显示 教师不显示 -->
            <!-- <div>{{ vv.stu_name }}</div> -->
            <div>拨出号码：{{ vv.call_phone }}</div>
            <div>时长：{{ vv.call_long }}秒</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-data_list">
      <img class="no-img" :src="require('@/assets/no_data.png')">
      <div class="no-text">暂无数据</div>
    </div>

    <mt-datetime-picker
      ref="startPicker"
      type="date"
      v-model="time_start"
      @confirm="handleConfirm()"
    >
    </mt-datetime-picker>
  </div>
</template>

<script>
import { httpFormPostMethod } from '@/common/HttpService'
import moment from 'moment'
import { Tool } from "@/common/Tool";
export default {
  name: "affection_index",
  data() {
    return {
      time_start: new Date(moment().format('YYYY-MM')),
      call_time_start: moment().format('YYYY-MM'),
      gra_id: this.$route.query.gra_id,
      cls_id: this.$route.query.cls_id,
      gra_name: this.$route.query.gra_name,
      cls_name: this.$route.query.cls_name,
      list: []
    }
  },
  mounted() {
    this.handleGetList()
  },
  methods: {
    handleSelectDate() {
      this.$refs.startPicker.open()
      let startPicker = document.getElementsByClassName('picker-slot')
      startPicker[2].style.display = 'none'
    },
    handleConfirm() {
      this.call_time_start = Tool.formate(this.time_start, "yyyy-MM")
      this.handleGetList()
    },
    handleGetList() {
      httpFormPostMethod('web/tel/telPaginate', {
        gra_id: this.gra_id,
        cls_id: this.cls_id,
        call_time_start: this.call_time_start.replace(/-/g, '')
      }).then((res) => {
        let data = res.data
        if (data && data.length !== 0) {
          let date = this.handleDateSort(data)
          let arr = []
          date.map((item, index) => {
            arr.push({
              call_time: item,
              time: item.split('-')[2],
              children: []
            })
            data.map((vv) => {
              vv.time = moment(Tool.formatDate(vv.call_time)).format('HH:mm')
              let pattern = /(\d{4})(\d{2})(\d{2})/;
              let att_time = vv.call_time ? vv.call_time.slice(0, 8) : ''
              if (item === att_time.replace(pattern, '$1-$2-$3')) {
                arr[index].children.push(vv)
              }
            })
          })
          this.list = arr
        } else {
          this.list = []
        }
      })
    },
    handleDateSort(arr){
      let arr1 = []
      let pattern = /(\d{4})(\d{2})(\d{2})/;
      arr.map((item) => {
        item.old_time = item.call_time ? item.call_time.slice(0, 8) : ''
        if (arr1.indexOf(item.old_time.replace(pattern, '$1-$2-$3')) === -1) {
          arr1.push(item.old_time.replace(pattern, '$1-$2-$3'))
        }
      })
      arr1.sort(function(a,b) {
        return Date.parse(b.replace(/-/g, '/')) - Date.parse(a.replace(/-/g, '/'));
      })
      return arr1
    }
  }
}
</script>

<style lang="scss" scoped>
.affection_index {
  width: 100%;
  background: #ffffff;

  .header {
    height: 3rem;
    padding: 0.6rem;
    background: rgb(245, 250, 255);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .text {
      font-size: 0.8rem;
      font-weight: bold;
    }

    .select_date {
      width: 5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.1rem;
      height: 1.5rem;
      font-size: 0.7rem;
      border: 0.05rem solid rgb(184, 218, 251);

      .top_icon {
        width: 0.8rem;
        height: 0.8rem;
        margin-left: 0.5rem;
        transform: rotateX(-180deg);
      }
    }
  }

  .content-list {
    padding: 0.6rem;

    .list_title {
      display: flex;
      align-items: center;
    }

    .left-time {
      width: 2rem;
    }

    .line {
      width: 1rem;
      height: 3rem;
      margin: 0 0.5rem;
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
        height: 150%;
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

    .list_item {
      display: flex;
      align-items: center;
      padding-bottom: 0.5rem;
    }

    .right-date {
      width: 13rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .right-time {
      position: relative;
      width: 13rem;
      height: 3rem;
      display: flex;
      align-items: center;
    }
    .time_day {
      position: relative;
      width: 2rem;
      height: 1.2rem;
      border-radius: 0.1rem;
      background: #3fbfff;
      color: #ffffff;
    }
    .time_day:after {
      content: '';
      position: absolute;
      left: -0.2rem;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 0;
      height: 0;
      border: 0.2rem solid transparent;
      border-right: 0.3rem solid #3fbfff;
    }
  }
}

.flex-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data_list {
  height: calc(100vh - 3rem);
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
