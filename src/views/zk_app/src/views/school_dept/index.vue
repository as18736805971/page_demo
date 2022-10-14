<template>
  <div class="app-container page-container" style="padding-bottom:0">
    <el-row>
      <el-col :span="8">
        <div :style="{height: height + 'px'}" class="fix_height_block" style="border-right: 1px solid #EBF0F5">
          <div class="header">
            <span class="title">部门列表</span>
            <span class="btn_area">
              <span v-if="functionList.includes('A14001')" style="margin-right:0" class="spp-btn spp-btn-primary" @click="addTopSclDept">
                <svg-icon icon-class="add" />新增1级部门
              </span>
            </span>
          </div>
          <el-scrollbar
            wrap-class="vertical_scrollbar"
            :style="{ height: height - 47 + 'px' }"
          >
            <el-tree :data="dept_data" node-key="dept_id" default-expand-all :expand-on-click-node="false" class="emer_group_tree">
              <div slot-scope="{data}" class="emer_group_tree_node" @click="showDetail(data.id, data)">
                <span style="display: flex;align-items: center">
                  <img v-if="data.parent_id === '0'" src="../../assets/icon/dept.png">
                  <img v-else src="../../assets/icon/group.png">
                  <span>{{ data.label }}</span>
                </span>
                <span v-if="selected_dept === data.id">
                  <el-button v-if="functionList.includes('A14001')" style="font-size: 14px" type="text" size="mini" @click="(e) => addSubSclDept(data.id, e)">添加部门</el-button>
                  <el-button v-if="functionList.includes('A14002')" style="font-size: 14px" type="text" size="mini" @click="(e) => editSclDept(data.id, e)">编辑</el-button>
                  <el-button v-if="functionList.includes('A14003')" style="font-size: 14px" type="text" size="mini" :disabled="data.hasOwnProperty('children') && data.children.length !== 0" @click="(e) => deleteSclDept(data.id, e)">删除</el-button>
                </span>
              </div>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col v-if="!selected_dept" :span="16">
        <div :style="{height: height + 'px'}" class="fix_height_block" style="text-align:center; padding-top: 50px;">
          <span style="color:#aaa">请选择部门以查看部门成员</span>
        </div>
      </el-col>
      <el-col v-else :span="16">
        <div class="fix_height_block">
          <div class="header">
            <div class="title">{{ dept_name }}</div>
            <div class="btn_area">
              <span v-if="functionList.includes('A14001')" class="spp-btn" style="margin-right: 0" @click="addDeptUser()"><svg-icon icon-class="add" />添加成员</span>
            </div>
          </div>
          <div class="body">
            <div class="header" style="line-height: 32px; font-size: 14px; color:#313233">
              <b>部门负责人</b>
              <span>{{ dept_response_man_name }}</span>
              <b>部门电话</b>
              <span>{{ dept_phone }}</span>
            </div>
            <div class="main-body" :style="{height: (height - 114) + 'px'}">
              <el-table :data="user_data">
                <el-table-column label="序号" type="index" width="60" />
                <el-table-column label="用户名" prop="user_name" />
                <el-table-column label="手机号" prop="user_phone" />
                <el-table-column label="用户角色" prop="role_name" />
                <el-table-column label="操作" width="130">
                  <template slot-scope="scope">
                    <el-button v-if="functionList.includes('A14001')" type="text" @click="removeUser(scope.row.user_id)">移出部门</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <pagination v-show="user_total>0" :total="user_total" :page.sync="user_page" :limit.sync="user_page_size" @pagination="getUserData" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="628px"
    >
      <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="120px" class="model_form">
        <el-form-item v-if="showParent" label="父部门" prop="parent_id">
          <el-cascader
            v-model="form.parent_id"
            :options="edit_dept_data"
            :props="{ checkStrictly: true }"
            placeholder="请选择父部门"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="dept_name">
          <el-input v-model="form.dept_name" type="text" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门联系电话" prop="dept_phone">
          <el-input v-model="form.dept_phone" type="text" placeholder="请输入部门电话" />
        </el-form-item>
        <el-form-item label="部门负责人" prop="dept_response_man">
          <el-select v-model="form.dept_response_man" filterable placeholder="请选择部门负责人">
            <el-option
              v-for="item in scl_user"
              :key="item.user_id"
              :label="item.user_name"
              :value="item.user_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="model_btn_group">
          <span class="spp-btn spp-btn-primary" @click="submit()">提交</span>
          <span class="spp-btn" @click="reset()">重置</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="请选择要要添加的用户"
      :visible.sync="showAddUserDialog"
      :close-on-click-modal="false"
      width="670px"
    >
      <el-transfer v-model="selectedUserId" :data="user_list" :titles="['用户列表', '已选用户']" filterable filter-placeholder="搜索用户名称" />
      <div style="padding: 16px 0px; text-align:right">
        <span class="spp-btn spp-btn-primary" @click="submitAddUser()">提交</span>
        <span class="spp-btn" @click="showAddUserDialog=false">取消</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSclDeptList, addSclDept, editSclDept, deleteSclDept, getSclDeptInfo } from '@/api/school_dept'
