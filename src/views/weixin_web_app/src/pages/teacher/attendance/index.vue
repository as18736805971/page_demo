<template>
  <div class="attendance">
    <calendar
      :default-date="defaultDatetime"
      :is-show-week-view="true"
      @confirm="dateConfirm"
      @weekshow="weekshow"
    ></calendar>

    <template v-if="page_show">
      <div class="tab-list">
        <div class="item-tab" v-for="(item ,index) in tab_list" :key="index" @click="handleTab(index, item)">
          <div class="item" :class="index === activeIndex ? 'active' : ''">{{ item.pos_name }}</div>
          <div class="line" v-if="activeIndex === index"></div>
        </div>
      </div>

      <div class="att-list">
        <template v-if="activeIndex === 0">
          <template v-if="activeType === 1">
            <class-list :list.sync="class_list" @handleGetStudent="handleGetStudent"></class-list>
          </template>
          <template v-else>
            <student-list :att_list="att_list" :att_num="att_num" :not_list="not_list" :not_num="not_num" @handleDetail="handleDetail"></student-list>
          </template>
        </template>
        <template v-else>
          <template v-if="activeType === 1">
            <class-list :list.sync="class_list" @handleGetStudent="handleGetStudent"></class-list>
          </template>
          <template v-else>
            <student-list :att_list="att_list" :att_num="att_num" :not_list="not_list" :not_num="not_num" @handleDetail="handleDetail"></student-list>
          </template>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
  import calendar from "@/components/calendar"
  import ClassList from './components/class_list'
  import StudentList from './components/student_list'
  import { httpFormPostMethod } from "@/common/HttpService"

  export default {
    name: "attendance_index",
    components: { calendar, ClassList, StudentList },
    data() {
      return {
        defaultDatetime: new Date(),
        gra_id: this.$route.query.gra_id || '',
        cls_id: this.$route.query.cls_id || '',
        tab_list: [],
        parameter: {
          att_type: -1,
          att_date: '',
        },
        activeIndex: 0,
        activeType: 0, // 1年级 2学生
        class_list: [],
        att_list: [], // 正常打卡
        att_num: 0, // 正常打卡人数
        not_list: [], // 异常打卡
        not_num: 0, // 异常打卡人数
        page_show: false,
      }
    },
    methods: {
      // 获取tab
      handleGetTab() {
        httpFormPostMethod('pajx/postype/wx/scl', {}).then((res) => {
          let list = res.data.att_type
          this.tab_list = list
          this.parameter.att_type = list[0].pos_code
          if (this.gra_id !== '' && this.cls_id !== '') {
            this.activeType = 2
            this.handleGetStudent({ cls_id: this.cls_id })
            this.page_show = true
          } else {
            httpFormPostMethod('web/use/att/gra/list', {
              att_type: list[0].pos_code,
              att_date: this.parameter.att_date,
            }).then((res) => {
              let list = res.data
              list.map((item) => {
                item.item_show = false
              })
              this.class_list = list
              this.activeType = 1
              this.page_show = true
            })
          }
        })
      },
      // 获取分组
      handleGetGroup() {
        if (this.parameter.att_type !== -1) {
          httpFormPostMethod('web/use/att/gra/list', this.parameter).then((res) => {
            let list = res.data
            list.map((item) => {
              item.item_show = false
            })
            this.class_list = list
          })
        }
      },
      // 切换tab
      handleTab(index, data) {
        this.activeIndex = index
        this.parameter.att_type = data.pos_code
        if (this.gra_id !== '' && this.cls_id !== '') {
          this.handleGetStudent({ cls_id: this.cls_id })
        } else {
          this.activeType = 1
          this.handleGetGroup()
        }
      },
      // 点击班级 获取学生列表
      handleGetStudent(data) {
        httpFormPostMethod('web/use/att/class/list', {
          att_type: this.parameter.att_type,
          att_date: this.parameter.att_date,
          cls_id: data.cls_id,
        }).then((res) => {
          let data = res.data
          this.att_list = data.att_stu || []
          this.att_num = data.stu_att_num || 0
          this.not_list = data.not_att_stu || []
          this.not_num = data.stu_not_att_num || 0
          this.activeType = 2
        })
      },
      // 点击学生 跳转至考勤详情
      handleDetail(data) {
        this.$router.push({
          path: 'att_detail',
          query: {
            att_type: this.parameter.att_type,
            att_date: this.parameter.att_date,
            stu_id: data.stu_id,
          }
        })
      },
      // 日历组件选中的日期
      dateConfirm(day) {
        this.parameter.att_date = day
        this.handleGetTab()
      },
      // 日历组件折叠
      weekshow(flag) {
        this.ifweek = flag
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../styles/mixin';

  .attendance {
    .tab-list {
      width: 100%;
      height: 2.4rem;
      background: #ffffff;
      display: flex;
      align-items: center;
      margin-top: 0.5rem;
      overflow-x: auto;

      .item-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        flex: 1;
        min-width: 5rem;
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
          width: 1.6rem;
          height: 0.1rem;
          background: #3297ff;
          border-radius: 0.05rem;
        }
      }

      .active {
        font-size: 0.8rem;
        font-weight: 600;
        color: #3399ff;
      }

      .tip {
        margin-left: 0.2rem;
        width: 0.8rem;
        height: 0.8rem;
        background: #f0644d;
        border-radius: 50%;;
        font-size: 0.55rem;
        font-weight: 400;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .att-list {
      width: 100%;
      // height: calc(100vh - 11.2rem);
      // height: calc(100vh - 20.7rem);
    }
  }
</style>
