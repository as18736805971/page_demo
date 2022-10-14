<template>
  <div class="app-container page-container">
    <div class="main-header">
      <div class="left">
        <span
          v-if="functionList.includes('A12001')"
          class="spp-btn spp-btn-primary"
          @click="addUser()"
        >
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="show_synchro" class="spp-btn spp-btn-primary" @click="tidyInterface()">
          <svg-icon icon-class="synchro" />
          <span>同步</span>
        </span>
      </div>
      <div>
        <div class="input-box">
          <input
            v-model="search"
            placeholder="搜索姓名或手机号"
            style="width: 280px"
            @keyup.enter="searchData()"
          >
          <span class="input-click" @click="searchData()">
            <svg-icon icon-class="search" />
          </span>
        </div>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="multipleTable" :data="userData">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="姓名" prop="user_name" />
        <el-table-column label="手机号" prop="user_phone" />
        <el-table-column label="邮箱" prop="user_email" />
        <el-table-column label="角色" prop="role_name" />
        <el-table-column prop="address" label="操作" width="130">
          <template slot-scope="scope">
            <div v-if="scope.row.isadmin === '1'">
              <el-button
                v-if="functionList.includes('A12004')"
                type="text"
                @click.native="resetPassword(scope.row.user_id)"
              >初始化密码</el-button>
            </div>
            <div v-else>
              <el-button
                v-if="functionList.includes('A12002')"
                type="text"
                @click="editUser(scope.row.user_id)"
              >编辑</el-button>
              <el-button type="text">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-if="functionList.includes('A12004')"
                      @click.native="resetPassword(scope.row.user_id)"
                    >初始化密码</el-dropdown-item>
                    <el-dropdown-item
                      v-if="functionList.includes('A12003')"
                      @click.native="deleteUser(scope.row.user_id)"
                    >删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="page"
        :limit.sync="page_size"
        @pagination="getData"
      />
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="650px"
    >
      <el-form
        v-if="showDialog"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="model_form insider_form"
      >
        <el-form-item label="角色" prop="user_role">
          <el-select v-model="form.user_role" placeholder="请选择角色">
            <el-option
              v-for="(role, i) in roles"
              :key="i"
              :label="role"
              :value="i"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="姓名" prop="user_name">
          <el-input v-model="form.user_name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="性别" prop="user_gender">
          <el-radio v-model="form.user_gender" label="1">男</el-radio>
          <el-radio v-model="form.user_gender" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="手机号" prop="user_phone">
          <el-input v-model="form.user_phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="user_email">
          <el-input v-model="form.user_email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item class="model_btn_group">
          <span class="spp-btn spp-btn-primary" @click="submit()">提交</span>
          <span class="spp-btn" @click="showDialog = false">取消</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  paginate,
  addUser,
  editUser,
  getUser,
  deleteUser,
  resetPassword,
  mmTeaSyn
} from '@/api/school_user'
import { getSclInfo } from '@/api/school'
import { getRolesList } from '@/api/role'
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'
export default {
  name: 'SchoolUser',
  components: { Pagination },
  data() {
    const validateMobile = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入手机号'))
      } else {
        if (/^1[0-9]{10}$/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      search: '',
      userData: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      show_synchro: false,
      dialogTitle: '',
      roles: [],
      user_id: '',
      form: {
        user_name: '',
        user_phone: '',
        user_gender: '1',
        user_email: '',
        user_role: ''
      },
      rules: {
        user_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '姓名长度在 1 到 10 个字之间',
            trigger: 'blur'
          }
        ],
        user_phone: [
          { required: true, trigger: 'blur', validator: validateMobile }
        ],
        user_role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      scl_id: ''
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  created() {
    this.getSclInfo()
    this.getData()
  },
  methods: {
    getSclInfo() {
      getSclInfo().then((res) => {
        if (res.data.mm_schoolid) {
          this.show_synchro = true
          this.scl_id = res.data.scl_id
        }
      })
    },
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      paginate(this.search, '', this.page, this.page_size).then((response) => {
        this.userData = response.data.list
        this.total = response.data.totalRow
      })
    },
    deleteUser(user_id) {
      this.$confirm('您确定要删除该用户吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(user_id).then((response) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 3000
          })
          this.getData()
        })
      })
    },
    async addUser() {
      const role_raw = await getRolesList('2')
      this.formatRoleData(role_raw.data)
      this.dialogTitle = '新增学校用户'
      this.user_id = ''
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
    },
    async editUser(user_id) {
      const role_raw = await getRolesList('2')
      this.formatRoleData(role_raw.data)
      this.dialogTitle = '编辑学校用户'
      getUser(user_id).then((response) => {
        const data = response.data
        this.user_id = data.user_id
        this.form = {
          user_name: data.user_name,
          user_phone: data.user_phone,
          user_gender: data.user_gender,
          user_email: data.user_email,
          user_role: this.roles.hasOwnProperty(data.user_role)
            ? data.user_role
            : ''
        }
        this.showDialog = true
      })
    },
    submit() {
      if (!this.user_id) {
        // 新增
        this.$refs.form.validate((valid) => {
          if (valid) {
            addUser(this.form).then((response) => {
              this.showDialog = false
              this.$message({
                message: '用户添加成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      } else {
        // 修改
        this.$refs.form.validate((valid) => {
          if (valid) {
            editUser(this.user_id, this.form).then((response) => {
              this.showDialog = false
              this.$message({
                message: '用户修改成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      }
    },
    getRoles() {
      getRolesList('2').then((response) => {
        const data = response.data
        const roles = {}
        data.forEach((v) => {
          roles[v['role_id']] = v['role_name']
        })
        this.roles = roles
      })
    },
    formatRoleData(data) {
      const roles = {}
      data.forEach((v) => {
        roles[v['role_id']] = v['role_name']
      })
      this.roles = roles
    },
    resetPassword(user_id) {
      resetPassword(user_id).then((response) => {
        this.$message({
          message: '密码重置成功',
          type: 'success',
          duration: 3000
        })
      })
    },
    tidyInterface() {
      mmTeaSyn(this.scl_id).then((res) => {
        this.$message({
          message: '同步成功',
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
</style>
