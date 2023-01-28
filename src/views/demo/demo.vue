<template>
  <div class="page">
    <div class="left-item" style="display: flex;align-items: center">
      <img class="icon-arrow" @click="handleChangeDate(1, 1)" src="../assets/left.png">
      <div class="date-txt" style="color: #4968FF">{{ date.day }}</div>
      <img class="icon-arrow" @click="handleChangeDate(2, 1)" src="../assets/right.png">
    </div>

    <div class="left-item" style="display: flex;align-items: center">
      <img class="icon-arrow" @click="handleChangeDate(1, 2)" src="../assets/left.png">
      <div class="date-txt" style="color: #4968FF">{{ date.month }}</div>
      <img class="icon-arrow" @click="handleChangeDate(2, 2)" src="../assets/right.png">
    </div>

    <div class="left-item" style="display: flex;align-items: center">
      <img class="icon-arrow" @click="handleChangeDate(1, 3)" src="../assets/left.png">
      <div class="date-txt" style="color: #4968FF">{{ date.weekday }}</div>
      <img class="icon-arrow" @click="handleChangeDate(2, 3)" src="../assets/right.png">
    </div>
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
    }
  },
  created() {
    console.log(this.date)
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
  }
}
</script>
