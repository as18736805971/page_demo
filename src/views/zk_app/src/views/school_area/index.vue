<template>
  <div class="app-container page-container">
    <div class="header-search">
      <el-form
        ref="search_form"
        :model="search"
        :inline="true"
        label-width="120px"
      >
        <el-form-item label="学校名称：">
          <el-select v-model="search.scl_id" filterable placeholder="请选择">
            <el-option
              v-for="item in scl_data"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="区域名称：">
          <el-input v-model="search.area_name" placeholder="请输入" />
        </el-form-item>
        <el-form-item class="btn-area">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="resetForm()">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-header">
      <div class="left">
        <span v-if="functionList.includes('A13001')" class="spp-btn spp-btn-primary" @click="addRole()">
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="functionList.includes('A13003')" class="spp-btn" @click="deleteRoleBatch()">
          <svg-icon icon-class="delete" />
          <span>删除</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="schoolAreaData">
        <el-table-column type="selection" width="55" />>
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="学校名称" prop="scl_name" />
        <el-table-column label="区域名称" prop="area_name" />
        <el-table-column label="风险级别" prop="area_risk_level" />
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ formatDateTime(scope.row.create_time) }}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="130">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A13002')" type="text" @click="editRole(scope.row.area_id)">编辑</el-button>
            <el-button v-if="functionList.includes('A13003')" type="text" class="red" @click="deleteRole(scope.row.area_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="628px"
    >
      <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="80px" class="model_form">
        <el-form-item label="学校名称" prop="scl_id">
          <el-select v-model="form.scl_id" filterable placeholder="请选择学校">
            <el-option
              v-for="item in scl_data"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="区域名称" prop="area_name">
          <el-input v-model="form.area_name" type="text" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="风险级别" prop="area_risk_level">
          <el-select v-model="form.area_risk_level" placeholder="请选择风险级别">
            <el-option
              v-for="item in risks"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="建模名称" prop="area_model_name">
          <el-input v-model="form.area_model_name" type="text" placeholder="请输入建模名称" />
        </el-form-item>
        <el-form-item class="model_btn_group">
          <span class="spp-btn spp-btn-primary" @click="submit()">提交</span>
          <span class="spp-btn" @click="showDialog=false">取消</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { paginate, deleteSclArea, getSclArea, addSclArea, editSclArea } from '@/api/school_area'
import { getSchoolList } from '@/api/school'
import Pagination from '@/components/Pagination'
import { formatDateTime } from '@/utils/index'
import { mapState } from 'vuex'
export default {
  name: 'SchoolArea',
  components: { Pagination },
  data() {
    return {
      search: {
        scl_id: '',
        area_name: ''
      },
      scl_data: [],
      risks: [
        {
          value: '1',
          label: '一级'
        },
        {
          value: '2',
          label: '二级'
        },
        {
          value: '3',
          label: '三级'
        },
        {
          value: '4',
          label: '四级'
        }
      ],
      schoolAreaData: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      dialogTitle: '',
      area_id: '',
      form: {
        scl_id: '',
        area_name: '',
        area_risk_level: '',
        area_model_name: ''
      },
      rules: {
        scl_id: [
          { required: true, message: '请选择学校', trigger: 'blur' }
        ],
        area_name: [
          { required: true, message: '请输入区域名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
    getSchoolList().then(response => {
      this.formatSclData(response.data)
    })
    this.getData()
  },
  methods: {
    formatSclData(scl_data_raw) {
      const scl_data = []
      scl_data_raw.forEach(item => {
        const tmp = {
          value: item.scl_id,
          label: item.scl_name
        }
        scl_data.push(tmp)
      })
      this.scl_data = scl_data
    },
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      paginate(this.search, this.page, this.page_size).then(response => {
        this.schoolAreaData = response.data.list
        this.total = response.data.totalRow
      })
    },
    resetForm() {
      this.search.scl_id = ''
      this.search.area_name = ''
    },
    formatDateTime: formatDateTime,
    async addRole() {
      const scl_data_raw = await getSchoolList()
      this.formatSclData(scl_data_raw.data)
      this.dialogTitle = '新增学校区域'
      this.area_id = ''
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
    },
    async editRole(area_id) {
      this.dialogTitle = '编辑学校区域'
      const scl_data_raw = await getSchoolList()
      this.formatSclData(scl_data_raw.data)
      getSclArea(area_id).then(response => {
        const data = response.data
        this.area_id = data.area_id
        this.form = {
          scl_id: data.scl_id,
          area_name: data.area_name,
          area_risk_level: data.area_risk_level,
          area_model_name: data.area_model_name
        }
        this.showDialog = true
      })
    },
    deleteRole(area_id) {
      this.$confirm('您确定要删除该区域吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSclArea(area_id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => {})
    },
    deleteRoleBatch() {
      const selected_row = this.$refs.table.selection
      if (selected_row.length === 0) {
        return false
      }
      this.$confirm('您确定要删除这些学校区域吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const selected_row = this.$refs.table.selection
        const ids = []
        selected_row.forEach(item => {
          ids.push(item.area_id)
        })
        deleteSclArea(ids.join(',')).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => {})
    },
    submit() {
      if (!this.area_id) {
        // 新增
        this.$refs.form.validate(valid => {
          if (valid) {
            addSclArea(this.form).then(response => {
              this.showDialog = false
              this.$message({
                message: '学校区域添加成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      } else {
        // 修改
        this.$refs.form.validate(valid => {
          if (valid) {
            editSclArea(this.area_id, this.form).then(response => {
              this.showDialog = false
              this.$message({
                message: '学校区域修改成功',
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
      if (this.$refs.hasOwnProperty('form')) {
        this.$refs.form.resetFields()
      }
    }
  }
}
</script>
