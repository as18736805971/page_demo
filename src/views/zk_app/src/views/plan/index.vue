<template>
  <div class="app-container page-container right-side-dialog">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="预案分类：">
            <el-select v-model="search.plan_type" clearable placeholder="请选择">
              <el-option v-for="(item, k) in plan_type" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="预案名称：">
            <el-input v-model="search.plan_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="风险类型：">
            <el-select v-model="search.risk_category" clearable placeholder="请选择">
              <el-option v-for="(item, k) in risk_category" :key="k" :label="item" :value="k" />
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
        <span v-if="functionList.includes('A16001')" class="spp-btn spp-btn-primary" @click="addPlan()">
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="functionList.includes('A16003')" class="spp-btn" @click="delBatch()">
          <svg-icon icon-class="delete" />
          <span>删除</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column type="selection" width="55" />>
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="预案名称" prop="plan_name" />
        <el-table-column label="预案分类" prop="activity_name">
          <template slot-scope="scope">{{ plan_type[scope.row.plan_type] }}</template>
        </el-table-column>
        <el-table-column label="风险类型" prop="risk_category">
          <template slot-scope="scope">{{ scope.row.risk_category ? risk_category[scope.row.risk_category] : '' }}</template>
        </el-table-column>
        <el-table-column label="启动类型" prop="count">
          <template slot-scope="scope">
            <span v-if="scope.row.count===0" class="gray_border">非自启动</span>
            <span v-else class="green_border">自启动</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template
            slot-scope="scope"
          >{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="create_oper" />
        <el-table-column prop="address" label="操作" width="130">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A16004')" type="text" @click="showDetail(scope.row.id)">详情</el-button>
            <el-button type="text">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="functionList.includes('A16002')" @click.native="edit(scope.row.id)">编辑</el-dropdown-item>
                  <el-dropdown-item v-if="functionList.includes('A16003')" @click.native="del(scope.row.id)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
    </div>
    <el-dialog
      title="应急预案详情"
      :visible.sync="showDetailDialog"
      width="720px"
      class="draw_dialog"
    >
      <EmergencyDetail v-if="showDetailDialog" :id="selected_id" :risk-category="risk_category" />
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-steps class="step_class" :active="stepActive" align-center style="margin-bottom: 16px;">
          <el-step title="应急预案基本信息" />
          <el-step title="管理应急设施/救援队伍" />
          <el-step title="管理自启动执行步骤" />
        </el-steps>
        <div v-show="stepActive === 0">
          <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item v-if="!form.id" label="预案模板">
              <el-select v-model="emergency_model_select" clearable placeholder="请选择应急预案模板" @change="changeEmergencyModel">
                <el-option v-for="(item, k) in emergency_model" :key="k" :label="item.plan_name" :value="k" />
              </el-select>
            </el-form-item>
            <el-form-item label="风险类型" prop="risk_category">
              <el-select v-model="form.risk_category" clearable placeholder="请选择风险类型">
                <el-option v-for="(item, k) in risk_category" :key="k" :label="item" :value="k" />
              </el-select>
            </el-form-item>
            <el-form-item label="预案类型" prop="plan_type">
              <el-select v-model="form.plan_type" clearable placeholder="请选择预案类型">
                <el-option v-for="(item, k) in plan_type" :key="k" :label="item" :value="k" />
              </el-select>
            </el-form-item>
            <el-form-item label="预案名称" prop="plan_name">
              <el-input v-model="form.plan_name" placeholder="请输入预案名称" />
            </el-form-item>
            <el-form-item label="预案知识" prop="plan_knowledge">
              <el-input v-model="form.plan_knowledge" type="textarea" :rows="4" placeholder="请输入预案知识" />
            </el-form-item>
            <el-form-item label="预案内容" prop="plan_content" />
            <StepInput v-model="form.plan_content" />
          </el-form>
        </div>
        <div v-show="stepActive === 1">
          <StepTwo v-if="showDialog" :plan-id="form.id" :equipment-info-detail="equipment_info_detail" :emergency-group-detail="emergency_group_detail" />
        </div>
        <div v-show="stepActive === 2">
          <StepThree v-if="showDialog" :plan-id="form.id" :plan-steps="plan_steps" @open="openAddExeDialog" />
        </div>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span v-if="stepActive > 0" class="spp-btn" @click="stepPre">上一步</span>
        <span v-if="stepActive < 2" class="spp-btn spp-btn-primary" @click="stepNext">下一步</span>
        <span v-if="stepActive == 2" class="spp-btn spp-btn-primary" @click="stepFinish">完成</span>
      </div>
    </el-dialog>
    <el-dialog
      title="新增执行步骤"
      :visible.sync="showExeDialog"
      :close-on-click-modal="false"
      width="480px"
      class="draw_dialog"
    >
      <AddStep v-if="showExeDialog" @submit="addExeStep" @cancel="cancelExeStep" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { formatDateTime } from '@/utils/index'
import EmergencyDetail from '@/components/EmergencyDetail'
import StepInput from '@/components/StepInput'
import { mapState } from 'vuex'
import { riskCategory } from '@/api/risk_point'
import { getModellist } from '@/api/plan_model'
import StepTwo from './components/step_two'
import StepThree from './components/step_three'
import AddStep from './components/add_step'
import { paginate, gainPlanInfo, savePlan, updatePlan, saveSteps, deletePlan } from '@/api/plan'
export default {
  name: 'Plan',
  components: { Pagination, StepInput, EmergencyDetail, StepTwo, StepThree, AddStep },
  data() {
    return {
      height: window.innerHeight - 135,
      search: {
        plan_type: '',
        plan_name: '',
        risk_category: ''
      },
      plan_type: {
        1: '应急行动指南',
        2: '应急响应预案',
        3: '互助应急预案',
        4: '应急管理预案'
      },
      risk_category: {},
      selected_id: '',
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      showDetailDialog: false,
      dialogTitle: '',
      stepActive: 0,
      detail: {},
      form: {
        id: '',
        plan_type: '',
        risk_category: '',
        plan_name: '',
        plan_content: [],
        plan_knowledge: ''
      },
      rules: {
        risk_category: [
          { required: true, message: '请选择风险类型', trigger: 'blur' }
        ],
        plan_name: [
          { required: true, message: '请输入预案名称', trigger: 'blur' }
        ],
        plan_type: [
          { required: true, message: '请选择预案类型', trigger: 'blur' }
        ],
        plan_content: [
          { required: true, message: '请输入预案步骤', trigger: 'blur' }
        ]
      },
      emergency_model_select: '',
      emergency_model: [],
      emergency_group_detail: [],
      equipment_info_detail: [],
      plan_steps: [],
      showExeDialog: false
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  async created() {
    const data = await riskCategory()
    this.risk_category = data.data
    this.getData()
    this.getModellist()
  },
  methods: {
    formatDateTime: formatDateTime,
    getModellist() {
      getModellist().then(res => {
        this.emergency_model = res.data
      })
    },
    changeEmergencyModel(val) {
      const data = this.emergency_model[val]
      this.form.plan_type = data.plan_type
      this.form.plan_name = data.plan_name
      this.form.plan_content = JSON.parse(data.plan_content)
      this.form.plan_knowledge = data.plan_knowledge
      this.form.risk_category = data.risk_category
    },
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      const { plan_type, plan_name, risk_category } = this.search
      paginate(plan_type, plan_name, risk_category, this.page, this.page_size).then(res => {
        this.data = res.data.list
        this.total = res.data.totalRow
      })
    },
    showDetail(id) {
      this.selected_id = id
      this.showDetailDialog = true
    },
    addPlan() {
      Object.assign(this.form, this.$options.data().form)
      this.emergency_model_select = ''
      this.stepActive = 0
      this.fileList = []
      this.emergency_group_detail = []
      this.plan_steps = []
      this.dialogTitle = '新增应急预案'
      this.showDialog = true
    },
    openAddExeDialog() {
      this.showExeDialog = true
    },
    addExeStep(data) {
      const {
        step_type,
        step_content,
        step_broadcast_url,
        broadcast_type,
        step_order,
        send_user
      } = data
      saveSteps(
        this.form.id,
        step_type,
        step_type === '2' ? step_content : '',
        step_type === '1' ? step_broadcast_url : '',
        step_type === '1' ? broadcast_type : '',
        step_order,
        step_type === '2' ? send_user : ''
      ).then(res => {
        this.showExeDialog = false
        gainPlanInfo(this.form.id).then(res => {
          this.plan_steps = res.data.plan_steps
        })
      })
    },
    cancelExeStep() {
      this.showExeDialog = false
    },
    edit(id) {
      gainPlanInfo(id).then(res => {
        const detail = res.data
        this.showDialog = true
        this.dialogTitle = '编辑应急预案'
        this.stepActive = 0
        this.form = {
          id: id,
          plan_type: detail.plan_type,
          plan_name: detail.plan_name,
          plan_content: JSON.parse(detail.plan_content),
          plan_knowledge: detail.plan_knowledge,
          risk_category: detail.risk_category
        }
        this.emergency_group_detail = detail.emergency_group
        this.equipment_info_detail = detail.equipment_info
        this.plan_steps = detail.plan_steps
      })
    },
    del(id) {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePlan(id).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 3000
          })
          this.getData()
        })
      }).catch(() => {})
    },
    delBatch() {
      let str = ''
      this.$refs.table.store.states.selection.forEach(item => {
        str += item.id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      if (str) {
        this.$confirm('确定要删除吗？', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePlan(str).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getData()
          })
        }).catch(() => {})
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
      }
    },
    reset() {
      if (this.$refs.hasOwnProperty('form')) {
        this.$refs.form.resetFields()
      }
    },
    resetForm() {
      this.search = {
        plan_type: '',
        plan_name: ''
      }
    },
    stepPre() {
      this.stepActive--
    },
    stepNext() {
      if (this.stepActive === 0) {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (!this.form.id) {
              const { plan_type, plan_name, plan_content, plan_knowledge, risk_category } = this.form
              savePlan(plan_type, plan_name, JSON.stringify(plan_content), plan_knowledge, risk_category).then(res => {
                this.form.id = res.data
                this.getData()
                this.stepActive++
              })
            } else {
              const { id, plan_type, plan_name, plan_content, plan_knowledge, risk_category } = this.form
              updatePlan(id, plan_type, plan_name, JSON.stringify(plan_content), plan_knowledge, risk_category).then(res => {
                this.getData()
                this.stepActive++
              })
            }
          }
        })
      } else {
        this.stepActive++
      }
    },
    stepFinish() {
      this.stepActive = 0
      this.getData()
      this.showDialog = false
    }
  }
}
</script>
<style lang="scss" scoped>
.green_border{
  border: 1px solid #4DCD70;
  border-radius: 2px;
  font-size: 12px;
  color: #4DCD70;
  padding: 0 5px;
  line-height: 16px;
}
.gray_border{
  border: 1px solid #999;
  border-radius: 2px;
  font-size: 12px;
  color: #999;
  padding: 0 5px;
  line-height: 16px;
}
</style>
