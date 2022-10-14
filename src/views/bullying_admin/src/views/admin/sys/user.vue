<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="12" class="header_left">
          <span v-if="auth.save != -1" class="spp-btn-add spp-btn-primary" @click="userEditVisible = true"><svg-icon icon-class="add_user" />新增用户</span>
        </el-col>
        <el-col :span="12" class="header_right search_view">
          <div class="input_view">
            <el-input v-model="search.keyword" placeholder="搜索姓名、手机号" clearable />
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content_view">
      <div class="tree_content_view">
        <el-scrollbar wrap-class="vertical_scrollbar" :style="'height: ' + height + 'px'">
          <el-tree :data="dept_tree_data" :props="defaultProps" icon-class="el-icon-arrow-right" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick" />
        </el-scrollbar>
      </div>
      <div class="tab_content_view">
        <div class="top-title"><span class="title">部门：</span>{{ Array.from(new Set(section_title)).join('/') }}</div>
        <el-table ref="table" :data="user_paginate_data" :height="height-100" size="mini" strip>
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="姓名" width="120" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.user_name }}</span>
              <img v-if="scope.row.user_sex == '0'" src="../../../assets/images/girl.png" style="width: 16px;vertical-align: top;" alt="">
              <img v-if="scope.row.user_sex == '1'" src="../../../assets/images/man.png" style="width: 16px;vertical-align: top;" alt="">
            </template>
          </el-table-column>
          <el-table-column label="任职" min-width="220" align="left">
            <template slot-scope="scope">
              <div v-for="item in scope.row.dept_list" :key="item.role_id" style="background: #F5F6FA;border-radius: 4px;display: inline-block;padding: 3px 16px;">
                <div>{{ item.dept_info }}</div>
                <div>{{ item.role_name }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="user_phone" width="140" align="left" />
          <el-table-column label="状态" width="120" align="left">
            <template v-if="auth.enable != -1 && auth.disable != -1" slot-scope="scope">
              <el-switch v-model="scope.row.switch" active-color="#13ce66" inactive-color="#ff4949" @change="userSwitchSubmit(scope.row)" />
              <span v-if="scope.row.switch" style="color: #14BC6C;">正常</span>
              <span v-if="!scope.row.switch" style="color: #FF4949;">停用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right" align="right">
            <template slot-scope="scope">
              <el-button v-if="auth.info != -1" type="text" @click="userDetail(scope.row)">详情</el-button>
              <el-button v-if="auth.update != -1" type="text" @click="userUpdate(scope.row)">修改</el-button>
              <el-button v-if="auth.delete != -1" class="font_red" type="text" @click="userDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getUserPaginateData" />
      </div>
    </div>
    <!-- 新增编辑用户 -->
    <el-dialog :title="user_edit_form.title" :append-to-body="true" :visible.sync="userEditVisible" :custom-class="'default-size'" :close-on-click-modal="false">
      <el-form ref="user_edit_form" :model="user_edit_form" :rules="rules" label-width="80px">
        <el-row style="padding: 0 16px;line-height: 36px;">
          <el-col :span="24">
            <span style="color: #939499;">基本信息</span>
          </el-col>
        </el-row>
        <el-form-item label="用户姓名" prop="user_name">
          <el-input v-model="user_edit_form.user_name" placeholder="请输入用户姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="user_phone">
          <el-input v-model="user_edit_form.user_phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="性别" prop="user_sex">
          <el-radio-group v-model="user_edit_form.user_sex">
            <el-radio label="0">女</el-radio>
            <el-radio label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" prop="user_email">
          <el-input v-model="user_edit_form.user_email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-row style="padding: 0 16px;line-height: 36px;">
          <el-col :span="12">
            <span style="color: #939499;">分配角色</span>
          </el-col>
        </el-row>
        <div v-for="(item, key) in user_edit_form.dept_list" :key="key">
          <div style="border: 1px solid #E1E3E6;border-radius: 10px;margin: 16px 0;padding: 16px 0;">
            <el-row style="padding: 0 16px;line-height: 36px;">
              <el-col :span="12" style="color: #323338;font-weight: bold;font-size:16px;">任职{{ key+1 }}</el-col>
              <el-col :span="12" style="text-align: right;color: #FF4949"><i class="el-icon-delete" @click="userJobDelete(key)" /></el-col>
              <el-col :span="24" style="color: #323338;">部门：{{ item.dept_info }}</el-col>
              <el-col :span="24">角色：{{ item.role_name }}</el-col>
            </el-row>
          </div>
        </div>
        <div style="border: 1px solid #E1E3E6;border-radius: 10px;margin: 16px 0;padding: 16px 0;">
          <el-form>
            <el-row style="padding: 0 16px;line-height: 36px;">
              <el-col :span="12" style="color: #323338;font-weight: bold;font-size:16px;">任职</el-col>
              <el-col :span="12" style="text-align: right;"><el-button class="round-btn-primary" round @click="userJobEdit()">保存任职</el-button></el-col>
            </el-row>
            <el-form-item>
              <el-cascader ref="cascaderAddr" v-model="user_edit_form.role_form.dept_code" style="width: 100%" :options="dept_tree_data" :props="{ children: 'hierarchy', label: 'dept_name', value: 'dept_code', checkStrictly: true }" placeholder="请选择部门" @change="((val)=>{handleChange(val)})" />
            </el-form-item>
            <el-form-item>
              <el-select ref="selectRole" v-model="user_edit_form.role_form.role_id" clearable placeholder="请选择">
                <el-option v-for="i in user_edit_form.role_form.role_dic" :key="i.role_id" :label="i.role_name" :value="i.role_id" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="userEditVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="userEditSubmit()">保存</span>
      </span>
    </el-dialog>
    <!-- 用户详情 -->
    <el-dialog title="用户详情" :visible.sync="userDetailVisible" :close-on-click-modal="false" width="720px" custom-class="have_scroll_dialog">
      <div style="background: #F0F2FF;border-radius: 10px;padding: 16px;">
        <div style="line-height: 72px;">
          <span style="display: inline-block;width: 72px;height: 72px;background: #4968FF;color: #fff;border-radius: 50%;text-align: center;position: relative;bottom: 3px;">{{ user_detail_data.user_name }}</span>
          <span style="font-weight: Bold;font-size: 28px;color: #323338;">{{ user_detail_data.user_name }}</span>
          <img v-if="user_detail_data.user_sex == '0'" src="../../../assets/images/girl.png" style="width: 22px;" alt="">
          <img v-if="user_detail_data.user_sex == '1'" src="../../../assets/images/man.png" style="width: 22px;" alt="">
          <span style="float: right;">
            <el-switch v-model="user_detail_data.switch" active-color="#13ce66" inactive-color="#ff4949" @change="userSwitchSubmit(user_detail_data)" />
            <span v-if="user_detail_data.switch" style="color: #14BC6C;">正常</span>
            <span v-if="!user_detail_data.switch" style="color: #FF4949;">停用</span>
          </span>
        </div>
      </div>
      <el-divider content-position="left">任职信息</el-divider>
      <el-row>
        <el-col v-for="(item, key) in user_detail_data.dept_list" :key="key" :span="12">
          <div style="border: 1px solid #E1E3E6;border-radius: 10px;margin: 16px 0;padding: 16px 8px;">
            <el-row style="padding: 0 16px;line-height: 36px;">
              <el-col :span="24" style="color: #323338;font-weight: bold;font-size:16px;">任职{{ key+1 }}</el-col>
              <el-col :span="24" style="color: #323338;">部门：<span>{{ item.dept_info }}</span></el-col>
              <el-col :span="24">角色：<span style="background: #F0F1F5;border-radius: 15px;padding: 3px 8px;color: #939499;">{{ item.role_name }}</span></el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-divider content-position="left">其他信息</el-divider>
      <el-row style="line-height: 32px;">
        <el-col :span="12">
          <span style="color: #696B70;">手机号：</span>
          <span style="color: #323338;">{{ user_detail_data.user_phone }}</span>
        </el-col>
        <el-col :span="12">
          <span style="color: #696B70;">用户邮箱：</span>
          <span style="color: #323338;">{{ user_detail_data.user_email }}</span>
        </el-col>
        <el-col :span="12">
          <span style="color: #696B70;">最后登录ip：</span>
          <span style="color: #323338;">{{ user_detail_data.last_login_ip }}</span>
        </el-col>
        <el-col :span="12">
          <span style="color: #696B70;">最后登录时间：</span>
          <span style="color: #323338;">{{ user_detail_data.last_login_time?formatDateTime(user_detail_data.last_login_time):'--' }}</span>
        </el-col>
        <el-col :span="12">
          <span style="color: #696B70;">APP激活状态：</span>
          <span v-if="user_detail_data.app_reg_flag == '0'" style="color: #323338;">未激活</span>
          <span v-if="user_detail_data.app_reg_flag == '1'" style="color: #14BC6C;">已激活</span>
        </el-col>
        <el-col :span="12">
          <span style="color: #696B70;">APP激活时间：</span>
          <span style="color: #323338;">{{ user_detail_data.app_reg_time?formatDateTime(user_detail_data.app_reg_time):'--' }}</span>
        </el-col>
        <el-col :span="12">
          <span style="color: #696B70;">创建人员：</span>
          <span style="color: #323338;">{{ user_detail_data.create_oper_name }}</span>
        </el-col>
        <el-col :span="12">
          <span style="color: #696B70;">创建时间：</span>
          <span style="color: #323338;">{{ user_detail_data.create_time?formatDateTime(user_detail_data.create_time):'--' }}</span>
        </el-col>
        <el-col :span="12">
          <span style="color: #696B70;">微信绑定：</span>
          <span v-if="!user_detail_data.wx_unionid" style="color: #323338;">未绑定</span>
          <span v-if="user_detail_data.wx_unionid" style="color: #14BC6C;">已绑定</span>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { decrypt, httpRequest } from '@/utils/auth'
import { formatDateTime } from '@/utils/index'
import { mapState } from 'vuex'
import Pagination from '@/components/Pagination'
export default {
  name: 'SysUser',
  components: { Pagination },
  data() {
    return {
      height: window.innerHeight - 135,
      auth: {},
      search: {
        dept_code: '',
        keyword: ''
      },
      dept_tree_data: [],
      defaultProps: {
        children: 'hierarchy',
        label: 'dept_name'
      },
      section_title: [],
      page: 1,
      page_size: 20,
      total: 0,
      user_paginate_data: [],
      userEditVisible: false,
      user_edit_form: {
        title: '新增用户',
        type: 'add',
        user_name: '',
        user_phone: '',
        user_email: '',
        user_sex: '',
        user_id: '',
        role_form: {
          role_dic: [],
          role_id: '',
          dept_info: '',
          dept_code: []
        },
        dept_list: []
      },
      rules: {
        user_name: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        user_phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        user_sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ]
      },
      userDetailVisible: false,
      user_detail_data: {}
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  watch: {
    userEditVisible(val) {
      if (val) {
        this.user_edit_form.title = this.user_edit_form.type === 'add' ? '新增用户' : '编辑用户'
      }
      if (!val) {
        this.user_edit_form.user_name = ''
        this.user_edit_form.user_phone = ''
        this.user_edit_form.user_email = ''
        this.user_edit_form.user_sex = ''
        this.user_edit_form.user_id =
        this.user_edit_form.dept_list = []
        this.user_edit_form.role_form.role_dic = []
        this.user_edit_form.role_form.dept_code = []
        this.user_edit_form.role_form.role_id = ''
        this.user_edit_form.role_form.dept_info = ''
        this.user_edit_form.type = 'add'
        this.$refs['user_edit_form'].clearValidate()
      }
    }
  },
  created() {
    this.permissionAuth()
    this.getDeptTreeData()
  },
  methods: {
    formatDateTime: formatDateTime,
    // 获取按钮权限
    permissionAuth() {
      this.auth.save = this.permission.indexOf('/api/pajx/user/save/inside')
      this.auth.update = this.permission.indexOf('/api/pajx/user/update')
      this.auth.delete = this.permission.indexOf('/api/pajx/user/delete')
      this.auth.enable = this.permission.indexOf('/api/pajx/user/enable')
      this.auth.disable = this.permission.indexOf('/api/pajx/user/disable')
    },
    // 获取部门列表
    getDeptTreeData() {
      httpRequest('/api/sys/dept/tree', {}).then(res => {
        this.dept_tree_data = this.handleUnderArray(JSON.parse(decrypt(res.data)), 0, '')
        this.section_title.push(this.dept_tree_data[0].dept_name)
        this.search.dept_code = this.dept_tree_data[0].dept_code
        this.getUserPaginateData()
      })
    },
    // 点击部门
    handleNodeClick(data) {
      this.section_title = []
      this.section_title = this.handleUpArray(this.dept_tree_data, data.level_code, [], 'dept_name')
      this.section_title.push(data.dept_name)
      this.search.dept_code = data.dept_code
      this.getUserPaginateData()
    },
    // 循环下层数组
    handleUnderArray(arr, index, pid) {
      arr.map((item) => {
        item.level = index
        item.level_code = ''
        if (pid === '') {
          item.level_code = item.dept_code
        } else {
          item.level_code += item.dept_code + ',' + pid
        }
        if (item.hierarchy && item.hierarchy.length > 0) {
          this.handleUnderArray(item.hierarchy, item.level + 1, item.level_code)
        }
      })
      return arr
    },
    // 循环上层数组
    handleUpArray(arr, item, str, name) {
      arr.map((vv) => {
        if (vv.hierarchy && vv.hierarchy.length > 0) {
          if (item.split(',').indexOf(vv.dept_code) > -1) {
            str.push(vv[name])
            this.handleUpArray(vv.hierarchy, item, str, name)
          }
        }
      })
      return str
    },
    // 获取用户列表
    getUserPaginateData() {
      var data = {
        page_num: this.page,
        page_size: this.page_size,
        dept_code: this.search.dept_code,
        keyword: this.search.keyword
      }
      httpRequest('/api/pajx/user/paginate', data).then(res => {
        var data = JSON.parse(decrypt(res.data))
        data.records.forEach(function(val) {
          if (val.status_flag === '1') {
            val.switch = true
          } else {
            val.switch = false
          }
        })
        this.user_paginate_data = data.records
        this.total = data.total
      }).catch(() => {
        this.user_paginate_data = []
        this.total = 0
      })
    },
    // 编辑用户状态
    userSwitchSubmit(row) {
      var data = {
        user_id: row.user_id
      }
      if (row.switch) {
        httpRequest('/api/pajx/user/enable', data).then(res => {}).catch(() => {
          this.getUserPaginateData()
        })
      } else {
        httpRequest('/api/pajx/user/disable', data).then(res => {}).catch(() => {
          this.getUserPaginateData()
        })
      }
    },
    // 删除用户
    userDelete(row) {
      this.$confirm('确认要删除该用户吗？', '提示', {
        title: '删除提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/pajx/user/delete', { user_id: row.user_id }).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getUserPaginateData()
        })
      }).catch(() => {})
    },
    // 新增任职
    userJobEdit() {
      var that = this
      this.user_edit_form.role_form.role_dic.forEach(function(val) {
        if (val.role_id === that.user_edit_form.role_form.role_id) {
          that.user_edit_form.dept_list.push({
            role_name: val.role_name,
            role_id: that.user_edit_form.role_form.role_id,
            dept_info: that.user_edit_form.role_form.dept_info
          })
        }
      })
      this.user_edit_form.role_form.role_dic = []
      this.user_edit_form.role_form.dept_code = []
      this.user_edit_form.role_form.role_id = ''
      this.user_edit_form.role_form.dept_info = ''
    },
    // 刪除任职
    userJobDelete(key) {
      this.user_edit_form.dept_list.splice(key, 1)
    },
    // 选择部门后获取部门角色列表
    handleChange(value) {
      this.user_edit_form.role_form.dept_info = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels.join('/')
      httpRequest('/api/sys/role/list', { dept_code: value[value.length - 1] }).then(res => {
        this.user_edit_form.role_form.role_dic = JSON.parse(decrypt(res.data))
      })
    },
    // 新增编辑用户
    userEditSubmit() {
      var dept_list = []
      this.user_edit_form.dept_list.forEach(function(val) {
        dept_list.push({
          role_id: val.role_id,
          dept_info: val.dept_info
        })
      })
      if (this.user_edit_form.type === 'add') {
        this.$refs['user_edit_form'].validate((valid) => {
          if (valid) {
            var data = {
              user_name: this.user_edit_form.user_name,
              user_phone: this.user_edit_form.user_phone,
              user_email: this.user_edit_form.user_email,
              user_sex: this.user_edit_form.user_sex,
              dept_list: JSON.stringify(dept_list)
            }
            httpRequest('/api/pajx/user/save/inside', data).then(res => {
              this.userEditVisible = false
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getUserPaginateData()
            })
          } else {
            return false
          }
        })
      }
      // 修改
      if (this.user_edit_form.type === 'edit') {
        this.$refs['user_edit_form'].validate((valid) => {
          if (valid) {
            var data = {
              user_name: this.user_edit_form.user_name,
              user_phone: this.user_edit_form.user_phone,
              user_email: this.user_edit_form.user_email,
              user_sex: this.user_edit_form.user_sex,
              user_id: this.user_edit_form.user_id,
              dept_list: JSON.stringify(dept_list)
            }
            httpRequest('/api/pajx/user/update', data).then(res => {
              this.userEditVisible = false
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getUserPaginateData()
            })
          } else {
            return false
          }
        })
      }
    },
    // 修改回显
    userUpdate(data) {
      this.userEditVisible = true
      this.user_edit_form.user_name = data.user_name
      this.user_edit_form.user_phone = data.user_phone
      this.user_edit_form.user_email = data.user_email
      this.user_edit_form.user_sex = data.user_sex
      this.user_edit_form.dept_list = data.dept_list
      this.user_edit_form.user_id = data.user_id
      this.user_edit_form.type = 'edit'
    },
    // 用户详情
    userDetail(row) {
      httpRequest('/api/pajx/user/detail', { user_id: row.user_id }).then(res => {
        this.user_detail_data = JSON.parse(decrypt(res.data))
        this.user_detail_data.switch = this.user_detail_data.status_flag === '1'
        this.userDetailVisible = true
        console.log(this.user_detail_data)
      })
    }
  }
}
</script>
<style lang="scss">
  .content_view .top-title {
    height: 30px;
    font-size: 13px;
    color: #323338;
    letter-spacing: 0;
    line-height: 30px;
    margin-bottom: 8px;

    .title {
      color: #696B70;
    }
  }
</style>
