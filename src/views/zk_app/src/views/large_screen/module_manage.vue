<template>
  <div class="app-container page-container right-side-dialog">
    <div class="main-header">
      <div class="left">
        <span
          v-if="functionList.includes('A58001')"
          class="spp-btn spp-btn-primary"
          @click="addModule()"
        ><svg-icon icon-class="add" /><span>新增</span></span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="multipleTable" :data="module_list">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="模块名称" prop="scmo_name" />
        <el-table-column label="排查类型" prop="patrol_type">
          <template slot-scope="scope">{{
            patrol_type[scope.row.scmo_code]
          }}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status_flag"
              :active-value="'1'"
              :inactive-value="'2'"
              @change="
                handleStatusChange(scope.row.status_flag, scope.row.scmo_id)
              "
            />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              v-if="functionList.includes('A58002')"
              type="text"
              @click="editModule(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="functionList.includes('A58003')"
              type="text"
              @click="del_scmo(scope.row.scmo_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增或者编辑模态框 -->
    <el-dialog
      v-if="showDialog"
      :title="dialog_title"
      :visible.sync="showDialog"
      width="720px"
      class="right-noall-content"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="巡检点模块" prop="scmo_name">
          <el-input
            v-model="ruleForm.scmo_name"
            placeholder="请输入巡检点模块"
          />
        </el-form-item>
        <el-form-item label="排查计划类型" prop="scmo_code">
          <el-select
            v-model="ruleForm.scmo_code"
            clearable
            placeholder="请选择排查计划类型"
          >
            <el-option
              v-for="(item, k) in patrol_type"
              :key="k"
              :label="item"
              :value="k"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-btn riskidentify-btn">
        <span class="spp-btn spp-btn-primary" @click="submit">提交</span>
        <span class="spp-btn" @click="reset">重置</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  paginate,
  deactivate_scmo,
  enable_scmo,
  save_scmo,
  update_scmo,
  del_scmo
} from '@/api/module_manage'
import { getPatrolType } from '@/api/dic'
import { mapState } from 'vuex'
export default {
  name: 'ModuleManage',
  components: {},
  data() {
    return {
      module_list: [],
      patrol_type: {},
      showDialog: false,
      dialog_title: '',
      scmo_id: '',
      ruleForm: {
        scmo_name: '',
        scmo_code: ''
      },
      rules: {
        scmo_name: [
          { required: true, message: '请输入巡检点模块', trigger: 'blur' }
        ],
        scmo_code: [
          { required: true, message: '请选择排查计划类型', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  async created() {
    await this.getPatrolType()
    this.getData()
  },
  methods: {
    getData() {
      paginate().then((response) => {
        this.module_list = response.data
      })
    },
    getPatrolType() {
      getPatrolType().then((response) => {
        this.patrol_type = response.data
      })
    },
    handleStatusChange(status_flag, scmo_id) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (status_flag === '2') {
            deactivate_scmo(scmo_id)
              .then((response) => {
                this.$message({
                  type: 'success',
                  message: '停用成功!'
                })
              })
              .catch(() => {
                this.getData()
              })
          } else {
            enable_scmo(scmo_id)
              .then((response) => {
                this.$message({
                  type: 'success',
                  message: '启用成功!'
                })
              })
              .catch(() => {
                this.getData()
              })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          })
          this.getData()
        })
    },
    addModule() {
      this.dialog_title = '新增巡检点模块'
      this.scmo_id = ''
      Object.assign(this.ruleForm, this.$options.data().ruleForm)
      this.showDialog = true
    },
    editModule(obj) {
      this.dialog_title = '编辑巡检点模块'
      this.scmo_id = obj.scmo_id
      this.ruleForm.scmo_name = obj.scmo_name
      this.ruleForm.scmo_code = obj.scmo_code
      this.showDialog = true
    },
    del_scmo(Id) {
      this.$confirm('您确定要删除该巡检点模块吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          del_scmo(Id).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getData()
          })
        })
        .catch(() => {})
    },
    submit() {
      if (!this.scmo_id) {
        // 新增
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            save_scmo(this.ruleForm.scmo_name, this.ruleForm.scmo_code).then(
              (response) => {
                this.showDialog = false
                this.$message({
                  message: '模块添加成功',
                  type: 'success',
                  duration: 3000
                })
                this.getData()
              }
            )
          }
        })
      } else {
        // 修改
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            update_scmo(
              this.scmo_id,
              this.ruleForm.scmo_name,
              this.ruleForm.scmo_code
            ).then((response) => {
              this.showDialog = false
              this.$message({
                message: '模块修改成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      }
    },
    reset() {
      if (this.$refs.hasOwnProperty('ruleForm')) {
        this.$refs.ruleForm.resetFields()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.main-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ebf0f5;
  .left {
    word-spacing: -10px;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #3399ff;
  font-size: 14px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.red {
  color: #f2854c;
}
.green {
  color: #4dcd70;
}
.insider_form {
  width: 446px !important;
}
.riskidentify-btn {
  text-align: right;
}
</style>
