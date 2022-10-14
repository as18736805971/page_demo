<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="12" class="header_left">
          <span v-if="auth.save != -1" class="spp-btn-add spp-btn-primary" @click="appVisible = true"><svg-icon icon-class="add_app" />新增应用</span>
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
      <el-table ref="table" :data="app_list" :height="height - 80" size="mini" strip>
        <el-table-column label="序号" type="index" width="60" align="left" />
        <el-table-column label="应用名称" prop="app_name" min-width="40" align="left" />
        <el-table-column label="应用过期时间" width="160" align="left">
          <template slot-scope="scope">
            <template v-if="scope.row.expire_time > 0">
              {{ scope.row.expire_time | formatDate }}
            </template>
            <template v-else>无限期</template>
          </template>
        </el-table-column>
        <el-table-column label="用户类型" prop="user_type" align="left" />
        <el-table-column label="是否校验权限" width="140" align="left">
          <template slot-scope="scope">
            {{ scope.row.check_permission == '1' ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="登录访问" width="140" align="left">
          <template slot-scope="scope">
            {{ scope.row.user_token == '1' ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column label="token过期时间(min)" width="150" prop="token_expire" align="left" />
        <el-table-column label="应用状态" width="120" align="left">
          <template v-if="auth.enable != -1 && auth.disable != -1" slot-scope="scope">
            <el-switch v-model="scope.row.switch" active-color="#13ce66" inactive-color="#ff4949" @change="handleSwitch(scope.row, scope.$index)" />
            <span v-if="scope.row.switch" style="color: #14BC6C;">正常</span>
            <span v-if="!scope.row.switch" style="color: #FF4949;">停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right" align="right">
          <template slot-scope="scope">
            <el-button v-if="auth.detail != -1" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button v-if="auth.update != -1" type="text" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="auth.delete != -1" type="text" style="color: #FF4949" @click="handleDel(scope.row.app_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="search.page_num" :limit.sync="search.page_size" @pagination="handleCurrentChange" />
    </div>
    <!-- 新增编辑菜单 -->
    <el-dialog :title="form.title" :append-to-body="true" :visible.sync="appVisible" :custom-class="'default-size'" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :label-position="'left'" :rules="rules" label-width="160px">
        <el-form-item label="应用名称" prop="app_name">
          <el-input v-model="form.app_name" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="用户类型" prop="user_type">
          <el-select v-model="form.user_type" multiple placeholder="请选择用户类型">
            <el-option
              v-for="(item, key, index) in user_list"
              :key="index"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="应用过期" prop="app_time">
          <el-radio-group v-model="form.app_time">
            <el-radio :label="0">无限期</el-radio>
            <el-radio :label="1">有限期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.app_time === 1" label="应用过期时间" prop="expire_time">
          <el-date-picker
            v-model="form.expire_time"
            style="width: 100%"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请输入应用过期"
          />
        </el-form-item>
        <el-form-item label="登录访问" prop="user_token">
          <el-radio-group v-model="form.user_token">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="token过期时间" prop="token_expire">
          <el-input v-model="form.token_expire" type="number" style="width: 90%" placeholder="请输入token过期时间" />
          <span class="points">分</span>
        </el-form-item>
        <el-form-item label="是否限制访问平台" prop="restrict_access">
          <el-radio-group v-model="form.restrict_access">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="可用平台" :prop="form.restrict_access === 1 ? 'restrict_platform' : ''">
          <el-select v-model="form.restrict_platform" multiple placeholder="请选择可用平台">
            <el-option
              v-for="(item, key, index) in platform_list"
              :key="index"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否校验权限" prop="check_permission">
          <el-radio-group v-model="form.check_permission">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="签名是否需要密匙加密" prop="add_secret">
          <el-radio-group v-model="form.add_secret">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否使用非对称加密" prop="asy_encry">
          <el-radio-group v-model="form.asy_encry">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="appVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmit()">保存</span>
      </span>
    </el-dialog>
    <!-- 应用详情 -->
    <el-dialog
      :title="'应用详情'"
      :visible.sync="detailVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="have_scroll_dialog"
    >
      <div class="app-content-list">
        <el-divider content-position="left">用户管理</el-divider>
        <div class="app-content-item">
          <div class="app-list-item">
            <div class="app-item-title">用户类型：</div>
            <div class="app-item-desc">
              <template v-if="info.user_type && info.user_type.length > 0">
                <span v-for="(item, index) in info.user_type" :key="index" class="app-item-block">{{ item }}</span>
              </template>
            </div>
          </div>
          <div class="app-list-item">
            <div class="app-item-title">应用过期时间：</div>
            <div class="app-item-desc">{{ info.expire_time === '' ? '无限期' : info.expire_time }}</div>
          </div>
          <div class="app-list-item">
            <div class="app-item-title">APP_ID：</div>
            <div class="app-item-desc">{{ info.app_id }}</div>
          </div>
          <div class="app-list-item">
            <div class="app-item-title">token过期时间(分)：</div>
            <div class="app-item-desc">{{ info.token_expire }}</div>
          </div>
          <div class="app-list-item">
            <div class="app-item-title">是否校验权限：</div>
            <div class="app-item-desc">{{ info.check_permission === 1 ? '是' : '否' }}</div>
          </div>
          <div class="app-list-item">
            <div class="app-item-title">可用访问平台：</div>
            <div class="app-item-desc">
              <template v-if="info.restrict_platform && info.restrict_platform.length > 0">
                <span v-for="(item, index) in info.restrict_platform" :key="index" class="app-item-block">{{ item }}</span>
              </template>
            </div>
          </div>
        </div>
        <div class="app-content-item see-top">
          <span class="spp-btn spp-btn-primary see-btn" @click="handleSeeKey(1)">查看</span>
          <div class="app-list-item">
            <div class="app-item-title">应用密匙：</div>
            <div class="app-item-desc" :class="info.app_key === '' ? 'show-key-desc' : ''">
              {{ info.app_key === '' ? '******' : info.app_key }}
            </div>
          </div>
        </div>
        <div class="app-content-item see-top">
          <span class="spp-btn spp-btn-primary see-btn" @click="handleSeeKey(2)">查看</span>
          <div class="app-list-item">
            <div class="app-item-title">rsa公钥：</div>
            <div class="app-item-desc" :class="info.rsa_public_key === '' ? 'show-key-desc' : ''">
              {{ info.rsa_public_key === '' ? '******' : info.rsa_public_key }}
            </div>
          </div>
          <div class="app-list-item">
            <div class="app-item-title">rsa私钥：</div>
            <div class="app-item-desc" :class="info.rsa_private_key === '' ? 'show-key-desc' : ''">
              {{ info.rsa_private_key === '' ? '******' : info.rsa_private_key }}
            </div>
          </div>
          <div class="app-list-item">
            <div class="app-item-title">aes密钥：</div>
            <div class="app-item-desc" :class="info.aes_key === '' ? 'show-key-desc' : ''">
              {{ info.aes_key === '' ? '******' : info.aes_key }}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { decrypt, httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'
import Pagination from '@/components/Pagination'

export default {
  name: 'Task',
  components: { Pagination },
  filters: {
    formatDate(value) {
      if (value) {
        return value.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6')
      }
    }
  },
  data() {
    return {
      height: window.innerHeight - 135,
      auth: {},
      total: 0,
      search: {
        app_name: '',
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      appVisible: false,
      detailVisible: false,
      app_id: '',
      app_list: [],
      user_list: [], // 用户列表
      platform_list: [], // 平台列表
      info: {
        app_key: '', // 应用密匙
        rsa_public_key: '', // rsa公钥
        rsa_private_key: '', // rsa私钥
        aes_key: '' // aes密钥
      },
      form: {
        title: '新增应用',
        type: 'add',
        app_name: '', // 应用标识
        user_type: [], // 授权访问用户类型[字典：dic_pcode]
        app_time: 1, // 0 无期限 1有限期
        expire_time: '', // 应用过期时间
        user_token: 0, // 登录访问：0-否，1-是
        token_expire: '', // token过期时间/min，当应用需要登录时为必须字段
        restrict_access: 0, // 限制访问平台，0-否，1-是
        restrict_platform: [], // 可用的平台代码，字典platform_code
        check_permission: 0, // 是否校验权限，0-否，1-是
        add_secret: 0, // 签名是否需要密钥加密，0-否，1-是
        asy_encry: 0 // 是否使用非对称加密，0-否，1-是
      },
      rules: {
        app_name: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }
        ],
        user_type: [
          { required: true, message: '请选择用户类型', trigger: 'blur' }
        ],
        app_time: [
          { required: true, message: '请选择应用过期', trigger: 'blur' }
        ],
        expire_time: [
          { required: true, message: '请输入应用过期时间', trigger: 'blur' }
        ],
        user_token: [
          { required: true, message: '请选择登录访问', trigger: 'blur' }
        ],
        token_expire: [
          { required: true, message: '请输入token过期时间', trigger: 'blur' }
        ],
        restrict_access: [
          { required: true, message: '请选择是否限制访问平台', trigger: 'blur' }
        ],
        restrict_platform: [
          { required: true, message: '请选择可用平台', trigger: 'blur' }
        ],
        check_permission: [
          { required: true, message: '请选择是否校验权限', trigger: 'blur' }
        ],
        add_secret: [
          { required: true, message: '请选择签名是否需要密匙加密', trigger: 'blur' }
        ],
        asy_encry: [
          { required: true, message: '请选择是否使用非对称加密', trigger: 'blur' }
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
    appVisible(val) {
      if (val) {
        this.form.title = this.form.type === 'add' ? '新增应用' : '编辑应用'
        this.handleGetUserList('/api/sys/dic/user/type', 1)
        this.handleGetUserList('/api/sys/dic/platform/code', 2)
      }
      if (!val) {
        this.form.type = 'add'
        this.form.app_name = ''
        this.form.user_type = []
        this.form.app_time = 0
        this.form.expire_time = ''
        this.form.user_token = 0
        this.form.token_expire = ''
        this.form.restrict_access = 0
        this.form.restrict_platform = []
        this.form.check_permission = 0
        this.form.add_secret = 0
        this.form.asy_encry = 0
        this.$refs['form'].clearValidate()
      }
    },
    detailVisible(val) {
      if (!val) {
        this.info = {
          app_key: '', // 应用密匙
          rsa_public_key: '', // rsa公钥
          rsa_private_key: '', // rsa私钥
          aes_key: '' // aes密钥
        }
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
      this.auth.save = this.permission.indexOf('/api/sys/app/save')
      this.auth.update = this.permission.indexOf('/api/sys/app/update')
      this.auth.delete = this.permission.indexOf('/api/sys/app/delete')
      this.auth.detail = this.permission.indexOf('/api/sys/app/info')
      this.auth.cache = this.permission.indexOf('/api/sys/app/refresh/cache')
      this.auth.enable = this.permission.indexOf('/api/sys/app/start')
      this.auth.disable = this.permission.indexOf('/api/sys/app/cease')
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
    fetchData() {
      httpRequest('/api/sys/app/paginate', this.search).then(res => {
        const data = JSON.parse(decrypt(res.data))
        const app_list = data.records
        this.total = data.total
        app_list.map((item) => {
          item.switch = item.status_flag === '1'
        })
        this.app_list = app_list
      })
    },
    handleSeeKey(type) {
      if (type === 1) {
        if (this.info.app_key === '') {
          this.handleGetKey('/api/sys/app/info/secret', 1)
        } else {
          this.info.app_key = ''
        }
      } else {
        if (this.info.rsa_public_key === '') {
          this.handleGetKey('/api/sys/app/info/key', 2)
        } else {
          this.info.rsa_public_key = ''
          this.info.rsa_private_key = ''
          this.info.aes_key = ''
        }
      }
    },
    handleGetKey(api, type) {
      httpRequest(api, {
        app_dd: this.info.app_id
      }, false).then(res => {
        if (type === 1) {
          this.info.app_key = JSON.parse(decrypt(res.data))
        } else {
          var obj = JSON.parse(decrypt(res.data))
          this.info.rsa_public_key = obj.rsa_public_key
          this.info.rsa_private_key = obj.rsa_private_key
          this.info.aes_key = obj.aes_key
        }
      })
    },
    // 用户/平台列表
    handleGetUserList(str, type) {
      httpRequest(str, {}, false).then(res => {
        if (type === 1) {
          this.user_list = JSON.parse(decrypt(res.data))
        } else {
          this.platform_list = JSON.parse(decrypt(res.data))
        }
      })
    },
    handleCache() {
      httpRequest('/api/sys/app/refresh/cache', {}, false, false).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.$message({
          message: data ? '同步成功' : '同步失败',
          type: data ? 'success' : 'error'
        })
        this.queryData()
      })
    },
    handleSwitch(row, index) {
      var api = row.switch ? '/api/sys/app/start' : '/api/sys/app/cease'
      httpRequest(api, {
        app_dd: row.app_id
      }, false).then(res => {

      }).catch(err => {
        console.log(err)
        this.app_list[index].switch = !row.switch
      })
    },
    handleUpdate(data) {
      this.app_id = data.app_id
      httpRequest('/api/sys/app/info', {
        app_dd: data.app_id
      }, false).then((res) => {
        var info = JSON.parse(decrypt(res.data))
        this.form.app_name = info.app_name
        this.form.token_expire = info.token_expire
        this.form.user_type = info.us_type ? info.us_type.split(',') : []
        this.form.restrict_platform = info.res_platform ? info.res_platform.split(',') : []
        this.form.user_token = Number(info.user_token)
        this.form.restrict_access = Number(info.restrict_access)
        this.form.check_permission = Number(info.check_permission)
        this.form.add_secret = Number(info.add_secret)
        this.form.asy_encry = Number(info.asy_encry)
        this.form.expire_time = info.expire_time.toString()
        if (this.form.expire_time !== '20991231235959') {
          this.form.app_time = 1
          this.form.expire_time = this.$options.filters.formatDate(this.form.expire_time)
        } else {
          this.form.app_time = 0
          this.form.expire_time = ''
        }
        this.form.type = 'edit'
        this.appVisible = true
      })
    },
    handleDetail(data) {
      httpRequest('/api/sys/app/info', {
        app_dd: data.app_id
      }, false).then((res) => {
        var info = JSON.parse(decrypt(res.data))
        this.info = { ...this.info, ...info }
        this.info.restrict_platform = this.info.restrict_platform ? this.info.restrict_platform.split(',') : []
        this.info.user_type = this.info.user_type ? this.info.user_type.split(',') : []
        this.info.check_permission = Number(info.check_permission)
        this.info.expire_time = this.info.expire_time.toString()
        if (this.info.expire_time !== '20991231235959') {
          this.info.expire_time = this.$options.filters.formatDate(this.info.expire_time)
        } else {
          this.info.expire_time = ''
        }
        this.detailVisible = true
      })
    },
    handleDel(id) {
      this.$confirm('确认要删除该应用吗？', '提示', {
        title: '删除提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/sys/app/delete', { app_dd: id }, false).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.queryData()
        })
      }).catch(() => {})
    },
    handleFormatStr(val) {
      let str = ''
      val = val.split(' ')
      val[0].split('-').map((item) => {
        str += item
      })
      val[1].split(':').map((item) => {
        str += item
      })
      return str
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var api = ''
          var data = {
            app_name: this.form.app_name,
            user_type: this.form.user_type.join(','),
            expire_time: this.form.app_time === 0 ? '20991231235959' : this.handleFormatStr(this.form.expire_time),
            user_token: this.form.user_token,
            token_expire: this.form.token_expire,
            restrict_access: this.form.restrict_access,
            restrict_platform: this.form.restrict_platform.join(','),
            check_permission: this.form.check_permission,
            add_secret: this.form.add_secret,
            asy_encry: this.form.asy_encry
          }
          if (this.form.type === 'add') {
            api = '/api/sys/app/save'
          } else {
            data.app_dd = this.app_id
            api = '/api/sys/app/update'
          }
          httpRequest(api, data, false).then(res => {
            this.appVisible = false
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
  .points {
    height: 20px;
    font-size: 14px;
    color: #323338;
    letter-spacing: 0;
    line-height: 20px;
  }

  .app-content-list {
    padding: 0 4px;

    .app-content-title {
      height: 26px;
      font-weight: Bold;
      font-size: 18px;
      color: #323338;
      letter-spacing: 0;
      line-height: 26px;
      margin-bottom: 24px;
    }

    .see-top {
      margin-top: 20px;
    }

    .app-content-item {
      .see-btn {
        height: 24px;
        font-size: 12px;
        margin-bottom: 8px;
        line-height: 22px;
        padding: 0 17px;
      }

      .app-list-item {
        display: flex;
        align-items: flex-start;
        min-height: 40px;
        font-size: 14px;
        font-weight: 400;
        color: #2c2e33;

        .app-item-title {
          display: flex;
          align-items: center;
          min-height: 28px;
          min-width: 100px;
          font-size: 14px;
          color: #939499;
          letter-spacing: 0;
        }

        .app-item-block {
          height: 28px;
          padding: 0 8px;
          background: #F0F1F5;
          border-radius: 15px;
          font-size: 12px;
          color: #939499;
          letter-spacing: 0;
          line-height: 28px;
          margin-right: 8px;
          margin-bottom: 8px;
        }

        .app-item-block:last-child {
          margin-right: 0;
        }

        .app-item-desc {
          font-size: 14px;
          color: #323338;
          letter-spacing: 0;
          min-height: 28px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          line-height: 28px;
        }

        .show-key-desc {
          color: #FF7428;
        }
      }
    }
  }

  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
  }

  ::v-deep input[type='number'] {
    -moz-appearance: textfield !important;
  }
</style>
