<template>
  <section class="app-container">
    <section class="patrol_summary_list edu_patrol_summary_list">
      <div class="summary_list_title">
        <div class="title">{{ summary_obj.scl_name }}</div>
        <div class="list_title_right">
          <div class="time_wrapper">
            <span class="text">时间:</span>
            <el-date-picker
              v-model="check_month"
              type="month"
              placeholder="选择月"
              value-format="yyyy-MM-dd"
              :clearable="false"
              @change="dp_summary"
            />
          </div>
          <span class="spp-btn" @click="exportExcel">
            <svg-icon icon-class="exportAll" />
            <span>导出</span>
          </span>
        </div>
      </div>
      <div class="summary_list_data">
        <div class="summary_list_data_title">巡检统计</div>
        <table class="patro_table">
          <tr>
            <td class="td_bg td_title" />
            <td class="td_bg td_title">日巡查点</td>
            <td class="td_bg td_title">周巡查点</td>
            <td class="td_bg td_title">月巡查点</td>
            <td class="td_bg td_title">总计</td>
          </tr>
          <tr>
            <td class="td_bg">需巡查</td>
            <td class="patrol_required">{{ summary_obj.dp_day_num }}</td>
            <td class="patrol_required">{{ summary_obj.dp_week_num }}</td>
            <td class="patrol_required">{{ summary_obj.dp_month_num }}</td>
            <td class="patrol_required">{{ summary_obj.dp_total_num }}</td>
          </tr>
          <tr>
            <td class="td_bg">已巡查</td>
            <td class="completion_rate">{{ summary_obj.dp_day_num_ed }}</td>
            <td class="completion_rate">{{ summary_obj.dp_week_num_ed }}</td>
            <td class="completion_rate">{{ summary_obj.dp_month_num_ed }}</td>
            <td class="completion_rate">{{ summary_obj.dp_total_num_ed }}</td>
          </tr>
          <tr>
            <td class="td_bg">完成率</td>
            <td class="patrolled">{{ summary_obj.dp_day_rate }}</td>
            <td class="patrolled">{{ summary_obj.dp_week_rate }}</td>
            <td class="patrolled">{{ summary_obj.dp_month_rate }}</td>
            <td class="patrol_orange">{{ summary_obj.dp_total_rate }}</td>
          </tr>
        </table>
        <div class="summary_list_data_title" style="padding-top: 16px">
          隐患统计
        </div>
        <table class="patro_table">
          <tr>
            <td class="td_bg td_title">总隐患</td>
            <td class="td_bg td_title">已处理</td>
            <td class="td_bg td_title">未处理</td>
            <td class="td_bg td_title">完成率</td>
          </tr>
          <tr>
            <td class="patrol_required">{{ summary_obj.hd_total_num }}</td>
            <td class="completion_rate">{{ summary_obj.hd_total_num_ed }}</td>
            <td class="patrol_required">
              {{ summary_obj.hd_total_num - summary_obj.hd_total_num_ed }}
            </td>
            <td class="patrolled">{{ summary_obj.hd_total_rate }}</td>
          </tr>
        </table>
      </div>
    </section>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { dpSummary, dpSummaryExport } from '@/api/patrolSummary'
export default {
  name: 'SchPatrolSummary',
  components: {},
  data() {
    return {
      check_month:
        new Date().getFullYear() +
        '-' +
        parseInt(new Date().getMonth() + 1) +
        '-' +
        '01',
      summary_obj: {}
    }
  },
  computed: {
    ...mapGetters(['user_type'])
  },
  async created() {
    this.dp_summary()
  },
  methods: {
    // 获取数据
    dp_summary() {
      dpSummary(
        new Date(this.check_month).getFullYear() +
          this.transform_num(new Date(this.check_month).getMonth() + 1)
      ).then((res) => {
        this.summary_obj = res.data[0]
      })
    },
    // 导出全部
    async exportExcel() {
      const url = await dpSummaryExport(
        new Date(this.check_month).getFullYear() +
          this.transform_num(new Date(this.check_month).getMonth() + 1),
        this.summary_obj.scl_id
      )
      window.open(url)
    },
    transform_num(num) {
      if (num < 10) {
        return '0' + num
      } else {
        return String(num)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.patrol_summary_list {
  background: #ffffff;
  border-radius: 4px;
  .summary_list_title {
    display: flex;
    justify-content: space-between;
    padding: 22px 16px;
    border-bottom: 1px solid #ebf0f5;
    .title {
      color: #313233;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .summary_list_data {
    padding: 16px;
    .summary_list_data_title {
      font-size: 16px;
      font-weight: bold;
      padding-bottom: 16px;
    }
  }
}
.edu_patrol_summary_list {
  td {
    padding: 33px 0;
  }
  .td_title {
    padding: 16px 0;
  }
}
</style>
