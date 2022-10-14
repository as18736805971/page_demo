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
        <span v-if="functionList.includes('A51001')" class="spp-btn spp-btn-primary" @click="addArticle()">
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="functionList.includes('A51003')" class="spp-btn" @click="delBatch()">
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
        <el-table-column label="文章分类" prop="category_name" />
        <el-table-column label="创建时间">
          <template
            slot-scope="scope"
          >{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="create_oper" />
        <el-table-column prop="address" label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="showDetail(scope.row.id)">详情</el-button>
            <el-button type="text">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="functionList.includes('A51002')" @click.native="edit(scope.row.id)">编辑
                  </el-dropdown-item>
                  <el-dropdown-item v-if="functionList.includes('A51003')" @click.native="del(scope.row.id)">删除
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
            {{ detail.article_category }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="图片：">
            <img v-if="detail.article_banner" :src="detail.article_banner" class="avatar">
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="文章内容：" />
          <div v-html="detail.article_content" />
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
            <el-upload :action="form.article_banner" :limit="1" accept=".jpg, .jpeg, .png" :http-request="uploadFile">
              <img v-if="banner_url" :src="banner_url" class="avatar">
              <el-button slot="trigger" class="spp-btn spp-btn-primary" size="small">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">上传附件不超过5MB</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="文章分类：" prop="article_category">
            <el-select v-model="form.article_category" clearable placeholder="请选择文章分类">
              <el-option v-for="(item, k) in article_category" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <div>
            <editor-bar v-model="form.article_content" :is-clear="isClear" />
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
import { paginate, getNewsDetail, addNews, editNews, deleteNews } from '@/api/scl_news'
import { getCategoryList } from '@/api/scl_news_cate'
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
      search: {
        article_title: '',
        article_category: ''
      },
      article_category: {},
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
        article_banner: '',
        article_category: '',
        article_content: ''
      },
      rules: {
        article_title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' }
        ],
        article_banner: [
          { required: true, message: '请上传文章封面', trigger: 'blur' }
        ],
        article_category: [
          { required: true, message: '请选择文章分类', trigger: 'blur' }
        ],
        article_content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
    this.getCategoryList()
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    searchData: function() {
      this.page = 1
      this.getData()
    },
    getCategoryList() {
      getCategoryList().then((res) => {
        res.data.map((e) => {
          this.article_category[e.id] = e.category_name
        })
      })
    },
    getData() {
      paginate(this.search, this.page, this.page_size).then(response => {
        this.data = response.data.list
        this.total = response.data.totalRow
      })
    },
    resetForm() {
      Object.assign(this.$data.search, this.$options.data().search)
    },
    addArticle() {
      this.banner_url = ''
      this.getCategoryList()
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
      this.dialogTitle = '新增文章'
    },
    showDetail(id) {
      getNewsDetail(id).then(response => {
        this.showDetailDialog = true
        const data = response.data
        this.detail = {
          article_title: data.title,
          article_category: data.category_name,
          article_banner: process.env.VUE_APP_BASE_API + '/' + data.banner,
          article_content: data.content
        }
      })
    },
    edit(id) {
      this.upload_url = ''
      getNewsDetail(id).then(response => {
        const data = response.data
        this.form = {
          id: data.id,
          article_title: data.title,
          article_banner: data.banner,
          article_category: data.category,
          article_content: data.content
        }
        this.banner_url = process.env.VUE_APP_BASE_API + '/' + data.banner
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
        deleteNews(id).then(response => {
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
          deleteNews(str).then(response => {
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
            addNews(this.form).then(response => {
              this.showDialog = false
              this.$message({
                message: '文章添加成功',
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
            editNews(this.form.id, this.form).then(response => {
              this.showDialog = false
              this.$message({
                message: '文章修改成功',
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
      if (file.size / 1024 / 1024 > 5) {
        this.$message({
          type: 'error',
          message: '上传的文件超过5M'
        })
        return
      }
      uploadFile(data, file).then(response => {
        this.banner_url = process.env.VUE_APP_BASE_API + '/' + response.data.upload_path
        this.form.article_banner = response.data.upload_path
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
