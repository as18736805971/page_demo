<template>
  <div class="app-container page-container">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="应用名称：">
            <el-input v-model="search.keyword" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="应用状态：">
            <el-select v-model="search.status_flag" clearable placeholder="请选择">
              <el-option label="停用" value="0" />
              <el-option label="启用" value="1" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="resetForm()">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-header">
      <div class="left">
        <span v-if="functionList.includes('A05001')" class="spp-btn spp-btn-primary" @click="addAppKey()">
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="functionList.includes('A05002')" class="spp-btn" @click="syncToCache()">
          <svg-icon icon-class="synchro" />
          <span>同步至缓存</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="appKeyData">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="APP_ID" prop="app_id" width="300" />
        <el-table-column label="APP_KEY" prop="app_key" width="300" />
        <el-table-column label="应用名称" prop="app_name" />
        <el-table-column label="过期时间">
          <template slot-scope="scope">{{ scope.row.expire_time ? formatDateTime(scope.row.expire_time) : '无限期' }}</template>
        </el-table-column>
        <el-table-column label="校验身份" width="100">
          <template slot-scope="scope">{{ scope.row.verify_token === '0' ? '不校验' : '校验' }}</template>
        </el-table-column>
        <el-table-column label="Token过期时间">
          <template slot-scope="scope">{{ scope.row.token_expire + '秒' }}</template>
        </el-table-column>
        <el-table-column label="用户类型" prop="user_type">
          <template slot-scope="scope">{{ formatUserType(scope.row.user_type) }}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status_flag == '1' && functionList.includes('A05003')"
              class="red"
              type="text"
              :disabled="scope.row.app_id === getAppId()"
              @click="disableAppKey(scope.row.app_id)"
            >
              停用
            </el-button>
            <el-button
              v-if="scope.row.status_flag != '1' && functionList.includes('A05004')"
              class="green"
              type="text"
              @click="enableAppKey(scope.row.app_id)"
            >
              启用
            </el-button>
            <el-button v-if="functionList.includes('A05005')" type="text" @click="editAppKey(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="800px"
    >
      <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="120px" class="model_form">
        <el-form-item label="应用名称" prop="app_name">
          <el-input v-model="form.app_name" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="应用过期时间" prop="expire_time">
          <el-date-picker v-model="form.expire_time" type="datetime" placeholder="请选择应用过期时间" style="width:100%" />
        </el-form-item>
        <el-form-item label="校验用户身份" prop="verify_token">
          <el-radio-group v-model="form.verify_token">
            <el-radio label="1">校验</el-radio>
            <el-radio label="0">不校验</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Token过期时间" prop="token_expire">
          <el-input v-model="form.token_expire" placeholder="请输入Token过期时间" type="number" />
        </el-form-item>
        <el-form-item label="用户类型" prop="user_type">
          <el-checkbox-group v-model="form.user_type">
            <el-checkbox v-for="(value, key, index) in user_type" :key="index" :label="key">{{ value }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="model_btn_group">
          <span class="spp-btn spp-btn-primary" @click="submit()">提交</span>
          <span class="spp-btn" @click="reset">重置</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { paginate, enableAppKey, disableAppKey, syncToCache, addAppKey, editAppKey } from '@/api/app_key'
import { getUserType } from '@/api/dic'
import { getAppId } from '@/utils/auth'
import Pagination from '@/components/Pagination'
import { formatDateTime, parseTime } from '@/utils/index'
import { mapState } from 'vuex'
export default {
  name: 'AppKey',
  components: { Pagination },
  data() {
    return {
      search: {
        keyword: '',
        status_flag: ''
      },
      user_type: '',
      appKeyData: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      dialogTitle: '',
      app_id: '',
      form: {
        app_name: '',
        expire_time: '',
        verify_token: '1',
        token_expire: '',
        user_type: []
      },
      rules: {
        app_name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        verify_token: [
          { required: true, message: '请选择是否需要校验用户身份', trigger: 'blur' }
        ],
        user_type: [
          { required: true, message: '请选择用户类型', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  async created() {
    const user_type_raw = await getUserType()
    this.user_type = user_type_raw.data
    this.getData()
  },
  methods: {
    formatUserType(data) {
      const result = []
      data.split(',').forEach(item => {
        result.push(this.user_type[item])
      })
      return result.join(',')
    },
    searchData: function() {
      this.page = 1
      this.getData()
    },
    getData() {
      paginate(this.search, this.page, this.page_size).then(response => {
        this.appKeyData = response.data.list
        this.total = response.data.totalRow
      })
    },
    addAppKey() {
      this.app_id = ''
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
      this.dialogTitle = '新增应用'
    },
    enableAppKey(app_id) {
      enableAppKey(app_id).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 3000
        })
        this.getData()
      })
    },
    disableAppKey(app_id) {
      disableAppKey(app_id).then(response => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 3000
        })
        this.getData()
      })
    },
    resetForm() {
      this.search.keyword = ''
      this.search.status_flag = ''
    },
    formatDateTime: formatDateTime,
    getAppId: getAppId,
    syncToCache() {
      syncToCache().then(response => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 3000
        })
      })
    },
    submit() {
      if (!this.app_id) {
        // 新增
        this.$refs.form.validate(valid => {
          if (valid) {
            const { ...data } = this.form
            data.user_type = data.user_type.join(',')
            data.expire_time = data.expire_time ? parseTime(data.expire_time, '{y}{m}{d}{h}{i}{s}') : ''
            addAppKey(data).then(response => {
              this.showDialog = false
              this.$message({
                message: '应用添加成功',
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
            const { ...data } = this.form
            data.user_type = data.user_type.join(',')
            data.expire_time = data.expire_time ? parseTime(data.expire_time, '{y}{m}{d}{h}{i}{s}') : ''
            editAppKey(this.app_id, data).then(response => {
              this.showDialog = false
              this.$message({
                message: '应用修改成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      }
    },
    editAppKey(row) {
      this.app_id = row.app_id
      this.form = {
        app_name: row.app_name,
        expire_time: row.expire_time ? new Date(formatDateTime(row.expire_time)) : '',
        verify_token: row.verify_token,
        token_expire: row.token_expire,
        user_type: row.user_type.split(',')
      }
      this.showDialog = true
      this.dialogTitle = '编辑应用'
    },
    reset() {
      if (this.$refs.hasOwnProperty('form')) {
        this.$refs.form.resetFields()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .insideuser-container {
    background: #ffffff;
    border-radius: 10px;
  }
</style>
