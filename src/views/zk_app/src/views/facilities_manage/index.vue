<template>
  <section class="app-container right-side-dialog">
    <section class="filter-container common-filter">
      <div class="filter-left">
        <div class="filter-item">
          <label class="label">设施名称：</label>
          <el-input
            v-model="facilitiesObj.facility_name"
            placeholder="请输入"
          />
        </div>
        <div class="filter-item">
          <label class="label">设施位置：</label>
          <el-cascader
            v-model="facilitiesObj.facility_location"
            :options="buildingList"
            clearable
            :props="{ checkStrictly: true }"
            @change="handleSearchChange"
          />
        </div>
        <div class="filter-item">
          <label class="label">设施编号：</label>
          <el-input v-model="facilitiesObj.facility_no" placeholder="请输入" />
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
    <div style="margin-top: 20px">
      <div class="main-header">
        <div class="left">
          <span
            v-if="functionList.includes('A44001')"
            class="spp-btn spp-btn-primary"
            @click="addFacility"
          >
            <svg-icon icon-class="add" />
            <span>新增</span>
          </span>
          <span
            v-if="functionList.includes('A44003')"
            class="spp-btn"
            @click="batchDelete"
          >
            <svg-icon icon-class="delete" />
            <span>删除</span>
          </span>
          <span class="spp-btn" @click="exportAll">
            <svg-icon icon-class="exportAll" />
            <span>导出设施信息</span>
          </span>
          <span class="spp-btn" @click="handleAllExportCard">
            <svg-icon icon-class="exportAll" />
            <span>批量导出风险卡</span>
          </span>
        </div>
      </div>
      <div class="main-body">
        <el-table ref="multipleTable" :data="facilitiesData">
          <el-table-column type="selection" width="55" />>
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="设施名称" prop="facility_name" />
          <el-table-column label="设施位置" prop="building_name" />
          <el-table-column label="设施编号" prop="facility_no" />
          <el-table-column label="风险点等级" prop="risk_rank" width="110">
            <template slot-scope="scope">
              <span
                v-show="scope.row.risk_rank === '1'"
                class="risk_label big_risk"
              >重大风险</span>
              <span
                v-show="scope.row.risk_rank === '2'"
                class="risk_label middle_risk"
              >较大风险</span>
              <span
                v-show="scope.row.risk_rank === '3'"
                class="risk_label small_risk"
              >一般风险</span>
              <span
                v-show="scope.row.risk_rank === '4'"
                class="risk_label micro_risk"
              >低风险</span>
            </template>
          </el-table-column>
          <el-table-column label="风险点数量" prop="ri_count" />
          <el-table-column label="负责人" prop="facilty_head_person" />
          <el-table-column label="负责人电话" prop="facilty_head_phone" />
          <el-table-column label="创建人" prop="user_name" />
          <el-table-column label="创建时间" prop="create_time" sortable>
            <template slot-scope="scope">{{
              scope.row.create_time | fgTime
            }}</template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                v-if="functionList.includes('A44004')"
                type="text"
                @click="seeCode(scope.row.id)"
              >二维码</el-button>
              <el-button type="text">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    更多
                    <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="handleExportCard(scope.row)"
                    >导出风险卡</el-dropdown-item>
                    <el-dropdown-item
                      v-if="functionList.includes('A19002')"
                      @click.native="handleDetection(scope.row.id, 1)"
                    >生成风险公告</el-dropdown-item>
                    <el-dropdown-item
                      v-if="functionList.includes('A19003')"
                      @click.native="handleDetection(scope.row.id, 2)"
                    >生成事故处置应急卡</el-dropdown-item>
                    <el-dropdown-item
                      v-if="functionList.includes('A44002')"
                      @click.native="open_related_video(scope.row.id)"
                    >相关视频</el-dropdown-item>
                    <el-dropdown-item
                      v-if="functionList.includes('A44002')"
                      @click.native="editFacility(scope.row)"
                    >编辑</el-dropdown-item>
                    <el-dropdown-item
                      v-if="functionList.includes('A44003')"
                      @click.native="deleteItem(scope.row.id)"
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
          :page.sync="facilitiesObj.page_num"
          :limit.sync="facilitiesObj.page_size"
          @pagination="getData"
        />
      </div>
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
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="设施名称：" prop="facility_name">
          <el-input
            v-model="ruleForm.facility_name"
            placeholder="请输入设施名称"
          />
        </el-form-item>
        <el-form-item label="设施位置：" prop="facility_location">
          <el-cascader
            v-model="ruleForm.facility_location"
            style="width: 100%"
            :options="buildingList"
            clearable
            :props="{ checkStrictly: true }"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="设施编号：" prop="facility_no">
          <el-input
            v-model="ruleForm.facility_no"
            placeholder="请输入设施编号"
          />
        </el-form-item>
        <el-form-item label="设施描述：" prop="activity_content">
          <el-input
            v-model="ruleForm.facility_desc"
            type="textarea"
            :rows="4"
            placeholder="请输入设施描述"
          />
        </el-form-item>
        <el-form-item label="负责人：" prop="facilty_head_person">
          <el-input v-model="ruleForm.facilty_head_person" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="负责人电话：" prop="facilty_head_phone">
          <el-input v-model="ruleForm.facilty_head_phone" placeholder="请输入负责人电话" />
        </el-form-item>
      </el-form>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn spp-btn-primary" @click="editSubmit">提交</span>
        <span class="spp-btn" @click="resetEditData">重置</span>
      </div>
    </el-dialog>
    <el-image-viewer
      v-if="showViewer"
      :on-close="closeViewer"
      :url-list="[pic_url]"
    />
    <el-drawer
      v-if="related_video"
      title="相关视频"
      :visible.sync="related_video"
      class="spp-drawer related_video_drawer"
      :wrapper-closable="false"
    >
      <div class="related_video_list">
        <div
          v-for="(item, index) in video_list"
          :key="index"
          class="related_video_item"
        >
          <div class="related_video_item_title">
            <div>
              <span>视频名称：</span>
              <span>{{ item.video_name }}</span>
            </div>

            <div class="right">
              <img
                src="../../assets/images/facilities_video_edit.png"
                alt=""
                class="facilities_video_icon"
                @click="openVideoDialog(item)"
              >
              <img
                src="../../assets/images/facilities_video_delete.png"
                alt=""
                class="facilities_video_icon"
                @click="deleteVideo(item.fv_id)"
              >
            </div>
          </div>
          <div>
            <span>视频链接：</span>
            <a
              :href="
                'https://wx.zm-teach.com/spp_tools/index.php/index/Web/video?id=' +
                  sf_id +
                  '&index=' +
                  index
              "
              target="_blank"
              class="video_url_text"
            >{{ item.video_url }}</a>
          </div>
        </div>
      </div>
      <div class="spp-add-btn" @click="openVideoDialog">添加视频</div>
      <!-- 新增视频 -->
      <el-drawer
        :title="editVideoTitle"
        :append-to-body="true"
        :visible.sync="editVideoDialog"
        class="spp-child-drawer right-noall-content"
        :wrapper-closable="false"
      >
        <el-form
          v-if="editVideoDialog"
          ref="ruleVideoForm"
          :model="ruleVideoForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="视频名称" prop="video_name">
            <el-input
              v-model="ruleVideoForm.video_name"
              placeholder="请输入视频名称"
            />
          </el-form-item>
          <el-form-item label="视频链接" prop="video_url">
            <el-input
              v-model="ruleVideoForm.video_url"
              placeholder="请输入视频链接"
            />
          </el-form-item>
        </el-form>
        <div class="dialog-btn riskcontrol-btn">
          <span class="spp-btn" @click="editVideoDialog = false">取消</span>
          <span class="spp-btn spp-btn-primary" @click="addVideo">确定</span>
        </div>
      </el-drawer>
    </el-drawer>
  </section>
