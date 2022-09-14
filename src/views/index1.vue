<template>
  <div class="page-index">
    <div class="top-list">
      <div class="left-item">
        <img class="icon-arrow" @click="handleChangeDate(1)" src="../assets/left.png">
        <div class="date-txt">{{ current_date.year }}/{{ current_date.month < 10 ? '0' + current_date.month : current_date.month }}</div>
        <img class="icon-arrow" @click="handleChangeDate(2)" src="../assets/right.png">
      </div>
      <div class="right-item">
        <div class="block-item"
           v-for="(item, index) in ste_list"
           :key="index"
           :class="item.type === ste_index ? 'active-block' : ''"
           @click="handleTag(item.type)"
        >
          <div v-if="item.bgColor !== ''" class="bg-block" :style="{ backgroundColor: item.bgColor }"></div>
          {{ item.txt }}
        </div>
      </div>
    </div>

    <!-- 日历组件 -->
    <div class="calendar">
      <div class="calendar-title">
        <div class="title-item">周一</div>
        <div class="title-item">周二</div>
        <div class="title-item">周三</div>
        <div class="title-item">周四</div>
        <div class="title-item">周五</div>
        <div class="title-item">周六</div>
        <div class="title-item">周日</div>
      </div>
      <div class="calendar-list" v-for="(item, index) in formatList" :key="index">
        <div class="list-item" v-for="(vv, kk) in item" :key="kk">
          <div class="date-txt" :class="vv.disable ? 'date-txt-disable' : vv.isDay ? 'date-txt-active' : ''">{{ vv.date }}</div>
          <!-- 待受理 -->
          <div class="block-item star-radius accept_list"></div>
          <!-- 待处理 -->
          <div class="block-item end-radius deal_list"></div>
          <!-- 待验收 -->
          <div class="block-item stay_accept_list"></div>
          <!-- 待评价 -->
          <div class="block-item stay_eval_list"></div>
          <!-- 已评价 -->
          <div class="block-item eval_list"></div>
          <!-- 已关闭 -->
          <div class="block-item close_list"></div>
        </div>
      </div>
    </div>
    <!-- 日历组件 -->

    <div style="width: 100%; height: 200px"></div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: "page-index",
    data() {
      return {
        ste_index: 0,
        ste_list: [{
          type: 0,
          txt: '全部状态',
          bgColor: '',
        },{
          type: 1,
          txt: '待受理',
          bgColor: '#F8644E',
        },{
          type: 2,
          txt: '待处理',
          bgColor: '#FAA700',
        },{
          type: 3,
          txt: '待验收',
          bgColor: '#9B6AE9',
        },{
          type: 4,
          txt: '待评价',
          bgColor: '#14BC6C',
        },{
          type: 5,
          txt: '已评价',
          bgColor: '#1AB9FF',
        },{
          type: 6,
          txt: '已关闭',
          bgColor: '#D2D3D6',
        }],
        current_date: {
          date: moment().date(),
          day: moment().day(),
          fullDate: moment().format('YYYY-MM-DD'),
          month: moment().month() + 1,
          year: moment().year(),
        }, // 当前日期
        date_item: [], // 日期数据
        accept_list: [], // 待受理
        deal_list: [], // 待处理
        stay_accept_list: [], // 待验收
        stay_eval_list: [], // 待评价
        eval_list: [], // 已评价
        close_list: [], // 已关闭
      }
    },
    computed: {
      formatList() {
        let data = []
        let arr = []
        this.date_item.map((item, index) => {
          if (index !== this.date_item.length - 1) {
            if (index !== 0 && index % 7 === 0) {
              data.push(arr)
              arr = []
              arr.push(item)
            } else {
              arr.push(item)
            }
          } else {
            if (arr.length !== 7) {
              arr.push(item)
              data.push(arr)
            } else {
              data.push(arr)
              arr = []
              arr.push(item)
              data.push(arr)
            }
          }
        })
        return data
      }
    },
    created() {
      this.handleDate(this.current_date.year, this.current_date.month, this.current_date)
    },
    methods: {
      handleTag(type) {
        this.ste_index = type
      },
      // 日期切换
      handleChangeDate(type) {
        if (type === 1) {
          if (Number(this.current_date.month) === 1) {
            this.current_date.year = Number(this.current_date.year) - 1
            this.current_date.month = 12
          } else {
            this.current_date.month = Number(this.current_date.month) - 1
          }
        } else {
          if (Number(this.current_date.month) === 12) {
            this.current_date.year = Number(this.current_date.year) + 1
            this.current_date.month = 1
          } else {
            this.current_date.month = Number(this.current_date.month) + 1
          }
        }
        this.handleDate(this.current_date.year, this.current_date.month, this.current_date)
      },
      // 获取日期数据
      handleDate(year, month, date) {
        this.date_item = []
        let currentDay = new Date(year, month, 0).getDate()
        this.date_item = this.currentMonthDys(currentDay, date)
        // 头部日期补充
        this.handleArrangeDate(this.date_item[0], this.date_item, 1)
        // 尾部日期补充
        this.handleArrangeDate(this.date_item[this.date_item.length - 1], this.date_item, 2)
      },
      // 重组日期排列
      handleArrangeDate(obj, arr, type) {
        if (type === 1) {
          let length = obj.week === 0 ? 7 : obj.week
          for (let i = 1; i < length; i++) {
            var beforeDate = moment(obj.fullDate).subtract(i, 'days').format('YYYY-MM-DD')
            arr.unshift({
              fullDate: beforeDate,
              year: moment().year(),
              month: moment(beforeDate).month() + 1,
              date: moment(beforeDate).date(),
              week: moment().day(),
              disable: true,
              isDay: false,
            })
          }
        } else {
          let length =
              obj.week === 1 ? 7 : obj.week === 2 ? 6 :
              obj.week === 3 ? 5 : obj.week === 4 ? 4 :
              obj.week === 5 ? 3 : obj.week === 6 ? 2 : 1
          for (let i = 1; i < length; i++) {
            var afterDate = moment(obj.fullDate).add(i, 'days').format('YYYY-MM-DD')
            arr.push({
              fullDate: afterDate,
              year: moment().year(),
              month: moment(afterDate).month() + 1,
              date: moment(afterDate).date(),
              week: moment().day(),
              disable: true,
              isDay: false,
            })
          }
        }
        // return arr
      },
      /**
       * 获取任意时间
       */
      getDate(date, AddDayCount = 0, str = 'day') {
        if (!date) {
          date = new Date()
        }
        if (typeof date !== 'object') {
          date = date.replace(/-/g, '/')
        }
        const dd = new Date(date)
        switch (str) {
          case 'day':
            dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
            break
          case 'month':
            if (dd.getDate() === 31) {
              dd.setDate(dd.getDate() + AddDayCount)
            } else {
              dd.setMonth(dd.getMonth() + AddDayCount) // 获取AddDayCount天后的日期
            }
            break
          case 'year':
            dd.setFullYear(dd.getFullYear() + AddDayCount) // 获取AddDayCount天后的日期
            break
        }
        const y = dd.getFullYear()
        const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
        const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
        return {
          fullDate: y + '-' + m + '-' + d,
          year: y,
          month: m,
          date: d,
          day: dd.getDay()
        }
      },
      /**
       * 获取本月天数
       */
      currentMonthDys(dateData, full, startDate = '', endDate = '') {
        let dateArr = []
        let fullDate = full.fullDate
        for (let i = 1; i <= dateData; i++) {
          let nowDate =
              full.year + '-' + (
                  full.month < 10 ? '0' + full.month : full.month
              ) + '-' + (i < 10 ?
              '0' + i : i)
          // 是否今天
          let isDay = fullDate === nowDate
          // 星期几
          let myDate = new Date(nowDate)
          let week = myDate.getDay()
          // 日期禁用
          let disableBefore = true
          let disableAfter = true
          if (startDate) {
            disableBefore = this.dateCompare(startDate, nowDate)
          }
          if (endDate) {
            disableAfter = this.dateCompare(nowDate, endDate)
          }
          let data = {
            fullDate: nowDate,
            year: full.year,
            date: i,
            month: full.month,
            disable: !(disableBefore && disableAfter), // 禁用
            isDay, // 是否是今天
            week: week, // 星期几
          }
          dateArr.push(data)
        }
        return dateArr
      },
      /**
       * 比较时间大小
       */
      dateCompare(startDate, endDate) {
        // 计算截止时间
        startDate = new Date(startDate.replace('-', '/').replace('-', '/'))
        // 计算详细项的截止时间
        endDate = new Date(endDate.replace('-', '/').replace('-', '/'))
        if (startDate <= endDate) {
          return true
        } else {
          return false
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .page-index {
    height: 100vh;
    padding: 50px;

    .top-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 34px;
      margin-bottom: 12px;

      .left-item {
        display: flex;
        align-items: center;

        .icon-arrow {
          width: 12px;
          height: 12px;
          cursor: pointer;
        }

        .date-txt {
          height: 34px;
          font-weight: Bold;
          font-size: 24px;
          color: #4968FF;
          letter-spacing: 0;
          line-height: 34px;
          margin: 0 12px;
        }
      }

      .right-item {
        display: flex;
        align-items: center;

        .block-item {
          display: flex;
          align-items: center;
          height: 28px;
          cursor: pointer;
          padding: 0 11px;
          border-radius: 15px;
          margin-right: 6px;
          font-size: 12px;
          color: #323338;
          letter-spacing: 0;
          line-height: 28px;
          border: 1px solid transparent;

          .bg-block {
            width: 12px;
            height: 12px;
            border-radius: 2px;
            margin-right: 4px;
          }
        }

        .block-item:last-child {
          margin-right: 0;
        }

        .active-block {
          background: #E7EBFF;
          border: 1px solid #4968FF;
        }
      }
    }
  }

  .calendar {
    width: 100%;
    background: #ffffff;
    border-top: 1px solid #4968FF;
    border-left: 1px solid #4968FF;

    .calendar-title {
      display: flex;
      align-items: center;
      width: 100%;
      height: 32px;
      border-bottom: 1px solid #4968FF;

      .title-item {
        flex: 1;
        height: 31px;
        font-weight: 500;
        font-size: 16px;
        color: #323338;
        text-align: center;
        line-height: 31px;
        border-right: 1px solid #4968FF;
      }
    }

    .calendar-list {
      display: flex;
      align-items: center;
      width: 100%;
      height: auto;
      border-bottom: 1px solid #4968FF;

      .list-item {
        position: relative;
        flex: 1;
        border-right: 1px solid #4968FF;

        .block-item {
          width: 100.4%;
          margin-bottom: 8px;
          height: 20px;
        }

        .star-radius {
          border-radius: 10px 0 0 10px;
        }

        .end-radius {
          border-radius: 0 10px 10px 0;
        }

        .accept_list {
          background: #F8644E;
        }

        .deal_list {
          background: #FAA700;
        }

        .stay_accept_list {
          background: #9B6AE9;
        }

        .stay_eval_list {
          background: #14BC6C;
        }

        .eval_list {
          background: #1AB9FF;
        }

        .close_list {
          background: #D2D3D6;
        }

        .date-txt {
          margin: 8px 0 8px 8px;
          text-align: left;
          font-size: 14px;
          color: #323338;
        }

        .date-txt-active {
          color: #4968FF;
        }

        .date-txt-disable {
          color: #D2D3D6;
        }
      }
    }
  }
</style>
