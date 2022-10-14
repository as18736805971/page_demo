<template>
  <div class="app-container insideuser-container">
    <div class="main-header">
      <div class="left">
        <span v-if="functionList.includes('A04001')" class="spp-btn spp-btn-primary" @click="addTopMenu()">
          <svg-icon icon-class="add" />
          <span>新增1级菜单</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table
        :data="menuData"
        row-key="menu_id"
        :tree-props="{children: 'children'}"
      >
        <el-table-column label="菜单名称" prop="menu_name" />
        <el-table-column label="菜单图标">
          <template slot-scope="scope">
            <svg-icon v-if="scope.row.menu_icon" :icon-class="scope.row.menu_icon" />
          </template>
        </el-table-column>
        <el-table-column label="菜单链接" prop="menu_url" />
        <el-table-column label="菜单关联" prop="menu_rel" />
        <el-table-column label="菜单目标" prop="menu_target">
          <template slot-scope="scope">{{ formatUserType(scope.row.menu_target) }}</template>
        </el-table-column>
        <el-table-column label="打开方式" prop="menu_type">
          <template slot-scope="scope">{{ scope.row.menu_type == '1' ? '当前窗口' : '新窗口' }}</template>
        </el-table-column>
        <el-table-column label="菜单顺序" prop="menu_order" />
        <el-table-column label="关联权限数量（个）">
          <template slot-scope="scope">
            <span v-if="scope.row.menu_rel">
              {{ scope.row.fp_count }} <svg-icon v-if="functionList.includes('A04004')" icon-class="edit" class="icon_btn" @click="editAuth(scope.row)" />
            </span>
            <span v-else>
              --
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A04001')" :disabled="scope.row.level > 2" type="text" @click="addSubMenu(scope.row)">新增</el-button>
            <el-button type="text">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="functionList.includes('A04002')" @click.native="editMenu(scope.row)">编辑</el-dropdown-item>
                  <el-dropdown-item v-if="functionList.includes('A04003')" :disabled="scope.row.hasOwnProperty('children') && scope.row.children.length !== 0" @click.native="deleteMenu(scope.row)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="650px"
    >
      <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="80px" class="model_form insider_form">
        <el-input v-model="form.menu_pid" type="hidden" />
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="form.menu_name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单链接" prop="menu_url">
          <el-input v-model="form.menu_url" placeholder="请输入菜单链接" />
        </el-form-item>
        <el-form-item label="菜单关联" prop="menu_rel">
          <el-input v-model="form.menu_rel" placeholder="请输入菜单关联" />
        </el-form-item>
        <el-form-item label="菜单描述" prop="menu_desc">
          <el-input v-model="form.menu_desc" type="textarea" :rows="3" placeholder="请输入菜单描述" />
        </el-form-item>
        <el-form-item label="菜单目标" prop="menu_target">
          <el-checkbox-group v-model="form.menu_target">
            <el-checkbox label="0">内部用户</el-checkbox>
            <el-checkbox label="1">教育局用户</el-checkbox>
            <el-checkbox label="2">学校用户</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="打开类型" prop="menu_desc">
          <el-radio v-model="form.menu_type" label="1">当前窗口</el-radio>
          <el-radio v-model="form.menu_type" label="2">新窗口</el-radio>
        </el-form-item>
        <el-form-item label="菜单图标" prop="menu_icon">
          <el-input v-model="form.menu_icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="菜单顺序" prop="menu_order">
          <el-input v-model="form.menu_order" type="number" min="1" placeholder="请输入菜单顺序" />
        </el-form-item>
        <el-form-item class="model_btn_group">
          <span class="spp-btn spp-btn-primary" @click="submit()">提交</span>
          <span class="spp-btn" @click="reset">重置</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="authDialogTitle"
      :visible.sync="showAuthDialog"
      :close-on-click-modal="false"
      width="666px"
    >
      <el-transfer v-model="selected_auth" :data="auth_list" :titles="['权限列表', '已选择权限']" />
      <div class="model-btn-right">
        <span class="spp-btn" @click="showAuthDialog=false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="saveAuth()">提交</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuList, getMenu, addMenu, editMenu, deleteMenu, getUnlinkAuth, getSelectedAuth, editMenuAuth } from '@/api/menu'
