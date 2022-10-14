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
            <span class="title">应急小组列表</span>
            <span class="btn_area">
              <span
                v-if="functionList.includes('A18001')"
                class="spp-btn spp-btn-primary"
                style="margin-right: 0"
                @click="addTeam"
              >
                <svg-icon icon-class="add-group" />添加小组
              </span>
            </span>
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
                  @click="getMember(data, true)"
                >
                  <span>
                    <img src="../../assets/icon/group.png">
                    <span>
                      {{ data.label }}
                    </span>
                  </span>
                  <span v-if="selected_data.id === data.id">
                    <el-button
                      v-if="functionList.includes('A18002')"
                      type="text"
                      @click="(e) => editTeam(e, data)"
                    >编辑</el-button>
                    <el-button
                      v-if="functionList.includes('A18003')"
                      type="text"
                      @click="(e) => delTeam(e, data.id)"
                    >删除</el-button>
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
            <span class="title">{{ select_name }}{{ select_phone }}</span>
            <span class="btn_area">
              <span
                v-if="functionList.includes('A18001') && selected_data.id"
                class="spp-btn"
                @click="addTeamMember()"
              >
                <svg-icon icon-class="add-member" />添加组员
              </span>
              <span
                v-if="functionList.includes('A18001') && selected_data.id"
                class="spp-btn"
                style="margin-right: 0"
                @click="delete_member_batch()"
              >
                <svg-icon icon-class="delete" />删除组员
              </span>
              <span
                v-if="selected_data.id && !sort_sign"
                class="spp-btn"
                style="margin-right: 0"
                @click="begin_sort"
              >
                排序
              </span>
              <span
                v-if="selected_data.id && sort_sign"
                class="spp-btn"
                style="margin-right: 0"
                @click="sureSort"
              >
                确定
              </span>
              <span
                v-if="selected_data.id && sort_sign"
                class="spp-btn"
                style="margin-right: 0"
                @click="cancelSort"
              >
                取消
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
                <el-table-column prop="member_name" label="姓名" />
                <el-table-column prop="is_leader" label="职位">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.is_leader === '1'"
                      style="color: #f76d02"
                    ><svg-icon icon-class="leader-flag" />组长</span>
                    <span
                      v-if="scope.row.is_leader === '2'"
                      style="color: #f76d02"
                    >副组长</span>
                    <span v-if="scope.row.is_leader === '3'">组员</span>
                  </template>
                </el-table-column>
                <el-table-column prop="member_phone" label="电话" />
                <el-table-column prop="address" label="操作" width="200">
                  <template slot-scope="scope">
                    <svg-icon
                      v-if="sort_sign"
                      icon-class="order_up"
                      class="group_sort"
                      :class="{
                        groupfirst:
                          scope.$index === 0 ||
                          scope.$index === 1 ||
                          scope.$index === first_member_index,
                      }"
                      @click="sortData(scope.$index, 1)"
                    />
                    <svg-icon
                      v-if="sort_sign"
                      icon-class="order_down"
                      class="group_sort"
                      :class="{
                        groupfirst:
                          scope.$index === memberData.length - 1 ||
                          scope.$index === 0 ||
                          scope.$index === first_member_index - 1,
                      }"
                      @click="sortData(scope.$index, 2)"
                    />
                    <el-button type="text">
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          设置职位<i
                            class="el-icon-arrow-down el-icon--right"
                          />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            :disabled="scope.row.is_leader === '1'"
                            @click.native="set_leader(scope.row.member_id, 1)"
                          >设为组长</el-dropdown-item>
                          <el-dropdown-item
                            :disabled="scope.row.is_leader === '2'"
                            @click.native="set_leader(scope.row.member_id, 2)"
                          >设为副组长</el-dropdown-item>
                          <el-dropdown-item
                            :disabled="scope.row.is_leader === '0'"
                            @click.native="set_leader(scope.row.member_id, 3)"
                          >设为组员</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-button>
                    <el-button
                      type="text"
                      @click="delete_member(scope.row.member_id)"
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
      v-if="showDialog"
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="733px"
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
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="小组名称" prop="group_name">
            <el-input
              v-model="ruleForm.group_name"
              placeholder="请输入小组名称"
            />
          </el-form-item>
          <el-form-item label="小组电话" prop="group_phone">
            <el-input
              v-model="ruleForm.group_phone"
              placeholder="请输入小组电话"
            />
          </el-form-item>
          <div v-if="!ruleForm.id">
            <el-form-item label="组员" prop="choiceTeamMember">
              <el-transfer
                v-model="ruleForm.choiceTeamMember"
                class="dialog_trans"
                :props="{ key: 'user_id', label: 'user_name' }"
                :data="teamMember"
                :titles="['人员列表', '已选人员']"
                @change="getLeaderList"
              />
            </el-form-item>
            <el-form-item label="组长" prop="leader_id">
              <el-select v-model="ruleForm.leader_id" placeholder="请选择组长">
                <el-option
                  v-for="(item, index) in leaderList"
                  :key="index"
                  :label="item.user_name"
                  :value="item.user_id"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn spp-btn-primary" @click="editSubmit">提交</span>
        <span class="spp-btn" @click="showDialog = false">取消</span>
      </div>
    </el-dialog>
    <el-dialog
      v-if="showMemberDialog"
      title="添加组员"
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
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="组员" prop="choiceTeamMember">
            <el-transfer
              v-model="choiceAddTeamMember"
              class="dialog_trans"
              :props="{ key: 'user_id', label: 'user_name' }"
              :data="notInMember"
              :titles="['人员列表', '已选人员']"
              filterable
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span
          class="spp-btn spp-btn-primary"
          @click="editMemberSubmit"
        >提交</span>
        <span class="spp-btn" @click="showMemberDialog = false">取消</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  paginatelist,
  saveGroup,
  deleteGroup,
  updateGroup,
  removeMember,
  setLeader,
  addTeamMember,
  memberNotList,
  moveorder
} from '@/api/emergency_group'
import { getGrouInfo } from '@/api/plan'
import { getSclUserList } from '@/api/school_user'
import { mapState } from 'vuex'
import Sortable from 'sortablejs'
export default {
  name: 'Group',
  data() {
    return {
      height: window.innerHeight - 145,
      drawer_height: window.innerHeight - 135,
      group_user: window.innerHeight - 192,
      groupData: [],
      memberData: [],
      showDialog: false,
      showMemberDialog: false,
      dialogTitle: '',
      ruleForm: {
        id: '',
        group_name: '',
        group_phone: '',
        choiceTeamMember: [],
        leader_id: ''
      },
      rules: {
        group_name: [
          { required: true, message: '请输入小组名称', trigger: 'blur' }
        ],
        group_phone: [
          { required: true, trigger: 'blur', message: '请输入小组电话' }
        ]
      },
      leaderList: [],
      teamMember: [],
      notInMember: [],
      selected_data: {},
      tempStorage: null,
      choiceAddTeamMember: [],
      select_name: '小组成员',
      select_phone: '',
      sort_sign: false,
      first_member_index: -1,
      sortObj: null
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  created() {
    this.getData()
    this.getSclUserList()
  },
  methods: {
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      this.sortObj = Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          if (_this.memberData[oldIndex].is_leader === '1') {
            if (newIndex > 0) {
              newIndex = 0
            }
          } else if (_this.memberData[oldIndex].is_leader === '2') {
            if (newIndex === 0) {
              newIndex = 1
            }
            if (newIndex > _this.first_member_index - 1) {
              newIndex = _this.first_member_index - 1
            }
          } else if (_this.memberData[oldIndex].is_leader === '3') {
            if (newIndex < _this.first_member_index) {
              newIndex = _this.first_member_index
            }
          }
          const currRow = _this.memberData.splice(oldIndex, 1)[0]
          setTimeout(() => {
            _this.memberData.splice(newIndex, 0, currRow)
          }, 10)
        }
      })
    },
    begin_sort() {
      this.rowDrop()
      this.sort_sign = true
    },
    // 获取列表数据
    getData() {
      this.groupData = []
      this.memberData = []
      this.selected_data = {}
      this.select_name = '小组成员'
      this.select_phone = ''
      paginatelist().then((res) => {
        const data = res.data
        data.forEach((item) => {
          const tmp = {
            id: item.id,
            label: item.group_name,
            group_phone: item.group_phone
          }
          this.groupData.push(tmp)
        })
      })
    },
    getMember(data, sign) {
      this.selected_data = data
      this.select_name = data.label
      this.select_phone = '(' + data.group_phone + ')'
      this.choiceAddTeamMember = []
      getGrouInfo(data.id).then((res) => {
        this.memberData = res.data
        const is_leader_array = this.memberData.map((opt) => {
          return opt.is_leader
        })
        this.first_member_index = is_leader_array.indexOf('3')
        // 切换时将sortObj销毁
        if (this.sortObj && this.memberData.length > 0 && this.sort_sign && sign) {
          this.sortObj.destroy()
          this.sort_sign = false
        }
      })
    },
    // 对小组人员进行排序
    sortData(index, move_flag) {
      // 组长不能上下移动
      if (index === 0 && move_flag === 1) {
        return
      }
      if (index === 0 && move_flag === 2) {
        return
      }
      // 第一个副组长不能向上移动
      if (index === 1 && move_flag === 1) {
        return
      }
      // 最后一个副组长不能向下移动
      if (index === this.first_member_index - 1 && move_flag === 2) {
        return
      }
      // 第一个组员不能向上移动
      if (index === this.first_member_index && move_flag === 1) {
        return
      }
      // 最后一个组员不能向下移动
      if (index === this.memberData.length - 1 && move_flag === 2) {
        return
      }
      if (move_flag === 1) {
        this.memberData[index] = this.memberData.splice(
          index - 1,
          1,
          this.memberData[index]
        )[0]
      } else {
        this.memberData[index] = this.memberData.splice(
          index + 1,
          1,
          this.memberData[index]
        )[0]
      }
    },
    // 确认排序
    sureSort() {
      if (this.memberData.length > 0) {
        const id_array = this.memberData.map((opt) => {
          return opt.id
        })
        moveorder(id_array.join()).then((res) => {
          this.$message({
            message: '排序成功',
            type: 'success',
            duration: 3000
          })
          this.getMember(this.selected_data)
          this.sort_sign = false
        })
      } else {
        this.sort_sign = false
      }
      this.sortObj.destroy()
    },
    // 取消排序
    cancelSort() {
      if (this.memberData.length > 0) {
        this.getMember(this.selected_data)
        this.sort_sign = false
      } else {
        this.sort_sign = false
      }
      this.sortObj.destroy()
    },
    // 获取所有队员
    getSclUserList() {
      getSclUserList().then((res) => {
        this.teamMember = res.data
      })
    },
    // 获取队长数组
    getLeaderList(array) {
      this.leaderList = []
      if (array) {
        this.teamMember.forEach((item, index) => {
          if (array.includes(item.user_id)) {
            this.leaderList.push(item)
          }
        })
      } else {
        this.ruleForm.leader_id = ''
      }
    },
    // 新增或编辑应急小组
    addTeam() {
      Object.assign(this.$data.ruleForm, this.$options.data().ruleForm)
      this.leaderList = []
      this.dialogTitle = '新增应急小组'
      this.showDialog = true
    },
    editTeam(e, data) {
      e.stopPropagation()
      this.dialogTitle = '修改应急小组'
      this.ruleForm = {
        id: data.id,
        group_name: data.label,
        group_phone: data.group_phone
      }
      this.showDialog = true
    },
    // 删除应急小组
    delTeam(e, id) {
      e.stopPropagation()
      this.$confirm('您确定要删除该应急小组吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteGroup(id).then((res) => {
            this.$message({
              message: '应急小组删除成功',
              type: 'success',
              duration: 3000
            })
            this.getData()
          })
        })
        .catch(() => {})
    },
    // 提交新增或者编辑的数据
    editSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.ruleForm.id) {
            updateGroup(
              this.ruleForm.id,
              this.ruleForm.group_name,
              this.ruleForm.group_phone
            ).then((response) => {
              this.showDialog = false
              this.select_name = this.ruleForm.group_name
              this.select_phone = '(' + this.ruleForm.group_phone + ')'
              this.getData()
            })
          } else {
            const choiceTeamMember = this.ruleForm.choiceTeamMember.join(',')
            const { group_name, leader_id } = this.ruleForm
            saveGroup(
              group_name,
              this.ruleForm.group_phone,
              choiceTeamMember,
              leader_id
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
        }
      })
    },
    delete_member(id) {
      this.$confirm('您确定要移出该用户吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeMember(this.selected_data.id, id).then((res) => {
            this.$message({
              message: '用户移除成功',
              type: 'success',
              duration: 3000
            })
            this.getMember(this.selected_data)
          })
        })
        .catch(() => {})
    },
    delete_member_batch() {
      let str = ''
      this.$refs.table.store.states.selection.forEach((item) => {
        str += item.member_id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      if (str) {
        this.$confirm('确定要删除吗？', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            removeMember(this.selected_data.id, str).then((response) => {
              this.$message({
                message: '用户移除成功',
                type: 'success',
                duration: 3000
              })
              this.getMember(this.selected_data)
            })
          })
          .catch(() => {})
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
      }
    },
    set_leader(id, type) {
      setLeader(this.selected_data.id, id, type).then((res) => {
        this.$message({
          message: '设置成功',
          type: 'success',
          duration: 3000
        })
        this.getMember(this.selected_data)
      })
    },
    addTeamMember() {
      memberNotList(this.selected_data.id).then((res) => {
        this.notInMember = res.data
        this.showMemberDialog = true
      })
    },
    editMemberSubmit() {
      addTeamMember(
        this.selected_data.id,
        this.choiceAddTeamMember.join(',')
      ).then((res) => {
        this.showMemberDialog = false
        this.$message({
          message: '设置成功',
          type: 'success',
          duration: 3000
        })
        this.getMember(this.selected_data)
      })
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
