<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="12" class="header_left">
          <span v-if="auth.save != -1" class="spp-btn-add spp-btn-primary" @click="taskVisible = true"><svg-icon icon-class="add_timing" />新增定时任务</span>
        </el-col>
        <el-col :span="12" class="header_right search_view">
          <div class="input_view">
            <el-input v-model="search.task_name" placeholder="搜索任务名称" @keyup.enter="queryData" @change="queryData" />
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content_view">
      <el-table ref="table" :data="task_list" :height="height - 80" size="mini" strip>
        <el-table-column label="序号" type="index" width="80" align="left" />
        <el-table-column label="任务名称" prop="task_name" width="200" align="left" />
        <el-table-column label="时间表达式" prop="task_expression" width="250" align="left" />
        <el-table-column label="任务路径" prop="task_class_name" align="left" />
        <el-table-column label="任务描述" prop="task_des" align="left" />
        <el-table-column label="创建时间" width="180" align="left">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="任务状态" width="120" align="left">
          <template v-if="auth.enable != -1 && auth.disable != -1" slot-scope="scope">
            <el-switch v-model="scope.row.switch" active-color="#13ce66" inactive-color="#ff4949" @change="handleSwitch(scope.row, scope.$index)" />
            <span v-if="scope.row.switch" style="color: #14BC6C;">正常</span>
            <span v-if="!scope.row.switch" style="color: #FF4949;">停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170" fixed="right" align="right">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="handlePerform(scope.row)">执行一次</el-button> -->
            <el-button v-if="auth.update != -1" type="text" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="auth.delete != -1" type="text" style="color: #FF4949" @click="handleDel(scope.row.task_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="search.page_num" :limit.sync="search.page_size" @pagination="handleCurrentChange" />
    </div>
    <!-- 新增编辑定时任务 -->
    <el-dialog :title="form.title" :append-to-body="true" :visible.sync="taskVisible" :custom-class="'default-size'" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="任务名称" prop="task_name">
          <el-input v-model="form.task_name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="时间表达式" prop="task_expression">
          <el-input v-model="form.task_expression" placeholder="请输入Cron时间表达式" />
        </el-form-item>
        <el-form-item label="任务路径" prop="task_class_name">
          <el-input v-model="form.task_class_name" placeholder="请输入任务路径" />
        </el-form-item>
        <el-form-item label="任务描述" prop="task_des">
          <el-input v-model="form.task_des" :rows="5" resize="none" type="textarea" placeholder="请输入任务描述" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="taskVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmit()">保存</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { decrypt, httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'
import Pagination from '@/components/Pagination'

export default {
  name: 'Task',
  components: { Pagination },
  filters: {
    formatDate(value) {
      if (value) {
        return value.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6')
      }
    }
  },
  data() {
    return {
      height: window.innerHeight - 135,
      auth: {},
      search: {
        task_name: '',
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      total: 0,
      taskVisible: false,
      task_list: [],
      form: {
        title: '新增定时任务',
        type: 'add',
        task_id: '',
        task_name: '',
        task_expression: '',
        task_class_name: '',
        task_des: ''
      },
      rules: {
        task_name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        task_expression: [
          { required: true, message: '请输入Cron时间表达式', trigger: 'blur' }
        ],
        task_class_name: [
          { required: true, message: '请输入任务路径', trigger: 'blur' }
        ],
        task_des: [
          { required: true, message: '请输入任务描述', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  watch: {
    taskVisible(val) {
      if (val) {
        this.form.title = this.form.type === 'add' ? '新增定时任务' : '编辑定时任务'
      }
      if (!val) {
        this.form.type = 'add'
        this.form.task_id = ''
        this.form.task_name = ''
        this.form.task_expression = ''
        this.form.task_class_name = ''
        this.form.task_des = ''
        this.$refs['form'].clearValidate()
      }
    }
  },
  created() {
    this.permissionAuth()
    this.queryData()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {
      this.auth.save = this.permission.indexOf('/api/sys/job/save')
      this.auth.update = this.permission.indexOf('/api/sys/job/update')
      this.auth.delete = this.permission.indexOf('/api/sys/job/delete')
      this.auth.enable = this.permission.indexOf('/api/sys/job/enable')
      this.auth.disable = this.permission.indexOf('/api/sys/job/disable')
    },
    handleCurrentChange(val) {
      this.search.page_num = val.page
      this.fetchData()
    },
    queryData() {
      this.search.page_num = 1
      this.fetchData()
    },
    fetchData() {
      httpRequest('/api/sys/job/paginate', this.search, false).then(res => {
        const data = JSON.parse(decrypt(res.data))
        const task_list = data.records
        this.total = data.total
        task_list.map((item) => {
          item.switch = item.status_flag === '1'
        })
        this.task_list = task_list
      })
    },
    handleSwitch(row, index) {
      var api = row.switch ? '/api/sys/job/enable' : '/api/sys/job/disable'
      httpRequest(api, {
        task_id: row.task_id
      }, false, false).then(res => {
      }).catch(() => {
        this.task_list[index].switch = !row.switch
      })
    },
    handlePerform(data) {
      console.log(data)
    },
    handleUpdate(data) {
      this.form.task_id = data.task_id
      this.form.task_name = data.task_name
      this.form.task_expression = data.task_expression
      this.form.task_class_name = data.task_class_name
      this.form.task_des = data.task_des
      this.form.type = 'edit'
      this.taskVisible = true
    },
    handleDel(id) {
      this.$confirm('确认要删除该任务吗？', '提示', {
        title: '删除提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/sys/job/delete', { task_id: id }, false).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.queryData()
        })
      }).catch(() => {})
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var api = ''
          var data = {
            task_name: this.form.task_name,
            task_expression: this.form.task_expression,
            task_class_name: this.form.task_class_name,
            task_des: this.form.task_des
          }
          if (this.form.type === 'add') {
            api = '/api/sys/job/save'
          } else {
            data.task_id = this.form.task_id
            api = '/api/sys/job/update'
          }
          httpRequest(api, data, false).then(res => {
            this.taskVisible = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.queryData()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
