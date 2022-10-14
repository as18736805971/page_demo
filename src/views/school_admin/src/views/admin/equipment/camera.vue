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
                placeholder="请输入设备名称、设备编码"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-select v-model="search.online_flag" clearable placeholder="选择设备状态">
                <el-option
                  v-for="(item, index) in online_status"
                  :key="index"
                  :label="item.title"
                  :value="item.type"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="search.user_duty_id" filterable clearable placeholder="请选择责任人">
                <el-option
                  v-for="(item, index) in duty_list"
                  :key="index"
                  :label="item.user_name"
                  :value="item.user_pid"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="search.user_police_id" filterable clearable placeholder="请选择出警人">
                <el-option
                  v-for="(item, index) in police_list"
                  :key="index"
                  :label="item.user_name"
                  :value="item.user_pid"
                />
              </el-select>
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
          <el-col :span="4" class="left">摄像头列表</el-col>
          <el-col :span="20" class="right" />
        </el-row>
      </div>
      <el-table ref="table" :data="camera_list" :height="height - 140" size="mini" stripe>
        <el-table-column label="#" type="index" width="60" />
        <el-table-column label="设备名称" prop="equ_name" show-overflow-tooltip align="left" />
        <el-table-column label="设备编号" prop="equ_no" align="left" />
        <el-table-column label="设备位置" show-overflow-tooltip prop="equ_position" align="left" />
        <el-table-column label="设备添加时间" align="left">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="出警人" width="150" align="left">
          <template slot-scope="scope">
            <div>{{ scope.row.police_name }}</div>
            <div>{{ scope.row.police_phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="责任人" width="150" align="left">
          <template slot-scope="scope">
            <div>{{ scope.row.duty_name }}</div>
            <div>{{ scope.row.duty_phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="设备状态" width="100" align="left">
          <template slot-scope="scope">
            <el-button v-if="scope.row.online_flag == '1'" type="text" style="color: #00BD79;margin-left: 8px">在线</el-button>
            <el-button v-else type="text" style="color: #909399;margin-left: 8px">离线</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190" fixed="right" align="left">
          <template slot-scope="scope">
            <el-button v-if="auth.edit != -1" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="auth.detail != -1" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button v-if="auth.police != -1" type="text" @click="handlePoliceInfo(scope.row)">出警信息管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="search.page_num"
        :limit.sync="search.page_size"
        @pagination="handleCurrentChange"
      />
    </div>
    <!-- 编辑 -->
    <el-dialog
      title="编辑摄像头"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="volume-video-form"
    >
      <el-form ref="form_info" :label-position="'top'" :model="form_info" :rules="rules_info" label-width="10px">
        <el-form-item label="设备名称" prop="equ_name">
          <el-input v-model="form_info.equ_name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备位置">
          <el-input v-model="form_info.equ_position" placeholder="请输入设备位置" />
        </el-form-item>
        <el-form-item label="httpflv地址">
          <el-input v-model="form_info.httpflv" placeholder="请输入httpflv地址" />
        </el-form-item>
        <el-form-item label="hls">
          <el-input v-model="form_info.hls" placeholder="请输入hls" />
        </el-form-item>
      </el-form>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="editVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onEditSubmit()">保存</span>
      </div>
    </el-dialog>
    <!-- 设备详情 -->
    <div v-if="detailVisible" class="el-dialog__wrapper" style="z-index: 2005">
      <div class="el-dialog have_scroll_dialog" style="margin-top: 15vh; width: 720px;">
        <div class="el-dialog__header">
          <span class="el-dialog__title">设备详情</span>
          <button type="button" class="el-dialog__headerbtn" @click="detailVisible = false">
            <i class="el-dialog__close el-icon el-icon-close" />
          </button>
        </div>
        <div class="el-dialog__body">
          <el-scrollbar wrap-class="vertical_scrollbar" :style="{ height: height + 'px' }">
            <equipment-details
              v-if="detailVisible"
              :detail-type="0"
              :markers="markers"
              :info="camera_info"
              @getLocation="handleGetLocation"
              @handleEditCoords="handleEditCoords"
            />
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div v-if="detailVisible" class="v-modal" style="z-index: 2004;" />
    <!-- 出警信息管理 -->
    <el-dialog
      title="出警信息管理"
      :visible.sync="policeVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="volume-form"
    >
      <el-form ref="form" :label-position="'top'" :model="form" :rules="rules" label-width="10px">
        <el-form-item label="出警人" prop="user_police_id">
          <el-select v-model="form.user_police_id" filterable clearable placeholder="请选择出警人">
            <el-option
              v-for="(item, index) in police_list"
              :key="index"
              :label="item.user_name"
              :value="item.user_pid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="责任人">
          <el-select v-model="form.user_duty_id" filterable clearable placeholder="请选择责任人">
            <el-option
              v-for="(item, index) in duty_list"
              :key="index"
              :label="item.user_name"
              :value="item.user_pid"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="policeVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmit()">保存</span>
      </div>
    </el-dialog>
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
import { decrypt, httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'
import Pagination from '@/components/Pagination'
import EquipmentDetails from '@/components/EquipmentDetails'
import SelectSchool from '@/components/SelectSchool'
export default {
  name: 'Camera',
  components: { Pagination, EquipmentDetails, SelectSchool },
  data() {
    return {
      login_role: Number(JSON.parse(decrypt(sessionStorage.getItem('login_role'))).login_user_type),
      height: window.innerHeight - 98,
      auth: {},
      markers: [],
      search: {
        scl_id: '',
        keyword: '', // 设备名称/设备编号
        online_flag: '', // 设备在线状态：0-离线，1-在线
        user_duty_id: '', // 责任人标识
        user_police_id: '', // 出警人标识
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      select_school: {
        scl_id: '',
        scl_name: ''
      }, // 选择学校
      online_status: [{
        type: 1,
        title: '在线'
      }, {
        type: 0,
        title: '离线'
      }], // 设备状态
      duty_list: [], // 责任人
      police_list: [], // 出警人
      editVisible: false,
      policeVisible: false,
      detailVisible: false,
      schoolVisible: false,
      camera_list: [],
      camera_info: {},
      total: 0,
      form: {
        equ_id: '',
        user_duty_id: '',
        user_police_id: ''
      },
      form_info: {
        equ_id: '',
        equ_name: '',
        equ_position: '',
        httpflv: '',
        hls: ''
      },
      rules: {
        user_police_id: [
          { required: true, message: '请选择出警人', trigger: 'blur' }
        ]
      },
      rules_info: {
        equ_name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
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
    policeVisible(val) {
      if (!val) {
        Object.assign(this.$data.form, this.$options.data().form)
        this.$refs['form'].clearValidate()
      }
    }
  },
  mounted() {
    this.permissionAuth()
    this.handleGetDuty()
    this.queryData()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {
      this.auth.police = this.permission.indexOf('/api/pajx/camera/scl/bind/police')
      this.auth.detail = this.permission.indexOf('/api/pajx/camera/scl/detail')
      this.auth.edit = this.permission.indexOf('/api/pajx/camera/scl/edit')
    },
    handleGetDuty() {
      var p1 = httpRequest('/api/pajx/scl/puser/police/list', {
        scl_id: this.select_school.scl_id
      }, false)
      var p2 = httpRequest('/api/pajx/scl/puser/duty/list', {
        scl_id: this.select_school.scl_id
      }, false)
      Promise.all([p1, p2]).then((res) => {
        this.police_list = JSON.parse(decrypt(res[0].data))
        this.duty_list = JSON.parse(decrypt(res[1].data))
      })
    },
    // 选择学校
    handleSelectSchool(data) {
      this.select_school.scl_id = data.scl_id
      this.select_school.scl_name = data.scl_name
      this.search.scl_id = data.scl_id
      this.search.keyword = ''
      this.search.user_duty_id = ''
      this.search.user_police_id = ''
      this.search.online_flag = ''
      this.schoolVisible = false
      this.handleGetDuty()
      this.queryData()
    },
    handleCloseSchool() {
      this.select_school.scl_id = ''
      this.select_school.scl_name = ''
      this.search.scl_id = ''
      this.search.keyword = ''
      this.search.user_duty_id = ''
      this.search.user_police_id = ''
      this.search.online_flag = ''
      this.handleGetDuty()
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
      httpRequest('/api/pajx/camera/scl/paginate', this.search).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.camera_list = data.records
        this.total = data.total
      })
    },
    handleEdit(data) {
      this.form_info.equ_id = data.equ_id
      this.form_info.equ_name = data.equ_name
      this.form_info.equ_position = data.equ_position
      this.form_info.httpflv = data.httpflv
      this.form_info.hls = data.hls
      this.editVisible = true
    },
    handleDetail(data) {
      httpRequest('/api/pajx/camera/scl/detail', {
        equ_id: data.equ_id
      }).then(res => {
        var info = JSON.parse(decrypt(res.data))
        this.camera_info = { ...this.camera_info, ...info }
        var coordinate = this.camera_info.equ_coordinate.split(',')
        this.$set(this.camera_info, 'center', coordinate)
        this.markers = [{
          id: '10',
          top: '0',
          left: '0',
          status: false,
          position: coordinate
        }]
        this.detailVisible = true
      })
    },
    handleGetLocation(data) {
      this.camera_info.center = [data.lng, data.lat]
    },
    handleEditCoords(data) {
      if (data.type === 1) {
        this.markers = []
        this.markers.push({
          id: 10,
          top: '0',
          left: '0',
          status: false,
          position: [data.str.lng, data.str.lat]
        })
      } else if (data.type === 2) {
        this.markers = []
        this.markers.push({
          id: data.str.lng,
          top: '0',
          left: '0',
          status: false,
          position: [data.str.lng, data.str.lat]
        })
        this.camera_info.center = [data.str.lng, data.str.lat]
        this.camera_info.equ_coordinate = data.str.lng + ',' + data.str.lat
      } else {
        var str = this.camera_info.equ_coordinate.split(',')
        this.markers = []
        this.markers.push({
          id: 10,
          top: '0',
          left: '0',
          status: false,
          position: [str[0], str[1]]
        })
        this.camera_info.center = [str[0], str[1]]
      }
    },
    handlePoliceInfo(data) {
      this.form.equ_id = data.equ_id
      this.form.user_duty_id = data.user_duty || ''
      this.form.user_police_id = data.user_police || ''
      this.policeVisible = true
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          httpRequest('/api/pajx/camera/scl/bind/police', this.form, false).then(res => {
            this.policeVisible = false
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
    },
    onEditSubmit() {
      this.$refs['form_info'].validate((valid) => {
        if (valid) {
          httpRequest('/api/pajx/camera/scl/edit', this.form_info, false).then(res => {
            this.editVisible = false
            this.$refs['form_info'].clearValidate()
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

<style lang="scss">
.volume-video-form {
  left: 50% !important;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 470px !important;
  overflow-y: hidden !important;
}
</style>
