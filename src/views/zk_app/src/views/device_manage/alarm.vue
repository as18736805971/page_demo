<template>
  <div class="app-container page-container">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="学校：">
            <el-input v-model="search.data.scl_name" placeholder="请选择" @focus="choiceSchool(1)" />
          </el-form-item>
          <el-form-item label="设备名称：">
            <el-input v-model="search.keyword" placeholder="请输入" />
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="resetForm()">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-header">
      <div class="left">
        <span
          v-if="functionList.includes('A40020')"
          class="spp-btn spp-btn-primary"
          @click="addEquipment()"
        >
          <svg-icon icon-class="add" />新增
        </span>
        <span v-if="functionList.includes('A40022')" class="spp-btn" @click="delBatch()">
          <svg-icon icon-class="delete" />删除
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column type="selection" width="55" />>
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="学校" prop="scl_name" />
        <el-table-column label="设备名称" prop="equ_name" />
        <el-table-column label="设备类型" prop="equ_type">
          <template slot-scope="scope">{{ device_type[scope.row.equ_type] }}</template>
        </el-table-column>
        <el-table-column label="责任人" prop="duty_name" />
        <el-table-column label="责任人手机号" prop="duty_phone" />
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="user_name" width="130" />
        <el-table-column prop="address" label="操作" width="130">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A40021')" type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button v-if="functionList.includes('A40022')" type="text" @click="del(scope.row.equ_id)">删除</el-button>
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
    <!-- 新增/编辑 -->
    <el-drawer
      :title="dialogTitle"
      :visible.sync="showDialog"
      :wrapper-closable="false"
      class="spp-drawer right-noall-content right-side-dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar">
        <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="选择学校：" prop="scl_name">
            <div @click="choiceSchool">
              <el-input v-model="form.data.scl_name" placeholder="请选择学校" />
            </div>
          </el-form-item>
          <el-form-item label="设备名称：" prop="equ_name">
            <el-input v-model="form.equ_name" placeholder="请输入设备名称" />
          </el-form-item>
          <el-form-item label="设备类型：" prop="equ_type">
            <el-select v-model="form.equ_type" clearable placeholder="请选择设备类型">
              <el-option v-for="(item, k) in device_type" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备厂商：" prop="equ_vender">
            <el-select v-model="form.equ_vender" clearable placeholder="请选择设备厂商">
              <el-option v-for="(item, k) in vender_type" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备ID：" prop="device_id">
            <el-input v-model="form.device_id" placeholder="请输入设备ID" />
          </el-form-item>
          <el-form-item label="设备位置：" prop="equ_position">
            <el-input v-model="form.equ_position" placeholder="请输入设备位置" />
          </el-form-item>
          <el-form-item label="设备描述：" prop="equ_desc">
            <el-input v-model="form.equ_desc" type="textarea" :rows="4" placeholder="请输入设备描述" />
          </el-form-item>
          <el-form-item label="责任人：" prop="duty_name">
            <el-input v-model="form.duty_name" placeholder="请输入责任人" />
          </el-form-item>
          <el-form-item label="责任人手机号：" prop="duty_phone">
            <el-input v-model="form.duty_phone" placeholder="请输入责任人手机号" />
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="form.remark" type="textarea" :rows="4" placeholder="请输入备注" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="showDialog = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="submit">保存</span>
      </div>
      <el-drawer
        title="选择学校"
        :append-to-body="true"
        :visible.sync="selectSchoolDialog"
        :wrapper-closable="false"
        class="spp-child-drawer"
      >
        <SelectSchool :type="2" @selectSchool="ensureSchool" />
      </el-drawer>
    </el-drawer>
    <!-- 选择学校 -->
    <el-drawer
      v-if="schoolDialog"
      title="选择学校"
      :visible.sync="schoolDialog"
      :wrapper-closable="false"
      class="spp-drawer"
      width="720px"
    >
      <SelectSchool :type="2" @selectSchool="selectSchool" />
    </el-drawer>
  </div>
</template>

