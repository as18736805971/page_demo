<template>
  <div class="app-container page-container right-side-dialog">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="设备状态：">
            <el-select v-model="search.equipment_status" clearable placeholder="请选择">
              <el-option v-for="(item, k) in equipment_status" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备名称：">
            <el-input v-model="search.equipment_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item class="btn-area">
            <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
            <span class="spp-btn" @click="resetForm()">重置</span>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-header">
      <div class="left">
        <span v-if="functionList.includes('A17001')" class="spp-btn spp-btn-primary" @click="addEquipment()">
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="functionList.includes('A17003')" class="spp-btn" @click="delBatch()">
          <svg-icon icon-class="delete" />
          <span>删除</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column type="selection" width="55" />>
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="名称" prop="equipment_name" />
        <el-table-column label="数量" prop="euqipment_count" />
        <el-table-column label="位置" prop="equipment_location" />
        <el-table-column label="状态" prop="activity_type">
          <template slot-scope="scope">{{ equipment_status[scope.row.equipment_status] }}</template>
        </el-table-column>
        <el-table-column label="负责人" prop="response_man" />
        <el-table-column label="联系方式" prop="response_man_phone" />
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A17002')" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-if="functionList.includes('A17003')" type="text" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="page_size"
        @pagination="getData"
      />
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="设备名称" prop="equipment_name">
            <el-input v-model="form.equipment_name" placeholder="请输入设备名称" />
          </el-form-item>
          <el-form-item label="设备数量" prop="euqipment_count">
            <el-input v-model="form.euqipment_count" placeholder="请输入设备数量" />
          </el-form-item>
          <el-form-item label="设备位置" prop="equipment_location">
            <el-input v-model="form.equipment_location" placeholder="请输入设备位置" />
          </el-form-item>
          <el-form-item label="设备状态" prop="equipment_status">
            <el-select v-model="form.equipment_status" clearable placeholder="请选择设备状态">
              <el-option v-for="(item, k) in equipment_status" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="负责人" prop="response_man">
            <el-select v-model="form.response_man" clearable placeholder="请选择负责人">
              <el-option v-for="(item, index) in response_man" :key="index" :label="item.user_name" :value="item.user_id" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="reset">重置</span>
        <span class="spp-btn spp-btn-primary" @click="submit">提交</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { formatDateTime } from '@/utils/index'
import { mapState } from 'vuex'
import {
  paginate,
  saveEquipment,
  updateEquipment,
  deleteEquipment
} from '@/api/equip'
import { getSclUserList } from '@/api/school_user'
export default {
  name: 'Equip',
  components: { Pagination },
  data() {
    return {
      height: window.innerHeight - 135,
      search: {
        equipment_name: '',
        equipment_status: ''
      },
      equipment_status: {
        1: '完好',
        2: '损坏'
      },
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      dialogTitle: '',
      form: {
        id: '',
        equipment_name: '',
        euqipment_count: '',
        equipment_location: '',
        equipment_status: '',
        response_man: ''
      },
      rules: {
        equipment_name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        euqipment_count: [
          { required: true, message: '请输入设备数量', trigger: 'blur' }
        ],
        equipment_location: [
          { required: true, message: '请输入设备位置', trigger: 'blur' }
        ],
        equipment_status: [
          { required: true, message: '请选择设备状态', trigger: 'blur' }
        ],
        response_man: [
          { required: true, message: '请选择负责人', trigger: 'blur' }
        ]
      },
      response_man: []
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  async created() {
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      const {
        equipment_name,
        equipment_status
      } = this.search
      paginate(
        equipment_name,
        equipment_status,
        this.page,
        this.page_size
      ).then(res => {
        this.data = res.data.list
        this.total = res.data.totalRow
      })
    },
    addEquipment() {
      Object.assign(this.form, this.$options.data().form)
      this.getUser()
      this.showDialog = true
      this.dialogTitle = '新增设备'
    },
    getUser() {
      getSclUserList().then(res => {
        this.response_man = res.data
        this.response_man.forEach(opt => {
          if (opt.user_name === this.form.response_man) {
            this.form.response_man = opt.user_id
          }
        })
      })
    },
    edit(opt) {
      this.form = JSON.parse(JSON.stringify(opt))
      this.getUser()
      this.showDialog = true
      this.dialogTitle = '修改设备'
    },
    del(id) {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteEquipment(id).then(res => {
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
    delBatch() {
      let str = ''
      this.$refs.table.store.states.selection.forEach(item => {
        str += item.id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      if (str) {
        this.$confirm('确定要删除吗？', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteEquipment(str).then(res => {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
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
    submit() {
      if (!this.form.id) {
        // 新增
        this.$refs.form.validate(valid => {
          if (valid) {
            const {
              equipment_name,
              euqipment_count,
              equipment_location,
              equipment_status,
              response_man
            } = this.form
            saveEquipment(
              equipment_name,
              euqipment_count,
              equipment_location,
              equipment_status,
              response_man
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
        })
      } else {
        // 修改
        this.$refs.form.validate(valid => {
          if (valid) {
            const {
              id,
              equipment_name,
              euqipment_count,
              equipment_location,
              equipment_status,
              response_man
            } = this.form
            updateEquipment(
              id,
              equipment_name,
              euqipment_count,
              equipment_location,
              equipment_status,
              response_man
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
        })
      }
    },
    reset() {
      if (this.$refs.hasOwnProperty('form')) {
        this.$refs.form.resetFields()
      }
    },
    resetForm() {
      this.search = {
        equipment_name: '',
        equipment_status: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
