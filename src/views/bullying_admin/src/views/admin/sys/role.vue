<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="12" class="header_left">
          <span v-if="auth.save != -1" class="spp-btn-add spp-btn-primary" @click="roleVisible = true"><svg-icon icon-class="add_role" />新增角色</span>
        </el-col>
        <el-col :span="12" class="header_right search_view">
          <div class="input_view">
            <el-input v-model="search.role_name" placeholder="搜索角色" @keyup.enter="queryData" @change="queryData" />
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content_view">
      <div class="tree_content_view">
        <el-scrollbar wrap-class="vertical_scrollbar" :style="'height: ' + height + 'px'">
          <el-tree
            :data="part_list"
            icon-class="el-icon-arrow-right"
            :expand-on-click-node="false"
            default-expand-all
            :props="{ children: 'hierarchy', label: 'dept_name'}"
            @node-click="handleNodeClick"
          />
        </el-scrollbar>
      </div>
      <div class="tab_content_view">
        <div class="branch-top-title"><span class="branch-title">部门：</span>{{ Array.from(new Set(section_title)).join('/') }}</div>
        <el-table ref="table" :data="role_list" :height="height - 100" size="mini" strip>
          <el-table-column label="序号" type="index" width="80" align="left" />
          <el-table-column label="角色名称" prop="role_name" min-width="120" align="left" />
          <el-table-column label="是否流程审批角色" min-width="80" align="left">
            <template slot-scope="scope">
              {{ scope.row.process == '1' ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column label="菜单状态" min-width="80" align="left">
            <template v-if="auth.enable != -1 && auth.disable != -1" slot-scope="scope">
              <el-switch v-model="scope.row.switch" active-color="#13ce66" inactive-color="#ff4949" @change="handleSwitch(scope.row, scope.$index)" />
              <span v-if="scope.row.switch" style="color: #14BC6C;">正常</span>
              <span v-if="!scope.row.switch" style="color: #FF4949;">停用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right" align="right">
            <template slot-scope="scope">
              <el-button v-if="auth.auth_list != -1" type="text" @click="handleAuth(scope.row)">管理权限</el-button>
              <el-button v-if="auth.update != -1" type="text" @click="roleUpdate(scope.row)">修改</el-button>
              <el-button v-if="auth.delete != -1" type="text" style="color: #FF4949" @click="handleDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="search.page_num" :limit.sync="search.page_size" @pagination="handleCurrentChange" />
      </div>
    </div>
    <!-- 新增编辑角色 -->
    <el-dialog :title="form.title" :append-to-body="true" :visible.sync="roleVisible" :custom-class="'default-size'" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="form.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="所属部门" prop="dept_code">
          <el-cascader
            v-model="form.dept_code"
            style="width: 100%"
            :options="part_list"
            :props="{ children: 'hierarchy', label: 'dept_name', value: 'dept_code', checkStrictly: true }"
            placeholder="请选择部门"
          />
        </el-form-item>
        <el-form-item label="是否流程审批角色" prop="process">
          <el-radio-group v-model="form.process">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.role_desc" :rows="5" resize="none" type="textarea" placeholder="请输入菜单说明" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="roleVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmit()">保存</span>
        <span v-if="form.type === 'add'" class="spp-btn spp-auth" @click="handleAuth(null)">保存并分配权限</span>
      </span>
    </el-dialog>
    <!-- 管理权限 -->
    <el-dialog :title="authTitle" :append-to-body="true" :visible.sync="authVisible" :custom-class="'default-big-size'" :close-on-click-modal="false">
      <div class="select-content">
        <div class="panel">
          <div class="header">权限列表</div>
          <el-scrollbar wrap-class="vertical_scrollbar" style="height: 280px">
            <el-tree ref="tree" node-key="menu_id" :data="menu_list" show-checkbox :props="{ children: 'child_menu', label: 'menu_name' }" @check-change="handleMenuClick">
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <img v-if="data.menu_type != 3" class="file-icon" src="../../../assets/images/file.png">
                <img v-else class="file-icon" src="../../../assets/images/auth_key.png">
                <span class="label-txt" :class="data.menu_type == 3 ? 'txt-active' : ''">{{ node.label }}</span>
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
        <div class="panel">
          <div class="header">已选权限列表</div>
          <el-scrollbar wrap-class="vertical_scrollbar" style="height: 280px">
            <div class="item-list">
              <div v-for="(item, index) in select_menu" :key="index" class="item">
                <img class="file-icon" src="../../../assets/images/auth_key.png">
                <div class="txt">{{ item.menu_name }}</div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="authVisible = false">暂不分配</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmitAuth()">保存</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { decrypt, httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'

export default {
  name: 'SysRole',
  components: { Pagination },
  data() {
    return {
      height: window.innerHeight - 135,
      auth: {},
      search: {
        role_name: '', // 角色名称
        dept_code: '', // 部门代码
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      total: 0,
      role_list: [], // 角色列表
      section_title: [],
      roleVisible: false, // 显示新增/编辑弹框
      authVisible: false, // 管理权限弹框
      authTitle: '', // 管理权限弹框标题
      part_list: [], // 左侧部门列表
      menu_list: [], // 菜单列表
      select_menu: [], // 选择的菜单
      select_ids: [], // 选择的菜单
      p_ids: [], // 父级节点
      auth_type: 1, // 权限管理
      form: {
        title: '新增角色',
        type: 'add',
        role_name: '', // 角色名称
        dept_code: [], // 所属部门
        role_desc: '', // 角色描述
        process: 0 // 是否流程审批角色 0否 1是
      },
      rules: {
        role_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        dept_code: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        process: [
          { required: true, message: '请选择是否流程审批角色', trigger: 'blur' }
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
    roleVisible(val) {
      if (val) {
        this.form.title = this.form.type === 'add' ? '新增角色' : '编辑角色'
      }
      if (!val) {
        this.form.type = 'add'
        this.form.role_name = ''
        this.form.dept_code = []
        this.form.role_desc = ''
        this.form.process = 0
        this.$refs['form'].clearValidate()
      }
    },
    authVisible(val) {
      if (!val) {
        this.select_menu = []
        this.select_ids = []
        this.$refs.tree.setCheckedKeys([])
      }
    }
  },
  created() {
    this.permissionAuth()
    this.getLeftPartData()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {
      this.auth.save = this.permission.indexOf('/api/sys/role/save') // 添加
      this.auth.update = this.permission.indexOf('/api/sys/role/update') // 修改
      this.auth.delete = this.permission.indexOf('/api/sys/role/delete') // 删除
      this.auth.auth_list = this.permission.indexOf('/api/sys/role/menu/list') // 管理权限
      this.auth.enable = this.permission.indexOf('/api/sys/role/enable') // 启用
      this.auth.disable = this.permission.indexOf('/api/sys/role/disable') // 停用
    },
    // 获取左侧部门列表
    getLeftPartData() {
      httpRequest('/api/sys/dept/tree', {}, false).then(res => {
        this.part_list = this.handleUnderArray(JSON.parse(decrypt(res.data)), 0, '')
        this.section_title.push(this.part_list[0].dept_name)
        this.search.dept_code = this.part_list[0].dept_code
        this.queryData()
      })
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
    // 切换页码
    handleCurrentChange(val) {
      this.search.page_num = val.page
      this.fetchData()
    },
    queryData() {
      this.search.page_num = 1
      this.fetchData()
    },
    // 角色列表
    fetchData() {
      httpRequest('/api/sys/role/paginate', this.search).then(res => {
        const data = JSON.parse(decrypt(res.data))
        const role_list = data.records
        this.total = data.total
        role_list.map((item) => {
          item.switch = item.status_flag === '1'
        })
        this.role_list = role_list
      })
    },
    // 点击部门
    handleNodeClick(data) {
      this.section_title = []
      this.section_title = this.handleUpArray(this.part_list, data.level_code, [], 'dept_name')
      this.section_title.push(data.dept_name)
      this.search.dept_code = data.dept_code
      this.queryData()
    },
    // 选择的菜单权限
    handleMenuClick() {
      this.select_ids = []
      this.select_menu = []
      var select_ids = this.$refs.tree.getCheckedKeys()
      select_ids.map((item, index) => {
        if (this.p_ids.indexOf(item) === -1) {
          this.select_ids.push(item)
        }
      })
      this.select_menu = this.handleDetectionArr(this.menu_list, this.select_ids, [], 1)
    },
    // 无子级则禁止选择
    handleDisabled(arr) {
      arr.map((item) => {
        if (Number(item.menu_type) !== 3) {
          if (item.child_menu.length > 0) {
            this.handleDisabled(item.child_menu)
          } else {
            item.disabled = true
          }
        }
      })
      return arr
    },
    // 选择的菜单权限列表
    handleDetectionArr(arr, str, value, type) {
      arr.map((item) => {
        if (type === 1) {
          if (str.indexOf(item.menu_id) > -1) {
            value.push({
              menu_id: item.menu_id,
              menu_name: item.menu_name
            })
          }
        }
        // item.child_menu && item.child_menu.length > 0  无限查询
        if (Number(item.menu_type) !== 3) {
          if (type === 2) {
            value.push(item.menu_id)
          }
          this.handleDetectionArr(item.child_menu, str, value, type)
        }
      })
      return value
    },
    // 编辑菜单状态
    handleSwitch(row, index) {
      var api = row.switch ? '/api/sys/role/enable' : '/api/sys/role/disable'
      httpRequest(api, {
        role_id: row.role_id
      }, false).then(res => {

      }).catch(err => {
        console.log(err)
        this.role_list[index].switch = !row.switch
      })
    },
    // 菜单管理
    handleAuth(data) {
      httpRequest('/api/sys/menu/tree/all', {}, false).then(res => {
        this.menu_list = this.handleDisabled(JSON.parse(decrypt(res.data)))
        this.p_ids = this.handleDetectionArr(this.menu_list, '', [], 2)
      })
      if (data) {
        this.authTitle = '为' + data.role_name + '分配权限'
        this.auth_type = 1
        this.role_id = data.role_id
        this.authVisible = true
        httpRequest('/api/sys/role/menu/list', {
          role_id: data.role_id
        }, false).then(res => {
          var list = JSON.parse(decrypt(res.data))
          list.map((item) => {
            this.select_ids.push(item.menu_id)
          })
          setTimeout(() => {
            this.$refs.tree.setCheckedKeys(this.select_ids)
          }, 500)
        })
      } else {
        this.auth_type = 2
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.authTitle = '为' + this.form.role_name + '分配权限'
            this.authVisible = true
          } else {
            return false
          }
        })
      }
    },
    // 删除角色
    handleDel(data) {
      this.$confirm('确认要删除该角色吗？', '提示', {
        title: '删除提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/sys/role/delete', { role_id: data.role_id }, false).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.queryData()
        })
      }).catch(() => {})
    },
    // 修改回显
    roleUpdate(data) {
      httpRequest('/api/sys/role/info', {
        role_id: data.role_id
      }, false).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.form.role_name = data.role_name
        this.form.role_desc = data.role_desc
        this.form.process = Number(data.process)
        this.form.dept_code = data.dept_code
        this.form.type = 'edit'
        this.role_id = data.role_id
        this.roleVisible = true
      })
    },
    // 保存
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var api = ''
          var data = {
            dept_code: this.form.dept_code[this.form.dept_code.length - 1],
            role_name: this.form.role_name,
            role_desc: this.form.role_desc,
            process: this.form.process
          }
          if (this.form.type === 'add') {
            api = '/api/sys/role/save'
          } else {
            data.role_id = this.role_id
            api = '/api/sys/role/update'
          }
          httpRequest(api, data, false).then(res => {
            this.roleVisible = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.queryData()
          })
        } else {
          return false
        }
      })
    },
    // 权限管理保存
    onSubmitAuth() {
      var arr = []
      var selected = this.$refs.tree.getCheckedKeys()
      var uncheck = this.$refs.tree.getHalfCheckedKeys()
      arr = arr.concat(uncheck).concat(selected)
      if (this.auth_type === 1) {
        httpRequest('/api/sys/role/menu/save', {
          role_id: this.role_id,
          menu_ids: arr.join(',')
        }, false).then(res => {
          this.authVisible = false
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.queryData()
        })
      } else {
        var data = {
          dept_code: this.form.dept_code[this.form.dept_code.length - 1],
          role_name: this.form.role_name,
          role_desc: this.form.role_desc,
          process: this.form.process,
          menu_ids: arr.join(',')
        }
        httpRequest('/api/sys/role/save', data, false).then(res => {
          this.authVisible = false
          this.roleVisible = false
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.queryData()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-table .row-expand-cover .cell .el-table__expand-icon {
    display: none !important;
  }

  .role-left {
    ::v-deep .el-tree .el-tree-node__expand-icon.is-leaf::before {
      width: 0;
      height: 0;
    }
  }

  .branch-top-title {
    height: 30px;
    font-size: 13px;
    color: #323338;
    letter-spacing: 0;
    line-height: 30px;
    margin-bottom: 8px;

    .branch-title {
      color: #696B70;
    }
  }

  .spp-auth {
    background: #14bc6c;
    border: 1px solid #14bc6c;
    color: #ffffff;
  }

  .select-content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .panel {
      width: 312px;
      height: 340px;
      background: #ffffff;
      border: 1px solid #e6e7eb;
      border-radius: 2px;
      overflow: hidden;

      ::v-deep .el-tree-node__content {
        border-radius: 0;
        height: 32px !important;
      }

      ::v-deep .el-tree .el-tree-node__content:hover {
        background: #ffffff;
      }

      .header{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 312px;
        height: 40px;
        background: #f5f6fa;
        border-bottom: 1px solid #e1e3e6;
      }

      .item-list {
        padding: 12px;

        .file-icon {
          margin-right: 7px;
        }

        .item {
          display: flex;
          align-items: center;
          height: 32px;
          font-size: 13px;
          font-weight: 400;
          text-align: left;
          color: #323338;
          line-height: 32px;
          .txt {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

          }
        }
      }

      .custom-tree-node {
        display: flex;
        align-items: center;

        .file-icon {
          width: 16px;
          height: 16px;
          margin-right: 7px;
        }

        .label-txt {
          font-size: 13px;
          color: #323338;
          letter-spacing: 0;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .txt-active {
          color: #1AB9FF;
        }
      }
    }
  }
</style>
