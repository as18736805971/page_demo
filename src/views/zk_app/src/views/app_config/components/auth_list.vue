<template>
  <div>
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="权限名称：">
            <el-input v-model="search.keyword" placeholder="请输入" />
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="resetForm()">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-header">
      <div class="left">
        <span v-if="functionList.includes('A37002')" class="spp-btn spp-btn-primary" @click="addAuth()">
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="functionList.includes('A37008')" class="spp-btn" @click="setDefault()">
          <span>设置默认模块</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="auth_list">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="模块名称" prop="af_name" />
        <el-table-column label="模块编码" prop="af_code" />
        <el-table-column label="模块类型" prop="af_client">
          <template slot-scope="scope">{{ af_client[scope.row.af_client] }}</template>
        </el-table-column>
        <el-table-column label="创建时间" prop="create_time" width="180">
          <template slot-scope="scope">{{ formatDateTime(scope.row.create_time) }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="create_oper_name" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A37003')" type="text" @click="edit(scope.row)">修改</el-button>
            <el-button v-if="functionList.includes('A37004') && scope.row.status_flag == '1'" class="red" type="text" @click="disableUser(scope.row.af_id)">停用</el-button>
            <el-button v-if="functionList.includes('A37005') && scope.row.status_flag != '1'" class="green" type="text" @click="enableUser(scope.row.af_id)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="650px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="model_form insider_form">
        <el-form-item label="模块名称" prop="af_name">
          <el-input v-model="form.af_name" placeholder="请输入模块名称" />
        </el-form-item>
        <el-form-item label="模块代码" prop="af_code">
          <el-input v-model="form.af_code" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="客户端" prop="af_client">
          <el-select v-model="form.af_client" placeholder="请选择客户端">
            <el-option v-for="(item, i) in af_client" :key="i" :label="item" :value="i" />
          </el-select>
        </el-form-item>
        <el-form-item class="model_btn_group">
          <span class="spp-btn spp-btn-primary" @click="submit()">提交</span>
          <span class="spp-btn" @click="showDialog=false">取消</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="设置APP通用默认模块"
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
import { paginate, save, update, disable, enable, allFunction, appSclChoose, defaultSave } from '@/api/app_config'
import { formatDateTime } from '@/utils/index'
import Pagination from '@/components/Pagination'
export default {
  name: 'AuthList',
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
      af_client: {
        0: '全部',
        1: '教育局端',
        2: '学校端'
      },
      total: 0,
      page: 1,
      page_size: 20,
      auth_list: [],
      showDialog: false,
      dialogTitle: '',
      showAPPDialog: false,
      choiceModule: [],
      moduleList: [],
      form: {
        af_id: '',
        af_code: '',
        af_name: '',
        af_client: ''
      },
      rules: {
        af_code: [
          { required: true, message: '请输入模块代码', trigger: 'blur' }
        ],
        af_name: [
          { required: true, message: '请输入模块名称', trigger: 'blur' }
        ],
        af_client: [
          { required: true, message: '请选择客户端', trigger: 'blur' }
        ]
      }
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
      paginate(this.search, this.page, this.page_size).then(res => {
        this.auth_list = res.data.list
        this.total = res.data.totalRow
      })
    },
    addAuth: function() {
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
      this.dialogTitle = '添加模块'
    },
    edit: function(row) {
      this.form = {
        af_id: row.af_id,
        af_code: row.af_code,
        af_name: row.af_name,
        af_client: row.af_client
      }
      this.showDialog = true
      this.dialogTitle = '修改模块'
    },
    submit: function() {
      if (!this.form.af_id) {
        // 新增
        this.$refs.form.validate(valid => {
          if (valid) {
            save(this.form).then(res => {
              this.$message({
                message: '模块添加成功',
                type: 'success',
                duration: 3000
              })
              this.showDialog = false
              this.getData()
            })
          }
        })
      } else {
        // 修改
        this.$refs.form.validate(valid => {
          if (valid) {
            update(this.form, this.form.af_id).then(res => {
              this.$message({
                message: '模块修改成功',
                type: 'success',
                duration: 3000
              })
              this.showDialog = false
              this.getData()
            })
          }
        })
      }
    },
    setDefault: function() {
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
        appSclChoose('default_scl_id', '').then(res => {
          const data = res.data
          data.forEach(item => {
            this.choiceModule.push(item.af_code)
          })
          this.showAPPDialog = true
        })
      })
    },
    submitDefault: function() {
      defaultSave('2', this.choiceModule.join(',')).then(res => {
        this.$message({
          message: '设置成功',
          type: 'success',
          duration: 3000
        })
        this.showAPPDialog = false
      })
    },
    disableUser: function(af_id) {
      this.$confirm('确定要停用吗？', '停用提示', {
        confirmButtonText: '停用',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        disable(af_id).then(res => {
          this.getData()
          this.$message({
            message: '停用成功',
            type: 'success',
            duration: 3000
          })
        })
      }).catch(() => {})
    },
    enableUser: function(af_id) {
      enable(af_id).then(res => {
        this.getData()
        this.$message({
          message: '启用成功',
          type: 'success',
          duration: 3000
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
