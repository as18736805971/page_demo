<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="12" class="header_left">
          <span v-if="auth.save != -1" class="spp-btn-add spp-btn-primary" @click="editVisible = true"><svg-icon icon-class="add_dept" />新增AI BOX设备</span>
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
      <el-table ref="table" :data="box_list" :height="height - 80" size="mini" strip>
        <el-table-column label="序号" type="index" width="60" align="left" />
        <el-table-column label="设备编号" prop="equ_no" align="left" />
        <el-table-column label="设备名称" prop="equ_name" align="left" />
        <el-table-column label="设备类型" prop="equ_type_name" align="left" />
        <el-table-column label="设备位置" prop="equ_position" align="left" />
        <el-table-column label="创建时间" width="160" align="left">
          <template slot-scope="scope">
            {{ scope.row.create_time | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleSeeCamera(scope.row)">查看摄像头</el-button>
            <el-button v-if="auth.update != -1" type="text" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button v-if="auth.delete != -1" type="text" style="color: #FF4949" @click="handleDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="search.page_num" :limit.sync="search.page_size" @pagination="handleCurrentChange" />
    </div>
    <!-- 新增编辑盒子 -->
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
        <el-form-item label="设备序列号：" prop="aibox_seial">
          <el-input v-model="form.aibox_seial" placeholder="请输入设备序列号" />
        </el-form-item>
        <el-form-item label="设备注册码：" prop="aibox_register_code">
          <el-input v-model="form.aibox_register_code" placeholder="请输入设备注册码" />
        </el-form-item>
        <el-form-item label="硬盘容量：" prop="aibox_disk_capacity">
          <el-input v-model="form.aibox_disk_capacity" placeholder="请输入硬盘容量" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="editVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmit()">保存</span>
      </span>
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
    <!-- 绑定摄像头 -->
    <el-dialog title="绑定摄像头" :append-to-body="true" :visible.sync="cameraBindVisible" :custom-class="'default-table-size'" :close-on-click-modal="false">
      <el-table
        ref="multipleTable"
        row-key="equ_id"
        :data="camera_list"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="equ_name" label="设备名称" show-overflow-tooltip />
        <el-table-column prop="equ_no" label="设备编号" show-overflow-tooltip />
        <el-table-column label="状态" width="100" align="left">
          <template slot-scope="scope">
            <el-button :style="{ color: scope.row.online_flag == '1' ? '#14BC6C' : '#939499' }" type="text">
              {{ scope.row.online_flag == '1' ? '在线' : '离线' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="cameraBindVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="cameraBindSubmit()">保存</span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import SelectCoords from '@/components/SelectCoords'
import SelectSchool from '@/components/SelectSchool'
import { decrypt, httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'
export default {
  name: 'Box',
  components: { Pagination, SelectCoords, SelectSchool },
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
      camera_info: {}, // 详情
      select_camera: [], // 选择摄像头
      select_edu_id: '',
      camera_list: [],
      school_type: 0,
      search_school: {
        scl_id: '',
        scl_name: ''
      }, // 搜索选择学校
      select_school: {
        scl_id: '',
        scl_name: ''
      }, // 选择学校
      box_list: [], // 列表
      mapVisible: false,
      editVisible: false,
      detailVisible: false,
      schoolVisible: false,
      cameraBindVisible: false,
      form: {
        title: '新增AI BOX设备',
        type: 'add',
        equ_id: '',
        equ_type: '', // 设备类型
        equ_name: '', // 设备名称
        scl_id: '', // 学校标识
        equ_position: '', // 设备安装位置
        equ_coordinate: '', // 设备坐标
        provider_type: '', // 设备提供方【字典】
        equ_vender: '', // 设备厂商【字典】
        aibox_seial: '', // 设备序列号
        aibox_register_code: '', // 设备注册码
        aibox_disk_capacity: '' // 硬盘容量
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
        this.form.title = this.form.type === 'add' ? '新增AI BOX设备' : '编辑AI BOX设备'
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
      this.auth.save = this.permission.indexOf('/api/pajx/aibox/save')
      this.auth.update = this.permission.indexOf('/api/pajx/aibox/update')
      this.auth.delete = this.permission.indexOf('/api/pajx/aibox/delete')
    },
    // 获取类型
    handleGetType() {
      var p1 = httpRequest('/api/sys/dic/equ/provider', {}, false) // 设备提供商
      var p2 = httpRequest('/api/sys/dic/equ/vendor', {}, false) // 设备厂商
      var p3 = httpRequest('/api/sys/dic/equ/type/camera', {}, false) // 设备类型
      Promise.all([p1, p2, p3]).then((data) => {
        this.provider = JSON.parse(decrypt(data[0].data))
        this.vendor = JSON.parse(decrypt(data[1].data))
        this.camera = JSON.parse(decrypt(data[2].data))
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
      httpRequest('/api/pajx/aibox/paginate', this.search).then(res => {
        const data = JSON.parse(decrypt(res.data))
        const box_list = data.records
        this.total = data.total
        this.box_list = box_list
      })
    },
    handleUpdate(data) {
      this.form.type = 'edit'
      httpRequest('/api/pajx/aibox/detail', {
        equ_id: data.equ_id
      }, false).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.form.equ_type = data.equ_type
        this.form.equ_name = data.equ_name
        this.form.scl_id = data.scl_id
        this.form.equ_position = data.equ_position
        this.form.equ_coordinate = data.equ_coordinate
        this.form.provider_type = data.provider_type
        this.form.equ_vender = data.equ_vender
        this.form.equ_id = data.equ_id
        this.form.aibox_seial = data.aibox_seial
        this.form.aibox_register_code = data.aibox_register_code
        this.form.aibox_disk_capacity = data.aibox_disk_capacity
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
    handleDel(data) {
      this.$confirm('确认要删除该AI BOX设备吗？', '提示', {
        title: '删除提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/pajx/aibox/delete', {
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
            scl_id: this.form.scl_id,
            equ_position: this.form.equ_position,
            equ_coordinate: this.form.equ_coordinate,
            provider_type: this.form.provider_type,
            equ_vender: this.form.equ_vender,
            aibox_seial: this.form.aibox_seial,
            aibox_register_code: this.form.aibox_register_code,
            aibox_disk_capacity: this.form.aibox_disk_capacity
          }
          var api
          if (this.form.type === 'add') {
            api = '/api/pajx/aibox/save'
          } else {
            data.equ_id = this.form.equ_id
            api = '/api/pajx/aibox/update'
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
    },
    handleSeeCamera(data) {
      this.select_edu_id = data.equ_id
      httpRequest('/api/pajx/aibox/bindList', {
        equ_id: data.equ_id,
        scl_id: this.search_school.scl_id
      }).then((res) => {
        this.camera_list = JSON.parse(decrypt(res.data))
        this.$nextTick(() => {
          this.camera_list.forEach((item) => {
            if (Number(item.bind_status) === 1) {
              this.$refs.multipleTable.toggleRowSelection(item, true)
            }
          })
        })
        this.cameraBindVisible = true
      })
    },
    handleSelectionChange(val) {
      this.select_camera = val
    },
    cameraBindSubmit() {
      const arr = []
      this.select_camera.map((item) => {
        arr.push(item.equ_id)
      })
      httpRequest('/api/pajx/cameraAibox/save', {
        aibox_id: this.select_edu_id,
        equ_id: arr.join(',')
      }).then((res) => {
        this.cameraBindVisible = false
        this.$message({
          message: '绑定成功',
          type: 'success'
        })
        this.select_camera = []
        this.select_edu_id = ''
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
