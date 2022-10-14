<template>
  <div class="app-container page-container">
    <div class="header-search single_line">
      <el-form
        ref="search_form"
        :model="search"
        :inline="true"
        label-width="120px"
      >
        <div class="form-area">
          <el-form-item label="角色名称：">
            <el-input v-model="search.role_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="是否分配权限：">
            <el-select v-model="search.has_fp" clearable placeholder="请选择">
              <el-option label="否" value="0" />
              <el-option label="是" value="1" />
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
        <span v-if="functionList.includes('A02001')" class="spp-btn spp-btn-primary" @click="addRole()">
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="functionList.includes('A02003')" class="spp-btn" @click="deleteRoleBatch()">
          <svg-icon icon-class="delete" />
          <span>删除</span>
        </span>
        <span v-if="functionList.includes('A02005')" class="spp-btn" @click="editSclDefaultRole()">
          <svg-icon icon-class="school" />
          <span>修改学校默认权限</span>
        </span>
        <span v-if="functionList.includes('A02006')" class="spp-btn" @click="editEduDefaultRole()">
          <svg-icon icon-class="edu" />
          <span>修改教育局默认权限</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="roleData">
        <el-table-column type="selection" width="55" />>
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="角色名称" prop="role_name" />
        <el-table-column label="角色描述" prop="role_desc" />
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ formatDateTime(scope.row.create_time) }}</template>
        </el-table-column>
        <el-table-column label="分配权限数量（个）">
          <template slot-scope="scope">
            <div v-if="scope.row.role_id == 'c2818e855a9b4337883337cee0c40f2a'">
              --
            </div>
            <div v-else>
              {{ scope.row.fp_count }} <svg-icon v-if="functionList.includes('A02004')" icon-class="edit" class="icon_btn" @click="editAuth(scope.row)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="160">
          <template slot-scope="scope">
            <div v-if="user_type === '2'">
              <el-button v-if="functionList.includes('A37007')" type="text" @click="appConfig(scope.row)">APP模块</el-button>
              <el-button type="text">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="functionList.includes('A02002')" @click.native="editRole(scope.row)">编辑</el-dropdown-item>
                    <el-dropdown-item v-if="functionList.includes('A02003')" @click.native="deleteRole(scope.row)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button>
            </div>
            <div v-else>
              <el-button v-if="functionList.includes('A02002')" type="text" @click="editRole(scope.row)">编辑</el-button>
              <el-button v-if="functionList.includes('A02003')" type="text" class="red" @click="deleteRole(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="928px"
    >
      <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="80px" class="">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="form.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="role_desc">
          <el-input v-model="form.role_desc" type="textarea" :rows="3" placeholder="请输入角色描述" />
        </el-form-item>
        <el-form-item label="分配权限" prop="fp_ids">
          <TreeView :data="menuTree" :checked.sync="authChecked" :selected="authSelected" @updateChecked="updateChecked" />
        </el-form-item>
        <el-form-item class="model_btn_group">
          <span class="spp-btn spp-btn-primary" @click="submit()">提交</span>
          <span class="spp-btn" @click="showDialog=false">取消</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="authDialogTitle"
      :visible.sync="showAuthDialog"
      :close-on-click-modal="false"
      width="848px"
    >
      <TreeView v-if="showAuthDialog" :data="menuTree" :checked.sync="authChecked" :selected="authSelected" @updateChecked="updateChecked" />
      <div class="model-btn-right">
        <span class="spp-btn spp-btn-primary" @click="saveAuth()">保存</span>
        <span class="spp-btn" @click="showAuthDialog=false">取消</span>
      </div>
    </el-dialog>
    <el-dialog
      title="设置APP模块"
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
import {
  paginate,
  deleteRole,
  getRole,
  addRole,
  editRole,
  getRoleAuth,
  editRoleAuth,
  editSclDefaultRoleAuth,
  editEduDefaultRoleAuth,
  getSclDefaultRole,
  getEduDefaultRole
} from '@/api/role'
import { configSave, appSclChoose } from '@/api/app_config'
import Pagination from '@/components/Pagination'
import TreeView from '@/components/Treeview'
import { formatDateTime, formatMenuAuth } from '@/utils/index'
import { mapState } from 'vuex'
export default {
  name: 'Role',
  components: { Pagination, TreeView },
  data() {
    return {
      auth_type: 0,
      search: {
        role_name: '',
        has_fp: ''
      },
      roleData: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      showAuthDialog: false,
      dialogTitle: '',
      authDialogTitle: '',
      role_id: '',
      form: {
        role_name: '',
        role_desc: ''
      },
      rules: {
        role_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      menuTree: [],
      authChecked: [],
      authSelected: [],
      showAPPDialog: false,
      choiceModule: [],
      moduleList: [],
      role_id_selected: '',
      org_id: ''
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList,
      user_type: state => state.user.user_type
    })
  },
  created() {
    this.getData()
  },
  methods: {
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      paginate(this.search, this.page, this.page_size).then(response => {
        this.roleData = response.data.list
        this.total = response.data.totalRow
      })
    },
    resetForm() {
      this.search.role_name = ''
      this.search.has_fp = ''
    },
    formatDateTime: formatDateTime,
    async addRole() {
      const menu_data = await getRoleAuth('', this.$store.state.user.user_type)
      this.formatData(menu_data.data)
      this.dialogTitle = '新增角色'
      this.role_id = ''
      this.form = {
        role_name: '',
        role_desc: ''
      }
      this.showDialog = true
    },
    async editRole(row) {
      this.dialogTitle = '编辑角色'
      const { role_id } = row
      const menu_data = await getRoleAuth(role_id, this.$store.state.user.user_type)
      this.formatData(menu_data.data)
      getRole(role_id).then(response => {
        const data = response.data
        this.role_id = data.role_id
        this.form = {
          role_name: data.role_name,
          role_desc: data.role_desc
        }
        this.showDialog = true
      })
    },
    deleteRole(row) {
      this.$confirm('您确定要删除该角色吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(row.role_id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => {})
    },
    deleteRoleBatch() {
      this.$confirm('您确定要删除该角色吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const selected_row = this.$refs.table.selection
        const ids = []
        selected_row.forEach(item => {
          ids.push(item.role_id)
        })
        deleteRole(ids.join(',')).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => {})
    },
    submit() {
      this.form.fp_id = this.authChecked.join(',')
      if (!this.role_id) {
        // 新增
        this.$refs.form.validate(valid => {
          if (valid) {
            addRole(this.form).then(response => {
              this.showDialog = false
              this.$message({
                message: '角色添加成功',
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
            editRole(this.role_id, this.form).then(response => {
              this.showDialog = false
              this.$message({
                message: '角色修改成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      }
    },
    editAuth(row) {
      this.role_id = row.role_id
      this.form.role_name = row.role_name
      this.form.role_desc = row.role_desc
      getRoleAuth(row.role_id, this.$store.state.user.user_type).then(response => {
        const data = response.data
        this.authDialogTitle = '为' + row.role_name + '分配权限'
        this.showAuthDialog = true
        this.formatData(data)
      })
    },
    editSclDefaultRole() {
      this.auth_type = 1
      getSclDefaultRole().then(response => {
        const data = response.data
        this.authDialogTitle = '为学校默认角色分配权限'
        this.showAuthDialog = true
        this.formatData(data)
      })
    },
    editEduDefaultRole() {
      this.auth_type = 2
      getEduDefaultRole().then(response => {
        const data = response.data
        this.authDialogTitle = '为教育局默认角色分配权限'
        this.showAuthDialog = true
        this.formatData(data)
      })
    },
    formatData(data) {
      const result = formatMenuAuth(data)
      this.menuTree = result.menuTree
      this.authChecked = result.authChecked
      this.authSelected = result.authSelected
    },
    updateChecked(data) {
      this.authChecked = data
    },
    saveAuth() {
      if (this.auth_type === 0) {
        editRoleAuth(this.role_id, this.authChecked.join(',')).then(response => {
          this.showAuthDialog = false
          this.$message({
            message: '角色修改成功',
            type: 'success',
            duration: 3000
          })
          this.getData()
        })
      } else if (this.auth_type === 1) {
        editSclDefaultRoleAuth(this.authChecked.join(',')).then(response => {
          this.showAuthDialog = false
          this.$message({
            message: '学校默认角色修改成功',
            type: 'success',
            duration: 3000
          })
          this.getData()
        })
      } else if (this.auth_type === 2) {
        editEduDefaultRoleAuth(this.authChecked.join(',')).then(response => {
          this.showAuthDialog = false
          this.$message({
            message: '教育局默认角色修改成功',
            type: 'success',
            duration: 3000
          })
          this.getData()
        })
      }
    },
    reset() {
      if (this.$refs.hasOwnProperty('form')) {
        this.$refs.form.resetFields()
      }
    },
    appConfig(row) {
      this.choiceModule = []
      this.moduleList = []
      this.role_id_selected = row.role_id
      this.org_id = row.org_id
      appSclChoose(row.org_id).then(res => {
        const data = res.data
        data.forEach(item => {
          const tmp = {
            key: item.af_code,
            label: item.af_name + '(' + item.af_code + ')'
          }
          this.moduleList.push(tmp)
        })
        appSclChoose(row.org_id, this.role_id_selected).then(res => {
          const data = res.data
          data.forEach(item => {
            this.choiceModule.push(item.af_code)
          })
          this.showAPPDialog = true
        })
      })
    },
    submitDefault() {
      configSave('2', this.choiceModule.join(','), this.org_id, this.role_id_selected).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success',
          duration: 3000
        })
        this.showAPPDialog = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .insideuser-container {
    background: #ffffff;
    border-radius: 10px;
  }
</style>
