<template>
  <section class="app-container right-side-dialog">
    <div
      v-if="functionList.includes('A53001')"
      class="main-header"
      style="
        background: transparent;
        padding-top: 0;
        padding-right: 0;
        justify-content: flex-end;
      "
    >
      <span class="spp-btn spp-btn-primary" @click="openDialog">
        <svg-icon icon-class="add" />
        <span>新增相册</span>
      </span>
    </div>
    <section class="filter-container common-filter">
      <div class="filter-left">
        <div class="filter-item">
          <label class="label">相册名称：</label>
          <el-input
            v-model="albumObj.album_name"
            placeholder="请输入相册名称"
          />
        </div>
        <div class="filter-item">
          <label class="label">创建时间：</label>
          <el-date-picker
            v-model="albumObj.start_time"
            value-format="yyyyMMddHHmmss"
            type="datetime"
            placeholder="请选择起始时间"
          />
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
    <div>
      <div v-if="album_list.length > 0" class="album_main">
        <el-row>
          <el-col
            v-for="(item, index) in album_list"
            :key="index"
            :span="6"
            class="album_item"
          >
            <div @click="viewDetail(item)">
              <div
                class="cover_img"
                :style="{
                  backgroundImage: 'url(' + segmentation(item.attachment_url[0]) + ')',
                }"
              />
              <div class="title multiple-hidden">
                {{ item.album_name }}
              </div>
              <div class="bot_wrapper">
                <span class="num">{{ item.attachment_url.length }}张</span>
                <div class="control_btn">
                  <span
                    v-if="functionList.includes('A53002')"
                    class="common_btn"
                    @click.stop="editDialog(item)"
                  >编辑</span>
                  <span
                    v-if="functionList.includes('A53003')"
                    class="common_btn"
                    @click.stop="deleteItem(item.id)"
                  >删除</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <pagination
          v-show="total > 0"
          :total="total"
          style="padding: 0 16px 0 0; background: transparent"
          :page.sync="albumObj.page_num"
          :limit.sync="albumObj.page_size"
          @pagination="getData"
        />
      </div>
      <div v-else class="safety_accident_nodata">暂无数据</div>
    </div>
    <!-- 新增或者编辑模态框 -->
    <el-dialog
      v-if="showDialog"
      :title="dialogTitle"
      :visible.sync="showDialog"
      width="720px"
      class="right-noall-content"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="90px"
        class="demo-ruleForm"
      >
        <el-form-item label="相册名称" prop="album_name">
          <el-input
            v-model="ruleForm.album_name"
            placeholder="请输入相册名称"
          />
        </el-form-item>
        <el-form-item label="相册描述" prop="album_desc">
          <el-input
            v-model="ruleForm.album_desc"
            type="textarea"
            :rows="4"
            placeholder="请输入相册描述 "
          />
        </el-form-item>
        <el-form-item label="上传文件" style="position: relative" prop="url">
          <Uploadfile
            v-if="!ruleForm.id"
            accept=".jpg, .jpeg, .png, .gif"
            :limit-num="9"
            :file-list="fileList"
            slot-tip="上传图片不超过5M"
            @getFileList="getFileList"
          />
          <Uploadfile
            v-else
            :limit-num="attachment_list.length"
            :show-file="false"
            slot-tip="上传图片不超过5M"
            @getFile="getEditFileList"
          />
          <span
            style="
              position: absolute;
              left: 120px;
              top: 0;
              color: #faa701;
              font-size: 14px;
            "
          >最多上传9张图片</span>
        </el-form-item>
        <div v-if="ruleForm.id">
          <AttachmentList
            v-if="!deleteStatus"
            :attachment="attachment_list"
            :editable="true"
            :campus="true"
            @deleteAttachment="deleteAttach"
          />
        </div>
      </el-form>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="showDialog = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="editSubmit">提交</span>
      </div>
    </el-dialog>
    <el-dialog
      v-if="detailDialog"
      title="相册详情"
      :visible.sync="detailDialog"
      :close-on-click-modal="false"
      width="720px"
    >
      <div>
        <div class="common-item">
          <span class="title" style="width: 70px">相册名称:</span>
          <span class="content">{{ detailObj.album_name }}</span>
        </div>
        <div class="common-item">
          <span class="title" style="width: 70px">相册描述:</span>
          <span class="content">{{ detailObj.album_desc }}</span>
        </div>
        <div class="common-item">
          <span class="title" style="width: 70px">创建时间:</span>
          <span class="content">{{ detailObj.create_time | fgTime }}</span>
        </div>
        <div class="album_img_main">
          <el-image
            v-for="(item, index) in detailObj.attachment_url"
            :key="index"
            class="album_img_list"
            :src="item"
            fit="fill"
            @click="see_pic(item)"
          />
        </div>
      </div>
      <el-image-viewer
        v-if="showViewer"
        :on-close="closeViewer"
        :url-list="[pic_url]"
      />
    </el-dialog>
  </section>