</template>

<script>
import {
  paginate,
  saveFacility,
  updateFacility,
  delFacility,
  facilityQrcode,
  exportFacilityZip,
  getFacilityFvList,
  saveFacilityFv,
  updateFacilityFv,
  deleteFacilityFv
} from '@/api/facilities_manage'
import { getBuildingList } from '@/api/building'
import { BuildingListToTree } from '@/utils/index'
import Pagination from '@/components/Pagination'
import { generateNotice, generatePlanInfo, exportCard, exportAllCard, getNotice, getPlanInfo } from '@/api/risk_point'
import { mapState } from 'vuex'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'Facilities',
  components: { Pagination, ElImageViewer },
  data() {
    return {
      id: [],
      buildingList: [],
      facilitiesObj: {
        facility_name: '',
        facility_location: '',
        facility_no: '',
        page_num: 1,
        page_size: 10
      },
      facilitiesData: [], // 列表数据
      total: 0,
      showDialog: false, // 编辑或者新增模态标识
      dialogTitle: '', // 新增编辑模态框标题
      ruleForm: {
        id: '',
        facility_name: '',
        facility_desc: '',
        facility_location: '',
        facility_no: '',
        facilty_head_person: '',
        facilty_head_phone: ''
      },
      rules: {
        facility_name: [
          { required: true, message: '请输入设施名称', trigger: 'blur' }
        ],
        facility_location: [
          { required: true, message: '请选择设施位置', trigger: 'blur' }
        ],
        video_name: [
          { required: true, message: '请输入视频名称', trigger: 'blur' }
        ],
        video_url: [
          { required: true, message: '请输入视频链接', trigger: 'blur' }
        ]
      },
      showViewer: false,
      related_video: false,
      editVideoDialog: false,
      pic_url: '',
      ruleVideoForm: {
        video_name: '',
        video_url: ''
      },
      video_list: [],
      editVideoTitle: '',
      sf_id: '',
      fv_id: ''
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  created() {
    this.getData()
    this.getBuildingList()
  },
  methods: {
    // 重置搜索选项
    resetData() {
      Object.assign(
        this.$data.facilitiesObj,
        this.$options.data().facilitiesObj
      )
    },
    handleSearchChange(value) {
      if (value) {
        this.facilitiesObj.facility_location = value[value.length - 1]
      }
    },

    handleChange(value) {
      if (value) {
        this.ruleForm.facility_location = value[value.length - 1]
      }
    },
    searchData() {
      this.facilitiesObj.page_num = 1
      this.getData()
    },
    // 获取列表数据
    getData() {
      const {
        facility_name,
        facility_location,
        facility_no,
        page_num,
        page_size
      } = this.facilitiesObj
      paginate(
        facility_name,
        facility_location,
        facility_no,
        page_num,
        page_size
      ).then((res) => {
        this.facilitiesData = res.data.list
        this.total = res.data.totalRow
      })
    },

    // 获取设施位置
    getBuildingList() {
      getBuildingList().then((res) => {
        this.buildingList = BuildingListToTree(res.data, '0')
      })
    },

    // 删除数据
    deleteItem(id) {
      this.$confirm('您确定要删除该设施吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delFacility(id).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getData()
          })
        })
        .catch(() => {})
    },

    // 批量删除
    batchDelete() {
      let str = ''
      this.$refs.multipleTable.store.states.selection.forEach((item) => {
        str += item.id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      str
        ? this.deleteItem(str)
        : this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
    },

    // 新增学校设施
    addFacility() {
      Object.assign(this.$data.ruleForm, this.$options.data().ruleForm)
      this.dialogTitle = '新增学校设施'
      this.showDialog = true
    },

    // 编辑学校设施
    editFacility(item) {
      this.ruleForm = { ...item }
      this.dialogTitle = '编辑学校设施'
      this.showDialog = true
    },

    // 重置编辑数据
    resetEditData() {
      this.$refs.ruleForm.resetFields()
    },

    // 提交编辑数据
    editSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const {
            facility_name,
            facility_desc,
            facility_location,
            facility_no,
            facilty_head_person,
            facilty_head_phone
          } = this.ruleForm
          if (!this.ruleForm.id) {
            // 新增
            saveFacility(
              facility_name,
              facility_desc,
              facility_location,
              facility_no,
              facilty_head_person,
              facilty_head_phone
            ).then((res) => {
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
            updateFacility(
              this.ruleForm.id,
              facility_name,
              facility_desc,
              facility_location,
              facility_no,
              facilty_head_person,
              facilty_head_phone
            ).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.showDialog = false
              this.getData()
            })
          }
        } else {
          console.log('error submit!!')
        }
      })
    },

    seeCode(id) {
      facilityQrcode(id).then((res) => {
        this.pic_url = res.data.qrcode
        this.showViewer = true
      })
    },

    closeViewer() {
      this.showViewer = false
    },
    handleDetection(risk_id, type) {
      if (type === 1) {
        getNotice(risk_id, '1').then((res) => {
          this.downloadNotice(risk_id)
        })
      } else {
        getPlanInfo(risk_id, '1').then((res) => {
          this.downloadPlaninfo(risk_id)
        })
      }
    },
    async exportAll() {
      const url = await exportFacilityZip()
      window.open(url)
    },
    async downloadNotice(risk_id) {
      const url = await generateNotice(risk_id, '1')
      window.open(url)
    },
    async downloadPlaninfo(risk_id) {
      const url = await generatePlanInfo(risk_id, '1')
      window.open(url)
    },
    open_related_video(sf_id) {
      this.video_list = []
      this.sf_id = sf_id
      getFacilityFvList(sf_id).then((res) => {
        this.video_list = res.data
        this.related_video = true
      })
    },
    getFacilityFvList() {
      getFacilityFvList(this.sf_id).then((res) => {
        this.video_list = res.data
        this.related_video = true
      })
    },
    openVideoDialog(item) {
      Object.assign(
        this.$data.ruleVideoForm,
        this.$options.data().ruleVideoForm
      )
      !item.fv_id
        ? (this.editVideoTitle = '新增视频')
        : (this.editVideoTitle = '编辑视频')
      if (item.fv_id) {
        this.ruleVideoForm = JSON.parse(JSON.stringify(item))
      }
      this.fv_id = item.fv_id
      this.editVideoDialog = true
    },
    addVideo() {
      this.$refs.ruleVideoForm.validate((valid) => {
        if (valid) {
          const { video_name, video_url } = this.ruleVideoForm
          if (!this.fv_id) {
            saveFacilityFv(this.sf_id, video_name, video_url).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.getFacilityFvList()
              this.editVideoDialog = false
            })
          } else {
            updateFacilityFv(this.fv_id, video_name, video_url).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 3000
              })
              this.getFacilityFvList()
              this.editVideoDialog = false
            })
          }
        } else {
          console.log('error submit!!')
        }
      })
    },
    deleteVideo(fv_id) {
      this.$confirm('您确定要删除该视频吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteFacilityFv(fv_id).then((res) => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 3000
            })
            this.getFacilityFvList()
          })
        })
        .catch(() => {})
    },
    async handleExportCard(data) {
      if (data.facility_no && data.facility_no !== '') {
        const url = await exportCard(data.id)
        window.open(url)
      } else {
        this.$message({
          message: '设备编号不存在，请先录入!',
          type: 'error',
          duration: 3000
        })
      }
    },
    async handleAllExportCard() {
      const data = {
        facility_location: this.facilitiesObj.facility_location,
        facility_no: this.facilitiesObj.facility_no
      }
      const url = await exportAllCard(data.facility_location, data.facility_no)
      window.open(url)
    }
  }
}
</script>
<style lang="scss" scoped>
.related_video_list {
  .related_video_item {
    background: #f5faff;
    border: 1px solid #e1e3e6;
    color: #313233;
    margin-bottom: 20px;
    padding: 10px;
    word-break: break-all;
  }
  .related_video_item_title {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .facilities_video_icon {
      width: 16px;
      height: 16px;
      cursor: pointer;
      &:first-of-type {
        margin-right: 10px;
      }
    }
  }
  .video_url_text {
    text-decoration: underline;
    color: #3399ff;
  }
}
.riskcontrol-btn {
  text-align: right;
  .spp-btn {
    margin-left: 0;
    margin-right: 20px;
  }
}
.spp-child-drawer {
  .riskcontrol-btn {
    position: absolute;
    width: 100%;
    height: 50px;
    line-height: 50px;
    bottom: 0;
    left: 0;
    width: calc(100% -50px);
    border-top: 1px solid #d3d7db;
  }
}
</style>
<style lang="scss">
.related_video_drawer {
  .el-drawer__body {
    margin-bottom: 0;
  }
}
</style>
