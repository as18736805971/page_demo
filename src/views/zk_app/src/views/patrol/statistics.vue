<template>
  <div class="app-container page-container right-side-dialog">
    <div class="header-search single_line">
      <el-form
        ref="search_form"
        :model="search"
        :inline="true"
        label-width="120px"
      >
        <div class="form-area">
          <el-form-item label="负责人：">
            <el-input v-model="search.user_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker v-model="search.dp_day_start" type="date" placeholder="请选择时间" style="width:100%" />
          </el-form-item>
          <el-form-item label="结束时间：">
            <el-date-picker v-model="search.dp_day_end" type="date" placeholder="请选择时间" style="width:100%" />
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span
            class="spp-btn spp-btn-primary"
            @click="searchData()"
          >搜索</span>
          <span v-if="functionList.includes('A56003')" class="spp-btn" @click="exportAll">
            <svg-icon icon-class="exportAll" />
            <span>导出全部</span>
          </span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-header">
      <el-tabs v-model="activeName" class="att_tab" @tab-click="tabClick">
        <el-tab-pane label="完成率" name="completeRate" />
        <el-tab-pane label="完成明细" name="completeList" />
        <el-tab-pane label="未巡检明细" name="undoneList" />
        <el-tab-pane label="上报隐患处理进度" name="progressList" />
      </el-tabs>
    </div>
    <div class="main-body">
      <el-table v-show="activeName == 'completeRate'" :data="completeRateData">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="学校名称" prop="scl_name" />
        <el-table-column label="巡检项目" prop="patrol_name" />
        <el-table-column label="巡检频率" prop="patrol_rate_name" />
        <el-table-column label="负责人" prop="user_name" />
        <el-table-column label="完成数量" prop="patrol_num" />
        <el-table-column label="完成率" prop="done_rate" />
      </el-table>
      <el-table v-show="activeName == 'completeList'" :data="completeListData">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="学校名称" prop="scl_name" />
        <el-table-column label="巡检项目" prop="patrol_name" />
        <el-table-column label="巡检频率" prop="patrol_rate_name" />
        <el-table-column label="负责人" prop="user_name" />
        <el-table-column label="巡检时间" prop="create_time">
          <template slot-scope="scope">{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="巡检日期" prop="create_day">
          <template slot-scope="scope">{{ scope.row.create_day ? formatDateTime(scope.row.create_day) : '--' }}</template>
        </el-table-column>
        <el-table-column label="巡检状态" prop="patrol_status" />
        <el-table-column label="巡检报告" prop="patrol_result" />
      </el-table>
      <el-table v-show="activeName == 'undoneList'" :data="undoneListData">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="学校名称" prop="scl_name" />
        <el-table-column label="巡检项目" prop="patrol_name" />
        <el-table-column label="巡检频率" prop="patrol_rate_name" />
        <el-table-column label="负责人" prop="user_name" />
        <el-table-column label="巡检状态" prop="patrol_status" />
      </el-table>
      <el-table v-show="activeName == 'progressList'" :data="progressListData">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="学校名称" prop="scl_name" />
        <el-table-column label="巡检项目" prop="patrol_name" />
        <el-table-column label="隐患编号" prop="hd_no" />
        <el-table-column label="隐患位置" prop="hd_position" />
        <el-table-column label="隐患等级" prop="hd_level" />
        <el-table-column label="隐患处理意见" prop="hd_handle_tips" />
        <el-table-column label="隐患上报人" prop="create_name" />
        <el-table-column label="上报时间" prop="create_time">
          <template slot-scope="scope">{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="隐患处理状态" prop="hd_status" />
        <el-table-column label="隐患接收人" prop="to_user_name" />
        <el-table-column label="预期完成时间" prop="hd_except_time">
          <template slot-scope="scope">{{ scope.row.hd_except_time ? formatDateTime(scope.row.hd_except_time) : '--' }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { formatDateTime, getDateString } from '@/utils/index'
import {
  getDpCompleteRate,
  getDpCompleteList,
  getDpUndoneList,
  getDpProgressList,
  exportDpComplete
} from '@/api/patrol'
import { mapState } from 'vuex'
export default {
  name: 'PatrolStatistics',
  data() {
    return {
      height: window.innerHeight - 90,
      activeName: 'completeRate',
      search: {
        dp_day_start: new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
        dp_day_end: new Date(),
        user_name: ''
      },
      completeRateData: [],
      completeListData: [],
      undoneListData: [],
      progressListData: []
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
    this.getDpCompleteRate()
  },
  methods: {
    formatDateTime: formatDateTime,
    tabClick: function(tab, event) {
      this.getList(tab.name)
    },
    searchData: function() {
      this.getList(this.activeName)
    },
    getList: function(activeName) {
      switch (activeName) {
        case 'completeRate':
          this.getDpCompleteRate()
          break
        case 'completeList':
          this.getDpCompleteList()
          break
        case 'undoneList':
          this.getDpUndoneList()
          break
        case 'progressList':
          this.getDpProgressList()
          break
      }
    },
    getDpCompleteRate: function() {
      const search = {
        user_name: this.search.user_name,
        dp_day_start: this.search.dp_day_start
          ? getDateString(this.search.dp_day_start, 'yyyyMMdd') + '000000'
          : '',
        dp_day_end: this.search.dp_day_end
          ? getDateString(this.search.dp_day_end, 'yyyyMMdd') + '235959'
          : ''
      }
      getDpCompleteRate(search.user_name, search.dp_day_start, search.dp_day_end).then((response) => {
        this.completeRateData = response.data
      })
    },
    getDpCompleteList: function() {
      const search = {
        user_name: this.search.user_name,
        dp_day_start: this.search.dp_day_start
          ? getDateString(this.search.dp_day_start, 'yyyyMMdd') + '000000'
          : '',
        dp_day_end: this.search.dp_day_end
          ? getDateString(this.search.dp_day_end, 'yyyyMMdd') + '235959'
          : ''
      }
      getDpCompleteList(search.user_name, search.dp_day_start, search.dp_day_end).then((response) => {
        this.completeListData = response.data
      })
    },
    getDpUndoneList: function() {
      const search = {
        user_name: this.search.user_name,
        dp_day_start: this.search.dp_day_start
          ? getDateString(this.search.dp_day_start, 'yyyyMMdd') + '000000'
          : '',
        dp_day_end: this.search.dp_day_end
          ? getDateString(this.search.dp_day_end, 'yyyyMMdd') + '235959'
          : ''
      }
      getDpUndoneList(search.user_name, search.dp_day_start, search.dp_day_end).then((response) => {
        this.undoneListData = response.data
      })
    },
    getDpProgressList: function() {
      const search = {
        user_name: this.search.user_name,
        dp_day_start: this.search.dp_day_start
          ? getDateString(this.search.dp_day_start, 'yyyyMMdd') + '000000'
          : '',
        dp_day_end: this.search.dp_day_end
          ? getDateString(this.search.dp_day_end, 'yyyyMMdd') + '235959'
          : ''
      }
      getDpProgressList(search.user_name, search.dp_day_start, search.dp_day_end).then((response) => {
        this.progressListData = response.data
      })
    },
    exportAll: function() {
      const search = {
        user_name: this.search.user_name,
        dp_day_start: this.search.dp_day_start
          ? getDateString(this.search.dp_day_start, 'yyyyMMdd') + '000000'
          : '',
        dp_day_end: this.search.dp_day_end
          ? getDateString(this.search.dp_day_end, 'yyyyMMdd') + '235959'
          : ''
      }
      const url = exportDpComplete(search.user_name, search.dp_day_start, search.dp_day_end)
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
.main-header {
  display: block;
}
</style>