<script>
import { equtype, equVender } from '@/api/device_manage'
import { paginate, save, update, del, detail } from '@/api/device_manage_alarm'
import Pagination from '@/components/Pagination'
import SelectSchool from '@/components/SelectSchool'
import { mapState } from 'vuex'
import { formatDateTime } from '@/utils/index'
export default {
  name: 'EquipAlarm',
  components: { Pagination, SelectSchool },
  data() {
    const validateSclname = (rule, value, callback) => {
      if (!this.form.data.scl_id) {
        callback('请选择学校')
      } else {
        callback()
      }
    }
    return {
      search: {
        keyword: '',
        data: { scl_id: '', scl_name: '' }
      },
      device_type: {}, // 设备类型
      vender_type: {}, // 设备厂商
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      schoolDialog: false,
      selectSchoolDialog: false,
      showDialog: false,
      dialogTitle: '',
      form: {
        id: '', // 设备id
        data: {
          scl_id: '',
          scl_name: ''
        }, // 学校id
        device_id: '', // 设备id
        equ_type: '', // 设备类型
        equ_name: '', // 设备名称
        equ_desc: '', // 设备描述
        equ_vender: '', // 设备厂商编码
        equ_position: '', // 设备位置
        duty_name: '', // 责任人
        duty_phone: '', // 责任人手机号
        remark: '' // 备注
      },
      rules: {
        scl_name: [{ required: true, trigger: 'blur', validator: validateSclname }],
        equ_name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        equ_type: [{ required: true, message: '请选择设备类型', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  async created() {
    this.getData()
    this.getDeviceType()
    this.getVenderType()
    console.log(this.functionList, '权限id')
  },
  methods: {
    formatDateTime: formatDateTime,
    searchData() {
      this.page = 1
      this.getData()
    },
    resetForm() {
      Object.assign(this.$data.search, this.$options.data().search)
      this.searchData()
    },
    getData() {
      paginate(this.search, this.page, this.page_size).then(response => {
        this.data = response.data.list
        this.total = response.data.totalRow
      })
    },
    // 获取设备类型
    getDeviceType() {
      equtype().then(res => {
        this.device_type = res.data
      })
    },
    // 获取设备厂商
    getVenderType() {
      equVender().then(res => {
        this.vender_type = res.data
      })
    },
    addEquipment() {
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
      this.dialogTitle = '新增一键报警设备'
    },
    edit(data) {
      this.form = {
        id: data.equ_id,
        data: {
          scl_id: data.scl_id,
          scl_name: data.scl_name
        },
        equ_type: data.equ_type,
        equ_name: data.equ_name,
        equ_desc: data.equ_desc,
        equ_vender: data.equ_vender,
        equ_position: data.equ_position,
        device_id: data.device_id,
        duty_name: data.duty_name,
        duty_phone: data.duty_phone,
        remark: data.remark
      }
      this.showDialog = true
      this.dialogTitle = '修改一键报警设备'
    },
    del(id) {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          del(id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          })
        })
        .catch(() => {})
    },
    delBatch() {
      let str = ''
      this.$refs.table.store.states.selection.forEach(item => {
        str += item.equ_id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      str ? this.del(str) : ''
      if (str) {
        this.$confirm('确定要删除吗？', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            del(str).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
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
            const data = this.form
            save(data).then(response => {
              this.showDialog = false
              this.$message({
                message: '设备添加成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      } else {
        // 修改
        this.$refs.form.validate(valid => {
          if (valid) {
            const data = this.form
            update(data.id, data).then(response => {
              this.showDialog = false
              this.$message({
                message: '设备修改成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      }
    },
    // 选择学校
    choiceSchool(type) {
      type === 1
        ? (this.schoolDialog = true)
        : (this.selectSchoolDialog = true)
    },
    // 确认选择
    selectSchool(data) {
      this.search.data = {
        scl_id: data.scl_id,
        scl_name: data.scl_name
      }
      this.schoolDialog = false
    },
    ensureSchool(data) {
      this.selectSchoolDialog = false
      this.form.data = {
        scl_id: data.scl_id,
        scl_name: data.scl_name
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
