<template>
  <section class="app-container">
    <section class="filter-container common-filter">
      <div class="filter-left">
        <div class="filter-item">
          <label class="label">权限名称：</label>
          <el-input v-model="authorityObj.fp_name" placeholder="请输入" />
        </div>
        <div class="filter-item">
          <label class="label">是否关联接口：</label>
          <el-select v-model="authorityObj.is_rela" clearable placeholder="请选择">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="label">状态：</label>
          <el-select v-model="authorityObj.status_flag" clearable placeholder="请选择">
            <el-option label="正常" value="1" />
            <el-option label="停用" value="0" />
          </el-select>
        </div>
      </div>
      <div class="filter-right">
        <div class="filter-btn">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="resetData">重置</span>
        </div>
      </div>
    </section>
    <div class="authority-container">
      <div class="main-header">
        <div class="left">
          <span
            v-if="functionList.includes('A01001')"
            class="spp-btn spp-btn-primary"
            @click="openDialog('新增权限', {fp_name: '',fp_code: '',fp_desc: ''})"
          >
            <svg-icon icon-class="add" />
            <span>新增</span>
          </span>
          <span v-if="functionList.includes('A01002')" class="spp-btn" @click="batchDelete">
            <svg-icon icon-class="stopusing" />
            <span>停用</span>
          </span>
        </div>
      </div>
      <div class="main-body">
        <el-table ref="multipleTable" :data="authorityData">
          <el-table-column type="selection" width="55" />>
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="权限名称" prop="fp_name" width="500" />
          <el-table-column label="关联接口数量（个）" prop="relanum">
            <template slot-scope="scope">
              {{ scope.row.relanum }}&nbsp;&nbsp;&nbsp;
              <span v-show="scope.row.status_flag == '1'">
                <svg-icon
                  v-if="functionList.includes('A01004')"
                  icon-class="edit"
                  style="cursor:pointer"
                  @click="openGlinterface(scope.row.fp_id)"
                />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="create_time" sortable>
            <template slot-scope="scope">{{ scope.row.create_time | fgTime }}</template>
          </el-table-column>
          <el-table-column label="状态" prop="status_flag">
            <template slot-scope="scope">{{ scope.row.status_flag == '1'?'正常':'停用' }}</template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="130">
            <template slot-scope="scope">
              <div v-show="scope.row.status_flag == '1'">
                <span
                  v-if="functionList.includes('A01003')"
                  class="edit common_text"
                  @click="openDialog('编辑权限', scope.row)"
                >编辑</span>
                <span
                  v-if="functionList.includes('A01002')"
                  class="delete common_text"
                  @click="deleteItem(scope.row.fp_id)"
                >停用</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="authorityObj.page_num"
          :limit.sync="authorityObj.page_size"
          @pagination="getData"
        />
      </div>
    </div>
    <el-dialog
      :title="eldialog"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="906px"
    >
      <div v-if="showDialog" class="authority-dialog">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
          <el-form-item label="权限名称" prop="fp_name">
            <el-input v-model="ruleForm.fp_name" />
          </el-form-item>
          <el-form-item label="权限代码" prop="fp_code">
            <el-input v-model="ruleForm.fp_code" />
          </el-form-item>
          <el-form-item label="权限描述" prop="fp_desc">
            <el-input v-model="ruleForm.fp_desc" type="textarea" rows="4" />
          </el-form-item>
          <el-form-item label="关联接口">
            <el-transfer
              v-model="choiceRole"
              :data="roleList"
              :titles="['接口列表', '已选择接口']"
              filterable
              filter-placeholder="搜索接口名称"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-btn">
        <span class="spp-btn spp-btn-primary" @click="editSubmit">提交</span>
        <span class="spp-btn" @click="resetEditData">重置</span>
      </div>
    </el-dialog>
    <el-dialog title="关联接口" :visible.sync="glinterface" :close-on-click-modal="false" width="667px">
      <el-transfer
        v-model="choiceRole"
        :data="roleList"
        :titles="['接口列表', '已选择接口']"
        filterable
        filter-placeholder="搜索接口名称"
      />
      <div class="authoritygl-btn">
        <span class="spp-btn left-btn" @click="glinterface=false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="bindRoleAndPermission">提交</span>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  paginate,
  deleteSys,
  viewListrole,
  addPoint,
  updatePoint,
  bindpermission
} from '@/api/authority_manage'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'Authority',
  components: { Pagination },
  data() {
    return {
      authorityObj: {
        fp_name: '',
        is_rela: '',
        status_flag: '',
        page_num: 1,
        page_size: 10
      },
      authorityData: [], // 列表数据
      total: 0,
      showDialog: false, // 编辑或者新增模态标识
      glinterface: false, // 关联接口模态标识
      eldialog: '', // 新增编辑模态框标题
      roleList: [], // 所有权限列表
      choiceRole: [], // 所选择的关联接口
      tempChoiceRole: [], // 临时存储关联接口
      editfpId: '', // 当前编辑权限和功能点绑定的功能点id
      ruleForm: {
        fp_name: '',
        fp_code: '',
        fp_desc: ''
      },
      transferSign: {
        sign: '', // 1代表新增  2代表编辑
        fp_id: '' // 功能点id
      },
      rules: {
        fp_name: [
          { required: true, message: '请输入权限名称', trigger: 'blur' }
        ],
        fp_code: [
          { required: true, message: '请输入权限代码', trigger: 'blur' }
        ]
      }
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
      Object.assign(this.$data.authorityObj, this.$options.data().authorityObj)
    },

    searchData() {
      this.authorityObj.page_num = 1
      this.getData()
    },

    // 获取列表数据
    getData() {
      paginate(this.authorityObj).then(res => {
        this.authorityData = res.data.list
        this.total = res.data.totalRow
      })
    },

    // 删除数据
    deleteItem(fp_id) {
      this.$confirm('您确定要停用该权限吗？', '停用提示', {
        confirmButtonText: '停用',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSys(fp_id).then(res => {
            this.$message({
              message: '停用成功',
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
      this.$refs.multipleTable.store.states.selection.forEach(item => {
        str += item.fp_id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      str
        ? this.deleteItem(str)
        : this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
    },

    // 获取权限列表
    getroleList(fp_id) {
      viewListrole(fp_id).then(res => {
        this.roleList = res.data
        this.roleList.forEach((item, index) => {
          item.label = item.pmsn_name
          item.key = item.pmsn_id
          if (item.flag) {
            this.choiceRole.push(item.pmsn_id)
          }
        })
        this.tempChoiceRole = JSON.parse(JSON.stringify(this.choiceRole))
      })
    },

    // 新增 或者 编辑权限
    openDialog(title, itemObj) {
      this.choiceRole = []
      this.transferSign = {
        sign: title === '新增权限' ? 1 : 2,
        fp_id: itemObj.fp_id
      }
      this.ruleForm = { ...itemObj }
      this.getroleList(itemObj.fp_id)
      this.eldialog = title
      this.showDialog = true
    },

    // 编辑单个权限和功能点绑定
    openGlinterface(fp_id) {
      this.choiceRole = []
      this.editfpId = fp_id
      this.getroleList(fp_id)
      this.glinterface = true
    },

    // 重置编辑数据
    resetEditData() {
      this.$refs.ruleForm.resetFields()
      this.choiceRole = JSON.parse(JSON.stringify(this.tempChoiceRole))
    },

    // 提交编辑数据
    editSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const { fp_name, fp_desc, fp_code } = this.ruleForm
          if (this.transferSign.sign === 1) {
            // 新增
            addPoint(fp_name, fp_desc, fp_code, this.handlePmsnid()).then(
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
          } else {
            // 编辑
            updatePoint(
              this.transferSign.fp_id,
              fp_name,
              fp_desc,
              fp_code,
              this.handlePmsnid()
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

    // 修改功能点和权限绑定
    bindRoleAndPermission() {
      bindpermission(this.editfpId, this.handlePmsnid()).then(res => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 3000
        })
        this.glinterface = false
        this.getData()
      })
    },

    // 处理pmsn_id 以','隔开
    handlePmsnid() {
      let str = ''
      this.choiceRole.forEach(item => {
        str += item + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      return str
    }
  }
}
</script>
<style lang="scss">
.authority-dialog {
  .el-form-item__content {
    margin-left: 80px !important;
  }
  .el-form-item__label {
    width: 80px !important;
    font-size: 14px;
  }
}
</style>
<style lang="scss" scoped>
.authority-container {
  background: #ffffff;
  margin-top: 20px;
  border-radius: 10px;
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
  }
  .delete {
    margin-left: 10px;
    color: #f36861;
  }
}
.authority-dialog {
  padding: 0 80px;
}
.dialog-btn {
  padding: 0 180px;
  margin-bottom: 30px;
}
.authoritygl-btn {
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
