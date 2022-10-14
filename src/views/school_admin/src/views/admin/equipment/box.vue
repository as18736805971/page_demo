<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 搜索条件 -->
    <div class="header-search single_line">
      <el-form
        ref="search_form"
        :model="search"
        :inline="true"
        label-width="80px"
      >
        <div class="form-area">
          <div class="search_view">
            <div v-if="login_role === 6" class="send-obj-item search-item" @click.stop="schoolVisible = true">
              <template v-if="select_school.scl_id">
                <div class="send-obj-block send-active">{{ select_school.scl_name }}</div>
                <i class="el-icon-circle-close send-obj-icon" @click.stop="handleCloseSchool()" />
              </template>
              <template v-else>
                <div class="send-obj-block">选择学校</div>
              </template>
            </div>
            <el-form-item>
              <el-input
                v-model="search.keyword"
                style="width: 220px"
                placeholder="请输入设备名称、设备编号"
                clearable
              />
            </el-form-item>
            <div class="btn-area">
              <span class="spp-btn spp-btn-primary" @click="queryData()">搜索</span>
              <span class="spp-btn" @click="resetData()">重置</span>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <!-- 表格 -->
    <div class="content_view">
      <div class="main-header">
        <el-row :gutter="20">
          <el-col :span="4" class="left">AI BOX设备列表</el-col>
          <el-col :span="20" class="right" />
        </el-row>
      </div>
      <el-table ref="table" :data="box_list" :height="height - 140" size="mini" stripe>
        <el-table-column label="#" type="index" width="60" />
        <el-table-column label="设备名称" prop="equ_name" show-overflow-tooltip align="left" />
        <el-table-column label="设备编号" prop="equ_no" align="left" />
        <el-table-column label="设备位置" show-overflow-tooltip prop="equ_position" align="left" />
        <el-table-column label="设备添加时间" align="left">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <!--<el-table-column label="操作" width="190" fixed="right" align="left">
          <template slot-scope="scope">
            <el-button v-if="auth.detail != -1" type="text" @click="handleDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="search.page_num"
        :limit.sync="search.page_size"
        @pagination="handleCurrentChange"
      />
    </div>
    <!-- 选择学校 -->
    <el-dialog
      title="选择学校"
      :visible.sync="schoolVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="select-school"
    >
      <select-school v-if="schoolVisible" :select="select_school" @selectSchool="handleSelectSchool" />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SelectSchool from '@/components/SelectSchool'
import Pagination from '@/components/Pagination'
import { decrypt, httpRequest } from '@/utils/auth'

export default {
  name: 'Box',
  components: { Pagination, SelectSchool },
  data() {
    return {
      login_role: Number(JSON.parse(decrypt(sessionStorage.getItem('login_role'))).login_user_type),
      height: window.innerHeight - 98,
      search: {
        scl_id: '',
        keyword: '', // 设备名称/设备编号
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      auth: {},
      box_list: [],
      total: 0,
      schoolVisible: false,
      select_school: {
        scl_id: '',
        scl_name: ''
      }
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  created() {
    this.queryData()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {
      // this.auth.police = this.permission.indexOf('/api/pajx/camera/scl/bind/police')
    },
    // 选择学校
    handleSelectSchool(data) {
      this.select_school.scl_id = data.scl_id
      this.select_school.scl_name = data.scl_name
      this.search.scl_id = data.scl_id
      this.search.keyword = ''
      this.schoolVisible = false
      this.queryData()
    },
    handleCloseSchool() {
      this.select_school.scl_id = ''
      this.select_school.scl_name = ''
      this.search.scl_id = ''
      this.search.keyword = ''
      this.queryData()
    },
    handleCurrentChange(val) {
      this.search.page_num = val.page
      this.fetchData()
    },
    queryData() {
      this.search.page_num = 1
      this.fetchData()
    },
    resetData() {
      Object.assign(this.$data.search, this.$options.data().search)
      this.queryData()
    },
    fetchData() {
      httpRequest('/api/pajx/aibox/scl/paginate', this.search).then(res => {
        const data = JSON.parse(decrypt(res.data))
        this.box_list = data.records
        this.total = data.total
      })
    },
    handleDetail(data) {}
  }
}
</script>

<style scoped>

</style>
