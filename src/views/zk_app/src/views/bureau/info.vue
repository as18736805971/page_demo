<template>
  <section class="app-container">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="bureauInfoObj" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="教育局地区：">
            <el-cascader
              ref="eduCascader"
              v-model="bureauInfoObj.edu_address_code"
              :props="props"
              clearable
            />
          </el-form-item>
          <el-form-item label="教育局名称：">
            <el-input v-model="bureauInfoObj.keyword" placeholder="请输入" />
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <el-button class="spp-btn spp-btn-primary" @click="searchData()">搜索</el-button>
          <el-button class="spp-btn" @click="resetData()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bureauinfo-container">
      <div class="main-header">
        <div class="left">
          <span v-if="functionList.includes('A09001')" class="spp-btn spp-btn-primary" @click="openDialog('新增', {})">
            <svg-icon icon-class="add" />
            <span>新增</span>
          </span>
          <span v-if="functionList.includes('A09003')" class="spp-btn" @click="batchDelete">
            <svg-icon icon-class="delete" />
            <span>删除</span>
          </span>
        </div>
      </div>
      <div class="main-body">
        <el-table ref="multipleTable" :data="bureauInfoData">
          <el-table-column type="selection" width="55" />>
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="教育局名称" prop="edu_name" />
          <el-table-column label="省份" prop="province_name" />
          <el-table-column label="城市" prop="area_name" />
          <el-table-column label="地区" prop="county_name" />
          <el-table-column label="联系电话" prop="edu_phone" />
          <el-table-column prop="address" label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="functionList.includes('A09004')"
                type="text"
                @click="editEduAuth(scope.row.admin_role_id)"
              >管理员权限</el-button>
              <el-button type="text">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    更多
                    <i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="bindSchool(scope.row.edu_id)">学校绑定</el-dropdown-item>
                    <el-dropdown-item
                      v-if="functionList.includes('A09002')"
                      @click.native="openDialog('修改', scope.row)"
                    >编辑</el-dropdown-item>
                    <el-dropdown-item
                      v-if="functionList.includes('A09003')"
                      @click.native="deleteItem(scope.row.edu_id)"
                    >删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="bureauInfoObj.page_num"
          :limit.sync="bureauInfoObj.page_size"
          @pagination="getData"
        />
      </div>
    </div>
    <el-dialog
      :title="eldialog"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="900px"
    >
      <div v-if="showDialog" class="bureauInfo-dialog">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="教育局名称" prop="edu_name">
                <el-input v-model="ruleForm.edu_name" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="教育局电话" prop="edu_phone" class="fill-right">
                <el-input v-model="ruleForm.edu_phone" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="教育局归属" prop="edu_address_code">
            <el-cascader
              ref="eduCascader"
              v-model="ruleForm.edu_address_code"
              :props="props_dialog"
              placeholder="请选择教育局区域"
              style="width:100%"
            />
          </el-form-item>
          <el-form-item label="教育局地址" prop="edu_address">
            <el-input
              v-model="ruleForm.edu_address"
              type="textarea"
              :rows="2"
              placeholder="请输入教育局地址"
            />
          </el-form-item>
          <el-row v-if="transferSign.sign === 1" :gutter="16">
            <el-col :span="12">
              <el-form-item label="教育局管理员" prop="user_name">
                <el-input v-model="ruleForm.user_name" placeholder="请输入教育局管理员姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="教育局管理员电话" prop="user_phone">
                <el-input v-model="ruleForm.user_phone" placeholder="请输入教育局管理员手机号" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="dialog-btn">
        <span class="spp-btn spp-btn-primary" @click="editSubmit">提交</span>
        <span class="spp-btn" @click="resetEditData">重置</span>
      </div>
    </el-dialog>
    <el-drawer
      :title="authDialogTitle"
      :visible.sync="showAuthDialog"
      :wrapper-closable="false"
      class="spp-drawer right-noall-content"
      style="font-size: 14px"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <TreeView
          v-if="showAuthDialog"
          :data="menuTree"
          :checked.sync="authChecked"
          :selected="authSelected"
          :height="height+'px'"
          @updateChecked="updateChecked"
        />
      </el-scrollbar>
      <div class="dialog-btn" style="position:fixed;bottom:0;right:0">
        <span class="spp-btn spp-btn-primary" @click="saveAuth()">保存</span>
        <span class="spp-btn" @click="showAuthDialog=false">取消</span>
      </div>
    </el-drawer>
    <el-dialog
      v-if="bindSchooldialog"
      title="关联学校"
      :visible.sync="bindSchooldialog"
      :close-on-click-modal="false"
      width="667px"
    >
      <el-transfer
        v-model="choiceSchool"
        :data="schoolList"
        :titles="['学校列表', '已选择学校']"
        filterable
        filter-placeholder="搜索学校名称"
      />
      <div class="bureauinfo-btn">
        <span class="spp-btn left-btn" @click="bindSchooldialog=false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="bindEduAndSchool">提交</span>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  infoPaginate,
  addEduinfo,
  updateEduinfo,
  deleteEduinfo,
  relList,
  relListSave
} from '@/api/bureau'
import { getSchoolList } from '@/api/school'
import Pagination from '@/components/Pagination'
import { getRoleAuth, editRoleAuth } from '@/api/role'
import { getAreaData, formatMenuAuth } from '@/utils'
import { mapGetters } from 'vuex'
import TreeView from '@/components/Treeview'
export default {
  name: 'BureauInfo',
  components: { Pagination, TreeView },
  data() {
    return {
      height: window.innerHeight - 135,
      bureauInfoObj: {
        keyword: '',
        edu_address_code: [],
        page_num: 1,
        page_size: 10
      },
      bureauInfoData: [], // 列表数据List
      total: 0,
      eldialog: '', // 新增编辑模态框标题
      showDialog: false, // 修改数据模态框标识
      ruleForm: {
        edu_name: '',
        edu_address_code: '',
        edu_address: '',
        edu_phone: '',
        user_name: '',
        user_phone: ''
      },
      transferSign: {
        sign: '', // 1代表新增  2代表编辑
        edu_id: '' // 信息id
      },
      rules: {
        edu_name: [
          { required: true, message: '请输入教育局名称', trigger: 'blur' }
        ],
        edu_address_code: [
          { required: true, message: '请选择教育区地区', trigger: 'blur' }
        ],
        edu_address: [
          { required: true, message: '请输入教育局地址', trigger: 'blur' }
        ],
        edu_phone: [
          { required: true, message: '请输入教育局联系电话', trigger: 'blur' }
        ],
        user_name: [
          { required: true, message: '请输入管理员姓名', trigger: 'blur' }
        ],
        user_phone: [
          { required: true, message: '请输入管理员手机号', trigger: 'blur' }
        ]
      },
      props: {
        checkStrictly: true,
        lazy: true,
        lazyLoad(node, resolve) {
          getAreaData(node, resolve)
        }
      },
      props_dialog: {
        lazy: true,
        lazyLoad(node, resolve) {
          getAreaData(node, resolve)
        }
      },
      showAuthDialog: false,
      authDialogTitle: '',
      authChecked: [],
      authSelected: [],
      bindSchooldialog: false, // 绑定学校模态框标识
      choiceSchool: [], // 所选择的关联接口
      schoolList: [], // 所有权限列表
      editeduid: ''
    }
  },
  computed: {
    ...mapGetters(['functionList'])
  },
  created() {
    this.getData()
  },
  methods: {
    // 重置搜索选项
    resetData() {
      Object.assign(
        this.$data.bureauInfoObj,
        this.$options.data().bureauInfoObj
      )
    },
    searchData() {
      this.bureauInfoObj.page_num = 1
      this.getData()
    },
    // 获取列表数据
    getData() {
      const {
        keyword,
        edu_address_code,
        page_num,
        page_size
      } = this.bureauInfoObj
      infoPaginate(
        keyword,
        edu_address_code[0],
        edu_address_code[1],
        edu_address_code[2],
        page_num,
        page_size
      ).then(res => {
        this.bureauInfoData = res.data.list
        this.total = res.data.totalRow
      })
    },

    // 批量删除
    batchDelete() {
      let str = ''
      this.$refs.multipleTable.store.states.selection.forEach(item => {
        str += item.edu_id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      str
        ? this.deleteItem(str)
        : this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
    },

    // 删除教育局信息
    deleteItem(edu_id) {
      this.$confirm('您确定要删除该教育局信息吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteEduinfo(edu_id).then(res => {
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

    // 新增 或者 编辑教育局信息
    openDialog(title, itemObj) {
      this.transferSign = {
        sign: title === '新增' ? 1 : 2,
        edu_id: itemObj.edu_id
      }
      this.ruleForm = { ...itemObj }
      if (title === '修改') {
        this.ruleForm.edu_address_code = [
          itemObj.province_code,
          itemObj.area_code,
          itemObj.county_code
        ]
      }
      this.eldialog = title + '教育局信息'
      this.showDialog = true
    },

    // 提交新增或者编辑数据
    editSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const {
            edu_name,
            edu_address,
            edu_phone,
            user_name,
            user_phone
          } = this.ruleForm
          if (this.transferSign.sign === 1) {
            // 新增
            addEduinfo(
              edu_name,
              this.ruleForm.edu_address_code[0],
              this.ruleForm.edu_address_code[1],
              this.ruleForm.edu_address_code[2],
              edu_address,
              edu_phone,
              user_name,
              user_phone
            ).then(res => {
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
            updateEduinfo(
              this.transferSign.edu_id,
              edu_name,
              this.ruleForm.edu_address_code[0],
              this.ruleForm.edu_address_code[1],
              this.ruleForm.edu_address_code[2],
              edu_address,
              edu_phone
            ).then(res => {
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

    // 重置编辑数据
    resetEditData() {
      this.$refs.ruleForm.resetFields()
    },

    editEduAuth(role_id) {
      this.role_id = role_id
      getRoleAuth(role_id, 1).then(response => {
        const data = response.data
        this.authDialogTitle = '为教育局管理员分配权限'
        this.showAuthDialog = true
        const result = formatMenuAuth(data)
        this.menuTree = result.menuTree
        this.authChecked = result.authChecked
        this.authSelected = result.authSelected
      })
    },
    saveAuth() {
      editRoleAuth(this.role_id, this.authChecked.join(',')).then(response => {
        this.showAuthDialog = false
        this.$message({
          message: '教育局角色修改成功',
          type: 'success',
          duration: 3000
        })
        this.getData()
      })
    },
    updateChecked(data) {
      this.authChecked = data
    },

    // 教育局绑定学校
    bindSchool(edu_id) {
      this.schoolList = []
      this.choiceSchool = []
      this.bindSchooldialog = true
      this.editeduid = edu_id
      getSchoolList().then(res => {
        this.schoolList = res.data
        this.schoolList.forEach((item, index) => {
          item.label = item.scl_name
          item.key = item.scl_id
        })
      })
      relList(edu_id).then(res => {
        res.data.forEach(item => {
          this.choiceSchool.push(item.scl_id)
        })
      })
    },

    // 修改教育局和学校绑定
    bindEduAndSchool() {
      relListSave(this.editeduid, this.handlePmsnid()).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 3000
        })
        this.bindSchooldialog = false
        this.getData()
      })
    },

    // 处理pmsn_id 以','隔开
    handlePmsnid() {
      let str = ''
      this.choiceSchool.forEach(item => {
        str += item + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      return str
    }
  }
}
</script>
<style lang="scss" scoped>
.bureauinfo-container {
  background: #ffffff;
  margin-top: 20px;
  border-radius: 10px;
  .main-header {
    padding: 16px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ebf0f5;
  }
}
.bureauInfo-dialog {
  padding: 0 40px;
  .fill-item {
    display: flex;
    .fill-right {
      margin-left: 20px;
    }
  }
}
.dialog-btn {
  padding-left: 160px;
  margin-bottom: 30px;
}
.bureauinfo-btn {
  text-align: right;
  margin-top: 10px;
  .spp-btn {
    margin-right: 0;
  }
  .left-btn {
    margin-right: 15px;
  }
}
</style>
