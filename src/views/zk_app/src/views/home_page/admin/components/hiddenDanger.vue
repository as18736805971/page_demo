<template>
  <div class="hiddendanger-main">
    <homeHeader title="隐患列表" :type="1" @viewAll="viewAll" />
    <el-table :data="governmentData" style="width: 100%;padding: 0 16px">
      <el-table-column type="index" label="序号" width="60" />>
      <el-table-column prop="hd_desc" label="隐患描述" min-width="200" />
      <el-table-column prop="hd_type" label="隐患类型" min-width="100">
        <template slot-scope="scope">
          <span style="color: #29B6F6;">{{ categoryObj[scope.row.hd_type] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="发现时间" min-width="180">
        <template slot-scope="scope">
          <span style="color: #626466">{{ scope.row.create_time | fgTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hd_status" label="处置情况" min-width="100">
        <template slot-scope="scope">
          <span style="color: #FF8A65">{{ scope.row.hd_status | dangerStatus }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="hiddenDangerObj.page_num"
      :limit.sync="hiddenDangerObj.page_size"
      @pagination="getData"
    />
  </div>
</template>

<script>
import homeHeader from './homeHeader'
import Pagination from '@/components/Pagination'
import { paginate, getdangerType } from '@/api/government'
export default {
  name: 'HiddenDanger',
  components: { homeHeader, Pagination },
  props: {},
  data() {
    return {
      governmentData: [],
      categoryObj: {}, // 隐患类型字典
      hiddenDangerObj: {
        page_num: 1,
        page_size: 6
      },
      total: 0
    }
  },
  mounted() {
    this.getData()
    this.getCategory()
  },
  methods: {
    // 获取列表数据
    getData() {
      const { page_num, page_size } = this.hiddenDangerObj
      paginate('', '', '', '', '', '', page_num, page_size).then(res => {
        this.governmentData = res.data.list
        this.total = res.data.totalRow
      })
    },

    // 获取隐患类型
    getCategory() {
      getdangerType().then(res => {
        this.categoryObj = res.data
      })
    },

    viewAll() {
      this.$router.push({ path: '/hidden_danger' })
    }
  }
}
</script>

<style scoped lang='scss'>
.hiddendanger-main {
  height: 450px;
  background: #ffffff;
  border-radius: 4px;
  .pagination-container {
    padding: 0;
    padding-top: 8px;
  }
  ::-webkit-scrollbar {
    height: 6px;
  }
  ::-webkit-scrollbar-track-piece {
    background: #d3dce6;
  }
  ::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
  }
}
</style>
<style lang="scss">
.hiddendanger-main {
  .el-table tr {
    height: 50px;
  }
  .el-table .cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
