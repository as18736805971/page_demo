<template>
  <div class="app-container page-container right-side-dialog" style="padding-bottom:0">
    <el-row>
      <el-col :span="7">
        <div :style="{height: height + 'px'}" class="col_bg">
          <div style="padding-bottom:16px; border-bottom: 1px solid #EBF0F5;padding-top: 16px">
            <div style="float:left; font-size: 16px; line-height: 30px;color: #313233">学校标注点列表</div>
            <div style="float:right"><span v-if="functionList.includes('A21006')" style="margin-right:0" class="spp-btn" @click="addLabel"><svg-icon icon-class="add-building" />添加标注点</span></div>
            <div style="clear: both" />
          </div>
          <el-tree
            :data="treeData"
            node-key="id"
            :expand-on-click-node="false"
            :default-expand-all="true"
            class="building_tree"
          >
            <span slot-scope="{data}" class="custom-tree-node">
              <div>
                <img v-if="data.mark_type === 'partol_group'" src="../../assets/icon/patrol_mark_group.png">
                <img v-if="data.mark_type === 'camera_group'" src="../../assets/icon/cam_mark_group.png">
                <img v-if="data.mark_type === '1' && data.patrol_rate === '1'" src="../../assets/icon/day_mark.png">
                <img v-if="data.mark_type === '1' && data.patrol_rate === '2'" src="../../assets/icon/week_mark.png">
                <img v-if="data.mark_type === '1' && data.patrol_rate === '3'" src="../../assets/icon/month_mark.png">
                <img v-if="data.mark_type === '1' && data.patrol_rate === '4'" src="../../assets/icon/season_mark.png">
                <img v-if="data.mark_type === '1' && data.patrol_rate === '5'" src="../../assets/icon/year_mark.png">
                <img v-if="data.mark_type === '2'" src="../../assets/icon/cam_mark.png">
                <span>
                  {{ data.label }}
                </span>
              </div>
              <span>
                <el-button v-if="data.level === 2 && functionList.includes('A21007')" type="text" size="mini" @click="(e) => deleteLabel(data.id, e)">删除</el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="17">
        <div :style="{height: height + 'px'}" class="col_bg no_padding">
          <plan-img :height="height" :url="url" />
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" :close-on-click-modal="false" width="480px" class="right-noall-content draw_dialog">
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: drawer_height + 'px'}">
        <el-form ref="markForm" :model="markForm" :rules="rules" label-width="120px">
          <el-form-item label="标注类型" prop="mark_type">
            <el-select v-model="markForm.mark_type" placeholder="请选标注类型" @change="changeSelect">
              <el-option v-for="(item, k) in mark_type" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="标注点" prop="relation_id">
            <el-select v-model="markForm.relation_id" filterable placeholder="请选择标注点">
              <el-option v-for="item in select_data" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn spp-btn-primary" @click="addLabelSubmit">提交</span>
        <span class="spp-btn" @click="resetFormData">重置</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import PlanImg from '@/components/Threeview/plan_img'
import { getSchoolModel } from '@/api/risk_map'
import { getLabelList, addLabel, deleteLabel, getPatrolList, getCameraList } from '@/api/school_label'
import { mapState } from 'vuex'
export default {
  name: 'SchoolLabel',
  components: { PlanImg },
  data() {
    return {
      three_id: 'label_three_show',
      selected: '',
      url: '',
      markForm: {
        id: '',
        mark_type: '',
        relation_id: ''
      },
      select_data: [],
      drawer_height: window.innerHeight - 135,
      height: window.innerHeight - 145,
      treeData: [],
      dialogTitle: '',
      showDialog: false,
      mark_type: {
        1: '巡检点',
        2: '摄像头'
      },
      rules: {
        mark_type: [
          { required: true, message: '请选择标注类型', trigger: 'blur' }
        ],
        relation_id: [
          { required: true, message: '请选择标注点', trigger: 'blur' }
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
    this.getSchoolModel()
    this.getLabelList()
  },
  methods: {
    getSchoolModel: function() {
      getSchoolModel().then(response => {
        if (response.data.scl_model && response.data.scl_model !== '') {
          this.url = process.env.VUE_APP_BASE_API + '/' + response.data.scl_model
        }
        // this.url = {
        //   url: response.data.scl_model,
        //   cam_init_x: response.data.model_cam_init_x,
        //   cam_init_y: response.data.model_cam_init_y,
        //   cam_init_z: response.data.model_cam_init_z
        // }
      })
    },
    getLabelList: function() {
      getLabelList().then(response => {
        this.treeData = []
        const data = response.data
        const partol_group = {
          id: 'partol_group',
          label: '巡检点',
          mark_type: 'partol_group',
          level: 1,
          children: []
        }
        const camera_group = {
          id: 'camera_group',
          label: '摄像头',
          mark_type: 'camera_group',
          level: 1,
          children: []
        }
        this.$refs.dragView.clearIcons()
        data.forEach(item => {
          const tmp = {
            id: item.mark_id,
            level: 2,
            relation_id: item.relation_id,
            label: item.mark_name,
            mark_type: item.mark_type,
            patrol_rate: item.patrol_rate
          }
          if (item.mark_type === '1') {
            partol_group.children.push(tmp)
          } else if (item.mark_type === '2') {
            camera_group.children.push(tmp)
          }
          if (item.mark_x !== null && item.mark_y !== null && item.mark_z !== null) {
            this.$refs.dragView.addIcon(item)
          }
        })
        this.$refs.dragView.resetDrag()
        if (partol_group.children.length > 0) {
          this.treeData.push(partol_group)
        }
        if (camera_group.children.length > 0) {
          this.treeData.push(camera_group)
        }
      })
    },
    addLabel: function() {
      this.dialogTitle = '添加标注点'
      this.showDialog = true
      Object.assign(this.markForm, this.$options.data().markForm)
    },
    addLabelSubmit: function() {
      this.$refs.markForm.validate(valid => {
        if (valid) {
          addLabel(this.markForm).then(response => {
            this.showDialog = false
            this.$message({
              message: '标注点添加成功',
              type: 'success',
              duration: 3000
            })
            this.getLabelList()
          })
        }
      })
    },
    deleteLabel: function(id, e) {
      e.stopPropagation()
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLabel(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getLabelList()
        })
      }).catch(() => {})
    },
    resetFormData: function() {
      this.$refs.markForm.resetFields()
    },
    changeSelect: function() {
      this.select_data = []
      if (this.markForm.mark_type === '1') {
        getPatrolList().then(res => {
          const data = res.data
          data.forEach(item => {
            const tmp = {
              id: item.patrol_id,
              name: item.patrol_name
            }
            this.select_data.push(tmp)
          })
        })
      } else if (this.markForm.mark_type === '2') {
        getCameraList().then(res => {
          const data = res.data
          data.forEach(item => {
            const tmp = {
              id: item.equ_id,
              name: item.equ_name
            }
            this.select_data.push(tmp)
          })
          console.log(this.select_data)
        })
      }
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
    width: 16px;
    height: 16px;
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
