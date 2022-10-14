<template>
  <section class="app-container right-side-dialog">
    <section class="filter-container common-filter">
      <div class="filter-left">
        <div v-if="user_type==='1'" class="filter-item">
          <label class="label">学校：</label>
          <el-input v-model="ledgerObj.data.scl_name" placeholder="请选择" @focus="choiceSchool" />
        </div>
        <div class="filter-item">
          <label class="label">开始时间：</label>
          <el-date-picker
            v-model="ledgerObj.create_time_start"
            value-format="yyyyMMddHHmmss"
            type="datetime"
            placeholder="任务创建开始时间"
          />
        </div>
        <div class="filter-item">
          <label class="label">结束时间：</label>
          <el-date-picker
            v-model="ledgerObj.create_time_end"
            value-format="yyyyMMddHHmmss"
            type="datetime"
            placeholder="任务创建结束时间"
          />
        </div>
        <div class="filter-item">
          <label class="label">巡查结果：</label>
          <el-select v-model="ledgerObj.patrol_status" clearable placeholder="请选择巡查结果">
            <el-option label="正常" value="1" />
            <el-option label="异常" value="0" />
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
          <span v-if="functionList.includes('A30002')" class="spp-btn" @click="exportAll">
            <svg-icon icon-class="exportAll" />
            <span>导出全部</span>
          </span>
        </div>
      </div>
      <div class="main-body">
        <el-table ref="multipleTable" :data="ledgerData">
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="排查名称" prop="patrol_name" />
          <el-table-column label="排查内容" prop="patrol_content" />
          <el-table-column label="排查频率" prop="patrol_rate">
            <template slot-scope="scope">{{ patrol_rate[scope.row.patrol_rate] }}</template>
          </el-table-column>
          <el-table-column label="负责人" prop="user_name" />
          <el-table-column label="排查结果" prop="patrol_status">
            <template slot-scope="scope">{{ scope.row.patrol_status === '1' ? '正常' : '异常' }}</template>
          </el-table-column>
          <el-table-column label="排查日期" prop="create_time" sortable>
            <template slot-scope="scope">{{ scope.row.create_time | fgTime }}</template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="80" fixed="right">
            <template slot-scope="scope">
              <span
                v-if="functionList.includes('A30001')"
                style="color: #3399ff;cursor: pointer"
                @click="viewDetail(scope.row)"
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
    <!-- 正常详情 -->
    <el-dialog
      v-if="normalDialog"
      title="隐患详情"
      :visible.sync="normalDialog"
      :close-on-click-modal="false"
      width="720px"
      class="patrolLedger-detail"
    >
      <div>
        <div class="common-item">
          <span class="title">排查名称:</span>
          <span class="content">{{ ledgerDetailObj.patrol_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">排查内容:</span>
          <span class="content">{{ ledgerDetailObj.patrol_content }}</span>
        </div>
        <div class="common-item">
          <span class="title">排查频率:</span>
          <span class="content">{{ patrol_rate[ledgerDetailObj.patrol_rate] }}</span>
        </div>
        <div class="common-item">
          <span class="title">负责人:</span>
          <span class="content">{{ ledgerDetailObj.user_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">排查结果:</span>
          <span class="content" style="color: #4DCD70">正常</span>
        </div>
        <div class="common-item">
          <span class="title">排查日期:</span>
          <span class="content">{{ ledgerDetailObj.create_time | fgTime }}</span>
        </div>
      </div>
    </el-dialog>
    <!-- 异常详情 -->
    <el-dialog
      v-if="abnormalDialog"
      :visible.sync="abnormalDialog"
      :close-on-click-modal="false"
      width="720px"
      class="government-detail patrolledger-detail"
    >
      <div slot="title" class="header-title">
        <el-radio-group v-model="tabDetail">
          <el-radio-button label="1">隐患详情</el-radio-button>
          <el-radio-button label="2">处理进度</el-radio-button>
        </el-radio-group>
      </div>
      <div v-show="tabDetail === '1'" class="left-content">
        <el-collapse v-model="activeName">
          <el-collapse-item title="排查详情" name="first">
            <div class="common-item">
              <span class="title">排查名称:</span>
              <span class="content">{{ ledgerDetailObj.patrol_name }}</span>
            </div>
            <div class="common-item">
              <span class="title">排查内容:</span>
              <span class="content">{{ ledgerDetailObj.patrol_content }}</span>
            </div>
            <div class="common-item">
              <span class="title">排查频率:</span>
              <span class="content">{{ patrol_rate[ledgerDetailObj.patrol_rate] }}</span>
            </div>
            <div class="common-item">
              <span class="title">负责人:</span>
              <span class="content">{{ ledgerDetailObj.user_name }}</span>
            </div>
            <div class="common-item">
              <span class="title">排查结果:</span>
              <span class="content" style="color: #F75A53">异常</span>
            </div>
            <div class="common-item">
              <span class="title">排查日期:</span>
              <span class="content">{{ ledgerDetailObj.create_time | fgTime }}</span>
            </div>
          </el-collapse-item>
          <el-collapse-item title="隐患详情" name="second">
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
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-show="tabDetail === '2'" class="right-content spp-hidden-danger-progress">
        <el-timeline>
          <hiddenDanger :handle-log="handleLog" :category-obj="categoryObj" />
        </el-timeline>
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
import { paginateReport, getPatrolReportDetail } from '@/api/patrol'
import {
  getdangerType,
  getDangerInfo,
  getDangerProgress,
  exportPatrolExcel
} from '@/api/government'
import { edupaginate } from '@/api/school'
import { getPatrolRrate } from '@/api/dic'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'
import AttachmentList from '@/components/AttachmentList'
import hiddenDanger from '@/components/hiddenDanger'
import SelectSchool from '@/components/SelectSchool'
export default {
  name: 'PatrolLedger',
  components: { Pagination, AttachmentList, hiddenDanger, SelectSchool },
  data() {
    return {
      ledgerObj: {
        data: { scl_id: '', scl_name: '' },
        create_time_start: '',
        create_time_end: '',
        patrol_status: '',
        page_num: 1,
        page_size: 10
      },
      ledgerData: [], // 列表数据List
      patrol_rate: {}, // 隐患类型字典
      categoryObj: {}, // 隐患类型字典
      total: 0,
      normalDialog: false,
      abnormalDialog: false,
      tabDetail: '1',
      ledgerDetailObj: {}, // 排查详情
      activeName: ['first', 'second'],
      governmentDetailObj: { fileList: [] }, // 隐患详情
      handleLog: [], // 处理进度
      schoolDialog: false, // 选择学校模态框
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
    this.getPatrolRate()
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
      const {
        create_time_start,
        create_time_end,
        patrol_status
      } = this.ledgerObj
      const url = await exportPatrolExcel(
        create_time_start,
        create_time_end,
        patrol_status
      )
      window.open(url)
    },

    // 获取排查频率字典
    getPatrolRate() {
      getPatrolRrate().then((response) => {
        this.patrol_rate = response.data
      })
    },

    // 获取隐患类型
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
        page_size,
        patrol_status
      } = this.ledgerObj
      paginateReport(
        data.scl_id,
        create_time_start,
        create_time_end,
        patrol_status,
        page_num,
        page_size
      ).then((res) => {
        this.ledgerData = res.data.list
        this.total = res.data.totalRow
      })
    },

    // 查看详情
    viewDetail(opt) {
      getPatrolReportDetail(opt.id).then((res) => {
        this.ledgerDetailObj = res.data
        if (this.ledgerDetailObj.patrol_status === '1') {
          this.normalDialog = true
        } else {
          this.tabDetail = '1'
          getDangerInfo(opt.hd_id).then((res) => {
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
          getDangerProgress(opt.hd_id).then((res) => {
            this.handleLog = res.data.handle_log
            this.handleLog.forEach((opt) => {
              opt.log_info = JSON.parse(opt.log_info)
              if (opt.hd_status === '1' || opt.hd_status === '4') {
                if (opt.attachment_url) {
                  opt.fileList = []
                  const attachment_url = opt.attachment_url.split('|')
                  const attachment_name = opt.attachment_name.split('|')
                  const attachment_ext = opt.attachment_ext.split('|')
                  attachment_url.forEach((item, index) => {
                    opt.fileList.push({
                      attachment_url: item,
                      attachment_name: attachment_name[index],
                      attachment_ext: attachment_ext[index]
                    })
                  })
                }
              }
            })
          })
          this.abnormalDialog = true
        }
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
<style lang="scss">
.patrolledger-detail {
  .el-collapse .el-collapse-item__header {
    font-weight: bold;
  }
}
</style>
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
.patrolLedger-detail {
  .common-item {
    .title {
      width: 80px;
    }
  }
}
</style>
