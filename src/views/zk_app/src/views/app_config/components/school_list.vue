<template>
  <div>
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="学校名称：">
            <el-input v-model="search.keyword" placeholder="请输入" />
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="resetForm()">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="scl_list">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="学校" prop="scl_name" />
        <el-table-column label="APP模块类型" prop="is_default">
          <template slot-scope="scope">{{ scope.row.is_default === '1' ? '自定义' : '默认' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A37006')" type="text" @click="setAuth(scope.row.scl_id)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
    </div>
    <el-dialog
      title="设置APP默认模块"
      :visible.sync="showAPPDialog"
      :close-on-click-modal="false"
      width="840px"
    >
      <el-form label-width="80px" class="model_form insider_form">
        <el-transfer
          v-model="choiceModule"
          :data="moduleList"
          :titles="['模块列表', '已选模块']"
          filterable
          filter-placeholder="搜索模块"
        />
        <el-form-item class="model_btn_group">
          <span class="spp-btn spp-btn-primary" @click="submitDefault()">提交</span>
          <span class="spp-btn" @click="showAPPDialog=false">取消</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { appSclPaginate, configSave, appSclChoose, allFunction } from '@/api/app_config'
import { formatDateTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
export default {
  name: 'SchoolList',
  components: { Pagination },
  props: {
    functionList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      search: {
        keyword: ''
      },
      total: 0,
      page: 1,
      page_size: 20,
      scl_list: [],
      showAPPDialog: false,
      choiceModule: [],
      moduleList: [],
      scl_id_selected: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    searchData: function() {
      this.page = 1
      this.getData()
    },
    getData: function() {
      appSclPaginate(this.search.keyword, this.page, this.page_size).then(res => {
        this.scl_list = res.data.list
        this.total = res.data.totalRow
      })
    },
    setAuth: function(scl_id) {
      this.scl_id_selected = scl_id
      this.choiceModule = []
      this.moduleList = []
      allFunction().then(res => {
        const data = res.data
        data.forEach(item => {
          const tmp = {
            key: item.af_code,
            label: item.af_name + '(' + item.af_code + ')'
          }
          this.moduleList.push(tmp)
        })
        appSclChoose(scl_id, '').then(res => {
          const data = res.data
          data.forEach(item => {
            this.choiceModule.push(item.af_code)
          })
          this.showAPPDialog = true
        })
      })
    },
    submitDefault: function() {
      configSave('2', this.choiceModule.join(','), this.scl_id_selected, '').then(res => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 3000
        })
        this.showAPPDialog = false
        this.getData()
      })
    },
    resetForm() {
      this.search.keyword = ''
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
