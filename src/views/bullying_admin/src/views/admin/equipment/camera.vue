<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="12" class="header_left">
          <span v-if="auth.save != -1" class="spp-btn-add spp-btn-primary" @click="editVisible = true"><svg-icon icon-class="add_camera" />新增摄像头</span>
        </el-col>
        <el-col :span="12" class="header_right search_view">
          <div class="input_view">
            <el-input v-model="search.equ_no" placeholder="设备编号" @keyup.enter="queryData" @change="queryData" />
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="content_view">
      <!-- 搜索条件 -->
      <div class="search_criteria">
        <div class="send-obj-item search-item" @click.stop="handleSchool(1)">
          <template v-if="search_school.scl_id">
            <span class="send-obj-block send-active">{{ search_school.scl_name }}</span>
          </template>
          <template v-else>
            <span class="send-obj-block">选择学校</span>
          </template>
          <i class="el-icon-arrow-down send-obj-icon" />
        </div>
        <el-select v-model="search.equ_type" class="select_provinces" clearable placeholder="选择类型">
          <el-option
            v-for="(item, key, index) in camera"
            :key="index"
            :label="item"
            :value="key"
          />
        </el-select>
        <el-select v-model="search.equ_vender" class="select_provinces" clearable placeholder="选择设备厂商">
          <el-option
            v-for="(item, key, index) in vendor"
            :key="index"
            :label="item"
            :value="key"
          />
        </el-select>
        <el-select v-model="search.provider_type" class="select_provinces" clearable style="width: 160px" placeholder="选择设备提供方">
          <el-option
            v-for="(item, key, index) in provider"
            :key="index"
            :label="item"
            :value="key"
          />
        </el-select>
        <span class="spp-btn spp-btn-primary" @click="queryData()">搜索</span>
        <span class="spp-btn" @click="resetData()">重置</span>
      </div>
      <!-- 表格 -->
      <el-table ref="table" :data="camera_list" :height="height - 80" size="mini" strip>
        <el-table-column label="序号" type="index" width="60" align="left" />
        <el-table-column label="设备编号" prop="equ_no" align="left" />
        <el-table-column label="设备名称" prop="equ_name" align="left" />
        <el-table-column label="设备类型" prop="equ_type_name" align="left" />
        <el-table-column label="出警人" width="160" align="left">
          <template slot-scope="scope">
            {{ scope.row.police_name }} {{ scope.row.police_phone }}
          </template>
        </el-table-column>
        <el-table-column label="责任人" width="160" align="left">
          <template slot-scope="scope">
            {{ scope.row.duty_name }} {{ scope.row.duty_phone }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" align="left">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="最后通讯时间" width="160" align="left">
          <template slot-scope="scope">
            {{ scope.row.last_connect_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="60" align="left">
          <template slot-scope="scope">
            <el-button :style="{ color: scope.row.online_flag == '1' ? '#14BC6C' : '#939499' }" type="text">
              {{ scope.row.online_flag == '1' ? '在线' : '离线' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right" align="right">
          <template slot-scope="scope">
            <el-button v-if="auth.detail != -1" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button v-if="auth.update != -1" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="auth.delete != -1" type="text" style="color: #FF4949" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="search.page_num" :limit.sync="search.page_size" @pagination="handleCurrentChange" />
    </div>
    <!-- 新增编辑摄像头 -->
    <el-dialog
      ref="edit"
      :title="form.title"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="have_scroll_dialog"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="设备类型：" prop="equ_type">
          <el-select v-model="form.equ_type" class="select_provinces" placeholder="请选择设备类型">
            <el-option
              v-for="(item, key, index) in camera"
              :key="index"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称：" prop="equ_name">
          <el-input v-model="form.equ_name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备描述：">
          <el-input v-model="form.equ_desc" placeholder="请输入设备描述" />
        </el-form-item>
        <el-form-item label="安装学校：" prop="scl_id">
          <template v-if="form.type === 'add'">
            <div class="send-obj-item" @click="handleSchool(2)">
              <template v-if="select_school.scl_id">
                <span class="send-obj-block send-active">{{ select_school.scl_name }}</span>
              </template>
              <template v-else>
                <span class="send-obj-block">请选择安装学校</span>
              </template>
              <i class="el-icon-arrow-down send-obj-icon" />
            </div>
          </template>
          <template v-else>
            <el-input v-model="select_school.scl_name" :disabled="true" />
          </template>
        </el-form-item>
        <el-form-item label="设备位置：" prop="equ_position">
          <el-input v-model="form.equ_position" placeholder="请输入设备位置" />
        </el-form-item>
        <el-form-item label="设备坐标：" prop="equ_coordinate">
          <span class="spp-btn" @click="mapVisible = true">选择坐标</span>
          <span class="coords-txt">{{ form.equ_coordinate }}</span>
        </el-form-item>
        <el-form-item label="应用场景：" prop="camera_use_type">
          <el-select v-model="form.camera_use_type" class="select_provinces" placeholder="请选择应用场景">
            <el-option
              v-for="(item, key, index) in use_type"
              :key="index"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备提供方：" prop="provider_type">
          <el-radio-group v-model="form.provider_type">
            <el-radio v-for="(item, key, index) in provider" :key="index" :label="key">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备厂商：" prop="equ_vender">
          <el-select v-model="form.equ_vender" class="select_provinces" placeholder="请选择设备厂商">
            <el-option
              v-for="(item, key, index) in vendor"
              :key="index"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="http-flv地址：">
          <el-input v-model="form.httpflv" :rows="3" resize="none" type="textarea" placeholder="请输入http-flv地址" />
        </el-form-item>
        <el-form-item label="hls地址：">
          <el-input v-model="form.hls" :rows="3" resize="none" type="textarea" placeholder="请输入hls地址" />
        </el-form-item>
        <el-form-item label="rtmp地址：">
          <el-input v-model="form.rtmp" :rows="3" resize="none" type="textarea" placeholder="请输入rtmp地址" />
        </el-form-item>
        <el-form-item label="rtsp地址：">
          <el-input v-model="form.rtsp" :rows="3" resize="none" type="textarea" placeholder="请输入rtsp地址" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="editVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmit()">保存</span>
      </span>
    </el-dialog>
    <!-- 设备详情 -->
    <el-dialog
      title="设备详情"
      :visible="detailVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="have_scroll_dialog"
      @close="handleClose"
    >
      <equipment-details
        v-if="detailVisible"
        :detail-type="1"
        :center="camera_info.center"
        :markers="markers1"
        :info="camera_info"
        @handleEditCoords="handleEditCoords"
        @getLocation="handleGetLocation"
      />
    </el-dialog>
    <!-- 选择地选择坐标 -->
    <el-dialog
      title="选择坐标"
      :append-to-body="true"
      :visible="mapVisible"
      :custom-class="'default-big-size'"
      :close-on-click-modal="false"
      @close="handleCancelCoords"
    >
      <select-coords v-if="mapVisible" :coords-type="2" :markers.sync="markers" :center="center" @clickCoords="handleCoords" @getLocation="handleGetLocation" />
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="mapVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="handleSelectCoords()">保存</span>
      </span>
    </el-dialog>
    <!-- 选择学校 -->
    <el-dialog
      title="选择学校"
      :append-to-body="true"
      :visible.sync="schoolVisible"
      :custom-class="'default-table-size'"
      :close-on-click-modal="false"
    >
      <select-school v-if="schoolVisible" :type="school_type" :select="school_type === 1 ? search_school : select_school" @selectSchool="handleSelectSchool" />
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import SelectCoords from '@/components/SelectCoords'
import SelectSchool from '@/components/SelectSchool'
import EquipmentDetails from './equipment_details'
import { decrypt, httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'
export default {
  name: 'Camera',
  components: { Pagination, SelectCoords, SelectSchool, EquipmentDetails },
  data() {
    return {
      height: window.innerHeight - 160,
      markers: [
        {
          id: 1,
          top: '0',
          left: '0',
          status: false,
          position: ['113.730000', '34.768000']
        }
      ],
      markers1: [],
      center: ['113.731372', '34.768085'],
      lnglat: {
        lng: '113.730000',
        lat: '34.768000'
      },
      auth: {},
      total: 0,
      search: {
        equ_no: '', // 设备编号
        equ_type: '', // 设备类型
        scl_id: '', // 学校标识
        provider_type: '', // 设备提供方
        equ_vender: '', // 设备厂商
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      provider: [], // 设备提供商
      vendor: [], // 设备厂商
      camera: [], // 设备类型
      use_type: [], // 应用场景
      camera_info: {}, // 详情
      school_type: 0,
      search_school: {
        scl_id: '',
        scl_name: ''
      }, // 搜索选择学校
      select_school: {
        scl_id: '',
        scl_name: ''
      }, // 选择学校
      camera_list: [], // 列表
      mapVisible: false,
      editVisible: false,
      detailVisible: false,
      schoolVisible: false,
      form: {
        title: '新增摄像头',
        type: 'add',
        equ_id: '',
        equ_type: '', // 设备类型
        equ_name: '', // 设备名称
        equ_desc: '', // 设备描述
        scl_id: '', // 学校标识
        equ_position: '', // 设备安装位置
        equ_coordinate: '', // 设备坐标
        camera_use_type: '', // 应用场景：【字典】
        provider_type: '', // 设备提供方【字典】
        equ_vender: '', // 设备厂商【字典】
        httpflv: '', // httpflv地址
        hls: '',
        rtmp: '', // rtmp地址
        rtsp: '' // rtsp地址
      },
      rules: {
        equ_type: [
          { required: true, message: '请选择设备类型', trigger: 'blur' }
        ],
        equ_name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        scl_id: [
          { required: true, message: '请选择安装学校', trigger: 'blur' }
        ],
        equ_position: [
          { required: true, message: '请输入设备位置', trigger: 'blur' }
        ],
        equ_coordinate: [
          { required: true, message: '请选择设备坐标', trigger: 'blur' }
        ],
        camera_use_type: [
          { required: true, message: '请选择应用场景', trigger: 'blur' }
        ],
        provider_type: [
          { required: true, message: '请选择设备提供方', trigger: 'blur' }
        ],
        equ_vender: [
          { required: true, message: '请选择设备厂商', trigger: 'blur' }
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
    editVisible(val) {
      if (val) {
        this.form.title = this.form.type === 'add' ? '新增摄像头' : '编辑摄像头'
      }
      if (!val) {
        this.select_school.scl_id = ''
        this.select_school.scl_name = ''
        Object.assign(this.$data.form, this.$options.data().form)
        this.$refs['form'].clearValidate()
      }
      this.$nextTick(() => {
        this.$refs.edit.$refs.dialog.children[1].scrollTop = 0
      })
    }
  },
  created() {
    this.permissionAuth()
    this.handleGetType()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {
      this.auth.save = this.permission.indexOf('/api/pajx/camera/save')
      this.auth.update = this.permission.indexOf('/api/pajx/camera/update')
      this.auth.detail = this.permission.indexOf('/api/pajx/camera/detail')
      this.auth.delete = this.permission.indexOf('/api/pajx/camera/delete')
    },
    // 获取类型
    handleGetType() {
      var p1 = httpRequest('/api/sys/dic/equ/provider', {}, false) // 设备提供商
      var p2 = httpRequest('/api/sys/dic/equ/vendor', {}, false) // 设备厂商
      var p3 = httpRequest('/api/sys/dic/equ/type/camera', {}, false) // 设备类型
      var p4 = httpRequest('/api/sys/dic/equ/camera/use', {}, false) // 应用场景
      Promise.all([p1, p2, p3, p4]).then((data) => {
        this.provider = JSON.parse(decrypt(data[0].data))
        this.vendor = JSON.parse(decrypt(data[1].data))
        this.camera = JSON.parse(decrypt(data[2].data))
        this.use_type = JSON.parse(decrypt(data[3].data))
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
    resetData() {
      this.school_type = 0
      this.search_school.scl_id = ''
      this.search_school.scl_name = ''
      Object.assign(this.$data.search, this.$options.data().search)
    },
    fetchData() {
      this.search.scl_id = this.search_school.scl_id
      httpRequest('/api/pajx/camera/paginate', this.search).then(res => {
        const data = JSON.parse(decrypt(res.data))
        const camera_list = data.records
        this.total = data.total
        this.camera_list = camera_list
      })
    },
    handleUpdate(data) {
      this.form.type = 'edit'
      httpRequest('/api/pajx/camera/detail', {
        equ_id: data.equ_id
      }, false).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.form.equ_type = data.equ_type
        this.form.equ_name = data.equ_name
        this.form.equ_desc = data.equ_desc
        this.form.scl_id = data.scl_id
        this.form.equ_position = data.equ_position
        this.form.equ_coordinate = data.equ_coordinate
        this.form.camera_use_type = data.camera_use_type
        this.form.provider_type = data.provider_type
        this.form.equ_vender = data.equ_vender
        this.form.httpflv = data.httpflv
        this.form.hls = data.hls
        this.form.rtmp = data.rtmp
        this.form.rtsp = data.rtsp
        this.form.equ_id = data.equ_id
        this.select_school.scl_id = data.scl_id
        this.select_school.scl_name = data.scl_name
        var str = this.form.equ_coordinate.split(',')
        this.markers[0].position[0] = str[0]
        this.markers[0].position[1] = str[1]
        this.center[0] = str[0]
        this.center[1] = str[1]
        this.editVisible = true
      })
    },
    handleDetail(data) {
      httpRequest('/api/pajx/camera/detail', {
        equ_id: data.equ_id
      }, false).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.camera_info = { ...this.camera_info, ...data }
        this.$set(this.camera_info, 'center', this.camera_info.equ_coordinate.split(','))
        this.markers1 = [{
          id: 1,
          top: '0',
          left: '0',
          status: false,
          position: this.camera_info.center
        }]
        this.detailVisible = true
      })
    },
    handleDel(data) {
      this.$confirm('确认要删除该摄像头设备吗？', '提示', {
        title: '删除提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/pajx/camera/delete', {
          equ_id: data.equ_id
        }, false).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.queryData()
        })
      }).catch(() => {})
    },
    handleSchool(type) {
      this.school_type = type
      this.schoolVisible = true
    },
    // 关闭学校弹框
    // handleCancelSchool() {
    //   if (this.school_type === 1) {
    //     this.search_school.scl_id = ''
    //     this.search_school.scl_name = ''
    //   } else {
    //     this.select_school.scl_id = ''
    //     this.select_school.scl_name = ''
    //   }
    //   this.schoolVisible = false
    // },
    handleSelectSchool(data) {
      if (this.school_type === 1) {
        this.search_school.scl_id = data.scl_id
        this.search_school.scl_name = data.scl_name
        this.queryData()
      } else {
        this.select_school.scl_id = data.scl_id
        this.select_school.scl_name = data.scl_name
      }
      this.schoolVisible = false
    },
    handleCoords(data) {
      this.markers = []
      this.markers.push({
        id: 1,
        top: '0',
        left: '0',
        status: false,
        position: [data.lng, data.lat]
      })
      this.lnglat.lng = data.lng
      this.lnglat.lat = data.lat
    },
    // 取消坐标
    handleCancelCoords() {
      if (this.form.equ_coordinate) {
        var str = this.form.equ_coordinate.split(',')
        this.center = [str[0].toString(), str[1].toString()]
        this.markers[0].position[0] = str[0].toString()
        this.markers[0].position[1] = str[1].toString()
      } else {
        this.center = ['113.731372', '34.768085']
        this.markers[0].position = ['113.730000', '34.768000']
      }
      this.mapVisible = false
    },
    handleSelectCoords() {
      this.form.equ_coordinate = this.lnglat.lng + ',' + this.lnglat.lat
      this.center = [this.lnglat.lng.toString(), this.lnglat.lat.toString()]
      this.markers[0].position[0] = this.lnglat.lng.toString()
      this.markers[0].position[1] = this.lnglat.lat.toString()
      this.mapVisible = false
    },
    handleEditCoords(data) {
      if (data.type === 1) {
        this.markers1 = []
        this.markers1.push({
          id: 1,
          top: '0',
          left: '0',
          status: false,
          position: [data.str.lng, data.str.lat]
        })
      } else if (data.type === 2) {
        this.markers1 = []
        this.markers1.push({
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
        this.markers1 = []
        this.markers1.push({
          id: 1,
          top: '0',
          left: '0',
          status: false,
          position: [str[0], str[1]]
        })
        this.camera_info.center = [str[0], str[1]]
      }
    },
    handleClose() {
      this.detailVisible = false
    },
    handleGetLocation(data) {
      this.center = [data.lng, data.lat]
    },
    onSubmit() {
      this.form.scl_id = this.select_school.scl_id
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.school_type = 0
          this.select_school.scl_id = ''
          this.select_school.scl_name = ''
          var data = {
            equ_type: this.form.equ_type,
            equ_name: this.form.equ_name,
            equ_desc: this.form.equ_desc,
            scl_id: this.form.scl_id,
            equ_position: this.form.equ_position,
            equ_coordinate: this.form.equ_coordinate,
            camera_use_type: this.form.camera_use_type,
            provider_type: this.form.provider_type,
            equ_vender: this.form.equ_vender,
            httpflv: this.form.httpflv,
            hls: this.form.hls,
            rtmp: this.form.rtmp,
            rtsp: this.form.rtsp
          }
          var api
          if (this.form.type === 'add') {
            api = '/api/pajx/camera/save'
          } else {
            data.equ_id = this.form.equ_id
            api = '/api/pajx/camera/update'
          }
          httpRequest(api, data, false).then((res) => {
            this.editVisible = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            if (this.search.scl_id !== '') {
              this.queryData()
            }
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
.send-obj-item {
  position: relative;
  width: 100%;
  height: 36px;
  background: #FFFFFF;
  border: 1px solid #dcdfe6;
  border-radius: 18px;
  padding: 0 20px 0 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  cursor: pointer;
  font-size: 14px;

  .send-obj-block {
    color: #c0c4cc !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .send-active {
    color: #313233 !important;
  }

  .send-obj-icon {
    position: absolute;
    top: 10px;
    right: 12px;
    width: 12px;
    height: 12px;
    color: #c0c4cc;
  }
}

.search-item {
  width: 160px !important;
  margin-right: 8px;
}
</style>
