<template>
  <section class="app-container">
    <section class="filter-container common-filter">
      <div class="filter-left">
        <div class="filter-item">
          <label class="label">接口名称：</label>
          <el-input v-model="InterfaceObj.pmsn_name" placeholder="请输入" />
        </div>
        <div class="filter-item">
          <label class="label">接口路由：</label>
          <el-input v-model="InterfaceObj.action_key" placeholder="请输入" />
        </div>
        <div class="filter-item">
          <label class="label">状态：</label>
          <el-select v-model="InterfaceObj.status_flag" clearable placeholder="请选择">
            <el-option label="正常" value="1" />
            <el-option label="废弃" value="0" />
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
    <div class="interface-container">
      <div class="main-header">
        <div class="left">
          <span
            v-if="functionList.includes('A03001')"
            class="spp-btn spp-btn-primary"
            @click="tidyInterface()"
          >
            <svg-icon icon-class="synchro" />
            <span>同步</span>
          </span>
          <span v-if="functionList.includes('A03002')" class="spp-btn" @click="batchDelete">
            <svg-icon icon-class="delete" />
            <span>删除</span>
          </span>
        </div>
      </div>
      <div class="main-body">
        <el-table ref="multipleTable" :data="interfaceData">
          <el-table-column type="selection" width="55" />>
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="接口名称" prop="pmsn_name" />
          <el-table-column label="接口描述" prop="pmsn_desc" />
          <el-table-column label="接口路由" prop="action_key" />
          <el-table-column label="所属控制器" prop="controller" />
          <el-table-column label="创建时间" prop="create_time" sortable>
            <template slot-scope="scope">{{ scope.row.create_time | fgTime }}</template>
          </el-table-column>
          <el-table-column label="状态" prop="status_flag">
            <template slot-scope="scope">{{ scope.row.status_flag == '1'?'正常':'废弃' }}</template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="130">
            <template slot-scope="scope">
              <span
                v-if="functionList.includes('A03003')"
                class="edit common_text"
                @click="editItem(scope.row)"
              >编辑</span>
              <span
                v-if="functionList.includes('A03002')"
                class="delete common_text"
                @click="deleteItem(scope.row.pmsn_id)"
              >删除</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="InterfaceObj.page_num"
          :limit.sync="InterfaceObj.page_size"
          @pagination="getData"
        />
      </div>
    </div>
    <el-dialog title="修改接口" :visible.sync="showDialog" :close-on-click-modal="false" width="650px">
      <div class="interface-dialog">
        <div class="dialog-item">
          <span class="text">接口名称</span>
          <el-input v-model="editDialog.pmsn_name" placeholder="请输入" />
        </div>
        <div class="dialog-item second-dialog">
          <span class="text">接口描述</span>
          <el-input v-model="editDialog.pmsn_desc" type="textarea" :rows="4" placeholder="请输入" />
        </div>
      </div>
      <div class="dialog-btn">
        <span class="spp-btn spp-btn-primary" @click="editSubmit">提交</span>
        <span class="spp-btn" @click="resetEditData">重置</span>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  paginate,
  updateSys,
  deleteSys,
  tidySys
} from '@/api/interface_manage'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
export default {
  name: 'Interface',
  components: { Pagination },
  data() {
    return {
      InterfaceObj: {
        pmsn_name: '',
        action_key: '',
        status_flag: '',
        page_num: 1,
        page_size: 10
      },
      interfaceData: [], // 列表数据List
      total: 0,
      showDialog: false, // 修改数据模态框标识
      editDialog: {
        pmsn_name: '',
        pmsn_desc: ''
      },
      temporaryEdit: {} // 暂存编辑数据
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
      Object.assign(this.$data.InterfaceObj, this.$options.data().InterfaceObj)
    },
    searchData() {
      this.InterfaceObj.page_num = 1
      this.getData()
    },
    // 获取列表数据
    getData() {
      paginate(this.InterfaceObj).then(res => {
        this.interfaceData = res.data.list
        this.total = res.data.totalRow
      })
    },
    // 删除数据
    deleteItem(pmsn_id) {
      this.$confirm('您确定要删除该接口吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSys(pmsn_id).then(res => {
            this.$message({
              message: '操作成功',
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
        str += item.pmsn_id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      str
        ? this.deleteItem(str)
        : this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
    },
    // 同步数据
    tidyInterface() {
      tidySys().then(res => {
        this.$message({
          message: '同步成功',
          type: 'success',
          duration: 3000
        })
        this.getData()
      })
    },
    // 编辑数据
    editItem(obj) {
      this.editDialog = { ...obj }
      this.temporaryEdit = { ...obj }
      this.showDialog = true
    },
    // 重置编辑数据
    resetEditData() {
      this.editDialog = { ...this.temporaryEdit }
    },
    // 提交编辑数据
    editSubmit() {
      const {
        pmsn_id,
        controller_name,
        pmsn_name,
        pmsn_desc
      } = this.editDialog
      updateSys(pmsn_id, controller_name, pmsn_name, pmsn_desc).then(res => {
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
}
</script>
<style lang="scss" scoped>
.interface-container {
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
.interface-dialog {
  padding: 0 116px;
  .dialog-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .text {
      width: 80px;
    }
  }
  .second-dialog {
    align-items: stretch;
    .text {
      padding-top: 5px;
    }
  }
}
.dialog-btn {
  padding: 0 180px;
  margin-bottom: 30px;
}
</style>
