<template>
  <div class="app-container page-container right-side-dialog notice-page">
    <div class="col_bg" style="border-radius: 4px;position:relative;">
      <span
        v-if="functionList.includes('A36002')"
        class="spp-btn spp-btn-primary"
        style="position:absolute; top: 14px; right: 0px; z-index: 5"
        @click="addNotice()"
      >
        <svg-icon icon-class="add" />新建通知
      </span>
      <el-tabs v-model="activeName">
        <el-tab-pane label="我收到的" name="first">
          <NoticeList
            :list.sync="my_recive_list"
            :function-list="functionList"
            :can-delete="false"
            @showDetail="showDetail"
            @update="getAllData"
          />
          <pagination
            v-show="page_recive_total>0"
            :total="page_recive_total"
            :page.sync="page_recive"
            :limit.sync="page_recive_size"
            @pagination="getReciveData"
          />
        </el-tab-pane>
        <el-tab-pane label="我发出的" name="second" class="mysend-list">
          <NoticeList
            :list.sync="my_send_list"
            :function-list="functionList"
            :can-delete="true"
            @showDetail="showDetail"
            @update="getAllData"
          />
          <pagination
            v-show="page_send_total>0"
            :total="page_send_total"
            :page.sync="page_send"
            :limit.sync="page_send_size"
            @pagination="getSendData"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      title="新增通知"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="733px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: (height - 50) + 'px'}">
        <el-form v-if="showDialog" ref="ruleForm" :model="form" :rules="rules" label-width="120px">
          <el-form-item v-if="user_type == '1'" label="接收学校" prop="scl_id">
            <el-transfer
              v-model="form.scl_id"
              :data="scl_list"
              :titles="['学校列表', '已选择学校']"
              filterable
              filter-placeholder="搜索学校名称"
              class="dialog_trans"
            />
          </el-form-item>
          <el-form-item v-if="user_type == '2'" label="接收人" prop="user_id">
            <el-transfer
              v-model="form.user_id"
              :data="user_list"
              :titles="['人员列表', '已选择人员']"
              filterable
              filter-placeholder="搜索人员名称"
              class="dialog_trans"
            />
          </el-form-item>
          <el-form-item label="通知标题" prop="notice_title">
            <el-input v-model="form.notice_title" :rows="4" placeholder="请输入报告内容" />
          </el-form-item>
          <el-form-item label="通知内容" prop="notice_content">
            <el-input
              v-model="form.notice_content"
              type="textarea"
              :rows="4"
              placeholder="请输入报告内容"
            />
          </el-form-item>
          <el-form-item label="上传附件">
            <Uploadfile @getFileList="getFileList" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn spp-btn-primary" @click="noticeSubmit">提交</span>
        <span class="spp-btn" @click="showDialog = false">取消</span>
      </div>
    </el-dialog>
    <el-dialog title="通知详情" :visible.sync="showDetailDialog" width="720px" class="draw_dialog">
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <div style="display:flex; align-items:center">
          <Avatar :img="detail.avatar" :text="detail.user_name" />
          <div style="margin-left: 16px;">
            <div style="font-size: 14px; color: #626466">{{ detail.user_name }}</div>
            <div
              style="font-size: 12px; color: #939699; margin-top: 8px"
            >{{ formatDateTime(detail.create_time) }}</div>
          </div>
        </div>
        <div style="font-size:18px; color: #313233; margin-top: 20px">{{ detail.notice_title }}</div>
        <div
          style="font-size: 14px; color: #626466; word-wrap:break-word; margin-top: 16px;"
        >{{ detail.notice_content }}</div>
        <div
          style="background-color: #EBF0F5; border-radius: 4px; display: inline-block; margin-top: 22px; padding: 0 8px;"
        >
          <span style="color: #939699">{{ user_type === '2' ? '接收人：' : '接收学校：' }}</span>
          <span style="color: #313233">{{ detail.notice_count }}{{ user_type === '2' ? '人' : '个' }}</span>
          <span style="color: #C4C8CC; margin: 0 10px">|</span>
          <el-button type="text" @click="see_people(detail.notice_id)">查看</el-button>
        </div>
        <AttachmentList
          v-if="detail.notice_attachment.length > 0"
          :attachment="detail.notice_attachment"
          style="margin-top: 10px"
        />
      </el-scrollbar>
    </el-dialog>
    <el-dialog title="查看接收方" :visible.sync="showPeopleDialog" width="480px" class="draw_dialog">
      <div v-if="user_type === '2'">
        <div style="text-align: center">
          <el-radio-group v-model="select_label">
            <el-radio-button
              v-for="(item, k) in radio_label"
              :key="k"
              :label="item.name"
              @click.native="changeLabel(item.type)"
            />
          </el-radio-group>
        </div>
        <div v-if="label_selected === '1'">
          <div
            v-for="(item, k) in notice_user_list_ok"
            :key="k"
            class="space_between"
            style="padding: 12px 0; border-bottom: 1px solid #EBEDF0"
          >
            <div style="display:flex; align-items:center">
              <Avatar :img="item.avatar" :text="item.user_name" />
              <span style="margin-left: 16px;">{{ item.user_name }}</span>
            </div>
            <div style="color:#53D37E; line-height: 48px;">已确定收到</div>
          </div>
        </div>
        <div v-if="label_selected === '0'">
          <div
            v-for="(item, k) in notice_user_list_no_ok"
            :key="k"
            class="space_between"
            style="padding: 12px 0; border-bottom: 1px solid #EBEDF0"
          >
            <div style="display:flex; align-items:center">
              <Avatar :img="item.avatar" :text="item.user_name" />
              <span style="margin-left: 16px;">{{ item.user_name }}</span>
            </div>
            <div style="color:#AFB0B3; line-height: 48px;">未确定</div>
          </div>
        </div>
      </div>
      <div v-if="user_type === '1'">
        <div
          v-for="(item, k) in notice_scl_list"
          :key="k"
          class="space_between"
          style="padding: 12px 0; border-bottom: 1px solid #EBEDF0"
        >
          <span style="margin-left: 16px; line-height: 36px">{{ item.user_name }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import NoticeList from './components/list'
import Avatar from '@/components/Avatar'
import AttachmentList from '@/components/AttachmentList'
import { paginate, detail, person, save } from '@/api/notice'
import { getSclUserList } from '@/api/school_user'
import { get_edu_scl } from '@/api/special_inspection'
import { formatDateTime } from '@/utils/index'
import { mapState } from 'vuex'
import Uploadfile from '@/components/Uploadfile'
export default {
  name: 'Notice',
  components: { Pagination, NoticeList, Avatar, AttachmentList, Uploadfile },
  data() {
    return {
      upload_url: '',
      height: window.innerHeight - 90,
      activeName: 'first',
      my_recive_list: [],
      my_send_list: [],
      page_recive: 1,
      page_recive_size: 10,
      page_recive_total: 0,
      page_send: 1,
      page_send_size: 10,
      page_send_total: 0,
      showDialog: false,
      showDetailDialog: false,
      showPeopleDialog: false,
      form: {
        notice_title: '',
        notice_content: '',
        scl_id: [],
        user_id: [],
        attachment_url: '',
        attachment_name: '',
        attachment_ext: ''
      },
      files: {},
      scl_list: [],
      user_list: [],
      rules: {
        notice_title: [
          { required: true, message: '请输入通知标题', trigger: 'blur' }
        ],
        notice_content: [
          { required: true, message: '请输入通知内容', trigger: 'blur' }
        ],
        scl_id: [
          { required: true, message: '请选择要接收的学校', trigger: 'blur' }
        ],
        user_id: [
          { required: true, message: '请选择要接收的用户', trigger: 'blur' }
        ]
      },
      detail: {
        notice_id: '',
        notice_title: '',
        notice_content: '',
        create_time: '',
        create_oper: '',
        avatar: '',
        notice_count: '',
        notice_attachment: []
      },
      select_label: '',
      radio_label: [],
      notice_user_list_ok: [],
      notice_user_list_no_ok: [],
      notice_scl_list: [],
      label_selected: '1'
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList,
      user_type: state => state.user.user_type
    })
  },
  created() {
    this.getReciveData()
    this.getSendData()
  },
  methods: {
    formatDateTime: formatDateTime,
    getFileList(files) {
      this.files = files
    },
    getReciveData() {
      paginate('0', '1', this.page_recive, this.page_recive_size).then(res => {
        this.page_recive_total = res.data.totalRow
        this.my_recive_list = res.data.list
      })
    },
    getSendData() {
      paginate('1', '0', this.page_send, this.page_send_size).then(res => {
        this.page_send_total = res.data.totalRow
        this.my_send_list = res.data.list
      })
    },
    getAllData() {
      this.getReciveData()
      this.getSendData()
    },
    getUserData() {
      Object.assign(this.form, this.$options.data().form)
      this.files = {}
      this.scl_list = []
      this.user_list = []
      if (this.user_type === '2') {
        getSclUserList().then(res => {
          const data = res.data
          data.forEach(item => {
            this.user_list.push({
              label: item.user_name,
              key: item.user_id
            })
          })
        })
      } else if (this.user_type === '1') {
        get_edu_scl().then(res => {
          const data = res.data
          data.forEach(item => {
            this.scl_list.push({
              label: item.scl_name,
              key: item.scl_id
            })
          })
        })
      }
    },
    addNotice: function() {
      this.showDialog = true
      this.getUserData()
    },
    noticeSubmit: function() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const data = {
            notice_title: this.form.notice_title,
            notice_content: this.form.notice_content,
            user_id: '',
            attachment_url: '',
            attachment_name: '',
            attachment_ext: ''
          }
          let attachment_url = ''
          let attachment_name = ''
          let attachment_ext = ''
          for (const i in this.files) {
            attachment_url += this.files[i].attachment_url + '|'
            attachment_name += this.files[i].attachment_name + '|'
            attachment_ext += this.files[i].attachment_ext + '|'
          }
          data.attachment_url = attachment_url.substring(
            0,
            attachment_url.length - 1
          )
          data.attachment_name = attachment_name.substring(
            0,
            attachment_name.length - 1
          )
          data.attachment_ext = attachment_ext.substring(
            0,
            attachment_ext.length - 1
          )
          if (this.user_type === '2') {
            data.user_id = this.form.user_id.join(',')
          } else if (this.user_type === '1') {
            data.user_id = this.form.scl_id.join(',')
          }
          save(data).then(res => {
            this.showDialog = false
            this.getAllData()
          })
        } else {
          console.log('error submit!!')
        }
      })
    },
    showDetail: function(id) {
      detail(id).then(res => {
        const data = res.data
        this.detail = {
          notice_id: data.notice_id,
          notice_title: data.notice_title,
          notice_content: data.notice_content,
          create_time: data.create_time,
          user_name: data.user_name,
          notice_count: data.notice_count,
          avatar: '',
          notice_attachment: []
        }
        if (data.attachment_url) {
          const attachment_url = data.attachment_url.split('|')
          const attachment_name = data.attachment_name.split('|')
          const attachment_ext = data.attachment_ext.split('|')
          for (const i in attachment_url) {
            const tmp = {
              attachment_url: attachment_url[i],
              attachment_name: attachment_name[i],
              attachment_ext: attachment_ext[i]
            }
            this.detail.notice_attachment.push(tmp)
          }
        }
        this.showDetailDialog = true
      })
    },
    see_people: function(id) {
      this.label_selected = '1'
      this.notice_user_list_ok = []
      this.notice_user_list_no_ok = []
      if (this.user_type === '2') {
        person(id).then(res => {
          const data = res.data
          let ok = 0
          let not = 0
          data.forEach(item => {
            if (Number(item.is_review) === 1) {
              ok++
              this.notice_user_list_ok.push(item)
            } else {
              not++
              this.notice_user_list_no_ok.push(item)
            }
          })
          this.radio_label = [
            {
              name: '已确定(' + ok + ')',
              type: '1'
            },
            {
              name: '未确定(' + not + ')',
              type: '0'
            }
          ]
          this.select_label = this.radio_label[0].name
          this.showPeopleDialog = true
        })
      } else if (this.user_type === '1') {
        person(id).then(res => {
          this.notice_scl_list = res.data
          this.showPeopleDialog = true
        })
      }
    },
    changeLabel(type) {
      this.label_selected = type
    }
  }
}
</script>
<style lang="scss">
.notice-page {
  .el-tabs__header {
    margin: 0;
  }
  .mysend-list {
    padding-top: 15px;
  }
}
</style>
