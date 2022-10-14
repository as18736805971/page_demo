<template>
  <section class="app-container timingtask-container">
    <section class="filter-container common-filter">
      <div class="filter-left">
        <div class="filter-item">
          <label class="label">任务名称：</label>
          <el-input v-model="timingTaskObj.task_name" placeholder="请输入" />
        </div>
        <div class="filter-item">
          <label class="label">任务路径：</label>
          <el-input v-model="timingTaskObj.task_class_name" placeholder="请输入" />
        </div>
        <div class="filter-item">
          <label class="label">任务描述：</label>
          <el-input v-model="timingTaskObj.task_des" placeholder="请输入" />
        </div>
        <div class="filter-item">
          <label class="label">任务状态：</label>
          <el-select v-model="timingTaskObj.status_flag" clearable placeholder="请选择">
            <el-option label="正常" value="1" />
            <el-option label="停用" value="2" />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="label">开始时间：</label>
          <el-date-picker
            v-model="timingTaskObj.create_time_start"
            type="datetime"
            placeholder="任务创建开始时间"
          />
        </div>
        <div class="filter-item">
          <label class="label">结束时间：</label>
          <el-date-picker
            v-model="timingTaskObj.create_time_end"
            type="datetime"
            placeholder="任务创建结束时间"
          />
        </div>
      </div>
      <div class="filter-right">
        <div class="filter-btn">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="resetData">重置</span>
        </div>
      </div>
    </section>
    <div class="interface-container">
      <div class="main-header">
        <div class="left">
          <span
            v-if="functionList.includes('A08001')"
            class="spp-btn spp-btn-primary"
            @click="openDialog('添加任务', { task_name: '',task_class_name: '',task_expression: '', task_des: '' })"
          >
            <svg-icon icon-class="add" />
            <span>新增</span>
          </span>
          <span v-if="functionList.includes('A08003')" class="spp-btn" @click="enableOnTask()">
            <svg-icon icon-class="enable_all" />
            <span>启用所有</span>
          </span>
          <span v-if="functionList.includes('A08004')" class="spp-btn" @click="OffallTask()">
            <svg-icon icon-class="stopusing" />
            <span>停用所有</span>
          </span>
        </div>
      </div>
      <div class="main-body">
        <el-table ref="multipleTable" :data="timingTaskData">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="任务名称" prop="task_name" />
          <el-table-column label="时间表达式" prop="task_expression" />
          <el-table-column label="任务路径" prop="task_class_name" />
          <el-table-column label="任务描述" prop="task_des" />
          <el-table-column label="任务状态" prop="status_flag">
            <template
              slot-scope="scope"
            >{{ scope.row.status_flag == '1'?'正常':scope.row.status_flag == '2'?'停用':'删除' }}</template>
          </el-table-column>
          <el-table-column label="创建时间" prop="create_time" sortable>
            <template slot-scope="scope">{{ scope.row.create_time | fgTime }}</template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <span
                v-show="scope.row.status_flag == '2' && functionList.includes('A08003')"
                class="enable common_text"
                @click="enabletem(scope.row.task_id)"
              >启用</span>
              <span
                v-show="scope.row.status_flag == '1' && functionList.includes('A08004')"
                class="delete common_text"
                @click="disableItem(scope.row.task_id)"
              >停用</span>
              <span
                v-if="functionList.includes('A08002')"
                class="edit common_text"
                @click="openDialog('修改任务', scope.row)"
              >编辑</span>
              <span
                v-if="functionList.includes('A08005')"
                class="edit common_text"
                @click="deleteItem(scope.row.task_id)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="timingTaskObj.page_num"
          :limit.sync="timingTaskObj.page_size"
          @pagination="getData"
        />
      </div>
    </div>
    <el-dialog
      :title="eldialog"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="650px"
    >
      <div v-if="showDialog" class="interface-dialog">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="任务名称" prop="task_name">
            <el-input v-model="ruleForm.task_name" />
          </el-form-item>
          <el-form-item label="任务路径" prop="task_class_name">
            <el-input v-model="ruleForm.task_class_name" />
          </el-form-item>
          <el-form-item label="时间表达式" prop="task_expression">
            <el-input v-model="ruleForm.task_expression" />
          </el-form-item>
          <el-form-item label="任务描述" prop="task_des">
            <el-input v-model="ruleForm.task_des" type="textarea" rows="4" />
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-btn">
        <span class="spp-btn spp-btn-primary" @click="editSubmit">提交</span>
        <span class="spp-btn" @click="resetEditData">重置</span>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  paginate,
  addTask,
  updateTask,
  disableOffTask,
  enableOnTask,
  deleteTask,
  enableTask,
  disableTask
} from '@/api/timing_task'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'TimingTask',
  components: { Pagination },
  data() {
    return {
      timingTaskObj: {
        task_name: '',
        task_class_name: '',
        task_des: '',
        status_flag: '',
        create_time_start: '',
        create_time_end: '',
        page_num: 1,
        page_size: 10
      },
      timingTaskData: [], // 列表数据List
      total: 0,
      eldialog: '', // 新增编辑模态框标题
      showDialog: false, // 修改数据模态框标识
      ruleForm: {
        task_name: '',
        task_class_name: '',
        task_expression: '',
        task_des: ''
      },
      transferSign: {
        sign: '', // 1代表新增  2代表编辑
        task_id: '' // 任务id
      },
      rules: {
        task_name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        task_class_name: [
          { required: true, message: '请输入任务路径', trigger: 'blur' }
        ],
        task_expression: [
          { required: true, message: '请输入时间表达式', trigger: 'blur' }
        ],
        task_des: [
          { required: true, message: '请输入任务描述', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['functionList'])
  },
  created() {
    this.getData()
  },
  methods: {
    // 重置搜索选项
    resetData() {
      Object.assign(
        this.$data.timingTaskObj,
        this.$options.data().timingTaskObj
      )
    },

    searchData() {
      this.timingTaskObj.page_num = 1
      this.getData()
    },

    // 获取列表数据
    getData() {
      const {
        task_name,
        task_class_name,
        task_des,
        status_flag,
        page_num,
        page_size
      } = this.timingTaskObj
      paginate(
        task_name,
        task_class_name,
        task_des,
        status_flag,
        this.timingTaskObj.create_time_start
          ? parseTime(
            this.timingTaskObj.create_time_start,
            '{y}{m}{d}{h}{i}{s}'
          )
          : '',
        this.timingTaskObj.create_time_end
          ? parseTime(this.timingTaskObj.create_time_end, '{y}{m}{d}{h}{i}{s}')
          : '',
        page_num,
        page_size
      ).then(res => {
        this.timingTaskData = res.data.list
        this.total = res.data.totalRow
      })
    },

    // 删除任务
    deleteItem(task_id) {
      this.$confirm('您确定要删除该任务吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteTask(task_id).then(res => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 3000
            })
            this.getData()
          })
        })
        .catch(() => {})
    },

    // 启用数据
    enabletem(task_id) {
      enableTask(task_id).then(res => {
        this.$message({
          message: '启用成功',
          type: 'success',
          duration: 3000
        })
        this.getData()
      })
    },

    // 停用数据
    disableItem(task_id) {
      disableTask(task_id).then(res => {
        this.$message({
          message: '停用成功',
          type: 'success',
          duration: 3000
        })
        this.getData()
      })
    },

    // 新增 或者 编辑系统定时任务
    openDialog(title, itemObj) {
      this.transferSign = {
        sign: title === '添加任务' ? 1 : 2,
        task_id: itemObj.task_id
      }
      this.ruleForm = { ...itemObj }
      this.eldialog = title
      this.showDialog = true
    },

    // 提交新增或者编辑数据
    editSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const {
            task_name,
            task_class_name,
            task_expression,
            task_des
          } = this.ruleForm
          if (this.transferSign.sign === 1) {
            // 新增
            addTask(task_name, task_class_name, task_expression, task_des).then(
              res => {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 3000
                })
                this.showDialog = false
                this.getData()
              }
            )
          } else {
            // 编辑
            updateTask(
              this.transferSign.task_id,
              task_name,
              task_class_name,
              task_expression,
              task_des
            ).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.showDialog = false
              this.getData()
            })
          }
        } else {
          console.log('error submit!!')
        }
      })
    },

    // 重置编辑数据
    resetEditData() {
      this.$refs.ruleForm.resetFields()
    },

    // 停用所有任务
    OffallTask() {
      disableOffTask().then(res => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 3000
        })
        this.getData()
      })
    },

    // 启用所有任务
    enableOnTask() {
      enableOnTask().then(res => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 3000
        })
        this.getData()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.interface-container {
  background: #ffffff;
  margin-top: 20px;
  border-radius: 10px;
  .main-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ebf0f5;
  }
  .common_text {
    font-size: 14px;
    cursor: pointer;
  }
  .edit {
    color: #3399ff;
    margin-left: 10px;
  }
  .delete {
    color: #f36861;
  }
  .enable{
    color: rgb(0, 238, 0);
  }
}
.interface-dialog {
  padding: 0 116px;
}
.dialog-btn {
  padding: 0 220px;
  margin-bottom: 30px;
}
</style>
