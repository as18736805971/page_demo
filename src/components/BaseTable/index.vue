<template>
  <div :class="{'base-table': hasMinHeight}">
    <el-table
        row-key="id"
        :data="list"
        :height="showPage && list.length !== 0 ? height : height - 56"
        :default-expand-all="defaultExpandAll"
        :highlight-current-row="singleChoose"
        size="mini"
        strip
        @selection-change="setSelectRows"
        @current-change="setSingleRow"
    >
      <el-table-column
          v-if="showChoose"
          width="55"
          type="selection"
      />
      <template v-for="(item, index) in theHeader">
        <el-table-column
            v-if="item.show && item.permission !== false"
            :key="index"
            show-overflow-tooltip
            :prop="item.prop"
            :label="item.label"
            :width="item.width || 'auto'"
            :align="item.align || 'left'"
            :formatter="item.formatter"
            :fixed="list.length?(item.label === '操作' ? 'right' : false):false"
        >
          <template v-if="!item.prop" v-slot="scope">
            <slot
                :name="item.label"
                :data="{
                ...scope.row,
                $index: scope.$index,
                $first: scope.$index === 0,
                $last: scope.$index === list.length - 1
              }"
            />
            <template v-if="item.type === 'index'">
              {{
                scope.$index + 1 + (queryForm.page_num - 1) * queryForm.page_size
              }}
            </template>
          </template>
          <template
              v-else-if="item.prop && item.type === 'time'"
              v-slot="scope"
          >
            {{ formatDateTime(scope.row[item.prop]) }}
          </template>
          <template
              v-else-if="item.prop && item.type === 'image'"
              v-slot="scope"
          >
            <el-image
                class="common-list-img"
                :preview-src-list="[scope.row[item.prop]]"
                :src="scope.row[item.prop]"
            />
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div v-if="showPage && list.length !== 0" class="pagination-container">
      <el-pagination
          background
          :current-page="queryForm.page_num"
          :page-size="queryForm.page_size"
          :layout="layout"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { httpRequest, decrypt } from '@/utils/auth'
import { formatDateTime } from '@/utils/index'

export default {
  props: {
    hasMinHeight: {
      type: Boolean,
      default: true
    },
    // 表格高度
    height: {
      type: [String, Number],
      default: window.innerHeight - 188
    },
    // 列表是否折叠,默认不折叠
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    // 显示选择框
    showChoose: {
      type: Boolean,
      default: false
    },
    // 允许单选
    singleChoose: {
      type: Boolean,
      default: false
    },
    // 显示分页
    showPage: {
      type: Boolean,
      default: true
    },
    // 获取列表时, 传递的参数
    querys: {
      type: Object,
      default: function() {
        return {}
      }
    },
    // 表头数据
    theHeader: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 已选数据
    selectRowsData: {
      type: Array,
      default: function() {
        return []
      }
    },
    // 获取数据接口
    apiList: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      layout: 'prev, pager, next',
      total: 0,
      selectRows: [],
      queryForm: {
        page_num: 1,
        page_size: 20
      }
    }
  },
  created() {
    this.queryData()
  },
  methods: {
    formatDateTime: formatDateTime,
    setSelectRows(val) {
      this.selectRows = val
      this.$emit('update:selectRowsData', this.selectRows)
    },
    setSingleRow(val) {
      if (this.singleChoose) {
        this.selectRows = [val]
        this.$emit('update:selectRowsData', this.selectRows)
      }
    },
    handleSizeChange(val) {
      this.queryForm.page_size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.page_num = val
      this.fetchData()
    },
    queryData() {
      this.queryForm.page_num = 1
      this.fetchData()
    },
    fetchData() {
      let param = {}
      for (const k in this.querys) {
        this.$set(this.queryForm, k, this.querys[k])
      }
      param = Object.assign({}, this.queryForm)
      httpRequest(this.apiList, param).then((res) => {
        const data = JSON.parse(decrypt(res.data))
        this.list = data.records
        this.total = data.total
        // console.log(this.list, '列表')
        this.$emit('fetchData', data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 56px;
  background: #ffffff;
  padding: 0;
  margin-top: 0 !important;

  ::v-deep .el-pagination {
    margin-top: 0 !important;
  }
}
</style>
