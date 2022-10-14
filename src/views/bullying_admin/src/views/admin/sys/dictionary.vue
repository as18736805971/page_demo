<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="24" class="header_left">
          <span v-if="auth.save != -1" class="spp-btn-add spp-btn-primary" @click="handleChildSave(1 , null)"><svg-icon icon-class="add_dictionary" />新增一级字典</span>
          <span v-if="auth.cache != -1" class="spp-btn-add spp-btn-default" @click="handleCache()"><svg-icon icon-class="add_synchronous" />同步缓存</span>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content_view">
      <el-table ref="table" row-key="dic_id" :data="dict_list" :height="height" :tree-props="{ children: 'hierarchy' }" size="mini" strip>
        <el-table-column label="字典名称" prop="dic_name" width="220" align="left" />
        <el-table-column label="字典编码" prop="dic_code" width="180" align="left" />
        <el-table-column label="字典描述" prop="dic_desc" align="left" />
        <el-table-column label="菜单状态" width="150" align="left">
          <template v-if="auth.enable != -1 && auth.disable != -1" slot-scope="scope">
            <el-switch v-model="scope.row.switch" active-color="#13ce66" inactive-color="#ff4949" @change="handleSwitch(scope.row)" />
            <span v-if="scope.row.switch" style="color: #14BC6C;">正常</span>
            <span v-if="!scope.row.switch" style="color: #FF4949;">停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="right">
          <template slot-scope="scope">
            <div style="display: flex;justify-content: flex-end">
              <el-button v-if="scope.row.hierarchy && auth.save != -1" type="text" @click="handleChildSave(2, scope.row)">新增下级</el-button>
              <el-button v-if="auth.update != -1" type="text" @click="handleUpdate(scope.row.hierarchy ? 1 : 2, scope.row)">修改</el-button>
              <el-button v-if="auth.delete != -1" type="text" style="color: #FF4949" @click="handleDel(scope.row.dic_id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增编辑菜单 -->
    <el-dialog :title="form.title" :append-to-body="true" :visible.sync="dictVisible" :custom-class="'default-size'" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级字典">
          <template v-if="form_type === 4">
            <el-select v-model="form.dic_pcode" placeholder="请选择">
              <el-option
                v-for="(item, index) in pcode_list"
                :key="index"
                :label="item.dic_name"
                :value="item.dic_code"
              />
            </el-select>
          </template>
          <template v-else>
            {{ form.dic_pname }}
          </template>
        </el-form-item>
        <el-form-item label="字典名称" prop="dic_name">
          <el-input v-model="form.dic_name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典编码" prop="dic_code">
          <el-input v-model="form.dic_code" :disabled="form_type === 3" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="字典描述">
          <el-input v-model="form.dic_desc" :rows="5" resize="none" type="textarea" placeholder="请输入字典描述" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="dictVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmit()">保存</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { decrypt, httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'

export default {
  name: 'Dictionary',
  data() {
    return {
      height: window.innerHeight - 135,
      auth: {},
      dictVisible: false,
      dict_list: [],
      pcode_list: [], // 上级菜单
      form_type: 1, // 1 新增一级 2新增下级 3编辑一级字典 4编辑字典
      form: {
        title: '新增一级字典',
        dic_pname: '一级字典',
        dic_pcode: '',
        dic_id: '',
        dic_name: '',
        dic_code: '',
        dic_desc: ''
      },
      rules: {
        dic_name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        dic_code: [
          { required: true, message: '请输入字典编码', trigger: 'blur' }
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
    dictVisible(val) {
      if (val) {
        this.form.title = this.form_type === 1 ? '新增一级字典' : this.form_type === 2 ? '新增下级字典' : '编辑字典'
      }
      if (!val) {
        this.form_type = 1
        this.form.dic_id = ''
        this.form.dic_pname = '一级字典'
        this.form.dic_pcode = ''
        this.form.dic_name = ''
        this.form.dic_code = ''
        this.form.dic_desc = ''
        this.$refs['form'].clearValidate()
      }
    }
  },
  created() {
    this.permissionAuth()
    this.fetchData()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {
      this.auth.save = this.permission.indexOf('/api/sys/dic/save')
      this.auth.update = this.permission.indexOf('/api/sys/dic/update')
      this.auth.delete = this.permission.indexOf('/api/sys/dic/delete')
      this.auth.enable = this.permission.indexOf('/api/sys/dic/enable')
      this.auth.disable = this.permission.indexOf('/api/sys/dic/disable')
      this.auth.cache = this.permission.indexOf('/api/sys/dic/refresh/cache') // 同步缓存
    },
    fetchData() {
      httpRequest('/api/sys/dic/list', {}).then(res => {
        const dict_list = JSON.parse(decrypt(res.data))
        dict_list.map((item) => {
          item.switch = item.status_flag === '1'
          item.hierarchy.map((vv) => {
            vv.switch = vv.status_flag === '1'
          })
        })
        this.dict_list = dict_list
      })
    },
    handleCache() {
      httpRequest('/api/sys/dic/refresh/cache', {}, false, false).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.$message({
          message: data ? '同步成功' : '同步失败',
          type: data ? 'success' : 'error'
        })
        this.fetchData()
      })
    },
    handleSwitch(row) {
      var api = row.switch ? '/api/sys/dic/enable' : '/api/sys/dic/disable'
      httpRequest(api, {
        dic_id: row.dic_id
      }, false).then(res => {
      })
    },
    handleChildSave(type, data) {
      if (type === 1) {
        this.form_type = 1
        this.form.dic_pname = '一级字典'
        this.form.dic_pcode = ''
      } else {
        this.form_type = 2
        this.form.dic_pname = data.dic_name
        this.form.dic_pcode = data.dic_code
      }
      this.dictVisible = true
    },
    handleUpdate(type, data) {
      this.form.dic_id = data.dic_id
      this.form.dic_name = data.dic_name
      this.form.dic_code = data.dic_code
      this.form.dic_desc = data.dic_desc
      if (type === 1) {
        this.form.dic_pname = '一级字典'
        this.form.dic_pcode = ''
        this.form_type = 3
        this.dictVisible = true
      } else {
        this.form.dic_pname = ''
        this.form.dic_pcode = data.dic_pcode
        this.form_type = 4
        httpRequest('/api/sys/dic/list/one', {}, false).then(res => {
          this.pcode_list = JSON.parse(decrypt(res.data))
          this.dictVisible = true
        })
      }
    },
    handleDel(id) {
      this.$confirm('确认要删除该字典吗？', '提示', {
        title: '删除提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/sys/dic/delete', { dic_id: id }, false).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {})
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var data = {
            dic_name: this.form.dic_name,
            dic_code: this.form.dic_code,
            dic_desc: this.form.dic_desc
          }
          var api = ''
          if (this.form_type === 1 || this.form_type === 2) {
            if (this.form_type === 2) {
              data.dic_pcode = this.form.dic_pcode
            }
            api = '/api/sys/dic/save'
          } else {
            data.dic_id = this.form.dic_id
            if (this.form_type === 4) {
              data.dic_pcode = this.form.dic_pcode
            }
            api = '/api/sys/dic/update'
          }
          httpRequest(api, data, false).then(res => {
            this.dictVisible = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.fetchData()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
