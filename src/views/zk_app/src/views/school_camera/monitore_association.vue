<template>
  <div
    class="app-container emergency-group right-side-dialog"
    style="margin-bottom: 0; padding-bottom: 0"
  >
    <el-row>
      <el-col :span="8">
        <div
          :style="{ height: height + 'px' }"
          class="fix_height_block"
          style="border-right: 1px solid #ebf0f5"
        >
          <div class="header">
            <span class="title">角色列表</span>
          </div>
          <div class="body">
            <el-scrollbar
              wrap-class="vertical_scrollbar"
              :style="{ height: height - 47 + 'px' }"
            >
              <el-tree
                :data="groupData"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                class="emer_group_tree"
              >
                <div
                  slot-scope="{ data }"
                  class="emer_group_tree_node"
                  @click="getRelCamera(data)"
                >
                  <span>
                    <img src="../../assets/icon/post.png">
                    <span>
                      {{ data.label }}
                    </span>
                  </span>
                </div>
              </el-tree>
            </el-scrollbar>
          </div>
        </div>
      </el-col>
      <el-col :span="16">
        <div :style="{ height: height + 'px' }" class="fix_height_block">
          <div class="header">
            <span class="title">{{ select_name }}</span>
            <span class="btn_area">
              <span
                v-if="functionList.includes('A40019') && selected_data.id"
                class="spp-btn"
                @click="addCamera()"
              >
                <svg-icon icon-class="add-member" />关联监控
              </span>
            </span>
          </div>
          <el-scrollbar
            wrap-class="vertical_scrollbar"
            :style="{ height: group_user + 'px' }"
          >
            <div class="body">
              <el-table ref="table" :data="memberData" row-key="id">
                <el-table-column type="selection" width="55" />
                <el-table-column label="序号" type="index" width="60" />
                <el-table-column prop="equ_name" label="监控名称" />
                <el-table-column prop="address" label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="delete_camera(scope.row.ro_equ_id)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      v-if="showMemberDialog"
      title="关联监控"
      :visible.sync="showMemberDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar
        wrap-class="vertical_scrollbar"
        :style="{ height: drawer_height + 'px' }"
      >
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="60px"
          class="demo-ruleForm"
        >
          <el-form-item label="">
            <el-transfer
              v-model="choiceCamera"
              class="dialog_trans"
              :props="{ key: 'equ_id', label: 'equ_name' }"
              :data="all_camera"
              :titles="['监控列表', '已关联监控']"
              filterable
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span
          class="spp-btn spp-btn-primary"
          @click="editCameraSubmit"
        >保存</span>
        <span class="spp-btn" @click="showMemberDialog = false">取消</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRelCamera,
  getCameraList,
  getRelCameraSave,
  removeCamera
} from '@/api/monitore_association'
import { getRolesList } from '@/api/role'
import { mapState } from 'vuex'
export default {
  name: 'Group',
  data() {
    return {
      height: window.innerHeight - 145,
      drawer_height: window.innerHeight - 135,
      group_user: window.innerHeight - 192,
      groupData: [],
      memberData: [],
      showMemberDialog: false,
      selected_data: {},
      choiceCamera: [],
      all_camera: [],
      select_name: '监控列表',
      ruleForm: {},
      rules: {}
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  created() {
    this.getData()
    this.getCameraList()
  },
  methods: {
    // 获取列表数据
    getData() {
      this.groupData = []
      this.memberData = []
      this.selected_data = {}
      this.select_name = '监控列表'
      getRolesList(2).then((res) => {
        const data = res.data
        data.forEach((item) => {
          const tmp = {
            id: item.role_id,
            label: item.role_name
          }
          this.groupData.push(tmp)
        })
      })
    },
    getRelCamera(data) {
      this.selected_data = data
      this.select_name = data.label
      this.choiceCamera = []
      getRelCamera(data.id).then((res) => {
        this.memberData = res.data
        this.choiceCamera = this.memberData.map((opt) => {
          return opt.equ_id
        })
      })
    },
    // 获取所有设备
    getCameraList() {
      getCameraList().then((res) => {
        this.all_camera = res.data
      })
    },
    delete_camera(id) {
      this.$confirm('您确定要移出该监控吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeCamera(id).then((res) => {
            this.$message({
              message: '监控移除成功',
              type: 'success',
              duration: 3000
            })
            this.getRelCamera(this.selected_data)
          })
        })
        .catch(() => {})
    },
    addCamera() {
      this.showMemberDialog = true
    },
    editCameraSubmit() {
      if (this.choiceCamera.join(',')) {
        getRelCameraSave(
          this.selected_data.id,
          this.choiceCamera.join(',')
        ).then((res) => {
          this.showMemberDialog = false
          this.$message({
            message: '设置成功',
            type: 'success',
            duration: 3000
          })
          this.getRelCamera(this.selected_data)
        })
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要关联的监控'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.group_sort {
  padding-right: 2px;
  cursor: pointer;
  color: #3399ff;
}
.groupfirst {
  color: #bbb;
}
</style>
