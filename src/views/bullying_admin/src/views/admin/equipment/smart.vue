<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="12" class="header_left">
          <span v-if="auth.synchronous != -1" class="spp-btn-add spp-btn-primary" @click="handleSynchronous()"><svg-icon icon-class="add_sync" />同步设备</span>
          <span v-if="auth.subscribes != -1" class="spp-btn-add spp-btn-default" @click="handleSubscribe()"><svg-icon icon-class="add_label" />订阅告警事件</span>
        </el-col>
        <el-col :span="12" class="header_right search_view">
          <div class="input_view">
            <el-input v-model="search.id" placeholder="搜索厂家设备ID" @keyup.enter="queryData" @change="queryData" />
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content_view">
      <!-- 搜索条件 -->
      <div class="search_criteria">
        <el-select v-model="search.status" class="select_provinces" clearable placeholder="设备状态" @change="queryData">
          <el-option
            v-for="(item, key, index) in status_list"
            :key="index"
            :label="item"
            :value="key"
          />
        </el-select>
      </div>
      <!-- 表格 -->
      <el-table ref="table" :data="smart_list" :height="height - 80" size="mini" strip>
        <el-table-column label="序号" type="index" width="60" align="left" />
        <el-table-column label="厂家设备ID" prop="id" width="250" align="left" />
        <el-table-column label="设备名称" prop="name" align="left" />
        <el-table-column label="设备失活间隔(s)" prop="inactive_timeout" align="left" />
        <el-table-column label="创建时间" align="left">
          <template slot-scope="scope">
            {{ scope.row.create_time | timeFormat }}
          </template>
        </el-table-column>
        <el-table-column label="最后通讯时间" prop="last_active_time" align="left">
          <template slot-scope="scope">
            {{ scope.row.last_active_time | timeFormat }}
          </template>
        </el-table-column>
        <el-table-column label="设备状态" width="90" align="left">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status == '100'" style="color: #FF7428" type="text">未知</el-button>
            <el-button v-if="scope.row.status == '110'" style="color: #1AB9FF" type="text">激活</el-button>
            <el-button v-if="scope.row.status == '120'" style="color: #FF7428" type="text">未激活</el-button>
            <el-button v-if="scope.row.status == '200'" style="color: #14BC6C" type="text">在线</el-button>
            <el-button v-if="scope.row.status == '300'" style="color: #939499" type="text">离线</el-button>
            <el-button v-if="scope.row.status == '400'" style="color: #FF4949" type="text">故障</el-button>
            <el-button v-if="scope.row.status == '500'" style="color: #FF4949" type="text">禁用</el-button>
            <el-button v-if="scope.row.status == '600'" style="color: #FF4949" type="text">移出</el-button>
            <el-button v-if="scope.row.status == '610'" style="color: #FF4949" type="text">擦除</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" fixed="right" align="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="search.page_num" :limit.sync="search.page_size" @pagination="handleCurrentChange" />
    </div>
    <!-- 设备详情 -->
    <el-dialog
      title="设备详情"
      :visible.sync="detailVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="have_scroll_dialog"
    >
      <equipment-details :detail-type="3" :info="smart_info" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import EquipmentDetails from './equipment_details'
import { decrypt, httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'
export default {
  name: 'Smart',
  components: { Pagination, EquipmentDetails },
  filters: {
    timeFormat(value) {
      var str = value ? value.substr(0, value.indexOf('.')) : ''
      return value ? str.replace('T', ' ') : ''
    }
  },
  data() {
    return {
      height: window.innerHeight - 160,
      total: 0,
      auth: {},
      search: {
        id: '',
        status: '',
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      status_list: {
        100: '未知',
        110: '激活',
        120: '未激活',
        200: '在线',
        300: '离线',
        400: '故障',
        500: '禁用',
        600: '移出',
        610: '擦除'
      },
      smart_info: {},
      smart_list: [],
      detailVisible: false
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  created() {
    this.permissionAuth()
    this.queryData()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {
      this.auth.subscribes = this.permission.indexOf('/api/sys/jiaren/subscriptionAddr')
      this.auth.synchronous = this.permission.indexOf('/api/sys/jiaren/deviceSynzed')
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
      httpRequest('/api/sys/jiaren/paginate', this.search).then(res => {
        const data = JSON.parse(decrypt(res.data))
        this.total = data.total
        this.smart_list = data.records
      })
    },
    // 同步设备
    handleSynchronous() {
      httpRequest('/api/sys/jiaren/deviceSynzed', {}, false).then(res => {
        const data = JSON.parse(decrypt(res.data))
        this.$message({
          message: data,
          type: 'success'
        })
        this.fetchData()
      })
    },
    // 订阅告警事件
    handleSubscribe() {
      httpRequest('/api/sys/jiaren/subscriptionAddr', {}, false).then(res => {
        const data = res.data
        let message = ''
        if (data && data !== 'null') {
          message = data
        } else {
          message = '同步成功'
        }
        this.$message({
          message: message,
          type: 'success'
        })
        this.fetchData()
      })
    },
    handleDetail(data) {
      httpRequest('/api/sys/jiaren/info', {
        id: data.id
      }, false).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.smart_info = data.data
        this.smart_info.keyword = data.keyword
        this.smart_info.audio_url = data.audio_url
        this.detailVisible = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