import { paginate, getNoDeptUser, userAddDept, userDelDept } from '@/api/school_user'
import { getSclUserList } from '@/api/school_user'
import { formatDateTime } from '@/utils/index'
import { mapState } from 'vuex'
import Pagination from '@/components/Pagination'
export default {
  name: 'SchoolDept',
  components: { Pagination },
  data() {
    return {
      search: {
        scl_id: '',
        area_name: ''
      },
      height: window.innerHeight - 145,
      showParent: false,
      edit_dept_data: [
        {
          value: '0',
          label: '顶层部门',
          children: []
        }
      ],
      dept_data: [],
      user_data: [],
      user_page: 1,
      user_page_size: 6,
      user_total: 0,
      scl_user: [],
      selected_dept: '',
      dept_response_man_name: '',
      dept_phone: '',
      dept_name: '',
      showDialog: false,
      showAddUserDialog: false,
      dialogTitle: '',
      dept_id: '',
      form: {
        dept_name: '',
        dept_response_man: '',
        parent_id: '',
        dept_phone: ''
      },
      rules: {
        parent_id: [
          { required: true, message: '请选择父部门', trigger: 'blur' }
        ],
        dept_name: [
          { required: true, message: '请填写部门名称', trigger: 'blur' }
        ],
        dept_response_man: [
          { required: true, message: '请选择部门联系人', trigger: 'blur' }
        ],
        dept_phone: [
          { required: true, message: '请填写部门联系电话', trigger: 'blur' }
        ]
      },
      selectedUserId: [],
      user_list: []
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    find_children(parent_id, data) {
      const return_data = []
      data.forEach(item => {
        if (item.parent_id === parent_id) {
          const tmp = {
            id: item.dept_id,
            label: item.dept_name,
            dept_response_man_name: item.dept_response_man_name,
            dept_phone: item.dept_phone,
            parent_id: item.parent_id
          }
          const t = this.find_children(item.dept_id, data)
          if (t && t.length > 0) {
            tmp['children'] = t
          }
          return_data.push(tmp)
        }
      })
      return return_data
    },
    find_children_for_edit(parent_id, data) {
      const return_data = []
      data.forEach(item => {
        if (item.parent_id === parent_id) {
          const tmp = {
            value: item.dept_id,
            label: item.dept_name
          }
          const t = this.find_children_for_edit(item.dept_id, data)
          if (t && t.length > 0) {
            tmp['children'] = t
          }
          return_data.push(tmp)
        }
      })
      return return_data
    },
    formatSclDeptData(scl_dept_data_raw) {
      const return_data = this.find_children('0', scl_dept_data_raw)
      this.dept_data = return_data
    },
    formatSclDeptDataForEdit(scl_dept_data_raw) {
      const return_data = this.find_children_for_edit('0', scl_dept_data_raw)
      this.edit_dept_data[0].children = return_data
    },
    getData() {
      this.dept_data = []
      this.edit_dept_data[0].children = []
      getSclDeptList().then(response => {
        const data = response.data
        this.formatSclDeptData(data)
        this.formatSclDeptDataForEdit(data)
        if (this.selected_dept) {
          data.forEach(item => {
            if (item.dept_id === this.selected_dept) {
              this.dept_response_man_name = item.dept_response_man_name
              this.dept_phone = item.dept_phone
              this.dept_name = item.dept_name
              return
            }
          })
        }
      })
    },
    showDetail(id, data) {
      this.selected_dept = id
      this.dept_response_man_name = data.dept_response_man_name
      this.dept_phone = data.dept_phone
      this.dept_name = data.label
      this.getUserData()
    },
    getUserData() {
      paginate('', this.selected_dept, this.user_page, this.user_page_size).then(response => {
        const data = response.data
        this.user_data = data.list
        this.user_total = data.totalRow
      })
    },
    async addSubSclDept(dept_id, e) {
      e.stopPropagation()
      this.showParent = false
      const scl_user_raw = await getSclUserList()
      this.scl_user = scl_user_raw.data
      this.dialogTitle = '新增学校部门'
      this.dept_id = ''
      Object.assign(this.form, this.$options.data().form)
      this.form.parent_id = dept_id
      this.showDialog = true
    },
    async addTopSclDept() {
      this.showParent = false
      const scl_user_raw = await getSclUserList()
      this.scl_user = scl_user_raw.data
      this.dialogTitle = '新增学校1级部门'
      this.dept_id = ''
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
    },
    async editSclDept(dept_id, e) {
      e.stopPropagation()
      this.showParent = true
      this.dialogTitle = '编辑学校部门'
      const scl_user_raw = await getSclUserList()
      this.scl_user = scl_user_raw.data
      this.dept_id = dept_id
      getSclDeptInfo(dept_id).then(response => {
        const data = response.data
        this.area_id = data.area_id
        this.form = {
          dept_name: data.dept_name,
          dept_response_man: data.dept_response_man,
          dept_phone: data.dept_phone,
          parent_id: data.parent_id
        }
        this.showDialog = true
      })
    },
    deleteSclDept(dept_id, e) {
      e.stopPropagation()
      this.$confirm('您确定要删除该部门吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSclDept(dept_id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
          this.user_data = []
          this.selected_dept = ''
        })
      }).catch(() => {})
    },
    submit() {
      if (!this.dept_id) {
        // 新增
        this.$refs.form.validate(valid => {
          if (valid) {
            addSclDept(this.form).then(response => {
              this.showDialog = false
              this.$message({
                message: '学校部门添加成功',
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
            if (this.form.parent_id instanceof Array) {
              this.form.parent_id = this.form.parent_id[this.form.parent_id.length - 1]
            }
            editSclDept(this.dept_id, this.form).then(response => {
              this.showDialog = false
              this.$message({
                message: '学校部门修改成功',
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
    },
    addDeptUser() {
      getNoDeptUser().then(response => {
        this.selectedUserId = []
        this.user_list = []
        const user = response.data
        user.forEach(item => {
          this.user_list.push({
            key: item.user_id,
            label: item.user_name
          })
        })
        this.showAddUserDialog = true
      })
    },
    submitAddUser() {
      const user_id = this.selectedUserId.join(',')
      userAddDept(user_id, this.selected_dept).then(response => {
        this.showAddUserDialog = false
        this.getUserData()
      })
    },
    removeUser(user_id) {
      this.$confirm('确定要移出该用户吗？', '移出提示', {
        confirmButtonText: '移出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userDelDept(user_id).then(response => {
          this.$message({
            type: 'success',
            message: '移出成功!'
          })
          this.getUserData()
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.dept-tree-node{
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 16px;
  .dept-tree-label{
    font-size: 14px;
    line-height: 28px;
    color: #313233;
  }
}
.right-content{
  min-height: 500px;
  .no_data{
    text-align: center;
    color: #313233;
  }
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
