<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="12" class="header_left">
          <span v-if="auth.save != -1" class="spp-btn-add spp-btn-primary" @click="editVisible = true"><svg-icon icon-class="add_dept" />新增音频设备</span>
        </el-col>
        <el-col :span="12" class="header_right search_view">
          <div class="input_view">
            <el-input v-model="search.equNo" placeholder="设备编号" @keyup.enter="queryData" @change="queryData" />
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
        <el-select v-model="search.equType" class="select_provinces" clearable placeholder="选择类型">
          <el-option
            v-for="(item, key, index) in camera"
            :key="index"
            :label="item"
            :value="key"
          />
        </el-select>
        <el-select v-model="search.equVender" class="select_provinces" clearable placeholder="选择设备厂商">
          <el-option
            v-for="(item, key, index) in vendor"
            :key="index"
            :label="item"
            :value="key"
          />
        </el-select>
        <el-select v-model="search.providerType" class="select_provinces" style="width: 160px" clearable placeholder="选择设备提供方">
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
      <el-table ref="table" :data="audio_list" :height="height - 80" size="mini" strip>
        <el-table-column label="序号" type="index" width="60" align="left" />
        <el-table-column label="设备编号" prop="equ_no" width="140" align="left" />
        <el-table-column label="设备名称" prop="equ_name" align="left" />
        <el-table-column label="设备类型" prop="equ_type_name" align="left" />
        <el-table-column label="出警人" width="150" prop="police_name" align="left" />
        <el-table-column label="责任人" width="150" prop="duty_name" align="left" />
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
        <el-table-column label="状态" width="80" align="left">
          <template slot-scope="scope">
            <el-button :style="{ color: scope.row.state == '在线' ? '#14BC6C' : '#939499' }" type="text">
              {{ scope.row.state }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="绑定第三方设备" min-width="160" align="left">
          <template slot-scope="scope">
            {{ scope.row.name }}
            <template v-if="scope.row.bind_status == '0'">
              <el-button style="color: #FF4949;margin-left: 8px" type="text" @click="handleBound(scope.row, 2)">解绑</el-button>
            </template>
            <template v-else>
              <el-button style="color: #4968FF;margin-left: 8px" type="text" @click="handleBound(scope.row, 1)">绑定</el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right" align="right">
          <template slot-scope="scope">
            <el-button v-if="auth.detail != -1" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button v-if="auth.update != -1" type="text" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button v-if="auth.delete != -1" type="text" style="color: #FF4949" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="search.page_num" :limit.sync="search.page_size" @pagination="handleCurrentChange" />
    </div>
    <!-- 新增编辑音频设备 -->
    <el-dialog
      :title="form.title"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="have_scroll_dialog"
    >
      <el-form ref="form" :model="form" :rules="rules" :label-width="'135px'">
        <el-form-item label="设备类型：" prop="equType">
          <el-select v-model="form.equType" class="select_provinces" placeholder="请选择设备类型">
            <el-option
              v-for="(item, key, index) in camera"
              :key="index"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称：" prop="equName">
          <el-input v-model="form.equName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备描述：">
          <el-input v-model="form.equDesc" placeholder="请输入设备描述" />
        </el-form-item>
        <el-form-item label="安装学校：" prop="sclId">
          <template v-if="form.type === 'add'">
            <div class="send-obj-item" @click.stop="handleSchool(2)">
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
        <el-form-item label="设备位置：" prop="equPosition">
          <el-input v-model="form.equPosition" placeholder="请输入设备位置" />
        </el-form-item>
        <el-form-item label="设备坐标：" prop="equCoordinate">
          <span class="spp-btn" @click="mapVisible = true">选择坐标</span>
          <span class="coords-txt">{{ form.equCoordinate }}</span>
        </el-form-item>
        <el-form-item label="设备提供方：" prop="providerType">
          <el-radio-group v-model="form.providerType">
            <el-radio v-for="(item, key, index) in provider" :key="index" :label="key">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备厂商：" prop="equVender">
          <el-select v-model="form.equVender" class="select_provinces" placeholder="请选择设备厂商">
            <el-option
              v-for="(item, key, index) in vendor"
              :key="index"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="绑定第三方设备：" prop="deviceId">
          <el-select v-model="form.deviceId" class="select_provinces" filterable clearable placeholder="请选择绑定第三方设备">
            <el-option
              v-for="(item, index) in devices_list"
              :key="index"
              :label="item.name + ' ( ' + item.alias + ' )'"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="editVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmit()">保存</span>
      </span>
    </el-dialog>
    <!-- 绑定第三方设备 -->
    <el-dialog title="绑定第三方设备" :append-to-body="true" :visible.sync="equipmentVisible" :custom-class="'default-small-size'" :close-on-click-modal="false">
      <el-form :label-position="'left'" label-width="100px">
        <el-form-item label="第三方设备：">
          <el-select v-model="bind.deviceId" filterable clearable placeholder="请选择第三方设备">
            <el-option
              v-for="(item, index) in devices_list"
              :key="index"
              :label="item.name + ' ( ' + item.alias + ' )'"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="equipmentVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="handleSubmit()">保存</span>
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
        :detail-type="2"
        :center="audio_info.center"
        :markers="markers1"
        :info="audio_info"
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
      <select-coords v-if="mapVisible" :coords-type="3" :markers.sync="markers" :center="center" @clickCoords="handleCoords" @getLocation="handleGetLocation" />
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
import SelectSchool from '@/components/SelectSchool'
import SelectCoords from '@/components/SelectCoords'
import EquipmentDetails from './equipment_details'
import { decrypt, httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'
export default {
  name: 'Audio',
  components: { Pagination, SelectCoords, SelectSchool, EquipmentDetails },
  filters: {
    timeFormat(value) {
      var str = value ? value.substr(0, value.indexOf('.')) : ''
      return value ? str.replace('T', ' ') : ''
    }
  },
  data() {
    return {
      height: window.innerHeight - 160,
      center: ['113.731372', '34.768085'],
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
      lnglat: {
        lng: '113.730000',
        lat: '34.768000'
      },
      auth: {},
      total: 0,
      search: {
        sclId: '', // 学校名
        equNo: '', // 设备编号
        equType: '', // 设备类型
        providerType: '', // 设备提供方
        equVender: '', // 设备厂家
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      provider: [], // 设备提供商
      vendor: [], // 设备厂商
      camera: [], // 设备类型
      devices_list: [], // 第三方设备
      audio_info: {}, // 详情
      school_type: 0,
      search_school: {
        scl_id: '',
        scl_name: ''
      }, // 搜索选择学校
      select_school: {
        scl_id: '',
        scl_name: ''
      }, // 选择学校
      audio_list: [],
      mapVisible: false,
      editVisible: false,
      detailVisible: false,
      schoolVisible: false,
      equipmentVisible: false, // 绑定第三方设备
      bind: {
        equId: '',
        deviceId: ''
      },
      form: {
        title: '新增音频设备',
        type: 'add',
        equId: '', // 设备id
        equType: '', // 设备类型
        equName: '', // 设备名
        equDesc: '', // 设备描述
        sclId: '', // 学校id
        equPosition: '', // 设备位置
        equCoordinate: '', // 设备坐标
        providerType: '', // 设备提供方
        equVender: '', // 设备厂商编码
        deviceId: '' // 第三方设备id
      },
      rules: {
        equType: [
          { required: true, message: '请选择设备类型', trigger: 'blur' }
        ],
        equName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        sclId: [
          { required: true, message: '请选择安装学校', trigger: 'blur' }
        ],
        equPosition: [
          { required: true, message: '请输入设备位置', trigger: 'blur' }
        ],
        equCoordinate: [
          { required: true, message: '请选择设备坐标', trigger: 'blur' }
        ],
        providerType: [
          { required: true, message: '请选择设备提供方', trigger: 'blur' }
        ],
        equVender: [
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
        this.form.title = this.form.type === 'add' ? '新增音频设备' : '编辑音频设备'
      }
      if (!val) {
        this.select_school.scl_id = ''
        this.select_school.scl_name = ''
        Object.assign(this.$data.form, this.$options.data().form)
        this.$refs['form'].clearValidate()
      }
    }
  },
  created() {
    this.permissionAuth()
    this.handleGetType()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {
      this.auth.save = this.permission.indexOf('/api/sys/audioInfo/insert')
      this.auth.update = this.permission.indexOf('/api/sys/audioInfo/updateAudioInfo')
      this.auth.detail = this.permission.indexOf('/api/sys/audioInfo/info')
      this.auth.delete = this.permission.indexOf('/api/sys/audioInfo/deleteById')
    },
    // 获取类型
    handleGetType() {
      var p1 = httpRequest('/api/sys/dic/equ/provider', {}, false) // 设备提供方
      var p2 = httpRequest('/api/sys/dic/equ/vendor', {}, false) // 设备厂商
      var p3 = httpRequest('/api/sys/dic/sound/equ/type', {}, false) // 设备类型
      var p4 = httpRequest('/api/sys/jiaren/list', {}, false) // 第三方设备
      Promise.all([p1, p2, p3, p4]).then((data) => {
        this.provider = JSON.parse(decrypt(data[0].data))
        this.vendor = JSON.parse(decrypt(data[1].data))
        this.camera = JSON.parse(decrypt(data[2].data))
        this.devices_list = JSON.parse(decrypt(data[3].data))
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
      this.search.sclId = this.search_school.scl_id
      httpRequest('/api/sys/audioInfo/paginate', this.search).then(res => {
        const data = JSON.parse(decrypt(res.data))
        this.total = data.total
        this.audio_list = data.records
      })
    },
    handleBound(data, type) {
      if (type === 1) {
        this.bind.equId = data.equ_id
        this.equipmentVisible = true
      } else {
        httpRequest('/api/sys/audioInfo/unbindThirdDevice', {
          equId: data.equ_id
        }, false).then(res => {
          this.$message({
            message: '解绑成功',
            type: 'success'
          })
          this.queryData()
        })
      }
    },
    handleUpdate(data) {
      this.form.type = 'edit'
      httpRequest('/api/sys/audioInfo/info', {
        equId: data.equ_id
      }, false).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.form.equType = data.equ_type
        this.form.equName = data.equ_name
        this.form.equDesc = data.equ_desc
        this.form.sclId = data.scl_id
        this.form.equPosition = data.equ_position
        this.form.equCoordinate = data.equ_coordinate
        this.form.providerType = data.provider_type
        this.form.equVender = data.equ_vender
        this.form.deviceId = data.device_id
        this.form.equId = data.equ_id // id
        this.select_school.scl_id = data.scl_id
        this.select_school.scl_name = data.scl_name
        var str = this.form.equCoordinate.split(',')
        this.markers[0].position[0] = str[0]
        this.markers[0].position[1] = str[1]
        this.center = [str[0], str[1]]
        this.editVisible = true
      })
    },
    handleDetail(data) {
      httpRequest('/api/sys/audioInfo/info', {
        equId: data.equ_id
      }, false).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.audio_info = { ...this.audio_info, ...data }
        this.$set(this.audio_info, 'center', this.audio_info.equ_coordinate.split(','))
        this.markers1 = [{
          id: 1,
          top: '0',
          left: '0',
          status: false,
          position: this.audio_info.center
        }]
        this.detailVisible = true
      })
    },
    handleDel(data) {
      this.$confirm('确认要删除该音频设备吗？', '提示', {
        title: '删除提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/sys/audioInfo/deleteById', {
          equId: data.equ_id
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
      if (this.form.equCoordinate) {
        var str = this.form.equCoordinate.split(',')
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
      this.form.equCoordinate = this.lnglat.lng + ',' + this.lnglat.lat
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
        this.audio_info.center = [data.str.lng, data.str.lat]
        this.audio_info.equ_coordinate = data.str.lng + ',' + data.str.lat
      } else {
        var str = this.audio_info.equ_coordinate.split(',')
        this.markers1 = []
        this.markers1.push({
          id: 1,
          top: '0',
          left: '0',
          status: false,
          position: [str[0], str[1]]
        })
        this.audio_info.center = [str[0], str[1]]
      }
    },
    handleClose() {
      this.detailVisible = false
    },
    handleGetLocation(data) {
      this.center = [data.lng, data.lat]
    },
    handleSubmit() {
      httpRequest('/api/sys/audioInfo/bindThirdDevice', {
        equId: this.bind.equId,
        deviceId: this.bind.deviceId
      }, false).then((res) => {
        this.bind.equId = ''
        this.bind.deviceId = ''
        this.equipmentVisible = false
        this.$message({
          message: '绑定成功',
          type: 'success'
        })
        this.queryData()
      })
    },
    onSubmit() {
      this.form.sclId = this.select_school.scl_id
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.school_type = 0
          this.select_school.scl_id = ''
          this.select_school.scl_name = ''
          var data = {
            equType: this.form.equType,
            equName: this.form.equName,
            equDesc: this.form.equDesc,
            sclId: this.form.sclId,
            equPosition: this.form.equPosition,
            equCoordinate: this.form.equCoordinate,
            providerType: this.form.providerType,
            equVender: this.form.equVender,
            deviceId: this.form.deviceId
          }
          var api
          if (this.form.type === 'add') {
            api = '/api/sys/audioInfo/insert'
          } else {
            data.equId = this.form.equId
            api = '/api/sys/audioInfo/updateAudioInfo'
          }
          httpRequest(api, data, false).then((res) => {
            this.editVisible = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            if (this.search.sclId !== '') {
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
