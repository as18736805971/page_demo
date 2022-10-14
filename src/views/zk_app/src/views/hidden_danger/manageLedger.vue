<template>
  <section class="app-container right-side-dialog">
    <section class="filter-container common-filter">
      <div class="filter-left">
        <div v-if="user_type==='1'" class="filter-item">
          <label class="label">学校：</label>
          <el-input
            v-model="ledgerObj.data.scl_name"
            placeholder="请选择"
            @focus="choiceSchool"
          />
        </div>
        <div class="filter-item">
          <label class="label">开始时间：</label>
          <el-date-picker
            v-model="ledgerObj.create_time_start"
            type="datetime"
            value-format="yyyyMMddHHmmss"
            placeholder="开始时间"
          />
        </div>
        <div class="filter-item">
          <label class="label">结束时间：</label>
          <el-date-picker
            v-model="ledgerObj.create_time_end"
            type="datetime"
            value-format="yyyyMMddHHmmss"
            placeholder="结束时间"
          />
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
          <span class="spp-btn" @click="exportAll">
            <svg-icon v-if="functionList.includes('A29002')" icon-class="exportAll" />
            <span>导出全部</span>
          </span>
        </div>
      </div>
      <div class="main-body">
        <el-table ref="multipleTable" :data="ledgerData">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="隐患地点" prop="hd_position" />
          <el-table-column label="事故隐患内容" prop="hd_desc" />
          <el-table-column label="措施建议" prop="hd_handle_tips" />
          <el-table-column label="上报人" prop="create_user_name" />
          <el-table-column label="接收人" prop="hd_response_man_name" />
          <el-table-column label="报告时间" prop="create_time" sortable>
            <template slot-scope="scope">{{ scope.row.create_time | fgTime }}</template>
          </el-table-column>
          <el-table-column label="整改情况" prop="hd_treat_result" />
          <el-table-column prop="address" label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <span
                v-if="functionList.includes('A29001')"
                style="color: #3399ff;cursor: pointer"
                @click="viewDetail(scope.row.id)"
              >详情</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="ledgerObj.page_num"
          :limit.sync="ledgerObj.page_size"
          @pagination="getData"
        />
      </div>
    </div>
    <el-dialog
      v-if="detailDialog"
      title="隐患详情"
      :visible.sync="detailDialog"
      :close-on-click-modal="false"
      width="720px"
      class="government-detail"
    >
      <div>
        <div class="common-item">
          <span class="title">上报人:</span>
          <span class="content">{{ governmentDetailObj.user_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">上报时间:</span>
          <span class="content">{{ governmentDetailObj.create_time | fgTime }}</span>
        </div>
        <div class="common-item">
          <span class="title">隐患点位置:</span>
          <span class="content">{{ governmentDetailObj.hd_position }}</span>
        </div>
        <div class="common-item">
          <span class="title">隐患描述:</span>
          <span class="content">{{ governmentDetailObj.hd_desc }}</span>
        </div>
        <div class="common-item">
          <span class="title">隐患类型:</span>
          <span class="content">{{ categoryObj[governmentDetailObj.hd_type] }}</span>
        </div>
        <div class="common-item">
          <span class="title">隐患等级:</span>
          <span class="content">{{ governmentDetailObj.hd_level ==='1' ? '一般隐患' : '重大隐患' }}</span>
        </div>
        <div class="common-item">
          <span class="title">处理状态:</span>
          <span
            class="content"
            style="color: #F76D02"
          >{{ governmentDetailObj.hd_status | dangerStatus }}</span>
        </div>
        <AttachmentList :attachment="governmentDetailObj.fileList" />
      </div>
    </el-dialog>
    <el-dialog
      v-if="schoolDialog"
      title="选择学校"
      :visible.sync="schoolDialog"
      :close-on-click-modal="false"
      width="720px"
      class="government-detail"
    >
      <SelectSchool @selectSchool="selectSchool" />
    </el-dialog>
  </section>
</template>

<script>
import {
  paginate,
  getDangerInfo,
  getdangerType,
  exportDangerExcel
} from '@/api/government'
import { edupaginate } from '@/api/school'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import AttachmentList from '@/components/AttachmentList'
import SelectSchool from '@/components/SelectSchool'
export default {
  name: 'ManageLedger',
  components: { Pagination, AttachmentList, SelectSchool },
  data() {
    return {
      ledgerObj: {
        data: { scl_id: '', scl_name: '' },
        create_time_start: '',
        create_time_end: '',
        page_num: 1,
        page_size: 10
      },
      ledgerData: [], // 列表数据List
      categoryObj: {}, // 隐患类型字典
      schoolDialog: false, // 选择学校模态框
      total: 0,
      detailDialog: false,
      governmentDetailObj: { fileList: [] }, // 隐患详情
      sclList: []
    }
  },
  computed: {
    ...mapGetters(['functionList', 'user_type'])
  },
  async created() {
    if (this.user_type === '1') {
      const { data } = await edupaginate('', 1, 1)
      this.sclList = data.list
      if (data.list.length > 0) {
        this.ledgerObj.data = {
          scl_id: data.list[0].scl_id,
          scl_name: data.list[0].scl_name
        }
      }
    }
    this.getData()
    this.getCategory()
  },
  methods: {
    // 重置搜索选项
    resetData() {
      Object.assign(this.$data.ledgerObj, this.$options.data().ledgerObj)
      if (this.sclList.length > 0) {
        this.ledgerObj.data = {
          scl_id: this.sclList[0].scl_id,
          scl_name: this.sclList[0].scl_name
        }
      }
    },

    // 导出全部
    async exportAll() {
      const { create_time_start, create_time_end } = this.ledgerObj
      const url = await exportDangerExcel(create_time_start, create_time_end)
      window.open(url)
    },

    // 获取隐患类型字典
    getCategory() {
      getdangerType().then((res) => {
        this.categoryObj = res.data
      })
    },

    searchData() {
      this.ledgerObj.page_num = 1
      this.getData()
    },

    // 获取列表数据
    getData() {
      const {
        data,
        create_time_start,
        create_time_end,
        page_num,
        page_size
      } = this.ledgerObj
      paginate(
        '',
        '',
        '',
        create_time_start,
        create_time_end,
        '',
        page_num,
        page_size,
        data.scl_id
      ).then((res) => {
        this.ledgerData = res.data.list
        this.total = res.data.totalRow
      })
    },

    // 查看详情
    viewDetail(id) {
      getDangerInfo(id).then((res) => {
        this.governmentDetailObj = res.data
        this.governmentDetailObj.fileList = []
        if (this.governmentDetailObj.attachment_url) {
          const attachment_url = this.governmentDetailObj.attachment_url.split(
            '|'
          )
          const attachment_name = this.governmentDetailObj.attachment_name.split(
            '|'
          )
          const attachment_ext = this.governmentDetailObj.attachment_ext.split(
            '|'
          )
          attachment_url.forEach((item, index) => {
            this.governmentDetailObj.fileList.push({
              attachment_url: item,
              attachment_name: attachment_name[index],
              attachment_ext: attachment_ext[index]
            })
          })
        }
        this.detailDialog = true
      })
    },

    // 选择学校
    choiceSchool() {
      this.schoolDialog = true
    },

    // 确认选择
    selectSchool(data) {
      this.schoolDialog = false
      this.ledgerObj.data = {
        scl_id: data.scl_id,
        scl_name: data.scl_name
      }
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
    margin-left: 10px;
  }
  .delete {
    color: #f36861;
  }
}
.government-detail {
  .common-item {
    .title {
      width: 90px;
    }
  }
}
</style>
