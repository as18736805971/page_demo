<template>
  <div :class="{'base-table': hasMinHeight}">
    <el-table
        ref="base_table"
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
            v-if="item.show"
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
          <template
              v-else-if="item.prop && item.type === 'switch'"
              v-slot="scope"
          >
            <template v-if="auth.on != -1 && auth.off != -1">
              <el-switch
                  v-model="scope.row[item.prop]"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="item.on"
                  :inactive-value="item.off"
                  :active-text="scope.row[item.prop] === '1' ? item.active_text : item.inactive_text"
                  @change="handleSwitch(scope.row, item, item.prop)"
              />
            </template>
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
import { mapState } from 'vuex'
import { httpRequest, decrypt } from '@/utils/auth'
import { formatDateTime } from '@/utils'

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
    // 单选时第一条默认显示选中样式
    singleChooseStyle: {
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
    },
    // 启用开关按钮  api_on 启用  api_off 禁用
    apiSwitch: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      list: [],
      layout: 'prev, pager, next',
      total: 0,
      auth: {},
      selectRows: [],
      queryForm: {
        page_num: 1,
        page_size: 20
      }
    }
  },
  computed: {
    ...mapState({
      permission: state => state.permission.permission
    })
  },
  created() {
    if (JSON.stringify(this.apiSwitch) !== '{}') {
      this.permissionAuth()
    }
    this.queryData()
  },
  methods: {
    formatDateTime: formatDateTime,
    permissionAuth() {
      this.auth.on = this.permission.indexOf(this.apiSwitch.api_on)
      this.auth.off = this.permission.indexOf(this.apiSwitch.api_off)
    },
    // 多选按钮
    setSelectRows(val) {
      this.selectRows = val
      this.$emit('update:selectRowsData', this.selectRows)
    },
    // 列表单选
    setSingleRow(val) {
      if (this.singleChoose) {
        this.selectRows = [val]
        this.$emit('singleRowsData', this.selectRows)
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
    handleSwitch(val, item, name) {
      let api = ''; const id = item.id
      if (item.on === val[name]) {
        api = this.apiSwitch.api_on
      } else {
        api = this.apiSwitch.api_off
      }
      const data = {
        [id]: val[item.id],
        [name]: val[name]
      }
      httpRequest(api, data
      ).then((res) => {
      }).catch(() => {
        this.fetchData()
      })
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
      // console.log(param, '列表筛选参数')
      httpRequest(this.apiList, param).then((res) => {
        const data = JSON.parse(decrypt(res.data))
        this.list = data.records
        if (this.singleChooseStyle && this.list.length !== 0) {
          this.$refs.base_table.setCurrentRow(this.list[0])
        }
        // console.log(data, '列表数据')
        if (data.current === 1) {
          this.total = data.total
        }
        this.$emit('fetchData', data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.common-list-img {
  height: 40px;
  margin-bottom: -8px;
}
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
::v-deep .el-switch__label.is-active {
  color: #14bc6c;
}
::v-deep .el-switch__label {
  color: #ff4949;
}
</style>
