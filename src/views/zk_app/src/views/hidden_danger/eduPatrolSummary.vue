<template>
  <section class="app-container">
    <div class="edu_patrol_time_wrapper">
      <div>
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
    </div>
    <section
      v-for="(item, index) in scl_list"
      :key="index"
      class="patrol_summary_list"
    >
      <div class="summary_list_title">
        <div class="title">{{ item.scl_name }}</div>
        <div class="list_title_right">
          <span class="spp-btn" @click="exportExcel(item.scl_id)">
            <svg-icon icon-class="exportAll" />
            <span>导出</span>
          </span>
        </div>
      </div>
      <div class="summary_list_data">
        <el-row :gutter="16">
          <el-col :span="18">
            <div class="summary_list_data_main">
              <div class="summary_list_data_title">巡检统计</div>
              <table class="patro_table">
                <tr>
                  <td class="td_bg" />
                  <td class="td_bg">日巡查点</td>
                  <td class="td_bg">周巡查点</td>
                  <td class="td_bg">月巡查点</td>
                  <td class="td_bg">总计</td>
                </tr>
                <tr>
                  <td class="td_bg">需巡查</td>
                  <td class="patrol_required">{{ item.dp_day_num }}</td>
                  <td class="patrol_required">{{ item.dp_week_num }}</td>
                  <td class="patrol_required">{{ item.dp_month_num }}</td>
                  <td class="patrol_required">{{ item.dp_total_num }}</td>
                </tr>
                <tr>
                  <td class="td_bg">已巡查</td>
                  <td class="completion_rate">{{ item.dp_day_num_ed }}</td>
                  <td class="completion_rate">{{ item.dp_week_num_ed }}</td>
                  <td class="completion_rate">{{ item.dp_month_num_ed }}</td>
                  <td class="completion_rate">{{ item.dp_total_num_ed }}</td>
                </tr>
                <tr>
                  <td class="td_bg">完成率</td>
                  <td class="patrolled">{{ item.dp_day_rate }}</td>
                  <td class="patrolled">{{ item.dp_week_rate }}</td>
                  <td class="patrolled">{{ item.dp_month_rate }}</td>
                  <td class="patrol_orange">{{ item.dp_total_rate }}</td>
                </tr>
              </table>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary_list_data_main">
              <div class="summary_list_data_title">隐患统计</div>
              <table class="patro_table hidden_table">
                <tr>
                  <td class="td_bg td_title">总隐患</td>
                  <td class="patrol_required">{{ item.hd_total_num }}</td>
                </tr>
                <tr>
                  <td class="td_bg td_title">已处理</td>
                  <td class="completion_rate">{{ item.hd_total_num_ed }}</td>
                </tr>
                <tr>
                  <td class="td_bg td_title">未处理</td>
                  <td class="patrol_required">
                    {{ item.hd_total_num - item.hd_total_num_ed }}
                  </td>
                </tr>
                <tr>
                  <td class="td_bg td_title">完成率</td>
                  <td class="patrolled">{{ item.hd_total_rate }}</td>
                </tr>
              </table>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { dpSummary, dpSummaryExport } from '@/api/patrolSummary'
export default {
  name: 'EduPatrolSummary',
  components: {},
  data() {
    return {
      check_month:
        new Date().getFullYear() +
        '-' +
        parseInt(new Date().getMonth() + 1) +
        '-' +
        '01',
      scl_list: []
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
        this.scl_list = res.data
      })
    },
    // 导出全部
    async exportExcel(scl_id) {
      const url = await dpSummaryExport(
        new Date(this.check_month).getFullYear() +
          this.transform_num(new Date(this.check_month).getMonth() + 1),
        scl_id
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
  margin-top: 16px;
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
    .summary_list_data_main {
      .summary_list_data_title {
        font-size: 16px;
        font-weight: bold;
        padding-bottom: 16px;
      }
    }
  }
}
</style>
<style lang="scss">
.edu_patrol_time_wrapper {
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
  .text {
    margin-right: 10px;
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
