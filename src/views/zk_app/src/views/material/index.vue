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
          <el-form-item label="任务编号：">
            <el-input v-model="search.task_no" placeholder="请输入任务编号" />
          </el-form-item>
          <el-form-item label="任务状态：">
            <el-select v-model="search.status_flag" clearable placeholder="请选择任务状态">
              <el-option v-for="(item, index) in status_list" :key="index" :value="item.type" :label="item.title" />
            </el-select>
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
        <span v-if="functionList.includes('A60001')" class="spp-btn spp-btn-primary" @click="handleAdd()">
          <svg-icon icon-class="add" />
          <span>新建任务</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="material_list">
        <el-table-column type="selection" width="55" />>
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="任务编号" prop="task_no" />
        <el-table-column label="处理状态">
          <template slot-scope="scope">
            {{ scope.row.status_flag == 0
              ? '作废'
              : scope.row.status_flag == 1
                ? '排队'
                : scope.row.status_flag == 2
                  ? '处理中' :
                    scope.row.status_flag == 3
                      ? '处理成功'
                      : scope.row.status_flag == 4
                        ? '处理失败' : '' }}
          </template>
        </el-table-column>
        <el-table-column label="完成时间">
          <template slot-scope="scope">{{ scope.row.finish_time ? formatDateTime(scope.row.finish_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="create_oper_name" />
        <el-table-column prop="address" label="操作" width="140">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A60002') && scope.row.file_path" type="text" @click="downMaterial(scope.row.task_id)">下载</el-button>
            <el-button type="text" @click="handleDetail(scope.row)">错误详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="search.page" :limit.sync="search.page_size" @pagination="handleChange" />
    </div>
    <el-dialog
      title="新建任务"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px">
          <el-form-item label="任务名称：" prop="name">
            <el-input v-model="form.name" placeholder="请输入任务名称" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="showDialog = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="submit">保存</span>
      </div>
    </el-dialog>
    <el-dialog
      title="详情"
      :visible.sync="showDetailDialog"
      width="800px"
      class="right-noall-content draw_dialog"
    >
      <el-scrollbar
        wrap-class="vertical_scrollbar"
        :style="{ height: height + 'px' }"
      >
        <el-table ref="table" :data="error_data">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="title" label="学校风险点" width="200" />
          <el-table-column prop="error_msg" label="错误信息" />
        </el-table>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import { paginate, taskSave, downMaterial, getMaterialPre } from '@/api/material'
import Pagination from '@/components/Pagination'
import { formatDateTime } from '@/utils/index'
import { mapState } from 'vuex'
export default {
  name: 'Material',
  components: { Pagination },
  data() {
    return {
      height: window.innerHeight - 135,
      search: {
        task_no: '',
        status_flag: '',
        page: 1,
        page_size: 10
      },
      status_list: [
        {
          type: 0,
          title: '作废'
        }, {
          type: 1,
          title: '排队'
        }, {
          type: 2,
          title: '处理中'
        }, {
          type: 3,
          title: '处理成功'
        }, {
          type: 4,
          title: '处理失败'
        }
      ],
      material_list: [],
      total: 0,
      showDialog: false,
      showDetailDialog: false,
      error_data: [],
      form: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  watch: {
    showDialog(val) {
      if (!val) {
        Object.assign(this.$data.form, this.$options.data().form)
        Object.assign(this.$data.board_lead, this.$options.data().board_lead)
        this.$refs.form.clearValidate()
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    handleChange(val) {
      this.search.page = val.page
      this.getData()
    },
    searchData() {
      this.search.page = 1
      this.getData()
    },
    resetForm() {
      Object.assign(this.$data.search, this.$options.data().search)
    },
    getData() {
      paginate(this.search).then(response => {
        this.material_list = response.data.list
        this.total = response.data.totalRow
      })
    },
    handleDetail(data) {
      const info = JSON.parse(data.error_msg)
      if (info) {
        this.error_data = info
        this.showDetailDialog = true
      } else {
        this.$message({
          message: '无错误信息',
          type: 'error',
          duration: 3000
        })
      }
    },
    handleAdd() {
      // this.showDialog = true
      this.$confirm('确认打包所有物料?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        taskSave().then((res) => {
          this.$message({
            message: '新建任务成功',
            type: 'success',
            duration: 3000
          })
          this.getData()
        })
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          taskSave(this.form.name).then((res) => {
            this.showDialog = false
            this.$message({
              message: '新建任务成功',
              type: 'success',
              duration: 3000
            })
            this.getData()
          })
        } else {
          return false
        }
      })
    },
    handleDetection(task_id) {
      getMaterialPre(task_id).then((res) => {
        this.downMaterial(task_id)
      })
    },
    async downMaterial(task_id) {
      const url = await downMaterial(task_id)
      window.open(url)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
