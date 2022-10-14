<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 操作按鈕 -->
    <div class="main-header">
      <el-row :gutter="20">
        <el-col :span="12" class="header_left">
          <span v-if="auth.save != -1" class="spp-btn-add spp-btn-primary" @click="noticeVisible = true"><svg-icon icon-class="add_notice" />发消息</span>
        </el-col>
        <el-col :span="12" class="header_right search_view">
          <div class="input_view">
            <el-input v-model="search.notice_title" placeholder="搜索公告标题" @keyup.enter="queryData" @change="queryData" />
            <i slot="prefix" class="el-input__icon el-icon-search" />
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content_view">
      <div class="tree_content_view">
        <el-scrollbar wrap-class="vertical_scrollbar" :style="'height: ' + height + 'px'">
          <div class="notice-item-title">我收到的</div>
          <div class="notice-item-lick" :class="notice_type === 1 ? 'notice-lick-active' : ''" @click="handleCutType(1)">
            <svg-icon icon-class="all_notice" />全部消息</div>
          <div class="notice-item-lick" :class="notice_type === 2 ? 'notice-lick-active' : ''" @click="handleCutType(2)">
            <svg-icon icon-class="sys_notice" />系统消息</div>
          <div class="notice-item-lick" :class="notice_type === 3 ? 'notice-lick-active' : ''" @click="handleCutType(3)">
            <svg-icon icon-class="not_notice" />通知公告</div>
          <el-divider />
          <div class="notice-item-title">我发送的</div>
          <div class="notice-item-lick" :class="notice_type === 4 ? 'notice-lick-active' : ''" @click="handleCutType(4)">
            <svg-icon icon-class="been_sent" />已发送</div>
          <div class="notice-item-lick" :class="notice_type === 5 ? 'notice-lick-active' : ''" @click="handleCutType(5)">
            <svg-icon icon-class="draft_box" />草稿箱</div>
        </el-scrollbar>
      </div>
      <div class="tab_content_view">
        <template v-if="notice_type < 4">
          <el-dropdown style="margin-bottom: 25px" @command="handleClickStatus">
            <span class="el-dropdown-link all-status">
              {{ top_list[top_index] }}<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="0">{{ top_list[0] }}</el-dropdown-item>
              <el-dropdown-item :command="1">{{ top_list[1] }}</el-dropdown-item>
              <el-dropdown-item :command="2">{{ top_list[2] }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <el-table ref="table" :data="notice_list" :height="height - 100" size="mini" strip @row-click="handleRowClick" @selection-change="handleSelectTable">
          <!--<el-table-column
            type="selection"
            width="55"
          />-->
          <template v-for="(item, index) in theader">
            <el-table-column
              v-if="item.show"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width || 'auto'"
              :align="item.align || 'left'"
              :formatter="item.formatter"
              :fixed="notice_list.length ? (item.label === '操作' ? 'right' : false) : false"
            >
              <template v-if="!item.prop" v-slot="scope">
                <slot
                  :name="item.label"
                  :data="{
                    ...scope.row,
                    $index: scope.$index
                  }"
                />
                <template v-if="item.label === '收件人数/已读人数'">
                  {{ scope.row.rec_num + '/' + scope.row.read_num }}
                </template>
                <template v-if="item.label === '接收时间'">
                  {{ scope.row.create_time | formatDate }}
                </template>
                <template v-if="item.label === '发送时间'">
                  {{ scope.row.create_time | formatDate }}
                </template>
                <template v-if="item.label === '通知类型'">
                  <el-button type="text" class="notification-type">
                    {{ scope.row.notice_type == '0' ? '系统消息' : scope.row.notice_type == '1' ? '通知公告' : '' }}
                  </el-button>
                </template>
                <template v-if="item.label === '通知方式'">
                  <div class="table-item">
                    <img v-if="scope.row.notice_way.includes('0')" class="type-icon" src="../../../assets/images/pc_platform.png">
                    <img v-if="scope.row.notice_way.includes('1')" class="type-icon" src="../../../assets/images/wechat.png">
                    <img v-if="scope.row.notice_way.includes('2')" class="type-icon" src="../../../assets/images/sms.png">
                    <img v-if="scope.row.notice_way.includes('3')" class="type-icon" src="../../../assets/images/email.png">
                  </div>
                </template>
                <template v-if="item.label === '发送状态'">
                  <template v-if="notice_type === 4">
                    <el-button type="text" class="success-send">已发送</el-button>
                  </template>
                  <template v-else>
                    <el-button v-if="scope.row.timing_flag == '1'" type="text" class="yes-send">{{ scope.row.notice_task | formatDate }} 发送</el-button>
                    <el-button v-else type="text" class="no-send">未发送</el-button>
                  </template>
                </template>
                <template v-if="item.label === '操作'">
                  <el-button type="text" @click.stop="handleEdit(scope.row.notice_id)">编辑</el-button>
                  <el-button v-if="auth.delete != -1" type="text" style="color: #FF4949" @click.stop="handleDelete(scope.row.notice_id)">删除</el-button>
                </template>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="search.page_num" :limit.sync="search.page_size" @pagination="handleCurrentChange" />
      </div>
    </div>
    <!-- 发消息 -->
    <el-dialog
      :title="edit_type === 1 ? '发消息' : '编辑草稿箱发消息'"
      :visible.sync="noticeVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="have_scroll_dialog"
    >
      <el-form ref="form" :label-position="'left'" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="发送对象">
          <div class="send-obj-item" @click.stop="objVisible = true">
            <template v-if="user_select_list.length > 0">
              <el-tag
                v-for="(item, index) in user_select_list"
                :key="index"
                closable
                class="send-obj-block-tag"
                @close="handleDelUser(item.dept_id, index)"
              >
                {{ item.dept_name }}
              </el-tag>
            </template>
            <template v-else>
              <span class="send-obj-block">请选择发送对象</span>
            </template>
            <i class="el-icon-arrow-right send-obj-icon" />
          </div>
        </el-form-item>
        <el-form-item label="通知类型">
          <el-radio-group v-model="form.notice_type">
            <el-radio :label="1">通知公告</el-radio>
            <el-radio :label="0">系统消息</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公告标题" prop="notice_title">
          <el-input v-model="form.notice_title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="公告内容">
          <editor-bar v-model="form.notice_content" :is-clear="false" />
        </el-form-item>
        <el-form-item label="通知方式" prop="notice_way">
          <el-checkbox-group v-model="form.notice_way">
            <el-checkbox v-for="(item, key, index) in notice_type_list" :key="index" :label="key">{{ item }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="发送类型">
          <el-radio-group v-model="form.timing_flag">
            <el-radio :label="0">立即发送</el-radio>
            <el-radio :label="1">定时发送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.timing_flag === 1" label="发送时间">
          <el-date-picker
            v-model="form.notice_task"
            style="width: 100%"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择发送时间"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="onSubmit(1)">存草稿</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmit(2)">发送</span>
      </span>
    </el-dialog>
    <!-- 选择发送对象 -->
    <el-dialog :title="'选择发送对象'" :append-to-body="true" :visible.sync="objVisible" :custom-class="'default-size'" :close-on-click-modal="false">
      <div class="select-obj">
        <div class="select-obj-title">
          <el-checkbox v-model="all_user">全选</el-checkbox>
          <div><span class="select-obj-txt">已选：</span>{{ user_select_id1.length }}人</div>
        </div>
        <el-input v-model="user_name" class="select-search-input" prefix-icon="el-icon-search" placeholder="搜索姓名" @keyup.enter="handleGetUserList" @change="handleGetUserList" />
        <el-scrollbar wrap-class="vertical_scrollbar" style="height: 376px">
          <el-tree
            ref="tree"
            icon-class="el-icon-arrow-right"
            :expand-on-click-node="false"
            node-key="dept_id"
            default-expand-all
            :data="user_filter_list"
            show-checkbox
            :props="{ children: 'hierarchy', label: 'dept_name' }"
            @check="handleNodeClick"
          >
            <span slot-scope="{ node, data }" class="user-custom-tree-node">
              <div v-if="data.user_id" class="user-photo-name">
                {{ node.label.length > 2 ? node.label.substring(node.label.length - 2, node.label.length) : node.label }}
              </div>
              <span class="user-label-txt">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <span class="spp-btn" @click="objVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="handleCloseUser()">保存</span>
      </span>
    </el-dialog>
    <!-- 公告详情 -->
    <el-dialog
      :title="'公告详情'"
      :visible.sync="detailVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="have_scroll_dialog"
    >
      <div class="app-content-list">
        <div class="app-content-title">{{ notice_info.notice_title }}</div>
        <div class="app-content-item">
          <div class="app-list-item">
            <div class="app-item-title">发件人：</div>
            <div class="app-item-desc">{{ notice_info.user_name }}</div>
          </div>
          <div class="app-list-item">
            <div class="app-item-title">时间：</div>
            <div class="app-item-desc">{{ notice_info.date | formatDate }}</div>
          </div>
          <div class="app-list-item">
            <div class="app-item-title">收件人：</div>
            <div class="app-item-desc">{{ notice_info.recipient }}等{{ notice_info.recipient_length }}人<span class="see-name" @click="handleSeeReceive()">查看</span></div>
          </div>
        </div>
        <div class="app-content-line" />
        <div class="app-content-detail" v-html="notice_info.notice_content" />
      </div>
    </el-dialog>
    <!-- 收件人 -->
    <el-dialog :title="'收件人'" :append-to-body="true" :visible.sync="receiveVisible" :custom-class="'default-size'" :close-on-click-modal="false">
      <div class="select-obj">
        <el-input v-model="receive_name" class="select-search-input" prefix-icon="el-icon-search" placeholder="搜索姓名" @keyup.enter="handleSeeReceive" @change="handleSeeReceive" />
        <el-scrollbar wrap-class="vertical_scrollbar" style="height: 430px">
          <div v-for="(item, index) in receive_list" :key="index" class="receive-list">
            <div class="receive-name">
              <div class="user-photo-name">{{ item.user_name.length > 2 ? item.user_name.substring(item.user_name.length - 2, item.user_name.length) : item.user_name }}</div>
              <div class="receive-name-txt">{{ item.user_name }}</div>
            </div>
            <div class="receive-status" :class="item.read_flag == '1' ? 'success-send' : 'yes-send'">{{ item.read_flag == '1' ? '已读' : '未读' }}</div>
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EditorBar from '@/components/wangEnduit'
import Pagination from '@/components/Pagination'
import { decrypt, httpRequest } from '@/utils/auth'
import { mapState } from 'vuex'

export default {
  name: 'Notice',
  components: { Pagination, EditorBar },
  filters: {
    formatDate(value) {
      if (value) {
        return value.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1-$2-$3 $4:$5:$6')
      }
    }
  },
  data() {
    return {
      height: window.innerHeight - 135,
      auth: {},
      search: {
        notice_title: '',
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      total: 0,
      edit_type: 1, // 1新增发消息 2编辑草稿箱
      notice_type: 1, // 1 全部消息 2系统消息 3通知公告 4已发送 5草稿箱
      notice_list: [],
      top_index: 0,
      top_list: ['全部消息', '已读消息', '未读消息'],
      notice_type_list: [],
      select_table: [], // 选择的表格数据
      all_user: false,
      user_name: '',
      user_list: [],
      user_filter_list: [],
      user_select_id: [], // 选择的用户id
      user_select_list: [], // 选择的用户
      user_select_id1: [], // 选择的用户id
      user_select_list1: [], // 选择的用户
      user_pid_list: [], // 部门id
      objVisible: false, // 发送对象
      noticeVisible: false, // 发消息
      detailVisible: false, // 公告详情
      receive_name: '',
      notice_id: '',
      receiveVisible: false, // 收件人
      notice_info: {
        notice_title: '',
        user_name: '',
        create_time: '',
        notice_content: '',
        timing_flag: '0',
        notice_task: '',
        addressee: []
      }, // 详情
      receive_list: [], // 详情收件人列表
      form: {
        notice_title: '', // 公告标题
        notice_type: 0, // 通知类型
        timing_flag: 0, // 发送类型
        notice_task: '', // 定时日期
        notice_content: '', // 公告内容
        notice_way: [] // 字典 通知方式
      },
      rules: {
        notice_title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' }
        ],
        notice_way: [
          { type: 'array', required: true, message: '请至少选择一个通知方式', trigger: 'change' }
        ]
      },
      theader: [],
      closed_thead: [
        {
          label: '发件人',
          prop: 'user_name',
          show: true,
          align: 'left',
          width: '200px'
        },
        {
          label: '公告标题',
          prop: 'notice_title',
          show: true,
          align: 'left'
        },
        {
          label: '接收时间',
          prop: '',
          show: true,
          width: '180px',
          align: 'left'
        },
        {
          label: '通知类型',
          prop: '',
          show: true,
          width: '200px',
          align: 'left'
        }
      ], // 收到信息
      send_thead: [
        {
          label: '公告标题',
          prop: 'notice_title',
          show: true,
          align: 'left'
        },
        {
          label: '收件人数/已读人数',
          prop: '',
          show: true,
          align: 'left',
          width: '180px'
        },
        {
          label: '发送时间',
          prop: '',
          show: true,
          align: 'left',
          width: '160px'
        },
        {
          label: '通知类型',
          prop: '',
          show: true,
          align: 'left',
          width: '130px'
        },
        {
          label: '通知方式',
          prop: '',
          show: true,
          align: 'left',
          width: '120px'
        },
        {
          label: '发送状态',
          prop: '',
          show: true,
          align: 'left',
          width: '150px'
        }
      ], // 已发送
      draft_thead: [
        {
          label: '公告标题',
          prop: 'notice_title',
          show: true,
          align: 'left'
        },
        {
          label: '发送状态',
          prop: '',
          show: true,
          align: 'left',
          width: '250px'
        },
        {
          label: '操作',
          prop: '',
          show: true,
          align: 'left',
          width: '150px'
        }
      ] // 草稿箱
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  watch: {
    noticeVisible(val) {
      if (!val) {
        this.all_user = false
        this.edit_type = 1
        this.form.notice_title = ''
        this.form.notice_type = 0
        this.form.notice_content = ''
        this.form.notice_way = []
        this.form.timing_flag = 0
        this.form.notice_task = ''
        this.user_select_list = []
        this.user_select_id = []
        this.user_select_list1 = []
        this.user_select_id1 = []
        this.$refs['form'].clearValidate()
      } else {
        this.handleGetNoticeType()
      }
    },
    objVisible(val) {
      if (val) {
        this.handleGetUserList()
      }
      if (!val) {
        this.user_list = []
        this.user_filter_list = []
        this.user_pid_list = []
        this.user_name = ''
        this.$refs.tree.setCheckedKeys([])
      }
    },
    detailVisible(val) {
      if (!val) {
        this.notice_id = ''
        this.notice_info = {
          notice_title: '',
          user_name: '',
          create_time: '',
          notice_content: '',
          timing_flag: '0',
          notice_task: '',
          addressee: []
        }
      }
    },
    receiveVisible(val) {
      if (!val) {
        this.receive_name = ''
        this.receive_list = []
      }
    },
    all_user(val) {
      this.handleAllUser()
    }
  },
  created() {
    this.permissionAuth()
    this.notice_type = 1
    this.theader = this.closed_thead
    this.queryData()
  },
  methods: {
    // 获取按钮权限
    permissionAuth() {
      this.auth.save = this.permission.indexOf('/api/sys/noticeInfo/save')
      this.auth.delete = this.permission.indexOf('/api/sys/noticeInfo/delete')
    },
    // 获取通知方式
    handleGetNoticeType() {
      httpRequest('/api/sys/dic/notice/way', {}, false).then((res) => {
        this.notice_type_list = JSON.parse(decrypt(res.data)) || []
      })
    },
    handleCutType(type) {
      if (type === 4) {
        this.theader = this.send_thead
      } else if (type === 5) {
        this.theader = this.draft_thead
      } else {
        this.theader = this.closed_thead
      }
      this.notice_type = type
      this.queryData()
    },
    // 点击状态切换
    handleClickStatus(data) {
      this.top_index = data
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
    fetchData() {
      var api = ''
      var data = {
        notice_title: this.search.notice_title,
        page_num: this.search.page_num,
        page_size: this.search.page_size
      }
      if (this.notice_type === 4) {
        data.notice_type = ''
        api = '/api/sys/noticeInfo/paginate' // 已发送信息
      } else if (this.notice_type === 5) {
        api = '/api/sys/noticeInfo/drafts' // 草稿箱
      } else {
        data.read_flag = this.top_index === 1 ? 1 : this.top_index === 2 ? 0 : ''
        data.notice_type = this.notice_type === 2 ? 0 : this.notice_type === 3 ? 1 : ''
        api = '/api/sys/notice/detail/paginate'
      }
      httpRequest(api, data).then(res => {
        const data = JSON.parse(decrypt(res.data))
        if (this.notice_type === 4) {
          data.records.map((item) => {
            item.notice_way = item.notice_way ? item.notice_way.split(',') : []
          })
        }
        this.total = data.total
        this.$nextTick(() => {
          this.notice_list = data.records
        })
      })
    },
    // 点击表格的行
    handleRowClick(row) {
      this.handleDetails(row.notice_id)
    },
    // 点击查看收件人
    handleSeeReceive() {
      httpRequest('/api/sys/notice/detail/addressee', {
        notice_id: this.notice_id,
        user_name: this.receive_name
      }, false).then(res => {
        this.receive_list = JSON.parse(decrypt(res.data))
        this.receiveVisible = true
      })
    },
    // 获取公告详情
    handleDetails(id) {
      this.notice_id = id
      httpRequest('/api/sys/noticeInfo/info', {
        notice_id: this.notice_id
      }, false).then(res => {
        this.notice_info = { ...this.notice_info, ...JSON.parse(decrypt(res.data)) }
        this.notice_info.timing_flag = this.notice_info.timing_flag.toString()
        var date = this.notice_info.timing_flag === '0' ? this.notice_info.create_time : this.notice_info.notice_task || ''
        this.$set(this.notice_info, 'date', date)
        var addressee = JSON.parse(JSON.stringify(this.notice_info.addressee))
        addressee.splice(addressee.length - 1, 1)
        var str = addressee.slice(0, 2)
        var arr = str.map((item) => {
          return item.user_name
        })
        this.$set(this.notice_info, 'recipient', arr.join('、'))
        this.$set(this.notice_info, 'recipient_length', this.notice_info.addressee[this.notice_info.addressee.length - 1].num)
        this.detailVisible = true
      })
    },
    // 编辑草稿箱
    handleEdit(id) {
      this.notice_id = id
      this.edit_type = 2
      httpRequest('/api/sys/noticeInfo/info', {
        notice_id: this.notice_id
      }, false).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.form.notice_title = data.notice_title
        this.form.notice_type = Number(data.notice_type)
        this.form.notice_content = data.notice_content
        this.form.notice_way = data.notice_way ? data.notice_way.split(',') : []
        this.form.timing_flag = Number(data.timing_flag)
        this.form.notice_task = this.form.timing_flag === 0 ? '' : this.$options.filters.formatDate(data.notice_task)
        this.user_select_list = []
        this.user_select_id = []
        this.user_select_list1 = []
        this.user_select_id1 = []
        var addressee = JSON.parse(JSON.stringify(data.addressee))
        addressee.splice(addressee.length - 1, 1)
        addressee.map((item) => {
          this.user_select_list.push({
            dept_id: item.user_id,
            dept_name: item.user_name
          })
          this.user_select_id.push(item.user_id)
          this.user_select_list1.push({
            dept_id: item.user_id,
            dept_name: item.user_name
          })
          this.user_select_id1.push(item.user_id)
        })
        this.noticeVisible = true
      })
    },
    // 删除草稿箱
    handleDelete(id) {
      this.$confirm('确认要删除该草稿吗？', '提示', {
        title: '删除提示',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/sys/noticeInfo/delete', { notice_id: id }, false).then(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.queryData()
        })
      }).catch(() => {})
    },
    // 勾选列表表格
    handleSelectTable(val) {
      this.select_table = val
    },
    // 获取用户对象列表
    handleGetUserList() {
      httpRequest('/api/sys/dept/user', {
        user_name: this.user_name
      }, false).then((res) => {
        this.user_list = JSON.parse(decrypt(res.data))
        this.user_filter_list = this.handleCycleUser(JSON.parse(JSON.stringify(this.user_list)))
        this.user_pid_list = this.handleCycleUserIds(JSON.parse(JSON.stringify(this.user_list)), [])
        if (this.user_select_id.length > 0) {
          setTimeout(() => {
            this.$refs.tree.setCheckedKeys(this.user_select_id)
            this.user_select_id1 = JSON.parse(JSON.stringify(this.user_select_id))
            this.user_select_list1 = JSON.parse(JSON.stringify(this.user_select_list))
          }, 500)
        }
      })
    },
    // 循环重组用户对象列表
    handleCycleUser(arr) {
      arr.map((item) => {
        if (item.userList && item.userList.length > 0) {
          item.hierarchy = item.hierarchy || []
          item.hierarchy = item.hierarchy.concat(item.userList)
        }
        if (item.hierarchy && item.hierarchy.length > 0) {
          this.handleCycleUser(item.hierarchy)
        }
      })
      return arr
    },
    // 循环重组用户对象列表
    handleCycleUserIds(arr, value) {
      arr.map((item) => {
        value.push(item.dept_id)
        if (item.hierarchy && item.hierarchy.length > 0) {
          this.handleCycleUserIds(item.hierarchy, value)
        }
      })
      return value
    },
    // 全选用户
    handleAllUser() {
      if (this.all_user) {
        this.$refs.tree.setCheckedNodes(this.user_filter_list)
        this.handleNodeClick()
      } else {
        this.$refs.tree.setCheckedKeys([])
        this.handleNodeClick()
      }
    },
    // 保存选择对象
    handleCloseUser() {
      // this.user_select_list = []
      // this.user_select_id = []
      // var select_ids = this.$refs.tree.getCheckedKeys()
      // // 过滤去掉 父级id 只保留用户id
      // select_ids.map((item) => {
      //   if (this.user_pid_list.indexOf(item) === -1) {
      //     this.user_select_id.push(item)
      //   }
      // })
      // this.user_select_list = this.handleDetectionArr(this.user_list, this.user_select_id, [])
      this.user_select_id1 = Array.from(new Set(this.user_select_id1))
      this.user_select_list1 = this.handleUnique(this.user_select_list1)
      this.user_select_list = []
      this.user_select_id = []
      this.user_select_list = JSON.parse(JSON.stringify(this.user_select_list1))
      this.user_select_list.map((item) => {
        this.user_select_id.push(item.dept_id)
      })
      this.objVisible = false
    },
    handleDetectionArr(arr, str, value) {
      arr.map((item) => {
        if (item.userList && item.userList.length > 0) {
          item.userList.map((vv) => {
            if (str.indexOf(vv.dept_id) > -1) {
              value.push({
                dept_id: vv.dept_id,
                dept_name: vv.dept_name
              })
            }
          })
        }
        if (item.hierarchy && item.hierarchy.length > 0) {
          this.handleDetectionArr(item.hierarchy, str, value)
        }
      })
      return value
    },
    // 点击选择的用户
    handleNodeClick() {
      this.user_select_list1 = []
      this.user_select_id1 = []
      var select_ids = this.$refs.tree.getCheckedKeys()
      // 过滤去掉 父级id 只保留用户id
      select_ids.map((item) => {
        if (this.user_pid_list.indexOf(item) === -1) {
          this.user_select_id1.push(item)
        }
      })
      this.user_select_list1 = this.handleDetectionArr(this.user_list, this.user_select_id1, [])
    },
    // 数组数据去除重复值
    handleUnique(arr) {
      var obj = {}
      arr = arr.reduce((newArr, next) => {
        obj[next.dept_id] ? '' : (obj[next.dept_id] = true && newArr.push(next))
        return newArr
      }, [])
      return arr
    },
    // 移除选择的对象
    handleDelUser(id, index) {
      this.user_select_list.splice(index, 1)
      this.user_select_id.splice(this.user_select_id.indexOf(id), 1)
    },
    handleFormatStr(val) {
      let str = ''
      val = val.split(' ')
      val[0].split('-').map((item) => {
        str += item
      })
      val[1].split(':').map((item) => {
        str += item
      })
      return str
    },
    // 存草稿 type 1 存草稿 2重新编辑再存草稿 3发送 4重新编辑再存发送
    onSubmit(type) {
      var edit_type = 1
      if (this.edit_type === 1) {
        edit_type = type === 1 ? 1 : 3
      } else {
        edit_type = type === 1 ? 2 : 4
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.user_select_id.length <= 0) {
            this.$message({
              message: '请至少选择一位发送对象',
              type: 'error'
            })
            return false
          }
          var api = ''
          var data = {
            notice_title: this.form.notice_title,
            notice_type: this.form.notice_type,
            timing_flag: this.form.timing_flag,
            notice_content: this.form.notice_content,
            notice_way: this.form.notice_way.join(','),
            user_id: this.user_select_id.join(',')
          }
          data.timing_flag === 1 ? data.notice_task = this.handleFormatStr(this.form.notice_task) : ''
          if (edit_type === 1) {
            api = '/api/sys/noticeInfo/save/drafts'
          } else if (edit_type === 2) {
            data.notice_id = this.notice_id
            api = '/api/sys/noticeInfo/drafts/update'
          } else if (edit_type === 3) {
            api = '/api/sys/noticeInfo/save'
          } else {
            data.notice_id = this.notice_id
            api = '/api/sys/noticeInfo/drafts/save'
          }
          httpRequest(api, data, false).then((res) => {
            this.noticeVisible = false
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

<style lang="scss" scoped>
  .content_view .tab_content_view {
    width: calc(100vw - 610px);
  }

  ::v-deep .el-table tr {
    cursor: pointer;
  }

  .all-status {
    font-size: 14px;
    color: #323338;
  }

  .tree_content_view {
    width: 260px;
    padding-right: 16px;

    .notice-item-title {
      height: 18px;
      font-size: 13px;
      color: #939499;
      letter-spacing: 0;
      margin-bottom: 8px;
    }

    .notice-item-lick {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      height: 40px;
      font-size: 14px;
      color: #323338;
      letter-spacing: 0;
      cursor: pointer;

      .svg-icon {
        width: 18px;
        height: 18px;
        margin-right: 8px;
        color: #323338;
      }
    }

    .notice-lick-active {
      background: #E7EBFF;
      border-radius: 10px;
      color: #4968FF;

      .svg-icon {
        color: #4968FF;
      }
    }

    .notice-svg-icon {
      fill: currentColor;
      color: #4968FF;
    }

    .el-divider--horizontal {
      margin: 16px 0;
    }

    .el-divider {
      background-color: #E6E7EB;
    }
  }

  .send-obj-item {
    position: relative;
    width: 100%;
    min-height: 36px;
    background: #FFFFFF;
    border: 1px solid #E6E7EB;
    border-radius: 18px;
    padding: 6px 20px 6px 12px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    cursor: pointer;

    .send-obj-block {
      line-height: 22px;
      margin-right: 4px;
    }

    .send-obj-block-tag {
      margin-right: 4px;
      margin-bottom: 4px;
    }

    .send-obj-icon {
      position: absolute;
      top: 10px;
      right: 12px;
      width: 12px;
      height: 12px;
      color: #939499;
    }
  }

  .select-obj {
    font-size: 14px;
    color: #323338;
    letter-spacing: 0;

    .select-obj-txt {
      color: #939499;
    }

    .select-obj-title {
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .select-search-input {
      margin: 16px 0 24px 0;
    }

    .receive-list {
      width: 100%;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .receive-name {
        display: flex;
        align-items: center;
      }

      .receive-name-txt {
        font-size: 13px;
        margin-left: 6px;
        color: #323338;
        letter-spacing: 0;
      }
    }
  }

  .user-photo-name {
    width: 35px;
    height: 35px;
    background: #4968FF;
    border-radius: 50%;
    font-size: 8px;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: 35px;
    text-align: center;
    margin-right: 6px;
    transform: scale(0.66);
  }

  .user-custom-tree-node {
    display: flex;
    align-items: center;

    .user-label-txt {
      font-size: 13px;
      color: #323338;
      letter-spacing: 0;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .no-send {
    color: #1AB9FF;
  }

  .yes-send {
    color: #FF7428;
  }

  .success-send {
    color: #14BC6C;
  }

  .notification-type {
    color: #313233;
  }

  .table-item {
    display: flex;
    align-items: center;

    .type-icon {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }

    .type-icon:last-child {
      margin-right: 0;
    }
  }

  .app-content-list {
    padding: 0 4px;

    .app-content-title {
      font-weight: Bold;
      font-size: 18px;
      color: #323338;
      letter-spacing: 0;
      line-height: 26px;
      margin-bottom: 24px;
    }

    .app-content-line {
      width: 100%;
      height: 1px;
      background: #E6E7EB;
      margin-bottom: 20px;
    }

    .app-content-detail {
      font-size: 16px;
      color: #323338;
      letter-spacing: 0;
      line-height: 24px;
    }

    .app-content-item {
      .app-list-item {
        display: flex;
        align-items: flex-start;
        min-height: 40px;
        font-size: 14px;
        font-weight: 400;
        color: #2c2e33;

        .app-item-title {
          display: flex;
          align-items: center;
          min-height: 28px;
          min-width: 60px;
          font-size: 14px;
          color: #939499;
          letter-spacing: 0;
        }
        .app-item-desc {
          font-size: 14px;
          color: #323338;
          letter-spacing: 0;
          min-height: 28px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          line-height: 28px;
        }

        .see-name {
          cursor: pointer;
          color: #4968FF;
          margin-left: 8px;
        }
      }
    }
  }

  ::v-deep .w-e-toolbar {
    flex-wrap: wrap !important;
  }

  ::v-deep .editor .text {
    height: 370px !important;
  }
</style>
