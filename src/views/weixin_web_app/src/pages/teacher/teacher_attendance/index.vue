<template>
  <div class="teacher_attendance">
    <div class="select_time">
      <div class="left" :class="time_type === 1 ? 'active' : ''" @click.stop="handleStartTime(1)">
        <img class="icon_time" :src="time_type === 1 ? require('@/assets/time_active.png') : require('@/assets/time.png')">开始时间
      </div>
      <div class="left" :class="time_type === 2 ? 'active' : ''" @click.stop="handleEndTime(2)">
        <img class="icon_time" :src="time_type === 2 ? require('@/assets/time_active.png') : require('@/assets/time.png')">结束时间
      </div>
    </div>

    <div class="chars_list">
      <div class="time_txt flex-content">
        <template v-if="search.att_time_end">{{ search.att_time_start + ' -- ' + search.att_time_end }}</template>
        <template v-else>{{ search.att_time_start }}</template>
      </div>
      <div class="charts">
        <div id="charts" class="charts_yuan"></div>
        <div class="charts_item">
          <div class="item">
            <div class="block_item not_tea"></div>
            <div class="block_txt">打卡 ({{ info.att_num + '人' }})</div>
          </div>
          <div class="item">
            <div class="block_item"></div>
            <div class="block_txt">异常打卡 ({{ info.not_att_num + '人' }})</div>
          </div>
        </div>
      </div>
    </div>

    <div class="tab-list">
      <div class="item-tab" v-for="(item ,index) in tab_list" :key="index" @click="handleTab(index)">
        <div class="item" :class="index === activeIndex ? 'active_txt' : ''">
          {{ index === 0 ? item.title + ' (' + info.att_num  + '人)' : item.title + ' (' + info.not_att_num  + '人)' }}
        </div>
        <div class="line" v-if="activeIndex === index"></div>
      </div>
    </div>

    <div class="content_list">
      <template v-if="activeIndex === 0">
        <template v-if="info.att_tea.length !== 0">
          <div class="list_item" @click.stop="handleJump(item.tea_id)" v-for="(item, index) in info.att_tea" :key="index">
            <img class="photo" :src="item.tea_avatar ? item.tea_avatar : require('@/assets/qqdh_photo.png')">
            <div class="name">{{ item.tea_name }}</div>
          </div>
        </template>
        <template v-else>
          <div class="no-data_list">
            <img class="no-img" :src="require('@/assets/no_data.png')">
            <div class="no-text">暂无数据</div>
          </div>
        </template>
      </template>
      <template v-if="activeIndex === 1">
        <template v-if="info.not_att_tea.length !== 0">
          <div class="list_item" @click.stop="handleJump(item.tea_id)" v-for="(item, index) in info.not_att_tea" :key="index">
            <img class="photo" :src="item.tea_avatar ? item.tea_avatar : require('@/assets/qqdh_photo.png')">
            <div class="name">{{ item.tea_name }}</div>
          </div>
        </template>
        <template v-else>
          <div class="no-data_list">
            <img class="no-img" :src="require('@/assets/no_data.png')">
            <div class="no-text">暂无数据</div>
          </div>
        </template>
      </template>
    </div>

    <!-- 组件弹框 -->
    <mt-datetime-picker
      ref="startPicker"
      type="datetime"
      v-model="att_time_start"
      @confirm="handleConfirm(1)"
    >
    </mt-datetime-picker>
    <mt-datetime-picker
      ref="endPicker"
      type="datetime"
      v-model="att_time_end"
      @confirm="handleConfirm(2)"
    >
    </mt-datetime-picker>
  </div>
</template>

