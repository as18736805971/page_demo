<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="24" class="header_left">
          <el-select v-model="menu_app_id" style="width: 220px" clearable placeholder="请选择所属应用" @change="getMenuPaginateData(1, null)">
            <el-option
              v-for="item in app_list"
              :key="item.app_id"
              :label="item.app_name"
              :value="item.app_id"
            />
          </el-select>
          <span v-if="auth.save != -1" class="spp-btn-add spp-btn-primary" @click="menuEditVisible = true"><svg-icon icon-class="add_menu" />新增一级菜单</span>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content_view">
      <el-table ref="table" :data="menu_paginate_data" row-key="menu_id" :tree-props="{children: 'child_menu'}" :height="height" size="mini" strip>
        <el-table-column label="菜单名称" prop="menu_name" min-width="200" align="left" />
        <el-table-column label="菜单图标" width="80" align="left">
          <template slot-scope="scope">
            <svg aria-hidden="true" style=" width: 20px;height: 20px;" fill="rgba(000,000,000,.5)"><use :href="'#icon-'+scope.row.menu_icon" /></svg>
          </template>
        </el-table-column>
        <el-table-column label="菜单路径" prop="menu_url" min-width="200" align="left" />
        <el-table-column label="菜单顺序" width="80" prop="menu_order" align="left" />
        <el-table-column label="菜单类型" width="80" align="left">
          <template slot-scope="scope">
            <div v-if="scope.row.menu_type == '1'" style="color: #1AB9FF;">{{ menu_type_dic[scope.row.menu_type] }}</div>
            <div v-if="scope.row.menu_type == '2'" style="color: #FF7428;">{{ menu_type_dic[scope.row.menu_type] }}</div>
          </template>
        </el-table-column>
        <el-table-column label="菜单状态" width="100" align="left">
          <template v-if="auth.enable != -1 && auth.disable != -1" slot-scope="scope">
            <el-switch v-model="scope.row.switch" active-color="#13ce66" inactive-color="#ff4949" @change="menuSwitchSubmit(scope.row)" />
            <span v-if="scope.row.switch" style="color: #14BC6C;">正常</span>
            <span v-if="!scope.row.switch" style="color: #FF4949;">停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="right">
          <template slot-scope="scope">
            <el-button v-if="auth.save != -1 && scope.row.menu_type=='1'" type="text" @click="menuChildSave(scope.row)">新增下级</el-button>
            <el-button v-if="auth.bind != -1 && scope.row.menu_type=='2'" type="text" style="color:#FF7428;" @click="getMenuBindData(scope.row.menu_id, scope.row.app_id)">管理权限</el-button>
            <el-button v-if="auth.update != -1" type="text" @click="menuUpdate(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增编辑菜单 -->
    <el-dialog :title="menu_edit_form.title" :append-to-body="true" :visible.sync="menuEditVisible" :custom-class="'default-size'" :close-on-click-modal="false">
      <el-form ref="menu_edit_form" :model="menu_edit_form" :rules="rules" label-width="80px">
        <el-form-item label="上级菜单">{{ menu_edit_form.menu_pname }}</el-form-item>
        <el-form-item label="所属应用" prop="menu_app_id">
          <el-select v-model="menu_edit_form.menu_app_id" placeholder="请选择所属应用">
            <el-option
              v-for="item in app_list"
              :key="item.app_id"
              :label="item.app_name"
              :value="item.app_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menu_type">
          <el-radio-group v-model="menu_edit_form.menu_type">
            <el-radio label="1">目录</el-radio>
            <el-radio label="2">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="menu_edit_form.menu_name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="menu_icon">
          <el-select v-model="menu_edit_form.menu_icon" filterable placeholder="请选择菜单图标">
            <el-option
              v-for="(item, index) in oneLevelSvg"
              :key="index"
              :label="item.title"
              :value="item.url"
            >
              <div class="select-svg-item">{{ item.title }} <svg-icon :icon-class="item.url" /></div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="menu_edit_form.menu_type == '2'" label="菜单路径" prop="menu_url">
          <el-input v-model="menu_edit_form.menu_url" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="菜单顺序" prop="menu_order">
          <el-input v-model.number="menu_edit_form.menu_order" :min="0" type="number" placeholder="请输入菜单顺序" />
        </el-form-item>
        <el-form-item label="打开方式" prop="menu_target">
          <el-radio-group v-model="menu_edit_form.menu_target">
            <el-radio label="self">当前窗口</el-radio>
            <el-radio label="new_tag">新窗口</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单描述" prop="menu_desc">
          <el-input v-model="menu_edit_form.menu_desc" type="textarea" placeholder="请输入菜单描述" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="menuEditVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="menuEditSubmit('1')">保存</span>
        <span v-if="menu_edit_form.menu_type == '1'" class="spp-btn spp-btn-info">保存并分配权限</span>
        <span v-if="menu_edit_form.menu_type == '2'" class="spp-btn spp-btn-success" @click="menuEditSubmit('2')">保存并分配权限</span>
      </span>
    </el-dialog>
    <!-- 管理权限 -->
    <el-dialog title="管理权限" :append-to-body="true" :visible.sync="menuBindVisible" :custom-class="'default-table-size'" :close-on-click-modal="false">
      <el-transfer
        v-if="menuBindVisible"
        ref="transfer"
        v-model="permission_ids"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="搜索权限名称"
        :titles="['权限列表', '已选择权限']"
        :data="menu_bind_data"
        :render-content="renderFunc"
        :props="{ key: 'menu_id',label: 'menu_name' }"
      />
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="menuBindVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="menuBindSubmit()">保存</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { decrypt, httpRequest } from '@/utils/auth'
import { oneLevelSvg } from '@/utils/svg'
import { mapState } from 'vuex'
export default {
  name: 'SysMenu',
  components: { },
  data() {
    return {
      height: window.innerHeight - 135,
      auth: {},
      app_list: [],
      oneLevelSvg: oneLevelSvg,
      menu_type_dic: { 1: '目录', 2: '菜单' },
      menu_paginate_data: [],
      menuEditVisible: false,
      menu_app_id: '',
      menu_edit_form: {
        title: '新增菜单',
        type: 'add',
        menu_app_id: '',
        menu_name: '',
        menu_url: '',
        menu_desc: '',
        menu_type: '1',
        menu_target: 'self',
        menu_icon: '',
        menu_order: '',
        menu_pid: '',
        menu_pname: '全部',
        menu_id: ''
      },
      rules: {
        menu_app_id: [
          { required: true, message: '请选择所属应用', trigger: 'change' }
        ],
        menu_type: [
          { required: true, message: '请选择菜单类型', trigger: 'change' }
        ],
        menu_name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        menu_order: [
          { required: true, message: '请输入顺序', trigger: 'blur' }
        ],
        menu_url: [
          { required: true, message: '请输入菜单路径', trigger: 'blur' }
        ],
        menu_target: [
          { required: true, message: '请选择打开方式', trigger: 'change' }
        ]
      },
      menuBindVisible: false,
      select_menu_id: '', // 选择的菜单id
      select_menu_app_id: '', // 选择的菜单id
      permission_ids: [],
      menu_bind_data: [],
      // 重置穿梭框显示内容
      renderFunc(h, option) {
        return <span style='font-size: 12px;'>
          <div style='height: 20px; color: #696B70;'>{ option.menu_name }</div>
          <div style='height: 30px; color: #939499;'>{ option.menu_url }</div>
        </span>
      }
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  watch: {
    menuEditVisible(val) {
      if (val) {
        this.menu_edit_form.title = this.menu_edit_form.type === 'add' ? '新增菜单' : '编辑菜单'
      }
      if (!val) {
        this.menu_edit_form.menu_app_id = ''
        this.menu_edit_form.menu_name = ''
        this.menu_edit_form.menu_url = ''
        this.menu_edit_form.menu_desc = ''
        this.menu_edit_form.menu_type = '1'
        this.menu_edit_form.menu_target = 'self'
        this.menu_edit_form.menu_icon = ''
        this.menu_edit_form.menu_order = ''
        this.menu_edit_form.menu_pid = ''
        this.menu_edit_form.menu_pname = '全部'
        this.menu_edit_form.menu_id = ''
        this.menu_edit_form.type = 'add'
        this.$refs['menu_edit_form'].clearValidate()
      }
    }
  },
  created() {
    this.permissionAuth()
    this.handleGetAppList()
  },
  methods: {
    // 重置穿梭框筛选功能
    filterMethod(query, item) {
      if (query !== '') {
        if (item.menu_name.indexOf(query) > -1 || item.menu_url.indexOf(query) > -1) {
          return true
        } else {
          return false
        }
      } else {
        return this.menu_bind_data
      }
    },
    // 获取按钮权限
    permissionAuth() {
      this.auth.save = this.permission.indexOf('/api/sys/menu/save')
      this.auth.update = this.permission.indexOf('/api/sys/menu/update')
      this.auth.bind = this.permission.indexOf('/api/sys/menu/bind')
      this.auth.enable = this.permission.indexOf('/api/sys/menu/enable')
      this.auth.disable = this.permission.indexOf('/api/sys/menu/disable')
    },
    // 获取应用列表
    handleGetAppList() {
      httpRequest('/api/sys/app/list', {}, false).then(res => {
        this.app_list = JSON.parse(decrypt(res.data))
        this.menu_app_id = this.app_list.length > 0 ? this.app_list[0].app_id : ''
        this.getMenuPaginateData(1, null)
      })
    },
    // 获取菜单列表
    getMenuPaginateData(type, app_id) {
      httpRequest('/api/sys/menu/tree', {
        menu_app_id: type === 1 ? this.menu_app_id : app_id
      }).then(res => {
        var data = JSON.parse(decrypt(res.data))
        data.forEach(function(val) {
          if (val.status_flag === '1') {
            val.switch = true
          } else {
            val.switch = false
          }
          if (val.child_menu.length !== 0) {
            var menu_1 = val.child_menu
            menu_1.forEach(function(ev) {
              if (ev.status_flag === '1') {
                ev.switch = true
              } else {
                ev.switch = false
              }
              if (ev.child_menu.length !== 0) {
                var menu_2 = ev.child_menu
                menu_2.forEach(function(ev) {
                  if (ev.status_flag === '1') {
                    ev.switch = true
                  } else {
                    ev.switch = false
                  }
                })
              }
            })
          }
        })
        this.menu_paginate_data = data
      })
    },
    getRowClass(row, rowIndex) {
      if (row.row.child_menu.length === 0) {
        return 'row-expand-cover'
      }
    },
    // 新增编辑菜单
    menuChildSave(row) {
      this.menuEditVisible = true
      this.menu_edit_form.menu_pname = row.menu_name
      this.menu_edit_form.menu_pid = row.menu_id
    },
    menuEditSubmit(type) {
      if (this.menu_edit_form.type === 'add') {
        this.$refs['menu_edit_form'].validate((valid) => {
          if (valid) {
            var data = {
              menu_app_id: this.menu_edit_form.menu_app_id,
              menu_name: this.menu_edit_form.menu_name,
              menu_url: this.menu_edit_form.menu_url,
              menu_desc: this.menu_edit_form.menu_desc,
              menu_type: this.menu_edit_form.menu_type,
              menu_target: this.menu_edit_form.menu_target,
              menu_icon: this.menu_edit_form.menu_icon,
              menu_order: this.menu_edit_form.menu_order,
              menu_pid: this.menu_edit_form.menu_pid
            }
            httpRequest('/api/sys/menu/save', data).then(res => {
              var menu_item = JSON.parse(decrypt(res.data))
              this.menuEditVisible = false
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getMenuPaginateData(1, null)
              if (type === '2') {
                this.getMenuPaginateData(2, menu_item.menu_app_id)
                this.getMenuBindData(menu_item.menu_id, menu_item.menu_app_id)
              }
            })
          } else {
            return false
          }
        })
      }
      // 修改
      if (this.menu_edit_form.type === 'edit') {
        this.$refs['menu_edit_form'].validate((valid) => {
          if (valid) {
            var data = {
              menu_app_id: this.menu_edit_form.menu_app_id,
              menu_name: this.menu_edit_form.menu_name,
              menu_url: this.menu_edit_form.menu_url,
              menu_desc: this.menu_edit_form.menu_desc,
              menu_type: this.menu_edit_form.menu_type,
              menu_target: this.menu_edit_form.menu_target,
              menu_icon: this.menu_edit_form.menu_icon,
              menu_order: this.menu_edit_form.menu_order,
              menu_pid: this.menu_edit_form.menu_pid,
              menu_id: this.menu_edit_form.menu_id
            }
            httpRequest('/api/sys/menu/update', data).then(res => {
              this.menuEditVisible = false
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getMenuPaginateData(1, null)
              if (type === '2') {
                this.getMenuPaginateData(2, this.menu_edit_form.menu_app_id)
                this.getMenuBindData(this.menu_edit_form.menu_id, this.menu_edit_form.menu_app_id)
              }
            })
          } else {
            return false
          }
        })
      }
    },
    // 修改回显
    menuUpdate(data) {
      this.menuEditVisible = true
      this.menu_edit_form.menu_app_id = data.app_id
      this.menu_edit_form.menu_name = data.menu_name
      this.menu_edit_form.menu_url = data.menu_url
      this.menu_edit_form.menu_desc = data.menu_desc
      this.menu_edit_form.menu_type = data.menu_type
      this.menu_edit_form.menu_target = data.menu_target
      this.menu_edit_form.menu_icon = data.menu_icon
      this.menu_edit_form.menu_order = data.menu_order
      this.menu_edit_form.menu_pid = data.menu_pid
      this.menu_edit_form.menu_pname = '全部'
      this.menu_edit_form.menu_id = data.menu_id
      this.menu_edit_form.type = 'edit'
    },
    // 编辑菜单状态
    menuSwitchSubmit(row) {
      var data = {
        menu_id: row.menu_id
      }
      if (row.switch) {
        httpRequest('/api/sys/menu/enable', data).then(res => {}).catch(() => {
          this.getMenuPaginateData(1, null)
        })
      } else {
        httpRequest('/api/sys/menu/disable', data).then(res => {}).catch(() => {
          this.getMenuPaginateData(1, null)
        })
      }
    },
    getMenuBindData(menu_id, app_id) {
      var permission_ids = []
      this.select_menu_id = menu_id
      this.select_menu_app_id = app_id
      httpRequest('/api/sys/menu/bind/list', {
        menu_id: this.select_menu_id,
        menu_app_id: this.select_menu_app_id
      }).then(res => {
        var data = JSON.parse(decrypt(res.data))
        data.forEach(function(val) {
          if (val.bind_flag === '1') {
            permission_ids.push(val.menu_id)
          }
        })
        this.permission_ids = permission_ids
        this.menu_bind_data = data
        this.menuBindVisible = true
      })
    },
    // 权限管理
    menuBindSubmit() {
      var data = {
        menu_id: this.select_menu_id,
        permission_ids: this.permission_ids.join(',')
      }
      httpRequest('/api/sys/menu/bind', data).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.menuBindVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-transfer-panel__item {
    height: auto;
  }

  ::v-deep .el-transfer .el-transfer-panel {
    width: 390px;
    height: 570px;
  }

  ::v-deep .el-transfer-panel__list.is-filterable {
    height: 466px;
  }

  ::v-deep .el-table__row:not([class*='el-table__row--level-']) {
    td:first-child {
      padding-left: 23px !important;
    }
  }

  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  ::v-deep input[type='number'] {
    -moz-appearance: textfield !important;
  }

  .select-svg-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
