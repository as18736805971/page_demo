<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="24" class="header_left">
          <span v-if="auth.save != -1" class="spp-btn-add spp-btn-primary" @click="deptEditVisible = true"><svg-icon icon-class="add_dept" />新增一级部门</span>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content_view">
      <el-table ref="table" :data="dept_paginate_data" row-key="dept_id" default-expand-all :tree-props="{children: 'hierarchy'}" :height="height" size="mini" strip>
        <el-table-column label="部门名称" prop="dept_name" min-width="250" align="left" />
        <el-table-column label="联系电话" prop="phone" width="150" align="left" />
        <el-table-column label="邮箱" prop="email" width="200" align="left" />
        <el-table-column label="部门状态" width="100" align="left">
          <template v-if="auth.enable != -1 && auth.disable != -1" slot-scope="scope">
            <el-switch v-model="scope.row.switch" active-color="#13ce66" inactive-color="#ff4949" @change="deptSwitchSubmit(scope.row)" />
            <span v-if="scope.row.switch" style="color: #14BC6C;">正常</span>
            <span v-if="!scope.row.switch" style="color: #FF4949;">停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="right">
          <template slot-scope="scope">
            <el-button v-if="auth.save != -1" type="text" @click="deptChildSave(scope.row)">新增下级</el-button>
            <el-button v-if="auth.update != -1" type="text" @click="deptUpdate(scope.row)">修改</el-button>
            <el-button v-if="auth.delete != -1" class="font_red" type="text" @click="deptDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增编辑部门 -->
    <el-dialog :title="dept_edit_form.title" :append-to-body="true" :visible.sync="deptEditVisible" :custom-class="'default-size'" :close-on-click-modal="false">
      <el-form ref="dept_edit_form" :model="dept_edit_form" :rules="rules" label-width="80px">
        <el-form-item label="上级部门">{{ dept_edit_form.dept_pname }}</el-form-item>
        <el-form-item label="部门名称" prop="dept_name">
          <el-input v-model="dept_edit_form.dept_name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="dept_edit_form.leader" placeholder="请输入部门负责人" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="dept_edit_form.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dept_edit_form.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="deptEditVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="deptEditSubmit()">保存</span>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { decrypt, httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'
export default {
  name: 'SysDept',
  components: { },
  data() {
    return {
      height: window.innerHeight - 135,
      auth: {},
      dept_paginate_data: [],
      deptEditVisible: false,
      dept_edit_form: {
        title: '新增部门',
        type: 'add',
        dept_pname: '全部',
        dept_name: '',
        dept_pcode: '',
        leader: '',
        phone: '',
        email: ''
      },
      rules: {
        dept_name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
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
    deptEditVisible(val) {
      if (val) {
        this.dept_edit_form.title = this.dept_edit_form.type === 'add' ? '新增部门' : '编辑部门'
      }
      if (!val) {
        this.dept_edit_form.dept_pname = '全部'
        this.dept_edit_form.dept_name = ''
        this.dept_edit_form.dept_pcode = ''
        this.dept_edit_form.leader = ''
        this.dept_edit_form.phone = ''
        this.dept_edit_form.email = ''
        this.dept_edit_form.dept_id = ''
        this.dept_edit_form.type = 'add'
        this.$refs['dept_edit_form'].clearValidate()
      }
    }
  },
  created() {
    this.permissionAuth()
    this.getDeptPaginateData()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {
      this.auth.save = this.permission.indexOf('/api/sys/dept/save')
      this.auth.update = this.permission.indexOf('/api/sys/dept/update')
      this.auth.delete = this.permission.indexOf('/api/sys/dept/delete')
      this.auth.enable = this.permission.indexOf('/api/sys/dept/enable')
      this.auth.disable = this.permission.indexOf('/api/sys/dept/disable')
    },
    // 获取部门列表
    getDeptPaginateData() {
      httpRequest('/api/sys/dept/list', {}).then(res => {
        var data = this.formatTree(JSON.parse(decrypt(res.data)), null)
        this.dept_paginate_data = data
      })
    },
    formatTree(data, parentId) {
      var that = this
      var itemArr = []
      data.forEach(function(val) {
        if (val.dept_pcode === parentId) {
          var newNode = {
            dept_code: val.dept_code,
            dept_id: val.dept_id,
            dept_name: val.dept_name,
            dept_pcode: val.dept_pcode,
            dept_pname: val.dept_pname,
            email: val.email,
            phone: val.phone,
            leader: val.leader,
            status_flag: val.status_flag,
            switch: val.status_flag === '1',
            hierarchy: that.formatTree(data, val.dept_code)
          }
          itemArr.push(newNode)
        }
      })
      return itemArr
    },
    // 新增编辑部门
    deptChildSave(row) {
      this.deptEditVisible = true
      this.dept_edit_form.dept_pname = row.dept_name
      this.dept_edit_form.dept_pcode = row.dept_code
    },
    deptEditSubmit() {
      if (this.dept_edit_form.type === 'add') {
        this.$refs['dept_edit_form'].validate((valid) => {
          if (valid) {
            var data = {
              dept_name: this.dept_edit_form.dept_name,
              dept_pcode: this.dept_edit_form.dept_pcode,
              leader: this.dept_edit_form.leader,
              phone: this.dept_edit_form.phone,
              email: this.dept_edit_form.email
            }
            httpRequest('/api/sys/dept/save', data).then(res => {
              this.deptEditVisible = false
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getDeptPaginateData()
            })
          } else {
            return false
          }
        })
      }
      // 修改
      if (this.dept_edit_form.type === 'edit') {
        this.$refs['dept_edit_form'].validate((valid) => {
          if (valid) {
            var data = {
              dept_name: this.dept_edit_form.dept_name,
              dept_pcode: this.dept_edit_form.dept_pcode,
              leader: this.dept_edit_form.leader,
              phone: this.dept_edit_form.phone,
              email: this.dept_edit_form.email,
              dept_id: this.dept_edit_form.dept_id
            }
            httpRequest('/api/sys/dept/update', data).then(res => {
              this.deptEditVisible = false
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getDeptPaginateData()
            })
          } else {
            return false
          }
        })
      }
    },
    // 修改回显
    deptUpdate(data) {
      this.deptEditVisible = true
      this.dept_edit_form.dept_pname = '全部'
      this.dept_edit_form.dept_name = data.dept_name
      this.dept_edit_form.dept_pcode = data.dept_pcode
      this.dept_edit_form.leader = data.leader
      this.dept_edit_form.phone = data.phone
      this.dept_edit_form.email = data.email
      this.dept_edit_form.dept_id = data.dept_id
      this.dept_edit_form.type = 'edit'
    },
    // 编辑部门状态
    deptSwitchSubmit(row) {
      var data = {
        dept_id: row.dept_id
      }
      if (row.switch) {
        httpRequest('/api/sys/dept/enable', data).then(res => {}).catch(() => {
          this.getDeptPaginateData()
        })
      } else {
        httpRequest('/api/sys/dept/disable', data).then(res => {}).catch(() => {
          this.getDeptPaginateData()
        })
      }
    },
    // 删除部门
    deptDelete(row) {
      this.$confirm('确认要删除该部门吗？', '提示', {
        title: '删除提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/sys/dept/delete', { dept_id: row.dept_id }).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getDeptPaginateData()
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-table__placeholder {
  margin-right: 3px;
}
</style>
