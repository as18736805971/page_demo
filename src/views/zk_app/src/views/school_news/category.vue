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
          <el-form-item label="分类名称：">
            <el-input v-model="search.categroy_name" placeholder="请输入" />
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span
            class="spp-btn spp-btn-primary"
            @click="searchData()"
          >搜索</span>
          <span class="spp-btn" @click="resetForm()">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-header">
      <div class="left">
        <span
          v-if="functionList.includes('A52004')"
          class="spp-btn spp-btn-primary"
          @click="addCategory()"
        >
          <svg-icon icon-class="add" />
          <span>新增</span>
        </span>
        <span
          v-if="functionList.includes('A52006')"
          class="spp-btn"
          @click="delBatch()"
        >
          <svg-icon icon-class="delete" />
          <span>删除</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="分类名称" prop="category_name" />
        <el-table-column label="分类排序" prop="order" />
        <el-table-column label="创建人" prop="create_oper" />
        <el-table-column label="创建时间">
          <template slot-scope="scope">{{
            scope.row.create_time
              ? formatDateTime(scope.row.create_time)
              : "--"
          }}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="155">
          <template slot-scope="scope">
            <el-button
              v-if="functionList.includes('A52005')"
              type="text"
              @click="edit(scope.row)"
            >修改</el-button>
            <el-button
              v-if="functionList.includes('A52006')"
              type="text"
              @click="del(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
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
      <el-scrollbar
        wrap-class="vertical_scrollbar"
        :style="{ height: height + 'px' }"
      >
        <el-form
          v-if="showDialog"
          ref="form"
          :model="form"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item label="分类名称" prop="category_name">
            <el-input v-model="form.category_name" placeholder="请输入分类名称" />
          </el-form-item>
          <el-form-item label="分类顺序" prop="order">
            <el-input
              v-model="form.order"
              type="number"
              min="0"
              placeholder="数字越小越靠前"
            />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn spp-btn-primary" @click="submit">提交</span>
        <span class="spp-btn" @click="reset">重置</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  paginate,
  addCategory,
  editCategory,
  deleteCategory
} from '@/api/scl_news_cate'
import Pagination from '@/components/Pagination'
import { formatDateTime } from '@/utils/index'
import { mapState } from 'vuex'
export default {
  name: 'SchoolAchieveCategory',
  components: { Pagination },
  data() {
    return {
      height: window.innerHeight - 90,
      search: {
        category_name: ''
      },
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      dialogTitle: '',
      form: {
        id: '',
        category_name: '',
        order: ''
      },
      rules: {
        category_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
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
      paginate(this.search, this.page, this.page_size).then((response) => {
        this.data = response.data.list
        this.total = response.data.totalRow
      })
    },
    addCategory() {
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
      this.dialogTitle = '新增新闻分类'
    },
    edit(data) {
      this.form = {
        id: data.id,
        category_name: data.category_name,
        order: data.order
      }
      this.showDialog = true
      this.dialogTitle = '修改新闻分类'
    },
    del(id) {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteCategory(id).then((response) => {
            this.getData()
          })
        })
        .catch(() => {})
    },
    delBatch() {
      let str = ''
      this.$refs.table.store.states.selection.forEach((item) => {
        str += item.id + ','
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
            deleteCategory(str).then((response) => {
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
        this.$refs.form.validate((valid) => {
          if (valid) {
            addCategory(this.form).then((response) => {
              this.showDialog = false
              this.getData()
            })
          }
        })
      } else {
        // 修改
        this.$refs.form.validate(valid => {
          if (valid) {
            editCategory(this.form).then(response => {
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
        patrol_name: '',
        patrol_rate: '',
        has_nfc: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.page-container {
  .draw_dialog {
    .step_border,
    .step_border_no_att {
      background: #f0f5fa;
    }
  }
}
</style>
<style lang="scss">
.patrol_draw_dialog {
  .el-range-editor--medium .el-range-separator {
    line-height: 24px;
  }
}
</style>
