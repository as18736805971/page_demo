<template>
  <section class="app-container">
    <section class="filter-container common-filter">
      <div class="filter-left">
        <div class="filter-item">
          <label class="label">警示标志名称：</label>
          <el-input v-model="dangericonObj.icon_name" placeholder="请输入警示标志名称" />
        </div>
      </div>
      <div class="filter-right">
        <div class="filter-btn">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="resetData">重置</span>
        </div>
      </div>
    </section>
    <div class="dangericon-container">
      <div class="main-header">
        <div class="left">
          <span
            v-if="functionList.includes('A33001')"
            class="spp-btn spp-btn-primary"
            @click="openDialog('添加警示标志', { icon_name: '',icon_url: ''})"
          >
            <svg-icon icon-class="add" />
            <span>新增</span>
          </span>
        </div>
      </div>
      <div class="main-body dangericon-list">
        <el-row :gutter="24">
          <el-col v-for="(item, index) in dangericonData" :key="index" :span="4">
            <el-card>
              <div class="image" :style="{backgroundImage: 'url('+ down_url + '/' + segmentation(item.icon_url) +')'}" />
              <div class="item-control des">
                <span>标志名称：{{ item.icon_name }}</span>
                <div style="height: 20px;line-height: 20px">标志关键字：{{ item.keyword }}</div>
              </div>
              <div class="item-control" style="text-align: center">
                <span
                  v-if="functionList.includes('A33002')"
                  class="spp-btn"
                  style="margin-right: 5px"
                  @click="openDialog('编辑警示标志', item)"
                >编辑</span>
                <span
                  v-if="functionList.includes('A33003')"
                  class="spp-btn"
                  style="margin-right: 0"
                  @click="deleteItem(item.icon_id)"
                >删除</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <pagination
          v-show="total>0"
          :total="total"
          style="padding: 0 16px 0 0"
          :page.sync="dangericonObj.page_num"
          :limit.sync="dangericonObj.page_size"
          @pagination="getData"
        />
      </div>
    </div>
    <el-dialog
      :title="eldialog"
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
          <el-form-item label="警示标志名称" prop="icon_name">
            <el-input v-model="ruleForm.icon_name" />
          </el-form-item>
          <el-form-item label="警示标志关键字" prop="keyword">
            <el-input v-model="ruleForm.keyword" show-word-limit maxlength="6" />
          </el-form-item>
          <el-form-item label="上传警示标志" prop="icon_url">
            <el-upload
              action
              accept=".jpg, .jpeg, .png, .gif"
              list-type="picture-card"
              :http-request="uploadFile"
              :on-change="handleUploadFileChange"
              :on-remove="handleRemove"
              :on-preview="handlePictureCardPreview"
              :file-list="fileList"
            >
              <i slot="default" class="el-icon-plus" />
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-btn">
        <span class="spp-btn spp-btn-primary" @click="editSubmit">提交</span>
        <span class="spp-btn" @click="showDialog=false">取消</span>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </section>
</template>

<script>
import {
  Paginate,
  saveDangericon,
  updateDangericon,
  deleteDangericon
} from '@/api/dangericon'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import { uploadFileUrl } from '@/utils'
export default {
  name: 'Dangericon',
  components: { Pagination },
  data() {
    return {
      fileList: [],
      dangericonObj: {
        icon_name: '',
        page_num: 1,
        page_size: 12
      },
      dangericonData: [], // 列表数据List
      total: 0,
      eldialog: '', // 新增编辑模态框标题
      showDialog: false, // 修改数据模态框标识
      ruleForm: {
        icon_name: '',
        keyword: '',
        icon_url: ''
      },
      transferSign: {
        sign: '', // 1代表新增  2代表编辑
        id: '' // 警示标志id
      },
      rules: {
        icon_name: [
          { required: true, message: '请输入警示标志名称', trigger: 'blur' }
        ],
        icon_url: [
          { required: true, message: '请上传警示标志', trigger: 'blur' }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      down_url: process.env.VUE_APP_BASE_API
    }
  },
  computed: {
    ...mapGetters(['functionList'])
  },
  created() {
    this.getData()
  },
  methods: {
    async uploadFile({ file }) {
      if (file.size / 1024 / 1024 > 20) {
        this.$message({
          type: 'error',
          message: '上传的文件超过20M'
        })
        return
      }
      uploadFileUrl('/api/dd/school/upload/sclimg', {
        upload_code: 302
      }, file).then((res) => {
        this.ruleForm.icon_url = res.data.upload_path
      })
    },

    handleUploadFileChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    handleRemove(file, fileList) {
      this.ruleForm.icon_url = ''
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 重置搜索选项
    resetData() {
      Object.assign(
        this.$data.dangericonObj,
        this.$options.data().dangericonObj
      )
    },

    searchData() {
      this.dangericonObj.page_num = 1
      this.getData()
    },
    // 获取列表数据
    async getData() {
      const { icon_name, page_num, page_size } = this.dangericonObj
      Paginate(icon_name, page_num, page_size).then(res => {
        this.dangericonData = res.data.list
        this.total = res.data.totalRow
      })
    },

    // 删除警示标志
    deleteItem(icon_id) {
      this.$confirm('您确定要删除该警示标志吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDangericon(icon_id).then(res => {
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

    // 新增 或者 编辑警示标志
    openDialog(title, itemObj) {
      this.fileList = []
      this.transferSign = {
        sign: title === '添加警示标志' ? 1 : 2,
        id: itemObj.icon_id
      }
      this.ruleForm = { ...itemObj }
      if (this.transferSign.sign === 2) {
        this.fileList = [
          {
            name: itemObj.icon_name,
            url: this.down_url + '/' + itemObj.icon_url
          }
        ]
      }
      this.eldialog = title
      this.showDialog = true
    },

    // 提交新增或者编辑数据
    editSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const { icon_name, icon_url, keyword } = this.ruleForm
          if (this.transferSign.sign === 1) {
            // 新增
            saveDangericon(icon_name, icon_url, keyword).then(res => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.showDialog = false
              this.getData()
            })
          } else {
            // 编辑
            updateDangericon(this.transferSign.id, icon_name, icon_url, keyword).then(
              res => {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 3000
                })
                this.showDialog = false
                this.getData()
              }
            )
          }
        } else {
          console.log('error submit!!')
        }
      })
    },
    segmentation(val) {
      return val.replace(/\\/g, '/')
    }
  }
}
</script>
<style lang="scss" scoped>
.dangericon-container {
  background: #ffffff;
  margin-top: 20px;
  border-radius: 10px;
  .el-col {
    margin-bottom: 15px;
  }
  .main-body {
    padding: 20px;
  }
  .dangericon-list {
    .image {
      width: 100%;
      padding-bottom: 134%;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .item-control {
      margin-top: 10px;
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
}
</style>
