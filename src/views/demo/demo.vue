<template>
  <div class="page">
    <div class="left-item" style="display: flex;align-items: center">
      <img class="icon-arrow" @click="handleChangeDate(1, 1)" src="@/assets/left.png">
      <div class="date-txt" style="color: #4968FF">{{ date.day }}</div>
      <img class="icon-arrow" @click="handleChangeDate(2, 1)" src="@/assets/right.png">
    </div>

    <div class="left-item" style="display: flex;align-items: center">
      <img class="icon-arrow" @click="handleChangeDate(1, 2)" src="@/assets/left.png">
      <div class="date-txt" style="color: #4968FF">{{ date.month }}</div>
      <img class="icon-arrow" @click="handleChangeDate(2, 2)" src="@/assets/right.png">
    </div>

    <div class="left-item" style="display: flex;align-items: center">
      <img class="icon-arrow" @click="handleChangeDate(1, 3)" src="@/assets/left.png">
      <div class="date-txt" style="color: #4968FF">{{ date.weekday }}</div>
      <img class="icon-arrow" @click="handleChangeDate(2, 3)" src="@/assets/right.png">
    </div>

    <div class="left-item" style="display: flex;align-items: center;color: #4968FF">
      <div @click="handleWeeks(1)">左</div>
      <div style="margin: 0 10px">{{ week.year }}年{{ week.month }}月 第{{ week.week }}周</div>
      <div @click="handleWeeks(2)">右</div>
    </div>
    <ul style="color: #F8644E">
      <li v-for="(item, index) in week.weeks" :key="index">{{item}}</li>
    </ul>
  </div>
</template>

<script>
import moment from "moment"

export default {
  name: "demo",
  data() {
    return {
      show: false,
      date: {
        day: moment().format('YYYY-MM-DD'),
        weekday: moment().format('YYYY-MM-DD'),
        month: moment().format('YYYY-MM')
      }, // 当前日期
      // 周
      week: {
        year: moment().year(),
        month: moment().month() + 1,
        week: moment().format('W'),
        weeks: [], // 周一至周日  排在第一位的就是周一
        weekday: moment().format('YYYY-MM-DD')
      }
    }
  },
  created() {
    this.week.weeks = this.getCurrWeekDays(this.week.weekday)
  },
  methods: {
    // 日期切换  day 1日 2月 3周
    // type 1 前  2 后
    handleChangeDate(type, day) {
      if (day === 1) {
        if (type === 1) {
          this.date.day = moment(this.date.day).subtract(1, 'days').format('YYYY-MM-DD')
        } else {
          this.date.day =  moment(this.date.day).add(1, 'days').format('YYYY-MM-DD')
        }
      } else if (day === 2) {
        if (type === 1) {
          this.date.month = moment(this.date.month).startOf('month').subtract('month', 1).format('YYYY-MM')
        } else {
          this.date.month = moment(this.date.month).startOf('month').subtract('month', -1).format('YYYY-MM')
        }
      } else {
        if (type === 1) {
          this.date.weekday = moment(this.date.weekday).weekday(-7).format('YYYY-MM-DD')
        } else {
          this.date.weekday = moment(this.date.weekday).weekday(7).format('YYYY-MM-DD')
        }
      }
    },
    // 周显示
    handleWeeks(type) {
      if (type === 1) {
        this.week.weekday = moment(this.week.weekday).weekday(-7).format('YYYY-MM-DD')
      } else {
        this.week.weekday = moment(this.week.weekday).weekday(7).format('YYYY-MM-DD')
      }
      this.week.year = moment(this.week.weekday).year()
      this.week.month = moment(this.week.weekday).month() + 1
      this.week.week = moment(this.week.weekday).format('W')
      this.week.weeks = this.getCurrWeekDays(this.week.weekday)
    },
    // 获取周一至周日日期
    getCurrWeekDays (day) {
      let date = []
      let weekOfDay = parseInt(moment(day).format('E'))
      let start = moment(day).subtract(weekOfDay - 1, 'days').format('MM-DD') // 周一日期
      let end = moment(day).add(7 - weekOfDay, 'days').format('MM-DD') // 周日日期
      date.push(start)
      for (let i = 1; i < 6 ; i++) {
        date.push(moment(start).add(i, 'days').format('MM-DD'))
      }
      date.push(end)
      return date
    }
  }
}
</script>
