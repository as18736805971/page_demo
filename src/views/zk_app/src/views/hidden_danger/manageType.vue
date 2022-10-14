<template>
  <div class="app-container page-container" style="padding-bottom: 0">
    <el-row>
      <el-col :span="8">
        <div
          :style="{ height: height + 'px' }"
          class="fix_height_block"
          style="border-right: 1px solid #EBF0F5"
        >
          <div class="header">
            <span class="title">隐患类型列表</span>
            <span class="btn_area">
              <span
                v-if="functionList.includes('A51001')"
                style="margin-right: 0"
                class="spp-btn spp-btn-primary"
                @click="addDangerType"
              >
                <svg-icon icon-class="add" />新增类型
              </span>
            </span>
          </div>
          <el-scrollbar
            wrap-class="vertical_scrollbar"
            :style="{ height: height - 47 + 'px' }"
          >
            <el-tree
              :data="type_list"
              node-key="dept_id"
              default-expand-all
              :expand-on-click-node="false"
              class="emer_group_tree"
            >
              <div
                slot-scope="{ data }"
                class="emer_group_tree_node"
                @click="showDetail(data.id, data)"
              >
                <span style="display: flex;align-items: center">
                  <img src="../../assets/icon/hidden_type.png">
                  <span>{{ data.type_name }}</span>
                </span>
                <span v-if="selected_type === data.id">
                  <el-button
                    v-if="functionList.includes('A51002')"
                    type="text"
                    size="mini"
                    :disabled="!data.scl_id"
                    style="font-size: 14px"
                    @click="(e) => editDangerType(data, e)"
                  >编辑</el-button>
                  <el-button
                    v-if="functionList.includes('A51003')"
                    type="text"
                    size="mini"
                    :disabled="!data.scl_id"
                    style="font-size: 14px"
                    @click="(e) => deleteType(data.id, e)"
                  >删除</el-button>
                </span>
              </div>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col v-if="!selected_type" :span="16">
        <div
          :style="{ height: height + 'px' }"
          class="fix_height_block"
          style="text-align: center; padding-top: 50px"
        >
          <span style="color: #aaa">请选择隐患类型查看类型负责人</span>
        </div>
      </el-col>
      <el-col v-else :span="16">
        <div class="fix_height_block">
          <div class="header">
            <div class="title">{{ type_name }}</div>
            <div class="btn_area">
              <span
                v-if="functionList.includes('A51004')"
                class="spp-btn"
                style="margin-right: 0"
                @click="addUser()"
              ><svg-icon icon-class="add" />添加成员</span>
            </div>
          </div>
          <div class="body">
            <div class="main-body" :style="{ height: height - 47 + 'px' }">
              <el-table :data="user_data">
                <el-table-column label="序号" type="index" width="60" />
                <el-table-column label="用户名" prop="user_name" />
                <el-table-column label="手机号" prop="user_phone" />
                <el-table-column label="操作" width="130">
                  <template slot-scope="scope">
                    <el-button
                      v-if="functionList.includes('A51005')"
                      type="text"
                      @click="removeUser(scope.row.id)"
                    >移出</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                v-show="user_total > 0"
                :total="user_total"
                :page.sync="user_page"
                :limit.sync="user_page_size"
                @pagination="getUserData"
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="628px"
    >
      <el-form
        v-if="showDialog"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="model_form"
      >
        <el-form-item label="类型名称" prop="type_name">
          <el-input
            v-model="form.type_name"
            type="text"
            placeholder="请输入类型名称"
          />
        </el-form-item>
        <el-form-item class="model_btn_group">
          <span class="spp-btn spp-btn-primary" @click="submit()">提交</span>
          <span class="spp-btn" @click="reset()">重置</span>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="请选择要添加的用户"
      :visible.sync="showAddUserDialog"
      :close-on-click-modal="false"
      width="670px"
    >
      <el-transfer
        v-model="selectedUserId"
        :data="user_list"
        :titles="['用户列表', '已选用户']"
        filterable
        filter-placeholder="搜索用户名称"
      />
      <div style="padding: 16px 0px; text-align: right">
        <span
          class="spp-btn spp-btn-primary"
          @click="submitAddUser()"
        >提交</span>
        <span class="spp-btn" @click="showAddUserDialog = false">取消</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  dangerTypeList,
  saveDangerType,
  updateDangerType,
  delDangerType,
  relationTypeList,
  saveRelationUser,
  delRelationUser,
  getNotypeUser
} from '@/api/government'
import { formatDateTime } from '@/utils/index'
import { mapState } from 'vuex'
import Pagination from '@/components/Pagination'
export default {
  name: 'ManageType',
  components: { Pagination },
  data() {
    return {
      height: window.innerHeight - 145,
      type_list: [],
      user_data: [],
      user_page: 1,
      user_page_size: 6,
      user_total: 0,
      scl_user: [],
      selected_type: '',
      type_name: '',
      showDialog: false,
      showAddUserDialog: false,
      dialogTitle: '',
      type_id: '',
      form: {
        type_name: ''
      },
      rules: {
        type_name: [
          { required: true, message: '请填写类型名称', trigger: 'blur' }
        ]
      },
      selectedUserId: [],
      user_list: []
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  created() {
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    getData() {
      this.type_list = []
      dangerTypeList().then((res) => {
        this.type_list = res.data
      })
    },
    showDetail(id, data) {
      this.type_name = data.type_name
      this.selected_type = id
      this.getUserData()
    },
    getUserData() {
      relationTypeList(
        this.selected_type,
        this.user_page,
        this.user_page_size
      ).then((res) => {
        const data = res.data
        this.user_data = data.list
        this.user_total = data.totalRow
      })
    },
    async addDangerType() {
      this.dialogTitle = '新增隐患类型'
      this.type_id = ''
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
    },
    async editDangerType(item, e) {
      e.stopPropagation()
      this.dialogTitle = '编辑隐患类型'
      this.type_id = item.id
      this.form = {
        type_name: item.type_name
      }
      this.showDialog = true
    },
    deleteType(id, e) {
      e.stopPropagation()
      this.$confirm('您确定要删除该类型？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delDangerType(id).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
            this.user_data = []
            this.selected_type = ''
          })
        })
        .catch(() => {})
    },
    submit() {
      if (!this.type_id) {
        // 新增
        this.$refs.form.validate((valid) => {
          if (valid) {
            const { type_name } = this.form
            saveDangerType(type_name).then((response) => {
              this.showDialog = false
              this.$message({
                message: '隐患类型添加成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      } else {
        // 修改
        this.$refs.form.validate((valid) => {
          if (valid) {
            if (this.form.parent_id instanceof Array) {
              this.form.parent_id = this.form.parent_id[
                this.form.parent_id.length - 1
              ]
            }
            const { type_name } = this.form
            updateDangerType(this.type_id, type_name).then((response) => {
              this.showDialog = false
              this.$message({
                message: '隐患类型修改成功',
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
    addUser() {
      getNotypeUser(this.selected_type).then((response) => {
        this.selectedUserId = []
        this.user_list = []
        const user = response.data
        user.forEach((item) => {
          this.user_list.push({
            key: item.user_id,
            label: item.user_name
          })
        })
        this.showAddUserDialog = true
      })
    },
    submitAddUser() {
      const user_id = this.selectedUserId.join(',')
      if (!user_id) {
        this.$message({
          type: 'warning',
          message: '请选择要添加的用户'
        })
        return
      }
      saveRelationUser(this.selected_type, user_id).then((response) => {
        this.showAddUserDialog = false
        this.getUserData()
      })
    },
    removeUser(id) {
      this.$confirm('确定要移出该用户吗？', '移出提示', {
        confirmButtonText: '移出',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delRelationUser(id).then((response) => {
            this.$message({
              type: 'success',
              message: '移出成功!'
            })
            this.getUserData()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.dept-tree-node {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 16px;
  .dept-tree-label {
    font-size: 14px;
    line-height: 28px;
    color: #313233;
  }
}
.right-content {
  min-height: 500px;
  .no_data {
    text-align: center;
    color: #313233;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
