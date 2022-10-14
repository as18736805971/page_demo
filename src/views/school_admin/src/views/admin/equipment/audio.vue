<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 搜索条件 -->
    <div class="header-search single_line">
      <el-form :inline="true" label-width="80px">
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
              <el-input v-model="search.keyword" placeholder="请输入设备名称、设备编码" style="width: 220px" clearable />
            </el-form-item>
            <el-form-item>
              <el-select v-model="search.online_flag" clearable placeholder="选择设备状态">
                <el-option label="离线" :value="0" />
                <el-option label="在线" :value="1" />
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
      <!-- 操作按鈕 -->
      <div class="main-header">
        <el-row :gutter="20">
          <el-col :span="4" class="left">音频设备列表</el-col>
          <el-col :span="20" class="right" />
        </el-row>
      </div>
      <el-table ref="table" :data="paginate_data" :height="height - 140" size="mini" stripe>
        <el-table-column label="#" type="index" width="60" />
        <el-table-column label="设备名称" prop="equ_name" show-overflow-tooltip align="left" />
        <el-table-column label="设备编号" prop="equ_no" align="left" />
        <el-table-column label="设备位置" min-width="250" show-overflow-tooltip prop="equ_position" align="left" />
        <el-table-column label="设备添加时间" min-width="160" align="left">
          <template slot-scope="scope">{{ scope.row.create_time | formatDate }}</template>
        </el-table-column>
        <el-table-column label="出警人" min-width="150" align="left">
          <template slot-scope="scope">
            <div>{{ scope.row.police_name }}</div>
            <div>{{ scope.row.police_phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="责任人" min-width="150" align="left">
          <template slot-scope="scope">
            <div>{{ scope.row.duty_name }}</div>
            <div>{{ scope.row.duty_phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="设备状态" width="100" align="left">
          <template slot-scope="scope">
            <el-button v-if="scope.row.online_flag == 1" style="color: #00BD79" type="text">在线</el-button>
            <el-button v-if="scope.row.online_flag == 0" style="color: #909399" type="text">离线</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170" fixed="right" align="left">
          <template slot-scope="scope">
            <el-button v-if="auth.edit != -1" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="auth.detail != -1" type="text" @click="handleDetail(scope.row)">详情</el-button>
            <el-button v-if="auth.audio != -1 || auth.volume != -1 || auth.police != -1" type="text">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="auth.audio != -1" @click.native="handleAudioSet(scope.row)">音频设定
                  </el-dropdown-item>
                  <el-dropdown-item v-if="auth.volume != -1" @click.native="handleVolumeSet(scope.row)">音量设定
                  </el-dropdown-item>
                  <el-dropdown-item v-if="auth.police != -1" @click.native="handlePoliceInfo(scope.row)">出警信息管理
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
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
      title="编辑音频设备"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="volume-audio-form"
    >
      <el-form ref="form_info" :label-position="'top'" :model="form_info" :rules="rules_info" label-width="10px">
        <el-form-item label="设备名称" prop="equ_name">
          <el-input v-model="form_info.equ_name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备位置">
          <el-input v-model="form_info.equ_position" placeholder="请输入设备位置" />
        </el-form-item>
      </el-form>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="editVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onEditSubmit()">保存</span>
      </div>
    </el-dialog>
    <!-- 设备详情 -->
    <el-dialog
      title="设备详情"
      :visible.sync="detailVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="have_scroll_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{ height: height + 'px' }">
        <equipment-details
          v-if="detailVisible"
          :detail-type="1"
          :markers="markers"
          :info="audio_info"
          @handleEditCoords="handleEditCoords"
          @getLocation="handleGetLocation"
          @handlePlay="handleAudio"
        />
      </el-scrollbar>
    </el-dialog>
    <!-- 音频设定 -->
    <el-dialog
      v-if="audioSet"
      title="音频设定"
      :visible.sync="audioSet"
      :close-on-click-modal="false"
      width="720px"
      custom-class="volume-dialog"
    >
      <el-form label-width="80px">
        <el-form-item label="选择音频">
          <el-select v-model="audio.audio_id" style="width: 250px" clearable placeholder="请选择播放音频" @change="handleChange">
            <el-option
              v-for="(item, index) in audio_list"
              :key="index"
              :label="item.audio_name"
              :value="item.audio_id"
            />
          </el-select>
        </el-form-item>
        <audio-play v-if="audio.audio_url" ref="audio_play" :clear-btn="false" :audio-url="audio.audio_url" />
      </el-form>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="audioSet = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="handleSetAudio()">确定</span>
      </div>
    </el-dialog>
    <!-- 音量设定 -->
    <el-dialog
      v-if="volumeSet"
      title="报警音量设置"
      :visible.sync="volumeSet"
      :close-on-click-modal="false"
      width="720px"
      custom-class="volume-dialog"
    >
      <div class="volume-content">
        <el-slider v-model="volumeNum" style="width: 80%" :min="0" :max="100" />
        <div class="volume-num">{{ volumeNum }}</div>
      </div>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="volumeSet = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="handleSetVolume()">确定</span>
      </div>
    </el-dialog>
    <!-- 出警信息管理 -->
    <el-dialog
      title="出警信息管理"
      :visible.sync="policeVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="volume-form"
    >
      <el-form ref="form" :label-position="'top'" :model="form" :rules="rules" label-width="80px">
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
    <!-- 播放音频 -->
    <el-dialog
      title="播放音频"
      :visible.sync="audioVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="volume-audio"
    >
      <audio-play v-if="audioVisible" ref="audio_play" :audio-url="audio_info.audio_url" />
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
import Pagination from '@/components/Pagination'
import AudioPlay from '@/components/Audio'
import EquipmentDetails from '@/components/EquipmentDetails'
import SelectSchool from '@/components/SelectSchool'
import { mapState } from 'vuex'
import { decrypt, httpRequest } from '@/utils/auth'
export default {
  name: 'Audio',
  components: { AudioPlay, Pagination, EquipmentDetails, SelectSchool },
  data() {
    return {
      login_role: Number(JSON.parse(decrypt(sessionStorage.getItem('login_role'))).login_user_type),
      height: window.innerHeight - 98,
      auth: {},
      markers: [],
      search: {
        keyword: '',
        scl_id: '',
        user_duty_id: '', // 责任人标识
        user_police_id: '', // 出警人标识
        online_flag: '', // 设备在线状态：0-离线，1-在线
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      select_school: {
        scl_id: '',
        scl_name: ''
      }, // 选择学校
      duty_list: [], // 责任人
      police_list: [], // 出警人
      equ_id: '',
      audio: {
        audio_id: '',
        audio_url: ''
      },
      audio_list: [], // 选择音频
      audioSet: false, // 音频设定
      volumeSet: false, // 音量设定
      volumeNum: 0, // 音量值
      editVisible: false,
      policeVisible: false, // 出警信息管理
      audioVisible: false,
      detailVisible: false, // 设备详情
      schoolVisible: false,
      paginate_data: [],
      audio_info: {},
      total: 0,
      form: {
        equ_id: '',
        user_duty_id: '',
        user_police_id: ''
      },
      form_info: {
        equ_id: '',
        equ_name: '',
        equ_position: ''
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
    'audio.audio_id': {
      handler() {
        if (this.audio.audio_id) {
          var has = false
          var url = ''
          for (var item of this.audio_list) {
            if (item.audio_id === this.audio.audio_id) {
              url = item.audio_url
              has = true
              break
            }
          }
          if (has) {
            this.audio.audio_url = process.env.VUE_APP_BASE_API + url
          }
        } else {
          this.audio.audio_url = ''
        }
      },
      deep: true
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
      this.auth.detail = this.permission.indexOf('/api/pajx/scl/audio/detail')
      this.auth.police = this.permission.indexOf('/api/pajx/scl/audio/bind/police')
      this.auth.volume = this.permission.indexOf('/api/pajx/scl/audio/set/volume')
      this.auth.audio = this.permission.indexOf('/api/pajx/scl/audio/bind/audio')
      this.auth.edit = this.permission.indexOf('/api/pajx/scl/audio/edit')
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
      httpRequest('/api/pajx/scl/audio/paginate', this.search).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.paginate_data = data.records
        this.total = data.total
      })
    },
    handleEdit(data) {
      this.form_info.equ_id = data.equ_id
      this.form_info.equ_name = data.equ_name
      this.form_info.equ_position = data.equ_position
      this.editVisible = true
    },
    handleDetail(data) {
      httpRequest('/api/pajx/scl/audio/detail', {
        equ_id: data.equ_id
      }, false).then((res) => {
        var info = JSON.parse(decrypt(res.data))
        this.audio_info = { ...this.audio_info, ...info }
        this.$set(this.audio_info, 'equ_id', data.equ_id)
        var coordinate = this.audio_info.equ_coordinate.split(',')
        this.$set(this.audio_info, 'center', coordinate)
        this.markers = [{
          id: '10',
          top: '0',
          left: '0',
          status: false,
          position: coordinate
        }]
        this.audio_info.audio_url = this.audio_info.audio_url ? process.env.VUE_APP_BASE_API + this.audio_info.audio_url : ''
        this.detailVisible = true
      })
    },
    handleGetLocation(data) {
      this.audio_info.center = [data.lng, data.lat]
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
        this.audio_info.center = [data.str.lng, data.str.lat]
        this.audio_info.equ_coordinate = data.str.lng + ',' + data.str.lat
      } else {
        var str = this.audio_info.equ_coordinate.split(',')
        this.markers = []
        this.markers.push({
          id: 10,
          top: '0',
          left: '0',
          status: false,
          position: [str[0], str[1]]
        })
        this.audio_info.center = [str[0], str[1]]
      }
    },
    handleChange() {
      if (this.audio.audio_url !== '') {
        this.$refs.audio_play.handlePause()
      }
    },
    handleAudio() {
      if (this.audio_info.audio_url) {
        this.audioVisible = true
      } else {
        this.$message({
          message: '无音频播放地址',
          type: 'error'
        })
      }
    },
    handleAudioSet(data) {
      httpRequest('/api/pajx/scl/audio/warn/audio/list', {}, false).then((res) => {
        this.audio_list = JSON.parse(decrypt(res.data))
        this.equ_id = data.equ_id
        this.audio.audio_id = data.audio_id || ''
        this.audioSet = true
      })
    },
    handleSetAudio() {
      httpRequest('/api/pajx/scl/audio/bind/audio', {
        equ_id: this.equ_id,
        audio_id: this.audio.audio_id
      }, false).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.equ_id = ''
        this.audio.audio_id = ''
        this.audio.audio_url = ''
        this.audioSet = false
      })
    },
    handleVolumeSet(data) {
      this.equ_id = data.equ_id
      this.volumeNum = Number(data.equ_volume) || 0
      this.volumeSet = true
    },
    handleSetVolume() {
      httpRequest('/api/pajx/scl/audio/set/volume', {
        equ_id: this.equ_id,
        equ_volume: this.volumeNum
      }, false).then((res) => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.equ_id = ''
        this.volumeSet = false
      })
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
          httpRequest('/api/pajx/scl/audio/bind/police', this.form, false).then(res => {
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
          httpRequest('/api/pajx/scl/audio/edit', this.form_info, false).then(res => {
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
.police-list {
  margin-top: 17px;
  width: 100%;

  .police-title {
    height: 20px;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0;
    color: #5E6166;
    margin-bottom: 4px;

    .error-txt {
      color: #FF5555;
    }
  }

  .police-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 60px;
    padding: 0 16px;
    border-radius: 2px;
    background: #F5F7FA;
    margin-bottom: 8px;

    .item-list {
      font-weight: 400;
      font-size: 16px;
      color: #5E6166;
      letter-spacing: 0;
    }

    .del-icon {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }

  .police-btn {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }
}

.volume-content {
  height: 98px;
}

.volume-form {
  left: 50% !important;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 320px !important;
  overflow-y: hidden !important;
}

.volume-dialog {
  left: 50% !important;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 220px !important;
  overflow-y: hidden !important;

  .volume-content {
    display: flex;
    align-items: center;
    justify-content: center;

    .volume-num {
      font-weight: 400;
      font-size: 14px;
      color: #3272FF;
      letter-spacing: 0;
      margin-left: 50px;
    }
  }
}

.volume-audio {
  left: 50% !important;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 150px !important;
  overflow-y: hidden !important;
}

.volume-audio-form {
  left: 50% !important;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 300px !important;
  overflow-y: hidden !important;
}
</style>
