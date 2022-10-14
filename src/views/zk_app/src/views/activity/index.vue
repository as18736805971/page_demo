<template>
  <div class="app-container page-container right-side-dialog">
    <div class="header-search single_line">
      <el-form
        ref="search_form"
        :model="search"
        :inline="true"
        label-width="120px"
      >
        <div class="form-area">
          <el-form-item label="活动类型：">
            <el-select v-model="search.activity_type" clearable placeholder="请选择">
              <el-option v-for="(item, k) in activity_type" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称：">
            <el-input v-model="search.activity_name" placeholder="请输入" />
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
        <span v-if="functionList.includes('A22001')" class="spp-btn spp-btn-primary" @click="addActivity()">
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span v-if="functionList.includes('A22004')" class="spp-btn" @click="delBatch()">
          <svg-icon icon-class="delete" />
          <span>删除</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column type="selection" width="55" />>
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="活动名称" prop="activity_name" />
        <el-table-column label="活动类型" prop="activity_type">
          <template slot-scope="scope">{{ activity_type[scope.row.activity_type] }}</template>
        </el-table-column>
        <el-table-column label="活动地点" prop="building_name" />
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="user_name" />
        <el-table-column prop="address" label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="text" @click="showDetail(scope.row.id)">详情</el-button>
            <el-button type="text">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-if="functionList.includes('A19002')" @click.native="handleDetection(scope.row.id, 1)">生成风险公告</el-dropdown-item>
                  <el-dropdown-item v-if="functionList.includes('A19003')" @click.native="handleDetection(scope.row.id, 2)">生成事故处置应急卡</el-dropdown-item>
                  <el-dropdown-item v-if="functionList.includes('A22003')" @click.native="edit(scope.row.id)">编辑</el-dropdown-item>
                  <el-dropdown-item v-if="functionList.includes('A22004')" @click.native="del(scope.row.id)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
    </div>
    <el-dialog
      title="活动详情"
      :visible.sync="showDetailDialog"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-form label-width="80px">
          <el-form-item class="detail-el-form-item" label="活动名称：">
            {{ detail.activity_name }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="活动地点">
            {{ detail.building_name ? detail.building_name : '--' }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="活动类型：">
            {{ activity_type[detail.activity_type] }}
          </el-form-item>
          <el-form-item class="detail-el-form-item" label="活动内容：">
            {{ detail.activity_content }}
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-dialog>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="活动名称：" prop="activity_name">
            <el-input v-model="form.activity_name" placeholder="请输入活动名称" />
          </el-form-item>
          <el-form-item label="活动地点：" prop="location_id">
            <el-cascader
              v-model="form.location_id"
              :options="buildingList"
              clearable
              :props="{ checkStrictly: true }"
              @change="handleChange"
            />
          </el-form-item>
          <el-form-item label="活动类型：" prop="activity_type">
            <el-select v-model="form.activity_type" clearable placeholder="请选择活动类型">
              <el-option v-for="(item, k) in activity_type" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动内容：" prop="activity_content">
            <el-input v-model="form.activity_content" type="textarea" :rows="4" placeholder="请输入活动内容" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="showDialog = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="submit">保存</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { paginate, detail, save, update, del } from '@/api/activity'
import Pagination from '@/components/Pagination'
import { getBuildingList } from '@/api/building'
import { formatDateTime, BuildingListToTree } from '@/utils/index'
import { generateNotice, generatePlanInfo, getNotice, getPlanInfo } from '@/api/risk_point'
import { mapState } from 'vuex'
export default {
  name: 'Activity',
  components: { Pagination },
  data() {
    return {
      height: window.innerHeight - 135,
      search: {
        activity_name: '',
        activity_type: ''
      },
      activity_type: {
        1: '校园组织管理',
        2: '教学科研手段',
        3: '教学科研实习活动',
        4: '人员行为'
      },
      data: [],
      buildingList: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      showDetailDialog: false,
      dialogTitle: '',
      detail: {},
      form: {
        id: '',
        activity_name: '',
        location_id: '',
        activity_content: '',
        activity_type: ''
      },
      rules: {
        activity_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        activity_type: [
          { required: true, message: '请选择活动类型', trigger: 'blur' }
        ],
        activity_content: [
          { required: true, message: '请输入活动内容', trigger: 'blur' }
        ]
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
    this.getBuildingList()
  },
  methods: {
    formatDateTime: formatDateTime,
    getBuildingList() {
      getBuildingList().then(res => {
        this.buildingList = BuildingListToTree(res.data, '0')
      })
    },
    handleChange(value) {
      if (value) {
        this.form.location_id = value[value.length - 1]
      }
    },
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      paginate(this.search, this.page, this.page_size).then(response => {
        this.data = response.data.list
        this.total = response.data.totalRow
      })
    },
    addActivity() {
      this.app_id = ''
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
      this.dialogTitle = '新增活动'
    },
    showDetail(id) {
      detail(id).then(response => {
        this.showDetailDialog = true
        this.detail = {
          activity_name: response.data.activity_name,
          activity_type: response.data.activity_type,
          building_name: response.data.building_name,
          activity_content: response.data.activity_content
        }
      })
    },
    edit(id) {
      detail(id).then(response => {
        const data = response.data
        this.form = {
          id: data.id,
          activity_name: data.activity_name,
          activity_type: data.activity_type,
          location_id: data.location_id ? data.location_id : '',
          activity_content: data.activity_content
        }
        this.showDialog = true
        this.dialogTitle = '修改活动'
      })
    },
    del(id) {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getData()
        })
      }).catch(() => {})
    },
    delBatch() {
      let str = ''
      this.$refs.table.store.states.selection.forEach(item => {
        str += item.id + ','
      })
      str ? str = str.substring(0, str.length - 1) : str
      str ? this.del(str) : ''
      if (str) {
        this.$confirm('确定要删除吗？', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(str).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          })
        }).catch(() => {})
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
                message: '教学活动添加成功',
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
                message: '教学活动修改成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      }
      this.showDialog = false
    },
    reset() {
      if (this.$refs.hasOwnProperty('form')) {
        this.$refs.form.resetFields()
      }
    },
    handleDetection(risk_id, type) {
      if (type === 1) {
        getNotice(risk_id, '2').then((res) => {
          this.downloadNotice(risk_id)
        })
      } else {
        getPlanInfo(risk_id, '2').then((res) => {
          this.downloadPlaninfo(risk_id)
        })
      }
    },
    async downloadNotice(risk_id) {
      const url = await generateNotice(risk_id, '2')
      window.open(url)
    },
    async downloadPlaninfo(risk_id) {
      const url = await generatePlanInfo(risk_id, '2')
      window.open(url)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
