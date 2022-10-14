<template>
  <div class="app-container page-container right-side-dialog">
    <div class="main-body">
      <el-table ref="multipleTable" :data="module_list">
        <el-table-column label="次序" type="index" width="60" />
        <el-table-column label="模块名称" prop="scmo_name" />
        <el-table-column label="是否显示" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status_flag"
              :active-value="'1'"
              :inactive-value="'2'"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="130">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status_flag === '1'"
              type="text"
              :disabled="scope.$index === 0"
              @click="scmo_move('up', scope.$index)"
            >上移</el-button>
            <el-button
              v-if="
                scope.row.status_flag === '1' &&
                  scope.$index + 1 !== module_list.length
              "
              type="text"
              :disabled="module_list[scope.$index + 1].status_flag === '2'"
              @click="scmo_move('down', scope.$index)"
            >下移</el-button>
            <el-button
              v-if="
                scope.row.status_flag === '1' &&
                  scope.$index + 1 === module_list.length
              "
              type="text"
              disabled
              @click="scmo_move('down', scope.$index)"
            >下移</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  scl_module,
  deactivate_scmo,
  enable_scmo,
  move_scmo
} from '@/api/scl_module'
import { mapState } from 'vuex'
export default {
  name: 'SclModule',
  components: {},
  data() {
    return {
      module_list: []
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
    getData() {
      scl_module().then((response) => {
        this.module_list = response.data
        this.module_list.forEach((item) => {
          if (item.scmo_order !== null) {
            item.status_flag = '1'
          } else {
            item.status_flag = '2'
          }
        })
      })
    },
    handleStatusChange(obj) {
      this.module_list = JSON.parse(JSON.stringify(this.module_list))
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (obj.status_flag === '2') {
            deactivate_scmo(obj.smsc_id)
              .then((response) => {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
                this.getData()
              })
              .catch(() => {
                this.getData()
              })
          } else {
            enable_scmo(obj.scmo_id)
              .then((response) => {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
                this.getData()
              })
              .catch(() => {
                this.getData()
              })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          })
          this.getData()
        })
    },
    scmo_move(sign, index) {
      let upper_id = ''
      let lower_id = ''
      if (sign === 'up') {
        upper_id = this.module_list[index - 1].smsc_id
        lower_id = this.module_list[index].smsc_id
      } else {
        upper_id = this.module_list[index].smsc_id
        lower_id = this.module_list[index + 1].smsc_id
      }
      move_scmo(upper_id, lower_id).then((response) => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.getData()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ebf0f5;
  .left {
    word-spacing: -10px;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #3399ff;
  font-size: 14px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.red {
  color: #f2854c;
}
.green {
  color: #4dcd70;
}
.insider_form {
  width: 446px !important;
}
.riskidentify-btn {
  text-align: right;
}
</style>
