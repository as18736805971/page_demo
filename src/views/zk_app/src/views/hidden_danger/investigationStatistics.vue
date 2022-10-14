<template>
  <section class="app-container right-side-dialog">
    <div class="investigation-container">
      <div class="main-header" style="border-bottom: none">
        <div class="left_des">
          <div class="left_item">
            <span class="square investigation_check_all" />
            <span class="text">全部排查</span>
          </div>
          <div class="left_item">
            <span class="square investigation_check_partial" />
            <span class="text">部分排查</span>
          </div>
          <div class="left_item">
            <span class="square investigation_check_not" />
            <span class="text">未排查</span>
          </div>
          <div class="left_item">
            <span class="square investigation_check_tobe" />
            <span class="text">待排查</span>
          </div>
        </div>
        <div class="right_control">
          <div class="filter_type">
            <span
              class="filter_item"
              :class="{
                check_filter: type === 1,
                check_filter_one: type === 1,
              }"
              @click="choice_type(1)"
            >日巡查点</span>
            <span
              class="filter_item"
              :class="{
                check_filter: type === 2,
                check_filter_one_two: type === 1,
                check_filter_one_three: type === 3,
              }"
              @click="choice_type(2)"
            >周巡查点</span>
            <span
              class="filter_item"
              :class="{
                check_filter: type === 3,
                check_filter_three: type === 3,
              }"
              @click="choice_type(3)"
            >月巡查点</span>
          </div>
          <div class="choice_time">
            <div v-if="type === 1 || type === 2" class="time_common">
              <span class="time_text">月份:</span>
              <el-date-picker
                v-model="check_month"
                type="month"
                placeholder="选择月"
                value-format="yyyy-MM-dd"
                @change="init_table_title"
              />
            </div>
            <div v-if="type === 3" class="time_common">
              <span class="time_text">年份:</span>
              <el-date-picker
                v-model="check_month"
                type="year"
                placeholder="选择年"
                value-format="yyyy-MM-dd"
                @change="init_table_title"
              />
            </div>
          </div>
          <div class="export_excel">
            <span class="spp-btn" @click="exportAll">
              <svg-icon icon-class="exportAll" />
              <span>导出</span>
            </span>
          </div>
        </div>
      </div>
      <div class="main-body">
        <el-table
          ref="multipleTable"
          :data="statistics_data"
          border
          :cell-style="cellStyle"
          @cell-click="view_detail"
        >
          <el-table-column width="148" prop="name" fixed>
            <template slot="header">
              <span class="y_text">人员</span><span class="x_text">时间</span>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item, index) in table_title_list"
            :key="index"
            :label="item"
          >
            <template slot-scope="scope">
              <div
                v-if="
                  scope.row[
                    type === 1
                      ? new Date(check_month).getFullYear() +
                        '-' +
                        transform_num(new Date(check_month).getMonth() + 1) +
                        '-' +
                        item.split('.')[1]
                      : String(index + 1)
                  ]
                "
                class="cell_main_wrapper"
                :class="{
                  investigation_check_not:
                    scope.row[
                      type === 1
                        ? new Date(check_time).getFullYear() +
                          '-' +
                          transform_num(new Date(check_time).getMonth() + 1) +
                          '-' +
                          item.split('.')[1]
                        : String(index + 1)
                    ].split('/')[0] === '0',
                  investigation_check_partial:
                    parseInt(
                      scope.row[
                        type === 1
                          ? new Date(check_time).getFullYear() +
                            '-' +
                            transform_num(new Date(check_time).getMonth() + 1) +
                            '-' +
                            item.split('.')[1]
                          : String(index + 1)
                      ].split('/')[0]
                    ) > 0 &&
                    parseInt(
                      scope.row[
                        type === 1
                          ? new Date(check_time).getFullYear() +
                            '-' +
                            transform_num(new Date(check_time).getMonth() + 1) +
                            '-' +
                            item.split('.')[1]
                          : String(index + 1)
                      ].split('/')[0]
                    ) <
                    parseInt(
                      scope.row[
                        type === 1
                          ? new Date(check_time).getFullYear() +
                            '-' +
                            transform_num(
                              new Date(check_time).getMonth() + 1
                            ) +
                            '-' +
                            item.split('.')[1]
                          : String(index + 1)
                      ].split('/')[1]
                    ),
                  investigation_check_all:
                    parseInt(
                      scope.row[
                        type === 1
                          ? new Date(check_time).getFullYear() +
                            '-' +
                            transform_num(new Date(check_time).getMonth() + 1) +
                            '-' +
                            item.split('.')[1]
                          : String(index + 1)
                      ].split('/')[0]
                    ) ===
                    parseInt(
                      scope.row[
                        type === 1
                          ? new Date(check_time).getFullYear() +
                            '-' +
                            transform_num(new Date(check_time).getMonth() + 1) +
                            '-' +
                            item.split('.')[1]
                          : String(index + 1)
                      ].split('/')[1]
                    ),
                  investigation_check_tobe_cell:
                    (type == 1 &&
                    new Date(
                      new Date(check_time).getFullYear() +
                        '-' +
                        transform_num(new Date(check_time).getMonth() + 1) +
                        '-' +
                        item.split('.')[1]
                    ) > new Date()) ||
                    (type === 3 &&
                    new Date(check_month).getFullYear() >
                    new Date().getFullYear()) ||
                    (type === 2 &&
                    new Date(check_month).getFullYear() >
                    new Date().getFullYear()) ||
                    (type === 2 &&
                    item.indexOf('-') !== -1 &&
                    new Date(check_month).getMonth() ===
                    new Date().getMonth() &&
                    parseInt(
                      item.substring(item.indexOf('.') + 1, item.indexOf('-'))
                    ) > new Date().getDate()) ||
                    (type === 2 &&
                    item.indexOf('-') === -1 &&
                    new Date(check_month).getMonth() ===
                    new Date().getMonth() &&
                    parseInt(
                      item.substring(item.indexOf('.') + 1, item.indexOf(')'))
                    ) > new Date().getDate()) ||
                    (type === 2 &&
                    new Date(check_month).getMonth() >
                    new Date().getMonth()) ||
                    (type === 3 &&
                    new Date(check_month).getFullYear() ===
                    new Date().getFullYear() &&
                    parseInt(item.substring(0, item.indexOf('月'))) >
                    new Date().getMonth() + 1),
                }"
              >
                <span class="cell_child_wrapper">
                  {{
                    scope.row[
                      type === 1
                        ? new Date(check_month).getFullYear() +
                          "-" +
                          transform_num(new Date(check_month).getMonth() + 1) +
                          "-" +
                          item.split(".")[1]
                        : String(index + 1)
                    ]
                  }}</span>
              </div></template>
          </el-table-column>
        </el-table>
        <!-- <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="statisticsObj.page_num"
          :limit.sync="statisticsObj.page_size"
          @pagination="getData"
        /> -->
      </div>
    </div>
    <el-dialog
      v-if="investigationDialog"
      title="排查详情"
      :visible.sync="investigationDialog"
      :close-on-click-modal="false"
      width="720px"
      class="investigation-detail"
    >
      <div>
        <div class="common-item">
          <span class="title">排查人:</span>
          <span class="content">{{ investigation_detail.user_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">排查时间:</span>
          <span v-if="type === 1 || type === 2" class="content">{{
            formatDate(investigation_detail.date)
          }}</span>
          <span v-else class="content">{{
            formatMonth(investigation_detail.date)
          }}</span>
        </div>
        <div class="common-item">
          <span class="title">排查频率:</span>
          <span class="content">{{ investigation_detail.frequency }}</span>
        </div>
      </div>
      <div class="filter_wrapper">
        <div class="filter_top">
          <span
            class="top_item"
            :class="{ top_checked: filter_type === 1 }"
            @click="change_filter_type(1)"
          >已排查({{ investigation_detail.normal.total }})</span>
          <span
            class="top_item"
            :class="{ top_checked: filter_type === 2 }"
            @click="change_filter_type(2)"
          >未排查({{ investigation_detail.abnormal.total }})</span>
        </div>
        <div class="investigation_list">
          <div
            v-for="(item, index) in investigation_list"
            :key="index"
            class="investigation_item"
          >
            <div class="investigation_title">{{ item.patrol_name }}</div>
            <div class="common-item">
              <span class="title">排查内容:</span>
              <span class="content">{{ item.patrol_content }}</span>
            </div>
            <div v-if="filter_type === 1" class="common-item">
              <span class="title">排查结果:</span>
              <span
                v-show="item.patrol_status === '1'"
                class="content"
                style="color: #4dcd70"
              >正常</span>
              <span
                v-show="item.patrol_status !== '1'"
                class="content"
                style="color: #f75a53"
              >异常</span>
            </div>
            <div v-if="filter_type === 1" class="common-item">
              <span class="title">排查时间:</span>
              <span class="content">{{
                formatDateTime(item.create_time)
              }}</span>
            </div>
            <div v-if="filter_type === 1 && item.patrol_status === '2'" class="common-item">
              <span class="title">排查报告:</span>
              <span class="content">{{ item.patrol_result }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  statisticsDay,
  statisticsWeek,
  statisticsYear,
  statisticsDay_detail,
  statisticsWeek_detail,
  statisticsYear_detail,
  exportPatrolExcel
} from '@/api/investigationStatistics'
// import Pagination from '@/components/Pagination'
import { formatDate, formatDateTime, formatMonth } from '@/utils'
export default {
  name: 'InvestigationStatistics',
  // components: { Pagination },
  data() {
    return {
      investigationDialog: false,
      statisticsObj: {
        page_num: 1,
        page_size: 10
      },
      statistics_data: [],
      total: 0,
      type: null,
      check_month:
        new Date().getFullYear() +
        '-' +
        parseInt(new Date().getMonth() + 1) +
        '-' +
        '01',
      table_title_list: [],
      month_list: [
        '1月',
        '2月',
        '3月',
        '4月',
        '5月',
        '6月',
        '7月',
        '8月',
        '9月',
        '10月',
        '11月',
        '12月'
      ],
      filter_type: 1,
      investigation_list: [],
      check_time: '', // 月份单独处理  防止报错
      investigation_detail: {}
    }
  },
  computed: {},
  async created() {},
  mounted() {
    this.choice_type(1)
  },
  methods: {
    formatDate: formatDate,
    formatMonth: formatMonth,
    formatDateTime: formatDateTime,
    cellStyle({ row, column, rowIndex, columnIndex }) {
      let cellStyle
      if ((rowIndex >= 0) & (columnIndex === 0)) {
        cellStyle = 'background: #F5FAFF;height: 76px;text-align: center'
      }
      return cellStyle
    },
    // 导出全部
    async exportAll() {
      let start_time = ''
      if (this.type === 1 || this.type === 2) {
        start_time =
          new Date(this.check_month).getFullYear() +
          this.transform_num(new Date(this.check_month).getMonth() + 1)
      } else {
        start_time = new Date(this.check_month).getFullYear()
      }
      const url = await exportPatrolExcel(start_time)
      window.open(url)
    },
    // 查看统计详情
    view_detail(row, column, event, cell) {
      if (!column.fixed) {
        switch (this.type) {
          case 1:
            statisticsDay_detail(
              new Date(this.check_month).getFullYear() +
                (this.transform_num(new Date(this.check_month).getMonth() + 1) +
                  column.label.split('.')[1]),
              row.user_id
            ).then((res) => {
              this.investigation_detail = res.data
              this.change_filter_type(1)
              this.investigationDialog = true
            })
            break
          case 2:
            statisticsWeek_detail(
              new Date(this.check_month).getFullYear() +
                this.transform_num(new Date(this.check_month).getMonth() + 1),
              column.label.substring(1, 2),
              row.user_id
            ).then((res) => {
              this.investigation_detail = res.data
              this.change_filter_type(1)
              this.investigationDialog = true
            })
            break
          case 3:
            statisticsYear_detail(
              new Date(this.check_month).getFullYear() +
                this.transform_num(new Date(this.check_month).getMonth() + 1),
              row.user_id
            ).then((res) => {
              this.investigation_detail = res.data
              this.change_filter_type(1)
              this.investigationDialog = true
            })
            break // 可选
        }
      }
    },
    // 切换排查类型
    change_filter_type(type) {
      this.filter_type = type
      if (type === 1) {
        this.investigation_list = this.investigation_detail.normal.data
      } else {
        this.investigation_list = this.investigation_detail.abnormal.data
      }
    },
    // 选择巡查点类型
    choice_type(type) {
      this.type = type
      this.init_table_title()
    },
    transform_num(num) {
      if (num < 10) {
        return '0' + num
      } else {
        return String(num)
      }
    },
    // 初始化表格标题
    init_table_title() {
      this.statistics_data = []
      switch (this.type) {
        case 1:
          this.table_title_list = JSON.parse(
            JSON.stringify(
              this.getDaysInMonth(
                new Date(this.check_month).getFullYear(),
                new Date(this.check_month).getMonth() + 1
              )
            )
          )
          statisticsDay(
            new Date(this.check_month).getFullYear() +
              this.transform_num(new Date(this.check_month).getMonth() + 1)
          ).then((res) => {
            this.statistics_data = res.data
            this.check_time = this.check_month
          })
          break
        case 2:
          this.table_title_list = JSON.parse(
            JSON.stringify(
              this.getWeek(
                new Date(this.check_month).getFullYear(),
                new Date(this.check_month).getMonth() + 1
              )
            )
          )
          statisticsWeek(
            new Date(this.check_month).getFullYear() +
              this.transform_num(new Date(this.check_month).getMonth() + 1)
          ).then((res) => {
            this.statistics_data = res.data
          })
          break
        case 3:
          statisticsYear(new Date(this.check_month).getFullYear()).then(
            (res) => {
              this.statistics_data = res.data
            }
          )
          this.table_title_list = JSON.parse(JSON.stringify(this.month_list))
          break // 可选
      }
    },
    getDaysInMonth(year, month) {
      const daysOfMonth = []
      month = parseInt(month, 10)
      const lastDayOfMonth = new Date(year, month, 0).getDate()
      for (let i = 1; i <= lastDayOfMonth; i++) {
        if (i < 10) {
          daysOfMonth.push(month + '.' + '0' + i) // 判断是部否小于10，如果小于加0，，例如“01”
        } else {
          daysOfMonth.push(month + '.' + i + '')
        }
      }
      return daysOfMonth
    },
    // 获取周
    getWeek(year, month) {
      var d = new Date()
      d.setFullYear(year, month - 1, 1)
      var w1 = d.getDay()
      if (w1 === 0) w1 = 7
      d.setFullYear(year, month, 0)
      var dd = d.getDate()
      var d1 = ''
      if (w1 !== 1) d1 = 7 - w1 + 2
      else d1 = 1
      const week_count = Math.ceil((dd - d1 + 1) / 7)
      const count_list = []
      for (var i = 0; i < week_count; i++) {
        var monday = d1 + i * 7
        var sunday = monday + 6
        var from = monday
        var to
        if (sunday <= dd) {
          to = sunday
        } else {
          d.setFullYear(year, month - 1, sunday)
          to = d.getDate()
        }
        count_list.push(from + '-' + to)
      }
      if (count_list[0].split('-')[0] !== '1') {
        if (parseInt(count_list[0].split('-')[0] - 1) === 1) {
          count_list.unshift('1')
        } else {
          count_list.unshift(
            '1' + '-' + parseInt(count_list[0].split('-')[0] - 1)
          )
        }
      }
      if (parseInt(count_list[count_list.length - 1].split('-')[1]) < 7) {
        if (parseInt(count_list[count_list.length - 1].split('-')[0]) === dd) {
          count_list[count_list.length - 1] = String(dd)
        } else {
          count_list[count_list.length - 1] =
            count_list[count_list.length - 1].split('-')[0] + '-' + dd
        }
      }
      const result_list = []
      count_list.forEach((item, index) => {
        let result = ''
        item.split('-').forEach((opt) => {
          result += month + '.' + opt + '-'
        })
        result_list.push(
          '第' +
            (index + 1) +
            '周(' +
            result.substring(0, result.length - 1) +
            ')'
        )
      })
      return result_list
    }
  }
}
</script>
<style lang="scss" scoped>
.investigation_check_all {
  background: #3be38a;
  color: #fff;
}
.investigation_check_partial {
  background: #65b5ff;
  color: #fff;
}
.investigation_check_not {
  background: #ff7761;
  color: #fff;
}
.investigation_check_tobe {
  background: #e1e6eb;
}
.investigation_check_tobe_cell {
  background: #f5faff;
  color: #c0c8d1;
}
.investigation-container {
  .main-header {
    .left_des {
      display: flex;
      .left_item {
        display: flex;
        align-items: center;
        margin-right: 32px;
        .square {
          display: inline-block;
          width: 14px;
          height: 14px;
          border-radius: 2px;
        }
        .text {
          font-size: 14px;
          color: #313233;
          margin-left: 6px;
        }
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
    .right_control {
      display: flex;
      align-items: center;
      .filter_type {
        display: flex;
        border-radius: 4px;
        font-size: 14px;
        color: #999999;
        margin-right: 40px;
        .filter_item {
          padding: 8px 13px;
          cursor: pointer;
          border: 1px solid #d3d7db;
          &:first-of-type {
            border-right: none;
            border-radius: 4px 0px 0px 4px;
          }
          &:last-of-type {
            border-left: none;
            border-radius: 0px 4px 4px 0px;
          }
        }
        .check_filter {
          border-color: #3399ff;
          color: #3399ff;
          position: relative;
        }
        .check_filter_one {
          border-right: 1px solid #3399ff !important;
        }
        .check_filter_three {
          border-left: 1px solid #3399ff !important;
        }
        .check_filter_one_two {
          border-left: none;
        }
        .check_filter_one_three {
          border-right: none;
        }
      }
      .choice_time {
        .time_common {
          display: flex;
          align-items: center;
          .time_text {
            margin-right: 11px;
            font-size: 14px;
            color: #313233;
          }
        }
      }
      .export_excel {
        margin-left: 40px;
        .spp-btn {
          height: 32px;
          margin-right: 0;
          line-height: 30px;
          padding: 0 13px;
        }
      }
    }
  }
  .cell_main_wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    .cell_child_wrapper {
      position: absolute;
      left: 10px;
      bottom: 9px;
    }
  }
}
.investigation-detail {
  .common-item {
    .title {
      width: 80px;
    }
    .content {
      width: calc(100% - 80px);
    }
  }
  .filter_wrapper {
    width: 100%;
    margin-top: 15px;
    .filter_top {
      display: flex;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      .top_item {
        flex: 1;
        text-align: center;
        padding: 10px 0;
        color: #606266;
        font-size: 14px;
        cursor: pointer;
      }
      .top_checked {
        background: #3399ff;
        color: #ffffff;
      }
    }
    .investigation_list {
      padding-top: 23px;
      .investigation_item {
        background: #f0f5fa;
        border: 1px solid #e1e3e6;
        padding: 15px 10px;
        margin-bottom: 10px;
        .investigation_title {
          color: #313233;
          font-weight: bold;
          font-size: 16px;
        }
        .common-item {
          line-height: normal;
          margin-bottom: 0;
          margin-top: 10px;
          .title {
            width: 70px;
            color: #626466;
          }
          .content {
            color: #626466;
          }
        }
        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.investigation-container {
  .el-table--medium th {
    padding: 18px 0;
  }
  .el-table__header {
    .cell {
      font-weight: normal;
      color: #313233;
    }
    th {
      background: #f5faff;
      text-align: center;
    }
    tr {
      th {
        &:first-of-type {
          position: relative;
          background: #fff;
          .cell {
            overflow: visible;
          }
          .x_text {
            position: absolute;
            right: 25px;
            color: #939699;
            top: -10px;
          }
          .y_text {
            position: absolute;
            left: 24px;
            color: #939699;
            bottom: -10px;
          }
          &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 1px;
            width: 160px;
            background-color: #ebf0f5;
            transform-origin: left;
            transform: rotate(23deg);
          }
        }
      }
    }
  }
  .el-table__body-wrapper {
    .el-table__body td {
      position: relative;
      height: 76px;
    }
    .el-table__body .cell {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 174px;
  }
  .el-input--medium .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .el-input--medium .el-input__icon {
    line-height: 32px;
  }
}
</style>
