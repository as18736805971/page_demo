<template>
  <div class="app-container page-container right-side-dialog" style="padding-bottom:0">
    <el-row>
      <el-col :span="8">
        <div :style="{height: height + 'px'}" class="col_bg">
          <div style="padding-bottom:16px; border-bottom: 1px solid #EBF0F5;padding-top: 16px">
            <div style="float:left; font-size: 16px; line-height: 30px;color: #313233">学校建筑列表</div>
            <div style="float:right"><span style="margin-right:0" class="spp-btn" @click="addBuilding"><svg-icon icon-class="add-building" />添加建筑</span></div>
            <div style="clear: both" />
          </div>
          <el-tree
            :data="treeData"
            node-key="id"
            :expand-on-click-node="false"
            class="building_tree"
          >
            <span slot-scope="{data}" class="custom-tree-node" @click="showDetail(data.id)">
              <div>
                <img v-if="listData[data.id].building_type == '1'" src="../../assets/icon/building.png">
                <img v-if="listData[data.id].building_type == '2'" src="../../assets/icon/floor.png">
                <img v-if="listData[data.id].building_type == '3'" src="../../assets/icon/room.png">
                <span>
                  {{ data.label }}
                </span>
              </div>
              <span v-if="selectedId == data.id">
                <el-button v-if="functionList.includes('A21002') && listData[data.id].building_type == '1'" type="text" size="mini" @click="(e) => addSubBuilding(data.id, e)">添加楼层</el-button>
                <el-button v-if="functionList.includes('A21002') && listData[data.id].building_type == '2'" type="text" size="mini" @click="(e) => addSubBuilding(data.id, e)">添加房间</el-button>
                <el-button v-if="functionList.includes('A21003')" type="text" size="mini" @click="(e) => editBuilding(data.id, e)">编辑</el-button>
                <el-button v-if="functionList.includes('A21004')" type="text" size="mini" :disabled="data.hasOwnProperty('children') && data.children.length > 0" @click="(e) => deleteBuilding(data.id, e)">删除</el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="16">
        <div :style="{height: height * 0.6 + 'px'}" class="col_bg no_padding">
          <plan-img :height="height * 0.6" :url="url" />
        </div>
        <div :style="{height: height * 0.4 + 'px'}" class="col_bg" style="padding: 8px 16px;">
          <div style="padding-bottom:8px; border-bottom: 1px solid #EBF0F5">
            <div style="float:left; font-size: 16px; line-height: 30px;color: #313233">建筑详情</div>
            <!-- <div v-if="detail && building_type_selected != '2'" style="float: right; font-size: 12px;">
              <span>
                <div v-if="detail.bind_model_name" style="display:inline-block">
                  <span style="color:#3399FF">已关联模型</span>
                  <span v-if="!canSelect">
                    <el-button v-if="functionList.includes('A21005')" class="spp-btn" style="margin:0 0 0 8px;" @click="canSelect = true"><svg-icon icon-class="link" />重新关联</el-button>
                    <el-button v-if="functionList.includes('A21005')" class="spp-btn" style="margin:0 0 0 8px;" @click="() => cancelLink(detail.id)"><svg-icon icon-class="unlink" />取消关联</el-button>
                  </span>
                  <span v-else>
                    <el-button class="spp-btn" style="margin:0 0 0 8px;" @click="() => linkBuilding(detail.id)">确定</el-button>
                    <el-button class="spp-btn" style="margin:0 0 0 8px;" @click="() => cancelSelect(detail.id)">取消</el-button>
                  </span>
                </div>
                <div v-else style="display:inline-block">
                  <span style="color:#313233">未关联模型</span>
                  <span v-if="!canSelect">
                    <el-button v-if="functionList.includes('A21005')" class="spp-btn" style="margin:0 0 0 8px;" @click="canSelect = true"><svg-icon icon-class="link" />关联模型</el-button>
                  </span>
                  <span v-else>
                    <el-button class="spp-btn" style="margin:0 0 0 8px;" @click="() => linkBuilding(detail.id)">确定</el-button>
                    <el-button class="spp-btn" style="margin:0 0 0 8px;" @click="() => cancelSelect(detail.id)">取消</el-button>
                  </span>
                </div>
              </span>
            </div>-->
            <div style="clear: both" />
          </div>
          <div>
            <div v-if="detail">
              <el-row class="building_detail">
                <el-col :span="8">
                  <div class="info">
                    <span>建筑结构：</span>
                    <span>{{ detail.building_struct }}</span>
                  </div>
                  <div class="info">
                    <span>安全等级：</span>
                    <span>{{ safty_level[detail.building_safety_level] }}</span>
                  </div>
                  <div class="info">
                    <span>建筑名称：</span>
                    <span>{{ detail.building_name }}</span>
                  </div>
                  <div class="info">
                    <span>建筑面积(m2)：</span>
                    <span>{{ detail.building_area }}</span>
                  </div>
                  <div class="info">
                    <span>建筑层数：</span>
                    <span>{{ detail.floor_count }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info">
                    <span>楼层高度(m)：</span>
                    <span>{{ detail.floor_height }}</span>
                  </div>
                  <div class="info">
                    <span>建筑高度(m)：</span>
                    <span>{{ detail.building_height }}</span>
                  </div>
                  <div class="info">
                    <span>建筑时间：</span>
                    <span>{{ detail.building_time }}</span>
                  </div>
                  <div class="info">
                    <span>管理员数(人)：</span>
                    <span>{{ detail.teacher_count }}</span>
                  </div>
                  <div class="info">
                    <span>成员数(人)：</span>
                    <span>{{ detail.student_count }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info">
                    <span>楼梯数：</span>
                    <span>{{ detail.stairs_count }}</span>
                  </div>
                  <div class="info">
                    <span>电梯数：</span>
                    <span>{{ detail.lift_count }}</span>
                  </div>
                  <div class="info">
                    <span>建筑用途：</span>
                    <span>{{ detail.building_function }}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div v-else style="text-align:center; margin-top: 100px; color: #999">
              点击左侧菜单树以查看建筑详情
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 新增或者编辑模态框 -->
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" :close-on-click-modal="false" width="720px" class="right-noall-content draw_dialog">
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: drawer_height + 'px'}">
        <el-form ref="buildingForm" :model="buildingForm" :rules="rules" label-width="120px">
          <el-form-item label="建筑结构" prop="building_struct">
            <el-input v-model="buildingForm.building_struct" placeholder="请输入建筑结构" />
          </el-form-item>
          <el-form-item label="安全等级" prop="building_safety_level">
            <el-select v-model="buildingForm.building_safety_level" placeholder="请选择安全等级">
              <el-option v-for="(item, k) in safty_level" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="建筑名称" prop="building_name">
            <el-input v-model="buildingForm.building_name" placeholder="请输入建筑名称" />
          </el-form-item>
          <el-form-item label="建筑面积" prop="building_area">
            <el-input v-model="buildingForm.building_area" placeholder="请输入建筑面积（平方米）" />
          </el-form-item>
          <el-form-item label="建筑层数" prop="floor_count">
            <el-input v-model="buildingForm.floor_count" placeholder="请输入建筑层数（层）" />
          </el-form-item>
          <el-form-item label="楼层高度" prop="floor_height">
            <el-input v-model="buildingForm.floor_height" placeholder="请输入楼层高度（米）" />
          </el-form-item>
          <el-form-item label="建筑高度" prop="building_height">
            <el-input v-model="buildingForm.building_height" placeholder="请输入建筑高度（米）" />
          </el-form-item>
          <el-form-item label="建筑时间" prop="building_time">
            <el-date-picker v-model="buildingForm.building_time" type="date" value-format="yyyyMMdd" placeholder="请选择建筑时间" style="width:100%" />
          </el-form-item>
          <el-form-item label="管理员数" prop="teacher_count">
            <el-input v-model="buildingForm.teacher_count" placeholder="请输入管理员数（人）" />
          </el-form-item>
          <el-form-item label="成员数" prop="student_count">
            <el-input v-model="buildingForm.student_count" placeholder="请输入成员数（人）" />
          </el-form-item>
          <el-form-item label="楼梯数" prop="stairs_count">
            <el-input v-model="buildingForm.stairs_count" placeholder="请输入楼梯数" />
          </el-form-item>
          <el-form-item label="电梯数" prop="lift_count">
            <el-input v-model="buildingForm.lift_count" placeholder="请输入电梯数" />
          </el-form-item>
          <el-form-item label="x轴偏移量" prop="label_offset_x">
            <el-input v-model="buildingForm.label_offset_x" placeholder="请输入x轴偏移量" />
          </el-form-item>
          <el-form-item label="y轴偏移量" prop="label_offset_y">
            <el-input v-model="buildingForm.label_offset_y" placeholder="请输入y轴偏移量" />
          </el-form-item>
          <el-form-item label="z轴偏移量" prop="label_offset_z">
            <el-input v-model="buildingForm.label_offset_z" placeholder="请输入z轴偏移量" />
          </el-form-item>
          <el-form-item label="建筑用途" prop="building_function">
            <el-input v-model="buildingForm.building_function" type="textarea" :rows="4" placeholder="请输入建筑用途" />
          </el-form-item>
          <!--<el-form-item v-if="buildingForm.building_type == '2'" label="楼层模型" prop="building_function">
            <Uploadfile :accept="'.obj'" :limit="true" :slot-tip="'只能上传obj文件，且不超过20MB'" :file-list="fileList" @getFileList="getFileList" />
          </el-form-item>-->
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn spp-btn-primary" @click="editBuildingSubmit">提交</span>
        <span class="spp-btn" @click="resetFormData">重置</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBuildingList, addBuilding, updateBuilding, deleteBuilding, bindBuilding } from '@/api/building'
