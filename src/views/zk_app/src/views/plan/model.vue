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
        <span v-if="functionList.includes('A34002')" class="spp-btn spp-btn-primary" @click="addPlan()">
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="functionList.includes('A34004')" class="spp-btn" @click="delBatch()">
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
        <el-table-column label="创建时间" width="170">
          <template
            slot-scope="scope"
          >{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="create_oper" />
        <el-table-column prop="address" label="操作" width="130">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A34001')" type="text" @click="showDetail(scope.row.id)">详情</el-button>
            <el-button type="text">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="functionList.includes('A34003')" @click.native="edit(scope.row.id)">编辑</el-dropdown-item>
                  <el-dropdown-item v-if="functionList.includes('A34004')" @click.native="del(scope.row.id)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="page_size"
        @pagination="getData"
      />
    </div>
    <el-dialog
      title="应急预案详情"
      :visible.sync="showDetailDialog"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-form label-width="80px">
          <el-form-item class="detail-el-form-item" label="预案名称：">{{ detail.plan_name }}</el-form-item>
          <el-form-item class="detail-el-form-item" label="风险类型">{{ risk_category[detail.risk_category] }}</el-form-item>
          <el-form-item class="detail-el-form-item" label="预案分类：">{{ plan_type[detail.plan_type] }}</el-form-item>
          <el-form-item class="detail-el-form-item" label="预案知识：">{{ detail.plan_knowledge }}</el-form-item>
          <el-form-item class="detail-el-form-item" label="预案内容：">
            <div v-for="(item, k) in detail.plan_content" :key="k">
              {{ k + 1 }}. {{ item.text }}
            </div>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="120px">
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
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="reset">重置</span>
        <span class="spp-btn spp-btn-primary" @click="submit">提交</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { formatDateTime } from '@/utils/index'
import StepInput from '@/components/StepInput'
import { mapState } from 'vuex'
import { riskCategory } from '@/api/risk_point'
import { paginate, gainPlanInfo, savePlan, updatePlan, deletePlan } from '@/api/plan_model'
export default {
  name: 'EmergencyModel',
  components: { Pagination, StepInput },
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
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      showDetailDialog: false,
      dialogTitle: '',
      detail: {},
      form: {
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
      }
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  async created() {
    const data = await riskCategory()
    const tmp = data.data
    tmp['0'] = '通用'
    this.risk_category = tmp
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
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
      this.showDetailDialog = true
      gainPlanInfo(id).then(res => {
        const detail = res.data
        const plan_content = detail.plan_content
        detail.plan_content = JSON.parse(plan_content)
        this.detail = detail
      })
    },
    addPlan() {
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
    },
    edit(id) {
      gainPlanInfo(id).then(res => {
        const detail = res.data
        this.dialogTitle = '编辑应急预案'
        this.form = {
          id: id,
          plan_type: detail.plan_type,
          plan_name: detail.plan_name,
          plan_content: JSON.parse(detail.plan_content),
          plan_knowledge: detail.plan_knowledge,
          risk_category: detail.risk_category
        }
        this.showDialog = true
      })
    },
    del(id) {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deletePlan(id).then(res => {
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
    delBatch() {
      let str = ''
      this.$refs.table.store.states.selection.forEach(item => {
        str += item.id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      str ? this.del(str) : ''
      if (str) {
        this.$confirm('确定要删除吗？', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deletePlan(str).then(res => {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          })
          .catch(() => {})
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
      }
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.id) {
            // 新增
            const { plan_type, plan_name, plan_content, plan_knowledge, risk_category } = this.form
            savePlan(plan_type, plan_name, JSON.stringify(plan_content), plan_knowledge, risk_category).then(res => {
              this.getData()
              this.showDialog = false
            })
          } else {
            // 修改
            const { id, plan_type, plan_name, plan_content, plan_knowledge, risk_category } = this.form
            updatePlan(id, plan_type, plan_name, JSON.stringify(plan_content), plan_knowledge, risk_category).then(res => {
              this.getData()
              this.showDialog = false
            })
          }
        }
      })
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
    }
  }
}
</script>