</template>

<script>
import {
  paginate,
  saveAlbum,
  updateAlbum,
  delAlbum,
  deleteByPicId
} from '@/api/campus_album'
import Pagination from '@/components/Pagination'
import Uploadfile from '@/components/Uploadfile'
import { mapGetters } from 'vuex'
import { processAttach } from '@/utils'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import AttachmentList from '@/components/AttachmentList'
export default {
  name: 'SclAlbum',
  components: { Pagination, Uploadfile, ElImageViewer, AttachmentList },
  data() {
    return {
      fileList: [],
      albumObj: {
        album_name: '',
        start_time: '',
        page_num: 1,
        page_size: 8
      },
      album_list: [], // 列表数据List
      total: 0,
      detailObj: {
        attachment_url: []
      },
      dialogTitle: '',
      showDialog: false, // 修改数据模态框标识
      detailDialog: false,
      ruleForm: {
        id: '',
        album_name: '',
        album_desc: '',
        url: ''
      },
      rules: {
        album_name: [
          { required: true, message: '请输入相册名称', trigger: 'blur' }
        ],
        album_desc: [
          { required: true, message: '请输入相册描述', trigger: 'blur' }
        ],
        url: [{ required: true, message: '请上传图片', trigger: 'blur' }]
      },
      filesData: {},
      pic_url: '',
      showViewer: false,
      attachment_list: [],
      deleteStatus: false,
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
    // 获取新增时上传的附件
    getFileList(files) {
      this.filesData = processAttach(files)
      this.ruleForm.url = this.filesData.attachment_url
    },

    // 获取编辑时上传的附件
    getEditFileList(files) {
      if (this.attachment_list.length > 8) {
        this.$message({
          type: 'warning',
          message: '最多上传9张图片'
        })
        return
      }
      this.deleteStatus = true
      this.attachment_list.push({
        attachment_ext: files.attachment_ext,
        attachment_name: files.attachment_name,
        attachment_sign: files.attachment_url
      })
      setTimeout(() => {
        this.deleteStatus = false
      }, 10)
    },

    // 重置搜索选项
    resetData() {
      Object.assign(this.$data.albumObj, this.$options.data().albumObj)
    },

    searchData() {
      this.albumObj.page_num = 1
      this.getData()
    },

    // 获取列表数据
    async getData() {
      const { album_name, start_time, page_num, page_size } = this.albumObj
      paginate(album_name, start_time, page_num, page_size).then((res) => {
        this.album_list = res.data.list
        this.album_list.forEach((item) => {
          item.attachment = item.album_pic_url.split('|')
          item.attachment_url = item.attachment.map((opt) => {
            return this.down_url + '/' + opt
          })
        })
        this.total = res.data.totalRow
      })
    },

    // 删除相册
    deleteItem(id) {
      this.$confirm('您确定要删除该相册吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delAlbum(id).then((res) => {
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

    // 查看详情
    viewDetail(obj) {
      this.detailObj = obj
      this.detailDialog = true
    },

    // 新增
    openDialog() {
      Object.assign(this.$data.ruleForm, this.$options.data().ruleForm)
      this.dialogTitle = '新建相册'
      this.showDialog = true
    },

    // 编辑
    editDialog(obj) {
      this.attachment_list = []
      this.ruleForm = {
        id: obj.id,
        album_name: obj.album_name,
        album_desc: obj.album_desc,
        url: ''
      }
      obj.attachment.forEach((item, index) => {
        this.attachment_list.push({
          attachment_name: Math.random(),
          attachment_ext: 'jpg',
          attachment_sign: item,
          pic_id: obj.pic_id.split('|')[index]
        })
      })
      this.dialogTitle = '编辑相册'
      this.showDialog = true
    },

    // 提交新增数据
    editSubmit() {
      if (this.ruleForm.id) {
        if (this.attachment_list.length > 0) {
          this.ruleForm.url = 'have'
        } else {
          this.ruleForm.url = ''
        }
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!this.ruleForm.id) {
            const { album_name, album_desc } = this.ruleForm
            // 新增
            saveAlbum(
              album_name,
              album_desc,
              this.filesData.attachment_url
            ).then((res) => {
              this.$message({
                message: '新增相册成功',
                type: 'success',
                duration: 3000
              })
              this.showDialog = false
              this.getData()
            })
          } else {
            const { id, album_name, album_desc } = this.ruleForm
            const attach = this.attachment_list.map((item) => {
              return item.attachment_sign
            })
            // 编辑
            updateAlbum(id, album_name, album_desc, attach.join('|')).then(
              (res) => {
                this.$message({
                  message: '修改相册成功',
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
    see_pic(url) {
      this.pic_url = url
      this.showViewer = true
    },
    closeViewer: function() {
      this.showViewer = false
    },
    deleteAttach(item) {
      if (this.attachment_list.length === 1) {
        this.$message({
          type: 'warning',
          message: '至少保留一张图片'
        })
        return
      }
      this.$confirm('您确定要删除该图片吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteStatus = true
          if (item.pic_id) {
            deleteByPicId(item.pic_id).then((res) => {
              this.$message({
                message: '图片删除成功',
                type: 'success',
                duration: 3000
              })
              this.attachment_list.splice(
                this.attachment_list.indexOf(item),
                1
              )
              this.deleteStatus = false
            })
          } else {
            setTimeout(() => {
              this.$message({
                message: '图片删除成功',
                type: 'success',
                duration: 3000
              })
              this.attachment_list.splice(
                this.attachment_list.indexOf(item),
                1
              )
              this.deleteStatus = false
            }, 10)
          }
        })
        .catch(() => {})
    },
    segmentation(val) {
      return val.replace(/\\/g, '/')
    }
  }
}
</script>
<style lang="scss" scoped>
.album_main {
  margin-top: 15px;
  padding: 0 16px;
  .album_item {
    margin-bottom: 15px;
    background: #ffffff;
    width: calc(25% - 16px);
    margin-right: 16px;
    border-radius: 0px 0px 4px 4px;
    cursor: pointer;
    .cover_img {
      width: 100%;
      padding-bottom: 82%;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .title {
      padding: 0 16px;
      margin-top: 16px;
      font-size: 16px;
      color: #313233;
      -webkit-line-clamp: 2;
    }
    .bot_wrapper {
      display: flex;
      justify-content: space-between;
      padding: 16px;
      align-items: center;
      .num {
        font-size: 14px;
        color: #999999;
      }
      .common_btn {
        display: inline-block;
        width: 64px;
        height: 26px;
        background: #ffffff;
        border: 1px solid #d3d7db;
        border-radius: 4px;
        text-align: center;
        line-height: 26px;
        font-size: 14px;
        color: #626466;
        cursor: pointer;
        &:first-of-type {
          margin-right: 10px;
        }
        &:hover {
          color: #3399ff;
          border: 1px solid #3399ff;
        }
      }
    }
  }
}
.album_img_main {
  border-top: 1px solid #ebf0f5;
  padding-top: 24px;
  .album_img_list {
    width: calc(25% - 9px);
    margin-right: 11px;
    margin-bottom: 9px;
    &:nth-child(4n + 0) {
      margin-right: 0;
    }
  }
}
</style>
<style lang="scss">
.album_img_list {
  img {
    height: 152px;
    cursor: pointer;
  }
}
</style>
