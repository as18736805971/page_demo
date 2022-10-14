<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="12" class="header_left">
          <span v-if="auth.save != -1" class="spp-btn-add spp-btn-primary" @click="webVisible = true"><svg-icon icon-class="add_websocket" />新增命令码</span>
          <span v-if="auth.cache != -1" class="spp-btn-add spp-btn-default" @click="handleCache()"><svg-icon icon-class="add_synchronous" />同步缓存</span>
        </el-col>
        <el-col :span="12" class="header_right search_view">
          <div class="input_view">
            <el-input v-model="search.app_name" placeholder="搜索应用名称" @keyup.enter="queryData" @change="queryData" />
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content_view">
      <el-table ref="table" :data="websocket_list" :height="height - 80" size="mini" strip>
        <el-table-column label="序号" type="index" width="80" align="left" />
        <el-table-column label="应用名称" prop="app_name" min-width="180" align="left" />
        <el-table-column label="命令码" prop="cmd_code" min-width="180" align="left" />
        <el-table-column label="命令码级别" prop="cmd_level" align="left" />
        <el-table-column label="命令码描述" prop="cmd_desc" align="left" />
        <el-table-column label="状态" width="110" align="left">
          <template v-if="auth.enable != -1 && auth.disable != -1" slot-scope="scope">
            <el-switch v-model="scope.row.switch" active-color="#13ce66" inactive-color="#ff4949" @change="handleSwitch(scope.row, scope.$index)" />
            <span v-if="scope.row.switch" style="color: #14BC6C;">正常</span>
            <span v-if="!scope.row.switch" style="color: #FF4949;">停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right" align="right">
          <template slot-scope="scope">
            <el-button v-if="auth.update != -1" type="text" @click="webUpdate(scope.row)">修改</el-button>
            <el-button v-if="auth.delete != -1" type="text" style="color: #FF4949" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="search.page_num" :limit.sync="search.page_size" @pagination="handleCurrentChange" />
    </div>
    <!-- 新增编辑命令码 -->
    <el-dialog :title="form.title" :append-to-body="true" :visible.sync="webVisible" :custom-class="'default-size'" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="应用名称" prop="ws_app_id">
          <el-select v-model="form.ws_app_id" placeholder="请选择应用名称">
            <el-option
              v-for="item in app_list"
              :key="item.app_id"
              :label="item.app_name"
              :value="item.app_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="命令码" prop="cmd_code">
          <el-input v-model="form.cmd_code" placeholder="请输入命令码" />
        </el-form-item>
        <el-form-item label="命令码级别" prop="cmd_level">
          <div class="web-number">
            <el-input-number v-model="form.cmd_level" style="width: 100%" placeholder="请输入命令码级别" controls-position="right" :min="1" :max="2" />
          </div>
        </el-form-item>
        <el-form-item label="命令码描述">
          <el-input v-model="form.cmd_desc" :rows="5" resize="none" type="textarea" placeholder="请输入命令码描述" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="webVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmit()">保存</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { decrypt, httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'

export default {
  name: 'WebSocket',
  components: { Pagination },
  data() {
    return {
      height: window.innerHeight - 135,
      auth: {},
      search: {
        app_name: '',
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      total: 0,
      websocket_list: [],
      app_list: [],
      webVisible: false,
      cmd_id: '',
      form: {
        title: '新增命令码',
        type: 'add',
        ws_app_id: '', // 应用标识
        cmd_code: '', // 命令码
        cmd_level: 1, // 命令码级别
        cmd_desc: '' // 命令码描述
      },
      rules: {
        ws_app_id: [
          { required: true, message: '请选择应用名称', trigger: 'blur' }
        ],
        cmd_code: [
          { required: true, message: '请输入命令码', trigger: 'blur' }
        ],
        cmd_level: [
          { required: true, message: '请输入命令码描述', trigger: 'blur' }
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
    webVisible(val) {
      if (val) {
        this.form.title = this.form.type === 'add' ? '新增命令码' : '编辑命令码'
        this.handleAppList()
      }
      if (!val) {
        this.form.type = 'add'
        this.form.ws_app_id = ''
        this.form.cmd_code = ''
        this.form.cmd_level = ''
        this.form.cmd_desc = ''
        this.$refs['form'].clearValidate()
      }
    }
  },
  created() {
    this.permissionAuth()
    this.queryData()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {
      this.auth.save = this.permission.indexOf('/api/sys/websocket/cmd/save') // 添加
      this.auth.update = this.permission.indexOf('/api/sys/websocket/cmd/update') // 修改
      this.auth.delete = this.permission.indexOf('/api/sys/websocket/cmd/delete') // 删除
      this.auth.enable = this.permission.indexOf('/api/sys/websocket/cmd/start') // 启用
      this.auth.disable = this.permission.indexOf('/api/sys/websocket/cmd/remove') // 停用
      this.auth.cache = this.permission.indexOf('/api/sys/websocket/cmd/refresh/cache') // 同步缓存
    },
    handleAppList() {
      httpRequest('/api/sys/app/list', {}, false).then(res => {
        this.app_list = JSON.parse(decrypt(res.data))
      })
    },
    handleCurrentChange(val) {
      this.search.page_num = val.page
      this.fetchData()
    },
    queryData() {
      this.search.page_num = 1
      this.fetchData()
    },
    fetchData() {
      httpRequest('/api/sys/websocket/cmd/paginate', this.search).then(res => {
        const data = JSON.parse(decrypt(res.data))
        const websocket_list = data.records
        this.total = data.total
        websocket_list.map((item) => {
          item.switch = item.status_flag === '1'
        })
        this.websocket_list = websocket_list
      })
    },
    handleCache() {
      httpRequest('/api/sys/websocket/cmd/refresh/cache', {}, false, false).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.$message({
          message: data ? '同步成功' : '同步失败',
          type: data ? 'success' : 'error'
        })
        this.queryData()
      })
    },
    handleSwitch(row, index) {
      var api = row.switch ? '/api/sys/websocket/cmd/start' : '/api/sys/websocket/cmd/remove'
      httpRequest(api, {
        cmd_id: row.cmd_id
      }, false).then(res => {

      }).catch(() => {
        this.role_list[index].switch = !row.switch
      })
    },
    webUpdate(data) {
      this.form.ws_app_id = data.ws_app_id
      this.form.cmd_code = data.cmd_code
      this.form.cmd_level = Number(data.cmd_level)
      this.form.cmd_desc = data.cmd_desc
      this.form.type = 'edit'
      this.cmd_id = data.cmd_id
      this.webVisible = true
    },
    handleDel(data) {
      this.$confirm('确认要删除该命令码吗？', '提示', {
        title: '删除提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/sys/websocket/cmd/delete', { cmd_id: data.cmd_id }, false).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.queryData()
        })
      }).catch(() => {})
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var api = ''
          var data = {
            ws_app_id: this.form.ws_app_id,
            cmd_code: this.form.cmd_code,
            cmd_level: this.form.cmd_level,
            cmd_desc: this.form.cmd_desc
          }
          if (this.form.type === 'add') {
            api = 'api/sys/websocket/cmd/save'
          } else {
            data.cmd_id = this.cmd_id
            api = '/api/sys/websocket/cmd/update'
          }
          httpRequest(api, data, false).then(res => {
            this.webVisible = false
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .web-number {
    ::v-deep .el-input--medium .el-input__inner {
      text-align: left;
    }

    ::v-deep .el-input-number--medium .el-input-number__increase {
      width: 40px;
    }

    ::v-deep .el-input-number--medium .el-input-number__decrease {
      width: 40px;
    }

    ::v-deep .el-input-number.is-controls-right .el-input-number__decrease {
      right: 10px;
    }

    ::v-deep .el-input-number__increase {
      right: 10px;
    }
  }
</style>