import { getSchoolModel } from '@/api/risk_map'
import { getBuildingInfo } from '@/api/risk_map'
import PlanImg from '@/components/Threeview/plan_img'
import { formatDate, date_str_to_time, parseTime } from '@/utils/index'
import { mapState } from 'vuex'
import { getaccessKey } from '@/api/file_libray'
import { client } from '@/utils/ali-oss'
export default {
  name: 'Building',
  components: { PlanImg },
  data() {
    return {
      selectedId: '',
      three_id: 'building_three_show',
      selected: '',
      url: '',
      buildings_info: {},
      drawer_height: window.innerHeight - 135,
      height: window.innerHeight - 145,
      treeData: [],
      listData: {},
      fileList: [],
      tmp_data: [],
      canSelect: false,
      detail: null,
      school_model: '',
      safty_level: {
        1: '一级',
        2: '二级',
        3: '三级'
      },
      dialogTitle: '',
      showDialog: false,
      buildingForm: {
        id: '',
        building_type: '',
        building_struct: '',
        building_safety_level: '',
        building_name: '',
        building_area: '',
        floor_count: '',
        floor_height: '',
        building_height: '',
        building_time: '',
        teacher_count: '',
        student_count: '',
        stairs_count: '',
        lift_count: '',
        building_function: '',
        bind_model_name: '',
        parent_id: '',
        model_url: '',
        label_offset_x: '',
        label_offset_y: '',
        label_offset_z: ''
      },
      building_type_selected: '',
      rules: {
        building_name: [
          { required: true, message: '请输入建筑名称', trigger: 'blur' }
        ]
      },
      show3D: true,
      no_model: require('@/assets/images/no_model.png')
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
    this.updateBuildingsInfo()
    this.getSchoolModel()
    this.getData()
  },
  methods: {
    getSchoolModel: function() {
      getSchoolModel().then(response => {
        if (response.data.scl_model) {
          this.show3D = true
          if (response.data.scl_model && response.data.scl_model !== '') {
            this.url = process.env.VUE_APP_BASE_API + '/' + response.data.scl_model
          }
          // getaccessKey().then(res => {
          //   this.school_model = client(
          //     res.data.accesskeyid,
          //     res.data.accesskeysecret,
          //     res.data.securitytoken
          //   ).signatureUrl(response.data.scl_model.replace(/\\/g, '/'))
          //   this.url = {
          //     url: this.school_model,
          //     cam_init_x: response.data.model_cam_init_x,
          //     cam_init_y: response.data.model_cam_init_y,
          //     cam_init_z: response.data.model_cam_init_z
          //   }
          // })
        } else {
          this.show3D = false
        }
      })
    },
    getData: function() {
      getBuildingList().then(response => {
        this.treeData = this.formatData(response.data)
        if (this.selectedId) {
          this.showDetail(this.selectedId)
        }
      })
    },
    getFileList(files) {
      this.buildingForm.model_url = ''
      for (const i in files) {
        this.buildingForm.model_url = files[i].attachment_url
      }
    },
    formatData: function(data) {
      for (const i in data) {
        data[i].building_time = data[i].building_time ? formatDate(data[i].building_time) : ''
        this.listData[data[i].id] = data[i]
      }
      return this.listToTree(data, '0')
    },
    listToTree: function(data, parent) {
      const tree = []
      let temp = []
      for (var i = 0; i < data.length; i++) {
        if (data[i].parent_id === parent) {
          var obj = {
            id: data[i].id,
            label: data[i].building_name
          }
          temp = this.listToTree(data, data[i].id)
          if (temp.length > 0) {
            obj.children = temp
          }
          tree.push(obj)
        }
      }
      return tree
    },
    updateSelected: function(data) {
      this.selected = data
    },
    showDetail: function(id) {
      this.selectedId = id
      this.canSelect = false
      this.detail = this.listData[id]
      this.selected = this.detail.bind_model_name
      this.building_type_selected = this.detail.building_type
      // if (this.building_type_selected === '1') {
      //   this.url = this.school_model
      // } else if (this.building_type_selected === '2' && this.detail.model_url) {
      //   getaccessKey().then(res => {
      //     this.url = client(
      //       res.data.accesskeyid,
      //       res.data.accesskeysecret,
      //       res.data.securitytoken
      //     ).signatureUrl(this.detail.model_url.replace(/\\/g, '/'))
      //   })
      // } else if (this.building_type_selected === '3') {
      //   const parent = this.detail.parent_id
      //   const parent_url = this.listData[parent].model_url
      //   if (parent_url) {
      //     this.url = parent_url
      //   }
      // }
    },
    addBuilding: function() {
      Object.assign(this.buildingForm, this.$options.data().buildingForm)
      this.buildingForm.building_type = '1'
      this.dialogTitle = '添加建筑物'
      this.showDialog = true
    },
    // 添加建筑
    addSubBuilding: function(id, e) {
      e.stopPropagation()
      Object.assign(this.buildingForm, this.$options.data().buildingForm)
      const building_type = this.listData[id].building_type
      this.buildingForm.parent_id = id
      if (building_type === '1') {
        this.dialogTitle = '添加楼层'
        this.buildingForm.building_type = '2'
        this.fileList = []
      } else if (building_type === '2') {
        this.dialogTitle = '添加房间'
        this.buildingForm.building_type = '3'
      }
      this.showDialog = true
    },
    // 修改建筑
    editBuilding: function(id, e) {
      e.stopPropagation()
      this.buildingForm = JSON.parse(JSON.stringify(this.listData[id]))
      this.buildingForm.building_time = date_str_to_time(this.buildingForm.building_time)
      const building_type = this.buildingForm.building_type
      if (building_type === '1') {
        this.dialogTitle = '修改建筑物'
      } else if (building_type === '2') {
        this.fileList = this.buildingForm.model_url ? [{ name: '楼层模型', url: this.buildingForm.model_url }] : []
        this.dialogTitle = '修改楼层'
      } else {
        this.dialogTitle = '修改房间'
      }
      this.showDialog = true
    },
    editBuildingSubmit: function() {
      if (!this.buildingForm.id) {
        // 新增
        this.$refs.buildingForm.validate(valid => {
          if (valid) {
            const data = this.buildingForm
            addBuilding(data).then(response => {
              this.showDialog = false
              this.$message({
                message: '建筑添加成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      } else {
        // 修改
        this.$refs.buildingForm.validate(valid => {
          if (valid) {
            const data = this.buildingForm
            if (data.building_time && typeof data.building_time !== 'string') {
              data.building_time = parseTime(data.building_time, '{y}{m}{d}')
            }
            updateBuilding(data.id, data).then(response => {
              this.showDialog = false
              this.$message({
                message: '建筑修改成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      }
    },
    // 删除建筑
    deleteBuilding: function(id, e) {
      e.stopPropagation()
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBuilding(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => {})
    },
    resetFormData: function() {
      this.$refs.buildingForm.resetFields()
    },
    // 关联建筑
    linkBuilding: function(id) {
      bindBuilding(id, this.selected).then(response => {
        this.canSelect = false
        this.listData[id].bind_model_name = this.selected
        this.updateBuildingsInfo()
      })
    },
    cancelLink: function(id) {
      this.selected = ''
      bindBuilding(id, this.selected).then(response => {
        this.canSelect = false
        this.listData[id].bind_model_name = ''
      })
    },
    cancelSelect: function(id) {
      this.selected = this.listData[id].bind_model_name
      this.canSelect = false
    },
    updateBuildingsInfo: function() {
      let id = ''
      if (this.building_type_selected === '2') {
        id = this.selectedId
      } else if (this.building_type_selected === '3') {
        id = this.detail.parent_id
      }
      getBuildingInfo(id).then(response => {
        const data = response.data
        const data_formated = {}
        data.forEach(function(item) {
          data_formated[item.bind_model_name] = item
        })
        this.buildings_info = data_formated
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.no_padding {
  padding: 0 !important
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  color: #313233;
  img {
    margin-right: 6px;
  }
  span {
    line-height: 16px;
  }
}
.building_detail {
  .info {
    margin-top: 12px;
    font-size:14px;
    span:first-child {
      color: #313233
    }
    span {
      color: #626466;
      word-break: break-all;
    }
  }
}
</style>
