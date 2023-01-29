<template>
  <div class="demo_index">
    <table class="date_table" cellpadding="0" cellspacing="0" border="0">
      <tr class="block_item">
        <td class="title">全天</td>
        <td class="content"></td>
      </tr>

      <!--<tr class="block_item">
        <td class="title">00:00</td>
        <td class="content">文件标题</td>
      </tr>
      <tr class="block_item">
        <td class="title">01:00</td>
        <td class="content">文件标题</td>
      </tr>
      <tr class="block_item">
        <td class="title">02:00</td>
        <td class="content" :rowspan="2">文件标题</td>
      </tr>
      <tr class="block_item">
        <td class="title">03:00</td>
      </tr>
      <tr class="block_item">
        <td class="title">04:00</td>
        <td class="content">文件标题</td>
      </tr>-->

      <tr class="block_item" v-for="(item, index) in date_list" :key="index">
        <td class="title">{{ item.time }}</td>
        <td class="content" v-if="item.show" :rowspan="item.merge_num">
          <template v-if="item.title">
            [{{ item.title }}]{{ item.content }}
          </template>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "demo2",
  data() {
    return {
      date_list: [{
        time: '00:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '01:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '02:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '03:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '04:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '05:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '06:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '07:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '08:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '09:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '10:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '11:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '12:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '13:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '14:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '15:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '16:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '17:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '18:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '19:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '20:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '21:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '22:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      },{
        time: '23:00',
        merge_num: 1,
        show: true,
        title: '',
        content: ''
      }],
      schedule_list: [{
        start_time: '07:01',
        end_time: '9:59',
        title: '个人',
        content: '开个会'
      },{
        start_time: '12:09',
        end_time: '15:29',
        title: '组织学习',
        content: '做笔记'
      },{
        start_time: '18:06',
        end_time: '22:35',
        title: '个人',
        content: '开个会'
      }]
    }
  },
  created() {
    this.handleFormatDate()
    // console.log(this.handleCompareDate('08:01', '08:00'))
    // console.log(this.handleCompareDate('10:00', '08:00'))
  },
  methods: {
    // 格式化显示日期格式
    handleFormatDate() {
      let index = 0
      for (let item of this.schedule_list) {
        for (let vv of this.date_list) {
          if (this.handleCompareDate(item.start_time, vv.time) && this.handleCompareDate(vv.time, item.end_time)) {
            if (index === 0) {
              vv.title = item.title
              vv.content = item.content
            } else {
              vv.show = false
            }
            index += 1
          }
        }
        item.merge_num = index
        index = 0
      }
      for (let item of this.schedule_list) {
        for (let vv of this.date_list) {
          if (this.handleCompareDate(item.start_time, vv.time) && this.handleCompareDate(vv.time, item.end_time)) {
            vv.merge_num = item.merge_num
            break
          }
        }
      }
    },
    // 比较时间大小
    handleCompareDate(t1, t2){
      let date = new Date()
      let a = t1.split(':')
      let b = t2.split(':')
      if (a[0] === b[0]) {
        return true
      } else {
        return date.setHours(a[0], a[1]) < date.setHours(b[0], b[1])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.demo_index {
  padding: 20px;
  color: #4968FF;
}

.date_table {
  width: 500px;
  color: #323338;
  border-top: 1px solid #4968FF;
  border-left: 1px solid #4968FF;
  border-right: 1px solid #4968FF;

  .block_item {
    width: 100%;

    .title {
      width: 80px;
      padding: 10px 0;
      text-align: center;
      border-right: 1px solid #4968FF;
      border-bottom: 1px solid #4968FF;
    }

    .content {
      padding: 10px;
      border-bottom: 1px solid #4968FF;
    }
  }
}
</style>
