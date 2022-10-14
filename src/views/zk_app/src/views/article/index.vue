<template>
  <div class="app-container page-container right-side-dialog">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="文章分类：">
            <el-select v-model="search.article_category" clearable placeholder="请选择">
              <el-option v-for="(item, k) in article_category" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="文章标题：">
            <el-input v-model="search.article_title" placeholder="请输入" />
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="resetForm()">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-header">
      <div class="left">
        <span v-if="functionList.includes('A35002')" class="spp-btn spp-btn-primary" @click="addArticle()">
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="functionList.includes('A35004')" class="spp-btn" @click="delBatch()">
          <svg-icon icon-class="delete" />
          <span>删除</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="文章标题" prop="title" />
        <el-table-column label="文章类型" prop="category">
          <template slot-scope="scope">{{ article_category[scope.row.category] }}</template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template
            slot-scope="scope"
          >{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="create_oper" />
        <el-table-column prop="address" label="操作" width="130">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A35001')" type="text" @click="showDetail(scope.row.id)">详情</el-button>
            <el-button type="text">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="functionList.includes('A35003')" @click.native="edit(scope.row.id)">编辑
                  </el-dropdown-item>
                  <el-dropdown-item v-if="functionList.includes('A35004')" @click.native="del(scope.row.id)">删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
    </div>
    <!-- 详情 -->
    <el-dialog title="文章详情" :visible.sync="showDetailDialog" width="720px" class="draw_dialog">
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-form label-width="120px">
          <el-form-item class="detail-el-form-item" label="文章标题：">
            {{ detail.article_title }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="文章分类：">
            {{ article_category[detail.article_category] }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="是否推荐到首页">
            {{ detail.article_is_recommend==0?'不推荐':'推荐' }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="图片：">
            <img v-if="detail.banner_url" :src="detail.banner_url" class="avatar">
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="文章内容：" />
          <div v-html="detail.wangEnduitDetail" />
        </el-form>
      </el-scrollbar>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="文章标题：" prop="article_title">
            <el-input v-model="form.article_title" placeholder="请输入文章标题" />
          </el-form-item>
          <el-form-item label="上传图片：" prop="article_banner">
            <el-upload :action="upload_url" accept=".jpg, .jpeg, .png" :http-request="uploadFile">
              <img v-if="banner_url" :src="banner_url" class="avatar">
              <el-button slot="trigger" class="spp-btn spp-btn-primary" size="small">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">上传附件不超过20MB</div> -->
            </el-upload>
          </el-form-item>
          <el-form-item label="文章分类：" prop="article_category">
            <el-select v-model="form.article_category" clearable placeholder="请选择文章分类">
              <el-option v-for="(item, k) in article_category" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否推荐到首页">
            <el-radio v-model="form.article_is_recommend " label="1">推荐</el-radio>
            <el-radio v-model="form.article_is_recommend " label="0">不推荐</el-radio>
          </el-form-item>
          <div>
            <editor-bar v-model="wangEnduitDetail" :is-clear="isClear" />
          </div>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="showDialog = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="submit">保存</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { paginate, detail, save, update, del } from '@/api/article'
import Pagination from '@/components/Pagination'
import EditorBar from '@/components/wangEnduit'
import { formatDateTime } from '@/utils/index'
import { uploadFile } from '@/utils'
import { mapState } from 'vuex'
export default {
  name: 'Article',
  components: { Pagination, EditorBar },
  data() {
    return {
      height: window.innerHeight - 135,
      isClear: false,
      wangEnduitDetail: '',
      search: {
        article_title: '',
        article_category: ''
      },
      article_category: {
        1: '安全教育'
      },
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      showDetailDialog: false,
      dialogTitle: '',
      detail: {},
      upload_url: '',
      banner_url: '',
      form: {
        id: '',
        article_title: '',
        article_category: '',
        article_banner: '',
        article_is_recommend: '1'
      },
      rules: {
        article_title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' }
        ],
        article_category: [
          { required: true, message: '请选择文章分类', trigger: 'blur' }
        ],
        article_banner: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  async created() {
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    searchData: function() {
      this.page = 1
      this.getData()
    },
    getData() {
      paginate(this.search, this.page, this.page_size).then(response => {
        this.data = response.data.list
        this.total = response.data.totalRow
      })
    },
    addArticle() {
      this.banner_url = ''
      this.upload_url = ''
      this.wangEnduitDetail = ''
      this.app_id = ''
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
      this.dialogTitle = '新增文章'
    },
    showDetail(id) {
      detail(id).then(response => {
        this.showDetailDialog = true
        const data = response.data
        this.detail = {
          article_title: data.title,
          article_category: data.category,
          article_is_recommend: data.is_recommend,
          banner_url: process.env.VUE_APP_BASE_API + '/' + data.banner,
          wangEnduitDetail: data.content
        }
      })
    },
    edit(id) {
      this.banner_url = ''
      this.upload_url = ''
      this.wangEnduitDetail = ''
      detail(id).then(response => {
        const data = response.data
        this.form = {
          id: data.id,
          article_title: data.title,
          article_category: data.category,
          article_is_recommend: data.is_recommend,
          article_banner: data.banner
        }
        this.banner_url = process.env.VUE_APP_BASE_API + '/' + data.banner
        this.upload_url = data.banner
        this.wangEnduitDetail = data.content
        this.showDialog = true
        this.dialogTitle = '修改文章'
      })
    },
    del(id) {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => { })
    },
    delBatch() {
      let str = ''
      this.$refs.table.store.states.selection.forEach(item => {
        str += item.id + ','
      })
      str ? str = str.substring(0, str.length - 1) : str
      str ? this.del(str) : ''
      if (str) {
        this.$confirm('确定要删除吗？', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(str).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          })
        }).catch(() => { })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
      }
    },
    submit() {
      if (!this.form.id) {
        // 新增
        this.$refs.form.validate(valid => {
          if (valid) {
            const data = this.form
            data.article_banner = this.upload_url
            data.article_content = this.wangEnduitDetail
            save(data).then(response => {
              this.showDialog = false
              this.$message({
                message: '安全文章添加成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      } else {
        // 修改
        this.$refs.form.validate(valid => {
          if (valid) {
            const data = this.form
            data.article_banner = this.upload_url
            data.article_content = this.wangEnduitDetail
            update(data.id, data).then(response => {
              this.showDialog = false
              this.$message({
                message: '安全文章修改成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      }
    },
    reset() {
      if (this.$refs.hasOwnProperty('form')) {
        this.$refs.form.resetFields()
      }
    },
    uploadFile(params) {
      const data = {
        upload_code: '105'
      }
      const file = params.file
      if (file.size / 1024 / 1024 > 20) {
        this.$message({
          type: 'error',
          message: '上传的文件超过20M'
        })
        return
      }
      uploadFile(data, file).then(response => {
        file.url = response.data.upload_path
        file.attachment_name = file.name.substring(0, file.name.indexOf('.'))
        file.attachment_ext = file.name.substring(
          file.name.indexOf('.') + 1,
          file.name.length
        )
        this.upload_url = response.data.upload_path
        this.form.article_banner = response.data.upload_path
        this.banner_url = process.env.VUE_APP_BASE_API + '/' + response.data.upload_path
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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

  .right-side-dialog .dialog-btn {
    background-color: #fff;
  }
</style>