import { formatMenuTree } from '@/utils/index'
import { mapState } from 'vuex'
export default {
  name: 'Menu',
  data() {
    return {
      menuData: [],
      showDialog: false,
      showAuthDialog: false,
      dialogTitle: '',
      authDialogTitle: '',
      menu_id: '',
      menu_target: {
        '0': '内部用户',
        '1': '教育局用户',
        '2': '学校用户'
      },
      form: {
        menu_name: '',
        menu_url: '',
        menu_desc: '',
        menu_rel: '',
        menu_type: '1',
        menu_target: [],
        menu_icon: '',
        menu_order: '1',
        menu_pid: ''
      },
      selected_auth: [],
      auth_list: [],
      rules: {
        menu_name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        menu_order: [
          { required: true, message: '请输入菜单顺序', trigger: 'blur' }
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
    this.getData()
  },
  methods: {
    getData() {
      getMenuList().then(response => {
        this.menuData = formatMenuTree(response.data)
      })
    },
    addTopMenu() {
      this.menu_id = ''
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
      this.dialogTitle = '新增1级菜单'
    },
    addSubMenu(row) {
      this.dialogTitle = row.menu_name + '下新增菜单'
      this.menu_id = ''
      Object.assign(this.form, this.$options.data().form)
      this.form.menu_pid = row.menu_id
      this.showDialog = true
    },
    editMenu(row) {
      this.dialogTitle = '修改' + row.menu_name + '菜单'
      const { menu_id } = row
      getMenu(menu_id).then(response => {
        const data = response.data
        this.menu_id = data.menu_id
        const menu_target = data.menu_target.split(',')
        this.form = {
          menu_name: data.menu_name,
          menu_url: data.menu_url,
          menu_desc: data.menu_desc,
          menu_rel: data.menu_rel,
          menu_type: data.menu_type,
          menu_target: menu_target,
          menu_icon: data.menu_icon,
          menu_order: data.menu_order,
          menu_pid: data.menu_pid
        }
        this.showDialog = true
      })
    },
    deleteMenu(row) {
      this.$confirm('您确定要删除该菜单吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMenu(row.menu_id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => {})
    },
    submit() {
      if (!this.menu_id) {
        // 新增
        this.$refs.form.validate(valid => {
          this.form.menu_target = this.form.menu_target.sort().join(',')
          if (valid) {
            addMenu(this.form).then(response => {
              this.showDialog = false
              this.$message({
                message: '菜单添加成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      } else {
        this.$refs.form.validate(valid => {
          if (valid) {
            editMenu(this.menu_id, this.form).then(response => {
              this.showDialog = false
              this.$message({
                message: '菜单修改成功',
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
      this.$refs.form.resetFields()
    },
    async editAuth(row) {
      this.menu_id = row.menu_id
      this.authDialogTitle = row.menu_name + '关联权限'
      const auth_list_all_response = await getUnlinkAuth()
      const auth_list_all_raw = auth_list_all_response.data
      const auth_menu_selected_response = await getSelectedAuth(row.menu_id)
      const auth_menu_selected_raw = auth_menu_selected_response.data
      const auth_list_all = []
      const auth_menu_selected = []
      auth_list_all_raw.forEach(item => {
        const tmp = {
          key: item.fp_id,
          label: item.fp_code + '-' + item.fp_name
        }
        auth_list_all.push(tmp)
      })
      auth_menu_selected_raw.forEach(item => {
        const tmp = {
          key: item.fp_id,
          label: item.fp_code + '-' + item.fp_name
        }
        auth_list_all.push(tmp)
        auth_menu_selected.push(item.fp_id)
      })
      this.auth_list = auth_list_all
      this.selected_auth = auth_menu_selected
      this.showAuthDialog = true
    },
    saveAuth() {
      const fp_ids = this.selected_auth.join(',')
      editMenuAuth(this.menu_id, fp_ids).then(response => {
        this.showAuthDialog = false
        this.$message({
          message: '菜单关联权限修改成功',
          type: 'success',
          duration: 3000
        })
        this.getData()
      })
    },
    formatUserType(str) {
      const user_type = str.split(',')
      if (user_type.sort().join(',') === '0,1,2') {
        return '全部'
      }
      const res = []
      for (const i in user_type) {
        res.push(this.menu_target[user_type[i]])
      }
      return res.join(',')
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #3399ff;
    font-size: 14px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
