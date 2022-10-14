<template>
  <div class="app-container page-container right-side-dialog">
    <!-- 表格 -->
    <div class="content_view">
      <!-- 操作按鈕 -->
      <div class="main-header">
        <el-row :gutter="20">
          <el-col :span="4" class="left">告警音列表</el-col>
          <el-col :span="20" class="right">
            <span v-if="auth.save != -1" class="spp-btn spp-btn-primary" @click="editVisible = true"><svg-icon icon-class="add" />新增告警音</span>
          </el-col>
        </el-row>
      </div>
      <el-table ref="table" :data="paginate_data" :height="height - 93" size="mini" stripe>
        <el-table-column label="#" type="index" width="60" />
        <el-table-column label="告警音名称" prop="audio_name" align="left" />
        <el-table-column label="文件名" prop="file_name" align="left" />
        <el-table-column label="添加时间" align="left">
          <template slot-scope="scope">{{ scope.row.create_time | formatDate }}</template>
        </el-table-column>
        <el-table-column label="音频" min-width="150" align="left">
          <template slot-scope="scope">
            <div style="margin: 10px 0">
              <audio-play ref="audio_play" :audio-url="scope.row.audio_url" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right" align="left">
          <template slot-scope="scope">
            <el-button v-if="auth.delete != -1" type="text" style="color: #FF4949" @click="handleDel(scope.row)">删除</el-button>
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
    <!-- 新增告警音 -->
    <el-dialog
      v-if="editVisible"
      title="新增告警音"
      :visible.sync="editVisible"
      :close-on-click-modal="false"
      width="720px"
      custom-class="alarm-dialog"
    >
      <el-form ref="form" :label-position="'top'" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="告警音名称" prop="audio_name">
          <el-input v-model="form.audio_name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="选择告警音文件">
          <el-upload
            action="upload_url"
            :limit="1"
            :http-request="uploadFile"
          >
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="editVisible = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="onSubmit()">确定</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { decrypt, httpRequest, uploadFile } from '@/utils/auth'
import AudioPlay from '@/components/Audio'
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'
export default {
  name: 'AlarmSound',
  components: { AudioPlay, Pagination },
  data() {
    return {
      height: window.innerHeight - 98,
      auth: {},
      editVisible: false,
      search: {
        page_num: 1, // 当前页条数
        page_size: 20 // 当前页数
      },
      paginate_data: [],
      total: 0,
      upload_file: '',
      form: {
        audio_name: ''
      },
      rules: {
        audio_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
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
        this.upload_file = ''
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
    permissionAuth() {
      this.auth.save = this.permission.indexOf('/api/pajx/audio/save')
      this.auth.delete = this.permission.indexOf('/api/pajx/audio/delete')
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
      httpRequest('/api/pajx/audio/paginate', this.search).then(res => {
        var data = JSON.parse(decrypt(res.data))
        this.paginate_data = data.records
        this.paginate_data.map((item) => {
          item.audio_url = process.env.VUE_APP_BASE_API + item.audio_url
        })
        this.total = data.total
      })
    },
    handleDel(data) {
      this.$confirm('确认要删除该告警音吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        httpRequest('/api/pajx/audio/delete', {
          audio_id: data.audio_id
        }, false).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.fetchData()
        })
      })
    },
    uploadFile(params) {
      this.upload_file = params.file
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          uploadFile('/api/pajx/upload/web', {
            upload_code: 'add_warn_audio'
          }, this.upload_file).then((res) => {
            var obj = JSON.parse(decrypt(res.data))
            httpRequest('/api/pajx/audio/save', {
              audio_name: this.form.audio_name,
              file_name: obj.original_name,
              audio_url: obj.upload_path
            }, false).then((res) => {
              this.editVisible = false
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.queryData()
            })
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
.alarm-dialog {
  left: 50% !important;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 350px !important;
  overflow-y: hidden !important;
}

.audio-content {
  margin-top: 0 !important;
}
</style>
