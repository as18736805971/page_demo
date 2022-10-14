<template>
  <section class="app-container">
    <section class="filter-container common-filter">
      <div class="filter-left">
        <div class="filter-item">
          <label class="label">文件名称：</label>
          <el-input v-model="fileObj.file_name" placeholder="请输入文件名称" />
        </div>
      </div>
      <div class="filter-right">
        <div class="filter-btn">
          <span
            class="spp-btn spp-btn-primary"
            @click="searchData()"
          >搜索</span>
          <span class="spp-btn" @click="resetData">重置</span>
        </div>
      </div>
    </section>
    <div class="filelibray-container">
      <div class="main-header">
        <div class="left">
          <span
            v-if="functionList.includes('A41001')"
            class="spp-btn spp-btn-primary"
            @click="openDialog"
          >
            <svg-icon icon-class="add" />
            <span>新增</span>
          </span>
        </div>
      </div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item><span
          class="all_category"
          @click="resetPage"
        >全部分类</span></el-breadcrumb-item>
        <el-breadcrumb-item v-if="page_title">{{
          page_title
        }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div v-if="parent_page">
        <div class="main-body filelibray-list">
          <el-row :gutter="24">
            <el-col
              v-for="(item, k) in file_category"
              :key="k"
              :lg="4"
              :md="6"
              :sm="6"
              :xs="12"
            >
              <div style="cursor: pointer" @click="viewDetail(k, item)">
                <el-card>
                  <svg-icon
                    icon-class="folder"
                    class="image"
                    style="height: 200px"
                  />
                  <div class="item-control des" style="text-align: center">
                    <span>{{ item }}</span>
                  </div>
                  <div class="item-control category" style="padding: 0 20px">
                    <span>{{ file_category[item.file_category] }}</span>
                  </div>
                </el-card>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-else>
        <div v-if="fileData.length > 0" class="main-body filelibray-list">
          <el-row :gutter="24">
            <el-col
              v-for="(item, index) in fileData"
              :key="index"
              :lg="4"
              :md="6"
              :sm="6"
              :xs="12"
            >
              <el-card>
                <img
                  v-if="pic_ext.includes(item.file_ext)"
                  src="../../assets/images/file_pic.png"
                  class="image"
                  alt
                >
                <img
                  v-else-if="audio_ext.includes(item.file_ext)"
                  src="../../assets/images/file_audio.png"
                  class="image"
                  alt
                >
                <img
                  v-else-if="video_ext.includes(item.file_ext)"
                  src="../../assets/images/file_video.png"
                  class="image"
                  alt
                >
                <img
                  v-else
                  src="../../assets/images/file_doc.png"
                  class="image"
                  alt
                >
                <el-tooltip
                  placement="top"
                  :content="item.file_name + '.' + item.file_ext"
                >
                  <div class="item-control des" style="padding: 0 20px">
                    <span
                      class="multiple-hidden"
                      style="
                        -webkit-line-clamp: 2;
                        height: 32px;
                        word-break: break-all;
                      "
                    >{{ item.file_name + "." + item.file_ext }}</span>
                  </div>
                </el-tooltip>
                <div class="item-control category" style="padding: 0 20px">
                  <span>{{ file_category[item.file_category] }}</span>
                </div>
                <div
                  class="item-control"
                  style="text-align: center; margin-top: 16px"
                >
                  <span
                    v-if="functionList.includes('A41002')"
                    class="spp-btn"
                    style="margin-right: 5px"
                    @click="downLoad(item)"
                  >下载</span>
                  <span
                    v-if="functionList.includes('A41003')"
                    class="spp-btn"
                    style="margin-right: 0"
                    @click="deleteItem(item.id)"
                  >删除</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <pagination
            v-show="total > 0"
            :total="total"
            style="padding: 0 16px 0 0"
            :page.sync="fileObj.page_num"
            :limit.sync="fileObj.page_size"
            @pagination="getData"
          />
        </div>
        <div v-else class="file_no_data table_line">暂无数据</div>
      </div>
    </div>
    <el-dialog
      v-if="showDialog"
      title="新增文件"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="650px"
    >
      <div v-if="showDialog" class="interface-dialog">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="110px"
          class="demo-ruleForm"
        >
          <el-form-item label="文件分类" prop="file_category">
            <el-select
              v-model="ruleForm.file_category"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="(item, k) in file_category"
                :key="k"
                :label="item"
                :value="k"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="上传文件">
            <Uploadfile :limit="true" @getFileList="getFileList" />
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-btn">
        <span class="spp-btn spp-btn-primary" @click="editSubmit">提交</span>
        <span class="spp-btn" @click="showDialog = false">取消</span>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  paginate,
  category,
  saveLibrary,
  deleteLibrary
} from '@/api/file_libray'
import Pagination from '@/components/Pagination'
import Uploadfile from '@/components/Uploadfile'
import { mapGetters } from 'vuex'
import { processAttach } from '@/utils'
export default {
  name: 'FileLibray',
  components: { Pagination, Uploadfile },
  data() {
    return {
      fileList: [],
      fileObj: {
        file_name: '',
        file_category: '',
        page_num: 1,
        page_size: 12
      },
      file_category: {},
      fileData: [], // 列表数据List
      total: 0,
      showDialog: false, // 修改数据模态框标识
      ruleForm: {
        file_category: '',
        file_url: '',
        file_name: '',
        file_ext: ''
      },
      rules: {
        file_category: [
          { required: true, message: '请选择文件分类', trigger: 'blur' }
        ],
        file_url: [{ required: true, message: '请上传文件', trigger: 'blur' }]
      },
      pic_ext: ['jpg', 'jpeg', 'png', 'gif'],
      audio_ext: ['mp3'],
      video_ext: ['mp4'],
      parent_page: true,
      page_title: '',
      down_url: process.env.VUE_APP_BASE_API
    }
  },
  computed: {
    ...mapGetters(['functionList'])
  },
  created() {
    this.getCategory()
  },
  methods: {
    getFileList(files) {
      const { attachment_url, attachment_name, attachment_ext } = processAttach(
        files
      )
      this.ruleForm.file_url = attachment_url
      this.ruleForm.file_name = attachment_name
      this.ruleForm.file_ext = attachment_ext
    },

    async downLoad(data) {
      window.open(this.down_url + '/' + data.file_url)
    },

    // 返回一级页面
    resetPage() {
      this.page_title = ''
      this.fileObj.file_category = ''
      this.fileObj.file_name = ''
      this.parent_page = true
    },

    // 重置搜索选项
    resetData() {
      this.fileObj.file_name = ''
    },

    // 获取文件分类字典
    getCategory() {
      category().then((res) => {
        this.file_category = res.data
      })
    },

    // 全局搜索数据
    searchData() {
      this.page_title = '搜索结果'
      this.fileObj.page_num = 1
      this.fileObj.file_category = ''
      this.getData()
    },

    // 获取列表数据
    getData() {
      const { file_name, file_category, page_num, page_size } = this.fileObj
      paginate(file_category, file_name, page_num, page_size).then((res) => {
        this.fileData = res.data.list
        this.parent_page = false
        this.total = res.data.totalRow
      })
    },

    // 删除文件
    deleteItem(id) {
      this.$confirm('您确定要删除该文件吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteLibrary(id).then((res) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 3000
            })
            this.getData()
          })
        })
        .catch(() => {})
    },

    // 新增
    openDialog() {
      Object.assign(this.$data.ruleForm, this.$options.data().ruleForm)
      this.showDialog = true
    },

    // 提交新增数据
    editSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const {
            file_category,
            file_url,
            file_name,
            file_ext
          } = this.ruleForm
          // 新增
          saveLibrary(file_category, file_url, file_name, file_ext).then(
            (res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.showDialog = false
              this.fileObj.file_category = file_category
              this.page_title = this.file_category[file_category]
              this.getData()
            }
          )
        } else {
          console.log('error submit!!')
        }
      })
    },

    // 查看该分类下的文件
    viewDetail(k, title) {
      this.fileObj.file_category = k
      this.page_title = title
      this.getData()
    }
  }
}
</script>
<style lang="scss" scoped>
.filelibray-container {
  background: #ffffff;
  margin-top: 20px;
  border-radius: 10px;
  .el-col {
    margin-bottom: 15px;
  }
  .main-body {
    padding: 20px;
  }
  .file_no_data {
    text-align: center;
    line-height: 28px;
    color: #626466;
    font-size: 14px;
    padding: 20px 0;
  }
  .all_category {
    cursor: pointer;
    &:hover {
      color: #3399ff;
    }
  }
  .filelibray-list {
    .image {
      width: 100%;
    }
    .item-control {
      .spp-btn {
        display: inline-block;
        height: 30px;
        padding: 0 10px;
        line-height: 30px;
      }
    }
    .des {
      font-size: 14px;
      color: #313233;
    }
    .category {
      margin-top: 8px;
      font-size: 12px;
      color: #909399;
    }
  }
  .main-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ebf0f5;
  }
  .common_text {
    font-size: 14px;
    cursor: pointer;
  }
  .edit {
    color: #3399ff;
    margin-left: 10px;
  }
  .delete {
    color: #f36861;
  }
}
.interface-dialog {
  padding: 0 100px;
}
.dialog-btn {
  padding: 0 220px;
  margin-bottom: 30px;
  margin-top: 10px;
}
</style>
<style lang="scss">
.filelibray-list {
  .el-card__body {
    padding: 20px 0;
  }
}
.filelibray-container {
  .el-breadcrumb {
    height: 50px;
    border-bottom: 1px solid #ebf0f5;
    line-height: 50px;
    padding: 0 16px;
  }
}
</style>
