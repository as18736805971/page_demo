<template>
  <el-row
    class="app-container page-container right-side-dialog"
    style="margin-bottom: 0; padding-bottom: 0"
  >
    <div class="header-search single_line">
      <el-form
        ref="search_form"
        :model="search"
        :inline="true"
        label-width="120px"
      >
        <div class="form-area">
          <el-form-item label="学校地区：">
            <el-cascader v-model="search.area" :props="props" clearable />
          </el-form-item>
          <el-form-item label="学校名称：">
            <el-input v-model="search.scl_name" placeholder="请输入" />
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <el-button
            class="spp-btn spp-btn-primary"
            @click="searchData()"
          >搜索</el-button>
          <el-button class="spp-btn" @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-header">
      <div class="left">
        <el-button
          v-if="functionList.includes('A10001')"
          class="spp-btn spp-btn-primary"
          @click="addSchool()"
        >
          <svg-icon icon-class="add" />
          <span>新增</span>
        </el-button>
        <el-button
          v-if="functionList.includes('A10003')"
          class="spp-btn"
          @click="delSchoolBatch()"
        >
          <svg-icon icon-class="delete" />
          <span>删除</span>
        </el-button>
        <el-button class="spp-btn" @click="showError = true">
          <svg-icon icon-class="exportAll" />
          <span>批量导入</span>
        </el-button>
        <el-button class="spp-btn" @click="uploadHistory()">
          <svg-icon icon-class="exportAll" />
          <span>上传历史</span>
        </el-button>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="sclData">
        <el-table-column type="selection" width="55" />>
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="学校名称" prop="scl_name" />
        <el-table-column label="学校编号" prop="scl_no" width="80" />
        <el-table-column label="省份" prop="province_name" />
        <el-table-column label="城市" prop="area_name" />
        <el-table-column label="地区" prop="county_name" />
        <el-table-column label="学校联系电话" prop="scl_phone" />
        <el-table-column label="管理员权限" prop="fp_count" width="120">
          <template slot-scope="scope">{{
            scope.row.fp_count > 0 ? "自定义" : "默认"
          }}</template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{
            formatDateTime(scope.row.create_time)
          }}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              v-if="functionList.includes('A10002')"
              type="text"
              @click="editSchoolAuth(scope.row.admin_role_id)"
            >管理员权限</el-button>
            <el-button type="text">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="functionList.includes('A10002')"
                    @click.native="editSchool(scope.row)"
                  >编辑</el-dropdown-item>
                  <el-dropdown-item
                    v-if="functionList.includes('A10003')"
                    @click.native="delSchool(scope.row)"
                  >删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="page"
        :limit.sync="page_size"
        @pagination="getData"
      />
    </div>
    <el-dialog
      v-if="showDialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="showDialog"
      class="draw_dialog spp-drawer"
    >
      <el-scrollbar
        wrap-class="vertical_scrollbar"
        :style="{ height: height + 'px' }"
      >
        <el-form
          v-if="showDialog"
          ref="form"
          :model="form"
          :rules="rules"
          label-width="118px"
        >
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="学校名称" prop="scl_name">
                <el-input
                  v-model="form.scl_name"
                  placeholder="请输入学校名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学校电话" prop="scl_phone">
                <el-input
                  v-model="form.scl_phone"
                  placeholder="请输入学校电话"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="学校归属" prop="scl_area">
            <el-cascader
              v-model="form.scl_area"
              :props="props_dialog"
              clearable
              placeholder="请选择学校区域"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="相机X坐标">
            <el-input
              v-model="form.model_cam_init_x"
              type="text"
              placeholder="请输入相机X坐标"
            />
          </el-form-item>
          <el-form-item label="相机Y坐标">
            <el-input
              v-model="form.model_cam_init_y"
              type="text"
              placeholder="请输入相机Y坐标"
            />
          </el-form-item>
          <el-form-item label="相机Z坐标">
            <el-input
              v-model="form.model_cam_init_z"
              type="text"
              placeholder="请输入相机Z坐标"
            />
          </el-form-item>
          <!--<el-form-item label="绑定平安家校" prop="pajx_scl_id">
            <div style="display: flex">
              <div style="width: calc(100% - 56px)" @click="choicePajx">
                <el-input
                  v-model="form.pajx_scl_name"
                  placeholder="请选择平安家校"
                />
              </div>
              <span
                style="color: #3399ff; cursor: pointer; margin-left: 20px"
                @click="unbound"
              >解绑</span>
            </div>
          </el-form-item>-->
          <div v-if="scl_id == ''">
            <!--<el-form-item label="绑定第三方平台" prop="bind_third">
              <el-select v-model="form.bind_third" placeholder="请选择">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>-->
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item label="学校管理员" prop="scl_admin_name">
                  <el-input
                    v-model="form.scl_admin_name"
                    placeholder="请输入学校管理员姓名"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学校管理员电话" prop="scl_admin_phone">
                  <el-input
                    v-model="form.scl_admin_phone"
                    placeholder="请输入学校管理员手机号"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item
              v-if="form.bind_third === '1'"
              label="第三方学校标识"
              prop="mm_schoolid"
            >
              <el-input
                v-model="form.mm_schoolid"
                placeholder="请输入第三方学校标识"
              />
            </el-form-item>
          </div>

          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="学校学生数">
                <el-input
                  v-model="form.scl_stu_num"
                  type="number"
                  placeholder="请输入学校学生数"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学校教师数">
                <el-input
                  v-model="form.scl_tea_num"
                  type="number"
                  placeholder="请输入学校教师数"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-input v-model="form.scl_model" type="hidden" class="spp-hidden" />-->
          <el-form-item label="学校平面图">
            <el-upload
              :action="'#'"
              accept=".jpg, .jpeg, .png"
              :http-request="uploadFileImg"
              :show-file-list="false"
            >
              <img v-if="form.scl_model" :src="down_url + '/' + form.scl_model" class="avatar">
              <el-button slot="trigger" class="spp-btn spp-btn-primary" size="small">点击上传</el-button>
            </el-upload>
            <!--<Uploadfile
              :accept="'.obj'"
              :limit="true"
              :slot-tip="'只能上传obj文件，且不超过20MB'"
              :file-list="fileList"
              @getFileList="getFileList"
            />-->
          </el-form-item>
          <el-form-item label="学校地址" prop="scl_address">
            <el-input
              v-model="form.scl_address"
              type="textarea"
              :rows="2"
              placeholder="请输入学校地址"
            />
          </el-form-item>
          <input v-model="form.scl_location" type="hidden">
          <el-form-item label="地图位置">
            <mapSelect
              :position="form.scl_location"
              style="width: 100%; height: 400px"
              @getPosition="getPosition"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn spp-btn-primary" @click="submit()">提交</span>
        <span class="spp-btn" @click="showDialog = false">取消</span>
      </div>
      <el-drawer
        title="选择平安家校"
        :append-to-body="true"
        :visible.sync="selectPajxDialog"
        class="spp-child-drawer"
      >
        <SelectPajx :scl-id="scl_id" @selectPajx="ensurePajx" />
      </el-drawer>
    </el-dialog>
    <el-dialog
      :title="authDialogTitle"
      :visible.sync="showAuthDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar
        wrap-class="vertical_scrollbar"
        :style="{ height: height + 'px' }"
      >
        <TreeView
          v-if="showAuthDialog"
          :data="menuTree"
          :checked.sync="authChecked"
          :selected="authSelected"
          :height="height + 'px'"
          title="权限列表"
          @updateChecked="updateChecked"
        />
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn spp-btn-primary" @click="saveAuth()">保存</span>
        <span class="spp-btn" @click="showAuthDialog = false">取消</span>
      </div>
    </el-dialog>
    <el-dialog
      :title="'上传历史'"
      :visible.sync="showHistory"
      :close-on-click-modal="false"
      width="1100px"
    >
      <div>
        <el-table ref="table" :data="history_list">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="源文件名称">
            <template slot-scope="scope">
              <el-button type="text" @click="handleDown(scope.row.sb_id)">{{ scope.row.file_ori_name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="上传时间" width="180">
            <template slot-scope="scope">
              {{ formatDateTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column label="上传人员" width="150" prop="user_name" />
          <el-table-column label="完成时间" width="180">
            <template slot-scope="scope">
              {{ formatDateTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column label="处理总数" width="80">
            <template slot-scope="scope">
              {{ scope.row.total_num || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="成功数" width="80">
            <template slot-scope="scope">
              {{ scope.row.success_num || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="失败数" width="80">
            <template slot-scope="scope">
              <template v-if="scope.row.fail_num && Number(scope.row.fail_num) > 0">
                <el-button type="text" @click="handleDownErr(scope.row.sb_id)">{{ scope.row.fail_num }}</el-button>
              </template>
              <template v-else>0</template>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="history_total > 0"
          :total="history_total"
          :page.sync="history_page"
          :limit.sync="page_size"
          @pagination="changePage"
        />
      </div>
    </el-dialog>
    <el-dialog
      :title="'学校批量导入'"
      :visible.sync="showError"
      :close-on-click-modal="false"
      width="900px"
    >
      <div>
        <el-form>
          <el-form-item>
            <el-link type="primary" :underline="false" :href="down_url + '/tpl/scl_batch_add.xlsx'" target="_blank">下载学校模版</el-link>
          </el-form-item>
          <el-form-item>
            <el-upload
              ref="upload"
              :action="'#'"
              :accept="'.xlsx'"
              :http-request="uploadFile"
              :on-change="handleUploadFileChange"
              :file-list="fileList1"
              :auto-upload="true"
            >
              <el-button slot="trigger" class="spp-btn spp-btn-primary" size="small">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过20MB</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div v-if="error_list.length !== 0" class="error-txt">上传错误数据</div>
        <el-table v-if="error_list.length !== 0" ref="table" :data="error_list">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="学校名称" prop="sclName" />
          <el-table-column label="省份" prop="province_code_name" />
          <el-table-column label="城市" prop="county_code_name" />
          <el-table-column label="地区" prop="area_code_name" />
          <el-table-column label="管理员姓名" prop="admin_name" />
          <el-table-column label="管理员电话" prop="scl_phone" />
          <el-table-column label="错误信息" prop="errorMsg" />
        </el-table>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  paginate,
  addSchool,
  getSclInfo,
  editSchool,
  deleteSchool,
  getHistoryList,
  download,
  downloadErr
} from '@/api/school'
import { getRoleAuth, editRoleAuth } from '@/api/role'
import Pagination from '@/components/Pagination'
import { formatDateTime, getAreaData, formatMenuAuth, uploadFileUrl } from '@/utils/index'
import TreeView from '@/components/Treeview'
import mapSelect from '@/components/BaiduMap/select'
import SelectPajx from './components/select_pajx'
import { mapState } from 'vuex'
export default {
  name: 'School',
  components: { Pagination, TreeView, mapSelect, SelectPajx },
  data() {
    return {
      height: window.innerHeight - 135,
      fileList: [],
      area_default: '请选择学校区域',
      props: {
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          getAreaData(node, resolve)
        }
      },
      props_dialog: {
        lazy: true,
        lazyLoad(node, resolve) {
          getAreaData(node, resolve)
        }
      },
      search: {
        area: '',
        scl_name: ''
      },
      sclData: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      showAuthDialog: false,
      dialogTitle: '',
      authDialogTitle: '',
      scl_id: '',
      role_id: '',
      selectPajxDialog: false,
      form: {
        scl_name: '',
        scl_area: [],
        scl_model: '',
        model_cam_init_x: 0,
        model_cam_init_y: 6,
        model_cam_init_z: 8,
        bind_third: '0',
        scl_phone: '',
        scl_address: '',
        scl_admin_name: '',
        scl_admin_phone: '',
        mm_schoolid: '',
        scl_location: {},
        scl_stu_num: '',
        scl_tea_num: '',
        pajx_scl_id: '',
        pajx_scl_name: ''
      },
      rules: {
        scl_name: [
          { required: true, message: '请输入学校名称', trigger: 'blur' }
        ],
        scl_area: [
          { required: true, message: '请选择所属区域', trigger: 'blur' }
        ],
        scl_admin_name: [
          { required: true, message: '请输入管理员名称', trigger: 'blur' }
        ],
        scl_admin_phone: [
          { required: true, message: '请输入管理员手机号', trigger: 'blur' }
        ],
        mm_schoolid: [
          { required: true, message: '请输入第三方学校标识', trigger: 'blur' }
        ]
      },
      menuTree: [],
      authChecked: [],
      authSelected: [],
      showHistory: false,
      history_list: [],
      history_page: 1,
      history_total: 0,
      showError: false,
      error_list: [],
      fileList1: [],
      down_url: process.env.VUE_APP_BASE_API
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  watch: {
    showError(val) {
      if (!val) {
        this.fileList1 = []
        this.error_list = []
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取管理措施上传的附件
    getFileList(files) {
      this.form.scl_model = ''
      for (const i in files) {
        this.form.scl_model = files[i].attachment_url
      }
    },
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      const search = {
        scl_name: this.search.scl_name,
        province_code: this.search.area[0],
        area_code: this.search.area[1],
        county_code: this.search.area[2]
      }
      paginate(search, this.page, this.page_size).then((response) => {
        this.sclData = response.data.list
        this.total = response.data.totalRow
      })
    },
    resetForm() {
      this.search.area = ''
      this.search.scl_name = ''
    },
    formatDateTime: formatDateTime,
    addSchool() {
      this.dialogTitle = '新增学校'
      this.area_default = '请选择学校区域'
      this.scl_id = ''
      Object.assign(this.form, this.$options.data().form)
      this.fileList = []
      this.showDialog = true
    },
    editSchool(row) {
      this.dialogTitle = '编辑学校'
      const { scl_id } = row
      getSclInfo(scl_id).then((response) => {
        const data = response.data
        this.scl_id = data.scl_id
        this.form = {
          scl_name: data.scl_name,
          scl_area: [data.province_code, data.area_code, data.county_code],
          scl_model: data.scl_model,
          model_cam_init_x: data.model_cam_init_x,
          model_cam_init_y: data.model_cam_init_y,
          model_cam_init_z: data.model_cam_init_z,
          scl_phone: row.scl_phone,
          scl_address: data.scl_address,
          scl_location: data.scl_location ? JSON.parse(data.scl_location) : {},
          scl_stu_num: data.scl_stu_num,
          scl_tea_num: data.scl_tea_num,
          pajx_scl_name: data.pajx_scl_name,
          pajx_scl_id: data.pajx_scl_id
        }
        this.area_default =
          '已选择 ' + data.area_name + ' / ' + data.county_name
        this.fileList = []
        if (data.scl_model) {
          this.fileList = [
            {
              name: '学校模型',
              url: data.scl_model
            }
          ]
        }
        this.showDialog = true
      })
    },
    delSchool(row) {
      this.$confirm('您确定要删除该学校吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSchool(row.scl_id).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          })
        })
        .catch(() => {})
    },
    delSchoolBatch() {
      const selected_row = this.$refs.table.selection
      if (!selected_row.length) {
        return false
      }
      this.$confirm('您确定要删除该学校吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const ids = []
          selected_row.forEach((item) => {
            ids.push(item.scl_id)
          })
          deleteSchool(ids.join(',')).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          })
        })
        .catch(() => {})
    },
    submit() {
      if (!this.scl_id) {
        // 新增
        this.$refs.form.validate((valid) => {
          if (valid) {
            const data = this.form
            data.province_code = data.scl_area[0]
            data.area_code = data.scl_area[1]
            data.county_code = data.scl_area[2]
            addSchool(data).then((response) => {
              this.showDialog = false
              this.$message({
                message: '学校添加成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      } else {
        // 修改
        this.$refs.form.validate((valid) => {
          if (valid) {
            const data = this.form
            data.province_code = data.scl_area[0]
            data.area_code = data.scl_area[1]
            data.county_code = data.scl_area[2]
            editSchool(data, this.scl_id).then((response) => {
              this.showDialog = false
              this.$message({
                message: '学校编辑成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      }
    },
    // 选择绑定的平安家校
    choicePajx() {
      this.selectPajxDialog = true
    },
    ensurePajx(data) {
      this.form.pajx_scl_id = data.scl_id
      this.form.pajx_scl_name = data.scl_name
      this.selectPajxDialog = false
    },
    // 解除绑定平安家校
    unbound() {
      this.form.pajx_scl_id = ''
      this.form.pajx_scl_name = ''
    },
    editSchoolAuth(role_id) {
      this.role_id = role_id
      getRoleAuth(role_id, 2).then((response) => {
        this.showAuthDialog = true
        const data = response.data
        this.authDialogTitle = '为学校管理员分配权限'
        const result = formatMenuAuth(data)
        this.menuTree = result.menuTree
        this.authChecked = result.authChecked
        this.authSelected = result.authSelected
      })
    },
    saveAuth() {
      editRoleAuth(this.role_id, this.authChecked.join(',')).then(
        (response) => {
          this.showAuthDialog = false
          this.$message({
            message: '学校角色修改成功',
            type: 'success',
            duration: 3000
          })
          this.getData()
        }
      )
    },
    updateChecked(data) {
      this.authChecked = data
    },
    getPosition(data) {
      this.form.scl_location = data
    },
    changePage(e) {
      this.history_page = e.page
      this.uploadHistory()
    },
    uploadHistory() {
      this.showHistory = true
      getHistoryList(this.history_page, this.page_size).then((res) => {
        const data = res.data
        this.history_list = data.list
        this.history_total = data.totalRow
      })
    },
    async handleDown(id) {
      const url = await download(id)
      window.open(url)
    },
    async handleDownErr(id) {
      const url = await downloadErr(id)
      window.open(url)
    },
    uploadFile(params) {
      const data = {
        upload_code: 4
      }
      const file = params.file
      if (file.size / 1024 / 1024 > 20) {
        this.$message({
          type: 'error',
          message: '上传的文件超过20M'
        })
        return
      }
      uploadFileUrl('/api/dd/school/upload/sclbatck', data, file).then((res) => {
        this.error_list = JSON.parse(res.data.fail_json)
        this.getData()
      })
    },
    handleUploadFileChange(file, fileList) {
      this.fileList1 = fileList.slice(-1)
    },
    uploadFileImg(params) {
      const data = {
        upload_code: '301'
      }
      const file = params.file
      if (file.size / 1024 / 1024 > 20) {
        this.$message({
          type: 'error',
          message: '上传的文件超过20M'
        })
        return
      }
      uploadFileUrl('/api/dd/school/upload/sclimg', data, file).then((res) => {
        this.form.scl_model = res.data.upload_path
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.insideuser-container {
  background: #ffffff;
  border-radius: 10px;
}

.school-dialog {
  padding: 0 40px;
}

.error-txt {
  color: #3399ff;
  margin-bottom: 10px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  height: 178px;
  display: block;
}
</style>
