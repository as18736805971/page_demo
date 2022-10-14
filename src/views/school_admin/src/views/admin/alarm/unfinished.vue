<template>
  <div class="app-container page-container right-side-dialog">
    <page-map v-if="map_show" :page-type="1" :center="center" :markers="markers" @getLocation="handleGetLocation" @handleClick="handleDownMap" />
    <div class="btn-list">
      <div class="top-show" @click="map_show = !map_show">
        <img v-if="map_show" class="top-icon" src="@/assets/images/top.png">
        <img v-else class="top-icon" src="@/assets/images/down.png">
      </div>
      <div v-for="(item, index) in status_list" :key="index" :class="index === status_index ? 'btn-active' : ''" class="btn-item" @click="handleCutStatus(index)">
        <div class="item-txt">{{ item.title }}</div>
        <div class="num-txt" :style="{color: item.color}">{{ item.num }}</div>
      </div>
    </div>
    <!-- 搜索条件 -->
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="80px">
        <div class="form-area">
          <div class="search_view">
            <el-form-item style="width: 380px !important;">
              <el-date-picker
                v-model="select_date"
                type="datetimerange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
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
              <el-select v-model="search.equ_no" filterable clearable placeholder="请选择设备">
                <el-option
                  v-for="(item, index) in equipment_list"
                  :key="index"
                  :label="item.equ_name + ' (' + item.equ_no + ')'"
                  :value="item.equ_no"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="search.equ_position"
                placeholder="请输入设备位置查询"
                clearable
              />
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
      <el-table
        ref="table"
        :data="paginate_data"
        :height="map_show ? height - 435 : height - 140"
        size="mini"
        stripe
        :row-class-name="tableRowClassName"
      >
        <el-table-column label="#" type="index" width="60" />
        <el-table-column label="事件ID" min-width="210" prop="event_id" align="left" />
        <el-table-column label="设备名称" prop="equ_name" show-overflow-tooltip align="left" />
        <el-table-column label="设备编号" min-width="120" align="left">
          <template slot-scope="scope">
            <el-button type="text" style="color: #3272FF">{{ scope.row.equ_no }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="设备位置" prop="equ_position" show-overflow-tooltip min-width="160" align="left" />
        <el-table-column label="出警人" min-width="100" align="left">
          <template slot-scope="scope">
            <div>{{ scope.row.police_name }}</div>
            <div>{{ scope.row.police_phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="责任人" min-width="100" align="left">
          <template slot-scope="scope">
            <div>{{ scope.row.duty_name }}</div>
            <div>{{ scope.row.duty_phone }}</div>
          </template>
        </el-table-column>
        <el-table-column label="记录时间" min-width="155" align="left">
          <template slot-scope="scope">{{ scope.row.cur_time | formatDate }}</template>
        </el-table-column>
        <el-table-column label="上报时间" min-width="155" align="left">
          <template slot-scope="scope">{{ scope.row.create_time | formatDate }}</template>
        </el-table-column>
        <el-table-column label="触发方式" min-width="80" align="left">
          <template slot-scope="scope">
            <div v-if="scope.row.trigger_type == '0'" class="way">
              <img class="icon-way" src="@/assets/images/audio.png">
              {{ scope.row.trigger_type_name }}
            </div>
            <div v-else-if="scope.row.trigger_type == '1'" class="way">
              <img class="icon-way" src="@/assets/images/btn.png">
              {{ scope.row.trigger_type_name }}
            </div>
            <div v-else-if="scope.row.trigger_type == '2'" class="way">
              <img class="icon-way" src="@/assets/images/camera.png">
              {{ scope.row.trigger_type_name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="事件状态" min-width="80" align="left">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status_flag == '0'" type="text" style="color: #FF5555">{{ scope.row.status_flag_name }}</el-button>
            <el-button v-if="scope.row.status_flag == '1'" type="text" style="color: #FFA200">{{ scope.row.status_flag_name }}</el-button>
            <el-button v-if="scope.row.status_flag == '2'" type="text" style="color: #909399">{{ scope.row.status_flag_name }}</el-button>
            <el-button v-if="scope.row.status_flag == '3'" type="text" style="color: #34D0F2">{{ scope.row.status_flag_name }}</el-button>
            <el-button v-if="scope.row.status_flag == '4'" type="text" style="color: #00BD79">{{ scope.row.status_flag_name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right" align="left">
          <template slot-scope="scope">
            <el-button v-if="auth.detail != -1" type="text" @click="handleEditStatus(scope.row)">{{ login_role === 6 ? '查看详情' : '查看并处理' }}</el-button>
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
    <!-- 事件详情 -->
    <el-dialog
      v-if="detailVisible"
      :title="'事件详情'"
      :visible.sync="detailVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="have_scroll_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{ height: height + 'px' }">
        <el-form class="school" :label-position="'right'">
          <!-- 事件信息 -->
          <el-row :gutter="24">
            <el-col :span="24">
              <el-divider content-position="left">事件信息</el-divider>
            </el-col>
          </el-row>
          <el-row :gutter="24" class="el-line">
            <el-col :span="24" class="el-item">
              <div class="list-item">
                <div class="item-title">事件ID：</div>
                <div class="item-desc">{{ paginate_info.event_id }}</div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24" class="el-line">
            <el-col :span="12" class="el-item">
              <div class="list-item">
                <div class="item-title">事件状态：</div>
                <div class="item-desc">
                  <el-button v-if="paginate_info.status_flag == '0'" type="text" style="color: #FF5555">{{ paginate_info.status_flag_name }}</el-button>
                  <el-button v-if="paginate_info.status_flag == '1'" type="text" style="color: #FFA200">{{ paginate_info.status_flag_name }}</el-button>
                  <el-button v-if="paginate_info.status_flag == '2'" type="text" style="color: #909399">{{ paginate_info.status_flag_name }}</el-button>
                  <el-button v-if="paginate_info.status_flag == '3'" type="text" style="color: #34D0F2">{{ paginate_info.status_flag_name }}</el-button>
                  <el-button v-if="paginate_info.status_flag == '4'" type="text" style="color: #00BD79">{{ paginate_info.status_flag_name }}</el-button>
                </div>
              </div>
            </el-col>
            <el-col :span="12" class="el-item-left">
              <div class="list-item">
                <div class="item-title">触发方式：</div>
                <div class="item-desc">
                  <div v-if="paginate_info.trigger_type == '0'" class="way">
                    <img class="icon-way" src="@/assets/images/audio.png">
                    {{ paginate_info.trigger_type_name }}
                  </div>
                  <div v-else-if="paginate_info.trigger_type == '1'" class="way">
                    <img class="icon-way" src="@/assets/images/btn.png">
                    {{ paginate_info.trigger_type_name }}
                  </div>
                  <div v-else-if="paginate_info.trigger_type == '2'" class="way">
                    <img class="icon-way" src="@/assets/images/camera.png">
                    {{ paginate_info.trigger_type_name }}
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24" class="el-line">
            <el-col :span="24" class="el-item">
              <div class="list-item">
                <div class="item-title">触发敏感词：</div>
                <div class="item-desc">
                  <div class="desc-txt">{{ paginate_info.keyword }}</div>
                  <div v-if="paginate_info.trigger_type == '2'" class="video-block" @click="handleVideo()">
                    <img class="video-icon" src="@/assets/images/video.png">播放视频
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row v-if="paginate_info.trigger_type == '0' && paginate_info.audio_url" :gutter="24" class="el-line">
            <el-col :span="24" class="el-item">
              <div class="list-item">
                <div class="item-title" />
                <div class="item-desc">
                  <audio-play :audio-url="paginate_info.audio_url" />
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="24" class="el-line">
            <el-col :span="12" class="el-item">
              <div class="list-item">
                <div class="item-title">设备名称：</div>
                <div class="item-desc">{{ paginate_info.equ_name }}</div>
              </div>
            </el-col>
            <el-col :span="12" class="el-item-left">
              <div class="list-item">
                <div class="item-title">设备编号：</div>
                <div class="item-desc">{{ paginate_info.equ_no }}</div>
              </div>
            </el-col>
          </el-row>
          <!-- 出警人 -->
          <el-row :gutter="24">
            <el-col :span="24">
              <el-divider content-position="left">出警人</el-divider>
            </el-col>
          </el-row>
          <el-row v-if="paginate_info.police_name" :gutter="24">
            <el-col :span="24">
              <div class="police-list">
                <div class="police-item">{{ paginate_info.police_name }} {{ paginate_info.police_phone }}</div>
              </div>
            </el-col>
          </el-row>
          <!-- 处理记录 -->
          <el-row :gutter="24">
            <el-col :span="24">
              <el-divider content-position="left">处理记录</el-divider>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="24">
              <el-timeline>
                <el-timeline-item
                  v-for="(item, index) in paginate_info.event_record_list"
                  :key="index"
                  :timestamp="item.status_flag_name"
                  :color="index === 0 ? '#3272FF' : ''"
                  placement="top"
                >
                  <div class="record-list">
                    <template v-if="item.status_flag != '-1'">
                      <div class="record-item">
                        <div class="item-record">
                          <div class="record-title">操作时间：</div>
                          <div class="record-desc">{{ item.oper_time | formatDate }}</div>
                        </div>
                        <div class="item-record">
                          <div class="record-title">操作人：</div>
                          <div class="record-desc">{{ item.oper_name }}</div>
                        </div>
                      </div>
                      <div class="record-item">
                        <div class="item-record">
                          <div class="record-title">操作结果：</div>
                          <div class="record-desc">{{ item.status_flag_name }}</div>
                        </div>
                        <div v-if="item.status_flag == '3'" class="item-record">
                          <div class="record-title">出警人：</div>
                          <div class="record-desc">{{ paginate_info.police_name }} {{ paginate_info.police_phone }}</div>
                        </div>
                      </div>
                    </template>
                    <template v-else>
                      <div class="record-item">
                        <div class="item-record">
                          <div class="record-title">上报事件：</div>
                          <div class="record-desc">{{ item.create_time | formatDate }}</div>
                        </div>
                      </div>
                    </template>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </el-col>
          </el-row>
        </el-form>
      </el-scrollbar>
      <div v-if="login_role !== 6" class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="detailVisible = false">取消</span>
        <span v-if="paginate_info.status_flag == '1'" class="spp-btn" @click="handleTagPolice(1)">标记为无需出警</span>
        <span v-if="paginate_info.status_flag == '1'" class="spp-btn spp-btn-primary" @click="handleTagPolice(2)">标记为已出警</span>
        <span v-if="paginate_info.status_flag == '3'" class="spp-btn spp-btn-primary" @click="editVisible = true">标记为已完成</span>
      </div>
    </el-dialog>
    <!-- 事件处理结果编辑 -->
    <el-dialog
      v-if="editVisible"
      :title="'事件处理结果编辑'"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      width="480px"
      custom-class="have_scroll_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{ height: height + 'px' }">
        <el-form ref="form" class="school" :label-position="'top'" :model="form" :rules="rules">
          <el-form-item label="报警原因" prop="cpolice_reason">
            <el-input v-model="form.cpolice_reason" placeholder="请输入报警原因" />
          </el-form-item>
          <el-form-item label="紧急程度" prop="emer_degree">
            <el-select v-model="form.emer_degree" placeholder="请选择紧急程度">
              <el-option
                v-for="(item, key, index) in degree_list"
                :key="index"
                :label="item"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发生时间" prop="occur_time">
            <el-date-picker
              v-model="form.occur_time"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="发生时间"
            />
          </el-form-item>
          <el-form-item label="发生地点">
            <el-input v-model="form.occur_place" placeholder="请输入发生地点" />
          </el-form-item>
          <el-form-item label="当事人" prop="patries_json">
            <div v-for="(item, index) in form.patries_json" :key="index" class="parties-item">
              <el-radio-group v-model="item.party_sex">
                <el-radio label="男" style="margin-right: 10px">男</el-radio>
                <el-radio label="女" style="margin-right: 10px">女</el-radio>
              </el-radio-group>
              <el-input v-model="item.party_name" :style="{width: index === 0 ? '200px' : '160px'}" placeholder="请输入当事人姓名" />
              <img v-if="index !== 0" class="icon-txt" src="@/assets/images/del.png" @click="handleDelParties(index)">
            </div>
          </el-form-item>
          <el-form-item style="display: flex; justify-content: flex-end">
            <div class="add-parties" @click="handleAddParties()">
              <img class="add-icon" src="@/assets/images/add.png">添加
            </div>
          </el-form-item>
          <el-form-item label="处理结果">
            <el-input
              v-model="form.handle_result"
              type="textarea"
              :rows="10"
              resize="none"
              placeholder="请输入处理结果"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="editVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmit()">确定</span>
      </div>
    </el-dialog>
    <!-- 播放视频 -->
    <el-dialog
      v-if="videoVisible"
      title="播放视频"
      :visible.sync="videoVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="volume-video"
    >
      <div class="video-item">
        <vue-core-video-player v-if="videoVisible" ref="video" :src="paginate_info.video_url" :autoplay="false" :loop="false" />
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
      <audio-play v-if="audioVisible" style="height: 400px" :audio-url="paginate_info.audio_url" />
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
import PageMap from './map'
import AudioPlay from '@/components/Audio'
import SelectSchool from '@/components/SelectSchool'
import { decrypt, httpRequest } from '@/utils/auth'
import { formatStrDate } from '@/filters'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  name: 'Unfinished',
  components: { Pagination, PageMap, AudioPlay, SelectSchool },
  data() {
    return {
      login_role: Number(JSON.parse(decrypt(sessionStorage.getItem('login_role'))).login_user_type),
      height: window.innerHeight - 128,
      map_show: false,
      auth: {},
      center: ['113.731372', '34.768085'],
      markers: [],
      select_date: [moment().format('YYYY-MM-DD') + ' 00:00:00', moment().format('YYYY-MM-DD') + ' 23:59:59'],
      search: {
        start_time: '',
        end_time: '',
        equ_no: '',
        scl_id: '',
        status_flag: '', // 0-未查看 1-已接警 2-无需出警3-已出警4-已完成
        equ_position: '',
        user_duty_id: '',
        user_police_id: '',
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      select_school: {
        scl_id: '',
        scl_name: ''
      }, // 选择学校
      status_index: 0,
      status_list: [{
        title: '全部',
        color: '#2C2E33',
        num: 0
      }, {
        title: '未查看',
        color: '#FF5555',
        num: 0
      }, {
        title: '已接警',
        color: '#FFB83B',
        num: 0
      }, {
        title: '已出警',
        color: '#34D0F2',
        num: 0
      }],
      equipment_list: [], // 设备类型
      duty_list: [], // 责任人
      police_list: [], // 出警人
      degree_list: [], // 紧急程度
      editVisible: false,
      detailVisible: false,
      videoVisible: false,
      audioVisible: false,
      schoolVisible: false,
      paginate_data: [],
      paginate_info: {},
      total: 0,
      form: {
        cpolice_reason: '', // 报警原因
        emer_degree: '', // 紧急程度
        occur_time: '', // 发生时间
        occur_place: '', // 发生地点
        patries_json: [{
          party_sex: '男',
          party_name: ''
        }],
        handle_result: ''
      },
      rules: {
        cpolice_reason: [
          { required: true, message: '请输入报警原因', trigger: 'blur' }
        ],
        emer_degree: [
          { required: true, message: '请选择紧急程度', trigger: 'blur' }
        ],
        occur_time: [
          { required: true, message: '请选择发生时间', trigger: 'blur' }
        ],
        patries_json: [
          { type: 'array', required: true, message: '请输入当事人信息', trigger: 'blur' }
        ]
      },
      websocket: null,
      websocket_close: true,
      timer: null,
      new_id: '',
      icon_timer: null
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  watch: {
    detailVisible(val) {
      if (!val) {
        this.paginate_info = {}
      }
    },
    editVisible(val) {
      if (val) {
        this.handleGetDegree()
      }
      if (!val) {
        Object.assign(this.$data.form, this.$options.data().form)
        this.$refs['form'].clearValidate()
      }
    }
  },
  mounted() {
    this.permissionAuth()
    this.handleGetCount()
    this.handleGetList()
    this.queryData()
    this.handleGetEquipment()
    window.addEventListener('onmessageWS', this.getSocketData, true)
  },
  beforeDestroy() {
    window.removeEventListener('onmessageWS', this.getSocketData, true)
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (this.new_id !== '') {
        if (row.event_id === this.new_id) {
          return 'warning-row'
        }
      }
      return ''
    },
    // 获取按钮权限
    permissionAuth() {
      this.auth.detail = this.permission.indexOf('/api/pajx/alarm/event/scl/detail')
    },
    handleCutStatus(index) {
      this.status_index = index
      this.queryData()
    },
    // 选择学校
    handleSelectSchool(data) {
      this.select_school.scl_id = data.scl_id
      this.select_school.scl_name = data.scl_name
      this.search.scl_id = data.scl_id
      this.search.equ_position = ''
      this.search.equ_no = ''
      this.search.user_duty_id = ''
      this.search.user_police_id = ''
      this.schoolVisible = false
      this.handleGetList()
      this.handleGetEquipment()
      this.queryData()
    },
    handleCloseSchool() {
      this.select_school.scl_id = ''
      this.select_school.scl_name = ''
      this.search.scl_id = ''
      this.search.equ_position = ''
      this.search.equ_no = ''
      this.search.user_duty_id = ''
      this.search.user_police_id = ''
      this.handleGetList()
      this.handleGetEquipment()
      this.queryData()
    },
    // 获取事件数据
    handleGetCount(info = null) {
      httpRequest('/api/pajx/alarm/event/scl/undeal/count', {}, false).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.status_list[0].num = data.total_num
        this.status_list[1].num = data.un_see_num
        this.status_list[2].num = data.police_num
        this.status_list[3].num = data.to_police_num
        if (info) {
          this.handleAddList(info)
        }
      })
    },
    // 获取设备列表
    handleGetList() {
      httpRequest('/api/pajx/equ/scl/info/list', {
        scl_id: this.select_school.scl_id
      }, false).then((res) => {
        this.equipment_list = JSON.parse(decrypt(res.data))
        if (this.equipment_list.length !== 0) {
          this.equipment_list.map((item) => {
            if (item.equ_coordinate) {
              var coords = item.equ_coordinate.split(',')
              this.markers.push({
                id: item.equ_id,
                equ_no: item.equ_no,
                equ_flag: Number(item.equ_flag),
                icon: Number(item.equ_flag) === 1 ? require('@/assets/images/pun_demo.webp') : require('@/assets/images/pun_video.webp'),
                title: item.equ_name,
                top: '0',
                left: '0',
                status: false,
                position: [coords[0], coords[1]]
              })
            }
          })
          this.center = [this.markers[0].position[0], this.markers[0].position[1]]
          this.map_show = true
        } else {
          this.map_show = false
        }
      })
    },
    handleGetEquipment() {
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
    handleCurrentChange(val) {
      this.search.page_num = val.page
      this.fetchData()
    },
    queryData() {
      this.search.page_num = 1
      this.fetchData()
    },
    resetData() {
      this.select_date = []
      Object.assign(this.$data.search, this.$options.data().search)
      this.queryData()
    },
    fetchData() {
      if (this.select_date.length !== 0) {
        this.search.start_time = formatStrDate(this.select_date[0])
        this.search.end_time = formatStrDate(this.select_date[1])
      }
      this.search.status_flag = this.status_index === 0
        ? '' : this.status_index === 1
          ? 0 : this.status_index === 2
            ? 1 : 3
      this.search.page_size = this.map_show ? 10 : 20
      httpRequest('/api/pajx/alarm/event/scl/undeal/paginate', this.search).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.paginate_data = data.records
        this.total = data.total
      })
    },
    handleGetLocation(data) {
      this.center = [data.lng, data.lat]
    },
    handleEditStatus(data) {
      if (Number(data.status_flag) === 0) {
        if (this.login_role !== 6) {
          httpRequest('/api/pajx/alarm/event/scl/oper', {
            event_id: data.event_id,
            status_flag: 1
          }, false).then((res) => {
            this.$message({
              message: '当前事件已接警',
              type: 'success'
            })
            this.handleGetCount()
            this.fetchData()
            this.handleDetail(data.event_id)
          })
        } else {
          this.handleDetail(data.event_id)
        }
      } else {
        this.handleDetail(data.event_id)
      }
    },
    handleDetail(event_id) {
      httpRequest('/api/pajx/alarm/event/scl/detail', {
        event_id: event_id
      }, false).then((res) => {
        var data = JSON.parse(decrypt(res.data))
        this.paginate_info = { ...this.paginate_info, ...data }
        this.paginate_info.event_record_list.push({
          status_flag: '-1',
          status_flag_name: '事件上报',
          create_time: this.paginate_info.create_time
        })
        this.detailVisible = true
      })
    },
    handleTagPolice(type) {
      var str = type === 1 ? '确定无需出警吗？' : '请确定是否已经通知出警人！'
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/pajx/alarm/event/scl/oper', {
          event_id: this.paginate_info.event_id,
          status_flag: type === 1 ? 2 : 3
        }, false).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.paginate_info = {}
          this.detailVisible = false
          this.handleGetCount()
          this.fetchData()
        })
      }).catch(() => {})
    },
    handleGetDegree() {
      httpRequest('/api/sys/dic/emer/degree', {}, false).then((res) => {
        this.degree_list = JSON.parse(decrypt(res.data))
      })
    },
    handleAddParties() {
      this.form.patries_json.push({
        party_sex: '男',
        party_name: ''
      })
    },
    handleDelParties(index) {
      this.form.patries_json.splice(index, 1)
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          var data = {
            event_id: this.paginate_info.event_id,
            cpolice_reason: this.form.cpolice_reason,
            emer_degree: this.form.emer_degree,
            patries_json: JSON.stringify(this.form.patries_json),
            handle_result: this.form.handle_result,
            occur_time: formatStrDate(this.form.occur_time),
            occur_place: this.form.occur_place
          }
          httpRequest('/api/pajx/alarm/result/scl/save', data, false).then((res) => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.editVisible = false
            this.detailVisible = false
            this.handleGetCount()
            this.fetchData()
          })
        } else {
          return false
        }
      })
    },
    handleAudio() {
      if (this.paginate_info.audio_url) {
        this.audioVisible = true
      } else {
        this.$message({
          message: '无音频播放地址',
          type: 'error'
        })
      }
    },
    handleVideo() {
      if (this.paginate_info.video_url) {
        this.videoVisible = true
      } else {
        this.$message({
          message: '无视频播放地址',
          type: 'error'
        })
      }
    },
    handleDownMap(data) {
      this.search.equ_no = data.equ_no
      this.handleGetCount()
      this.queryData()
    },
    handleFormatIcon() {
      this.new_id = ''
      this.markers.map((item) => {
        item.icon = Number(item.equ_flag) === 1 ? require('@/assets/images/pun_demo.webp') : require('@/assets/images/pun_video.webp')
      })
    },
    // 接收后端返回的数据   对数据进行处理渲染
    getSocketData(res) {
      if (res.detail.cmd === 'event_not_handle') {
        var data = res.detail.data
        this.handleGetCount(data)
      }
    },
    handleAddList(data) {
      if (this.search.page_size === 10) {
        if (this.paginate_data.length === 10) {
          this.paginate_data.splice(this.paginate_data.length - 1, 1)
        }
      } else {
        if (this.paginate_data.length === 20) {
          this.paginate_data.splice(this.paginate_data.length - 1, 1)
        }
      }
      this.paginate_data.unshift(data)
      if (this.markers.length !== 0) {
        this.markers.map((item) => {
          if (item.equ_no === data.equ_no) {
            this.new_id = data.event_id
            item.icon = item.equ_flag === 1 ? require('@/assets/images/flash_audio.webp') : require('@/assets/images/flash_video.webp')
            this.center = [item.position[0], item.position[1]]
            setTimeout((res) => {
              this.handleFormatIcon()
            }, 10000)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .el-table .warning-row {
    background: rgba(255, 85, 85, 0.1);
  }

  .btn-list {
    position: relative;
    padding: 0 16px;
    width: 100%;
    height: 72px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    background: #ffffff;

    .btn-item {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 72px;
      padding: 8px 37px 8px 12px;
      background: #F5F7FA;
      border: 1px solid #F5F7FA;
      border-radius: 4px;
      margin-right: 10px;
      cursor: pointer;

      .item-txt {
        font-size: 12px;
        color: #5E6166;
        margin-right: 8px;
      }

      .num-txt {
        font-weight: 600;
        font-size: 18px;
      }
    }

    .btn-active {
      background: #E5EDFF;
      border: 1px solid #3272FF;
      border-radius: 4px;
    }

    .top-show {
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, 0%);
      width: 90px;
      height: 20px;
      background: #EBEDF0;
      border-radius: 0 0 10px 10px;
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      justify-content: center;

      .top-icon {
        width: 20px;
        height: 20px;
      }
    }
  }

  .way {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 55px;
    height: 24px;
    background: #EAEDF3;
    border-radius: 2px;

    .icon-way {
      width: 10px;
      height: 10px;
      margin-right: 4px;
    }
  }

  .school {
    .el-line {
      margin: 0 !important;

      .el-item {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      .el-item-left {
        padding-right: 0 !important;
      }
    }

    .list-item {
      display: flex;
      align-items: flex-start;
      min-height: 40px;
      font-size: 14px;
      font-weight: 400;
      color: #2c2e33;

      .item-title {
        display: flex;
        align-items: center;
        min-height: 40px;
        min-width: 75px;
        color: #5e6166;
      }

      .item-desc {
        min-height: 40px;
        display: flex;
        align-items: center;
        line-height: 40px;
        font-size: 14px;
        color: #2c2e33;
        font-weight: 400;
      }

      .desc-txt {
        max-width: 400px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 8px;
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
    }

    .police-list {
      width: 100%;
      padding: 16px;
      background: #F5F7FA;
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .police-item {
        height: 26px;
        font-weight: 400;
        font-size: 14px;
        color: #2C2E33;
        line-height: 26px;
        margin-right: 10px;
      }
    }
  }

  ul {
    padding: 0;
  }

  ::v-deep .el-form--label-top .el-form-item__label {
    padding: 0;
  }

  ::v-deep .el-timeline-item__timestamp {
    color: #5E6166;
  }

  .parties-item {
    width: 100%;
    height: 60px;
    border: 1px solid #E1E2E6;
    border-radius: 2px;
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;

    ::v-deep .el-radio {
      margin-right: 0;
    }

    .icon-txt {
      width: 24px;
      height: 24px;
      margin-left: 12px;
      cursor: pointer;
    }
  }

  .parties-item:last-child {
    margin-bottom: 0;
  }

  .add-parties {
    width: 72px;
    height: 36px;
    background: #F9FAFC;
    border: 1px solid #E1E2E6;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400;
    font-size: 14px;
    color: #5E6166;
    cursor: pointer;

    .add-icon {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
  }

  .record-list {
    width: 100%;
    padding: 14px 18px;
    background: #F5F7FA;

    .record-item {
      display: flex;
      align-items: center;
      height: 26px;

      .item-record {
        display: flex;
        align-items: center;
        width: 50%;
        height: 26px;

        .record-title {
          height: 26px;
          font-weight: 400;
          font-size: 14px;
          color: #5E6166;
          line-height: 26px;
        }

        .record-desc {
          height: 26px;
          font-weight: 400;
          font-size: 14px;
          color: #2C2E33;
          line-height: 26px;
        }
      }
    }
  }

  .volume-audio {
    left: 50% !important;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 200px !important;
    overflow-y: hidden !important;
  }

  .volume-video {
    left: 50% !important;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 500px !important;
    overflow-y: hidden !important;

    .video-item {
      width: 100%;
      height: 400px;
    }
  }

  .audio-content {
    margin-top: 0 !important;
  }
</style>