<script>
import moment from 'moment'
import * as echarts from 'echarts'
import { Tool } from '@/common/Tool'
import { httpFormPostMethod } from '@/common/HttpService'
export default {
  name: "teacher_attendance",
  data () {
    return {
      time_type: 0,
      att_time_start: new Date(moment().format('YYYY-MM-DD') + ' 00:00:00'),
      att_time_end: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
      search: {
        att_time_start: moment().format('YYYY-MM-DD') + ' 00:00:00',
        att_time_end: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      tab_list: [{
        title: '打卡',
      },{
        title: '异常打卡',
      }],
      activeIndex: 0,
      info: {
        att_num: 0,
        not_att_num: 0,
        att_tea: [],
        not_att_tea: []
      },
      option: {
        color: ['#ff8200', '#219bff'],
        grid: {
          top: 'center',
          left: 'center',
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: '',
            textAlign: 'center',
            fill: '#ff8200',
            fontsize: '18px'
          }
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['45%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 0, name: '打卡' },
              { value: 0, name: '异常打卡' },
            ]
          }
        ]
      }
    }
  },
  mounted() {
    this.handleGetData()
  },
  methods: {
    handleStartTime(type) {
      this.time_type = type
      this.$refs.startPicker.open()
    },
    handleEndTime(type) {
      this.time_type = type
      this.$refs.endPicker.open()
    },
    handleConfirm(type) {
      if (type === 1) {
        this.search.att_time_start = Tool.formate(this.att_time_start, "yyyy-MM-dd hh:mm:ss")
        this.search.att_time_end = ''
        Tool.tip('请选择结束时间')
      } else {
        this.search.att_time_end = Tool.formate(this.att_time_end, "yyyy-MM-dd hh:mm:ss")
        this.handleGetData()
      }
    },
    handleTab(index) {
      this.activeIndex = index
    },
    handleGetData() {
      if (this.search.att_time_start === '') {
        Tool.tip('请选择开始时间')
        return false
      }
      if (this.search.att_time_end === '') {
        Tool.tip('请选择结束时间')
        return false
      } else if (this.search.att_time_end > moment().format('YYYY-MM-DD HH:mm:ss')) {
        Tool.tip('结束时间不能大于当前时间')
        return false
      } else {
        if (this.search.att_time_start >= this.search.att_time_end) {
          Tool.tip('结束时间不能小于开始时间')
          return false
        }
      }
      httpFormPostMethod('use/att/tea/pub/common/list',{
        att_time_start: Tool.handleFormat(this.search.att_time_start),
        att_time_end: Tool.handleFormat(this.search.att_time_end)
      }).then((res) => {
        this.info = res.data
        this.option.series[0].data[0].value = this.info.att_num
        this.option.series[0].data[1].value = this.info.not_att_num
        this.option.graphic.style.text = `(${this.info.att_num})人\n\n打卡`
        const myChart = echarts.init(document.getElementById('charts'))
        myChart.setOption(this.option)
        window.onresize = () => {
          setTimeout(() => {
            myChart.resize()
          }, 50)
        }
      })
    },
    handleJump(tea_id) {
      this.$router.push({
        path: 'attendance_detail',
        query: {
          tea_id: tea_id,
          att_time_start: Tool.handleFormat(this.search.att_time_start),
          att_time_end: Tool.handleFormat(this.search.att_time_end)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.teacher_attendance {
  width: 100%;

  .select_time {
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    margin-bottom: 0.3rem;

    .left {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2.5rem;
      font-size: 0.8rem;

      .icon_time {
        width: 0.8rem;
        margin-right: 0.3rem;
      }
    }
  }

  .shadow {
    box-shadow: 0 0.3rem 0.2rem -0.2rem rgba(0, 0, 0, 0.1);
  }

  .chars_list {
    height: 12rem;
    background: #ffffff;

    .time_txt {
      height: 2rem;
      color: #219bff;
    }

    .charts {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 10rem;

      .charts_yuan {
        width: 10rem;
        height: 10rem;
      }

      .charts_item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        height: 10rem;

        .item {
          display: flex;
          align-items: center;
          margin-bottom: 0.2rem;

          .block_item {
            width: 0.5rem;
            height: 0.5rem;
            margin-right: 0.2rem;
            font-size: 0.6rem;
            background: #219bff;
          }

          .not_tea {
            background: #ff8200;
          }
        }
      }
    }
  }

  .tab-list {
    height: 2.4rem;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .item-tab {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 2.3rem;
      font-size: 0.8rem;
      font-weight: 400;
      color: #999999;

      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2.2rem;
      }

      .line {
        width: 2.4rem;
        height: 0.1rem;
        background: #3297ff;
        border-radius: 0.05rem;
      }
    }

    .active_txt {
      font-size: 0.8rem;
      font-weight: 600;
      color: #3399ff;
    }
  }

  .content_list {
    background: #ffffff;
    padding: 0 1.2rem;

    .list_item {
      display: flex;
      align-items: center;
      height: 2.5rem;
      border-bottom: 0.05rem solid #f5f7fa;
      font-size: 0.8rem;

      .photo {
        height: 1.8rem;
        margin-right: 1rem;
      }
    }
    .list_item:last-child {
      border-bottom: none;
    }
  }

  .no-data_list {
    height: calc(100vh - 17.2rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .no-img {
      height: 2rem;
      margin-bottom: 0.5rem;
    }

    .no-text {
      font-size: 0.6rem;
    }
  }

  .flex-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .active {
    color: #219bff;
  }
}
</style>
