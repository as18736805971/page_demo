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
              <el-input v-model="search.keyword" placeholder="请输入姓名、手机号" clearable />
            </el-form-item>
            <el-form-item>
              <el-select v-model="search.user_role" clearable placeholder="选择职责">
                <el-option label="责任人" :value="0" />
                <el-option label="出警人" :value="1" />
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
          <el-col :span="4" class="left">出警人员列表</el-col>
          <el-col :span="20" class="right">
            <span v-if="auth.save != -1" class="spp-btn spp-btn-primary" @click="editVisible = true">
              <svg-icon icon-class="add_user" />新增人员
            </span>
          </el-col>
        </el-row>
      </div>
      <el-table ref="table" :data="paginate_data" :height="height - 140" size="mini" stripe>
        <el-table-column label="#" type="index" width="60" />
        <el-table-column label="姓名" prop="user_name" align="left" />
        <el-table-column label="联系方式" prop="user_phone" align="left" />
        <el-table-column label="职责划分" prop="user_role_name" align="left" />
        <el-table-column label="绑定设备数量" align="left">
          <template slot-scope="scope">
            <el-button type="text" style="color: #2C2E33;">{{ scope.row.bind_num }}</el-button>
            <el-button v-if="auth.bind != -1 && scope.row.bind_num > 0" type="text" style="color: #3272ff;" @click="handleSee(scope.row)">查看</el-button>
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
    <!-- 新增人员 -->
    <el-dialog
      title="新增人员"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="have_scroll_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{ height: height + 'px' }">
        <el-form ref="form" :model="form" :rules="rules" label-width="110px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="姓名" prop="user_name" class="top_bot_form">
                <el-input v-model="form.user_name" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话" prop="user_phone" class="top_bot_form">
                <el-input v-model="form.user_phone" placeholder="请输入电话" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-form-item label="职位属性" prop="user_role" class="top_bot_form">
                <el-radio-group v-model="form.user_role">
                  <el-radio :label="0">责任人</el-radio>
                  <el-radio :label="1">出警人</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="editVisible = false">取消</span>
        <span
          class="spp-btn spp-btn-primary"
          @click="onSubmit()"
        >保存</span>
      </div>
    </el-dialog>
    <!-- 人员绑定设备列表 -->
    <el-dialog
      title="人员绑定设备列表"
      :visible.sync="seeDetail"
      :close-on-click-modal="false"
      width="720px"
      custom-class="have_scroll_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{ height: height + 'px' }">
        <div class="card-list">
          <div v-for="(item, index) in equipment_list" :key="index" class="card-item">
            <div class="item-top">
              <div class="left-top">
                <img class="demo-icon" :src="item.equ_flag == '1' ? require('@/assets/images/round_demo.png') : require('@/assets/images/round_video.png')">
                {{ item.equ_name }}
              </div>
              <el-button v-if="item.on_flag == '1'" style="color: #00BD79" type="text">在线</el-button>
              <el-button v-else style="color: #909399" type="text">离线</el-button>
            </div>
            <div class="item-center">
              <div class="center-item">
                <div class="item-txt right">
                  <div class="txt-title">设备编号：</div>
                  <div class="txt-desc">{{ item.equ_no }}</div>
                </div>
                <div class="item-txt">
                  <div class="txt-title">设备添加时间：</div>
                  <div class="txt-desc">{{ item.create_time | formatDate }}</div>
                </div>
              </div>
              <div class="center-item">
                <div class="item-txt">
                  <div class="txt-title">设备位置：</div>
                  <div class="txt-desc">{{ item.equ_position }}</div>
                </div>
              </div>
            </div>
            <div class="item-footer">
              <span v-if="auth.camera != -1 && item.equ_flag == '0'" class="see-block" @click="handleDetail(item.equ_id, 0)">查看</span>
              <span v-if="auth.audio != -1 && item.equ_flag == '1'" class="see-block" @click="handleDetail(item.equ_id, 1)">查看</span>
            </div>
          </div>
        </div>
      </el-scrollbar>
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
          :detail-type="detail_info.detail_type"
          :markers="markers"
          :info="detail_info"
          @getLocation="handleGetLocation"
          @handleEditCoords="handleEditCoords"
          @handlePlay="handleAudio"
        />
      </el-scrollbar>
    </el-dialog>
    <!-- 播放音频 -->
    <el-dialog
      title="播放音频"
      :visible.sync="audioVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="volume-audio"
    >
      <audio-play v-if="audioVisible" ref="audio_play" :audio-url="detail_info.audio_url" />
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
import EquipmentDetails from '@/components/EquipmentDetails'
import { mapState } from 'vuex'
import { decrypt, httpRequest } from '@/utils/auth'
import AudioPlay from '@/components/Audio'
import SelectSchool from '@/components/SelectSchool'
export default {
  name: 'Personnel',
  components: { Pagination, EquipmentDetails, AudioPlay, SelectSchool },
  data() {
    return {
      login_role: Number(JSON.parse(decrypt(sessionStorage.getItem('login_role'))).login_user_type),
      height: window.innerHeight - 98,
      auth: {},
      markers: [],
      search: {
        keyword: '',
        user_role: '', // 职责
        scl_id: '',
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      select_school: {
        scl_id: '',
        scl_name: ''
      }, // 选择学校
      equipment_list: [],
      seeDetail: false,
      editVisible: false,
      audioVisible: false,
      detailVisible: false,
      schoolVisible: false,
      paginate_data: [],
      detail_info: {},
      total: 0,
      form: {
        user_name: '',
        user_phone: '',
        user_role: 0 // 0-责任人，1-出警人
      },
      rules: {
        user_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        user_phone: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ],
        user_role: [
          { required: true, message: '请选择职位属性', trigger: 'blur' }
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
      if (!val) {
        Object.assign(this.$data.form, this.$options.data().form)
        this.$refs['form'].clearValidate()
      }
    }
  },
  mounted() {
    this.permissionAuth()
    this.queryData()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {
      this.auth.save = this.permission.indexOf('/api/pajx/scl/puser/save')
      this.auth.bind = this.permission.indexOf('/api/pajx/scl/puser/bind')
      this.auth.camera = this.permission.indexOf('/api/pajx/scl/puser/camera')
      this.auth.audio = this.permission.indexOf('/api/pajx/scl/puser/audio')
    },
    // 选择学校
    handleSelectSchool(data) {
      this.select_school.scl_id = data.scl_id
      this.select_school.scl_name = data.scl_name
      this.search.scl_id = data.scl_id
      this.search.user_role = ''
      this.schoolVisible = false
      this.queryData()
    },
    handleCloseSchool() {
      this.select_school.scl_id = ''
      this.select_school.scl_name = ''
      this.search.scl_id = ''
      this.search.user_role = ''
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
      httpRequest('/api/pajx/scl/puser/paginate', this.search).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.paginate_data = data.records
        this.total = data.total
      })
    },
    handleSee(data) {
      httpRequest('/api/pajx/scl/puser/bind', {
        user_pid: data.user_pid
      }, false).then((res) => {
        this.equipment_list = JSON.parse(decrypt(res.data))
        this.seeDetail = true
      })
    },
    handleDetail(equ_id, type) {
      var api = type === 1 ? '/api/pajx/scl/puser/audio' : '/api/pajx/scl/puser/camera'
      httpRequest(api, {
        equ_id: equ_id
      }, false).then((res) => {
        var info = JSON.parse(decrypt(res.data))
        this.markers = []
        this.detail_info = info || {}
        this.$set(this.detail_info, 'detail_type', type)
        var coordinate = this.detail_info.equ_coordinate.split(',')
        this.$set(this.detail_info, 'center', coordinate)
        this.markers = [{
          id: '10',
          top: '0',
          left: '0',
          status: false,
          position: coordinate
        }]
        if (type === 1) {
          this.$set(this.detail_info, 'equ_id', equ_id)
          this.detail_info.audio_url = this.detail_info.audio_url ? process.env.VUE_APP_BASE_API + this.detail_info.audio_url : ''
        }
        this.detailVisible = true
      })
    },
    handleGetLocation(data) {
      this.detail_info.center = [data.lng, data.lat]
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
        this.detail_info.center = [data.str.lng, data.str.lat]
        this.detail_info.equ_coordinate = data.str.lng + ',' + data.str.lat
      } else {
        var str = this.detail_info.equ_coordinate.split(',')
        this.markers = []
        this.markers.push({
          id: 10,
          top: '0',
          left: '0',
          status: false,
          position: [str[0], str[1]]
        })
        this.detail_info.center = [str[0], str[1]]
      }
    },
    handleAudio() {
      if (this.detail_info.audio_url) {
        this.audioVisible = true
      } else {
        this.$message({
          message: '无音频播放地址',
          type: 'error'
        })
      }
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          httpRequest('/api/pajx/scl/puser/save', this.form, false).then((res) => {
            this.editVisible = false
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

<style lang="scss">
.card-list {
  margin-top: 17px;

  .card-item {
    width: 100%;
    padding: 16px;
    background: #FFFFFF;
    border: 1px solid #E1E3E6;
    border-radius: 4px;
    margin-bottom: 16px;

    .item-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 25px;
      margin-bottom: 18px;

      .left-top {
        display: flex;
        align-items: center;
        height: 25px;
        font-weight: 600;
        font-size: 18px;
        color: #2C2E33;
      }

      .demo-icon {
        width: 20px;
        height: 20px;
        margin-right: 6px;
      }

      .right-top {
        font-weight: 400;
        font-size: 14px;
        color: #909399;
        letter-spacing: 0;
      }
    }

    .item-center {
      .center-item {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .item-txt {
          display: flex;
          align-items: center;
          height: 40px;
          font-weight: 400;
          font-size: 14px;

          .txt-title {
            color: #5E6166;
          }

          .txt-desc {
            color: #2C2E33;
          }
        }

        .right {
          margin-right: 20px;
        }
      }
    }

    .item-footer {
      width: 100%;
      display: flex;
      justify-content: flex-end;

      .see-block {
        display: block;
        padding: 0 10px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: #F9FAFC;
        border: 1px solid #E1E2E6;
        border-radius: 2px;
        font-weight: 400;
        font-size: 14px;
        color: #5E6166;
        cursor: pointer;
      }
    }
  }

  .card-item:last-child {
    margin-bottom: 0;
  }
}

.edit-block {
  width: 76px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  background: #F9FAFC;
  border: 1px solid #E1E2E6;
  border-radius: 2px;
  font-weight: 400;
  font-size: 14px;
  color: #5E6166;
  cursor: pointer;
}

.video-block {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 78px;
  height: 24px;
  background: #3272FF;
  border-radius: 2px;
  font-weight: 400;
  font-size: 12px;
  color: #FFFFFF;
  cursor: pointer;

  .video-icon {
    width: 10px;
    height: 10px;
    margin-right: 4px;
  }
}

.status-equipment {
  border: 1px solid #E1E3E6;

  ::v-deep .el-table--small th {
    padding: 0 !important;
  }
}

.volume-audio {
  left: 50% !important;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 150px !important;
  overflow-y: hidden !important;
}
</style>
