<template>
  <div class="app-container page-container right-side-dialog special-index">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="学校名称：">
            <el-select v-model="search.scl_id" clearable filterable placeholder="请选择">
              <el-option v-for="(item, k) in schoolList" :key="k" :label="item.scl_name" :value="item.scl_id" />
            </el-select>
          </el-form-item>
          <el-form-item label="检查名称：">
            <el-input v-model="search.si_name" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="是否评分：">
            <el-select v-model="search.inspection_status" clearable placeholder="请选择">
              <el-option label="未评分" :value="0" />
              <el-option label="已评分" :value="1" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="resetForm()">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="检查名称" prop="si_name" />
        <el-table-column label="检查方式" prop="inspection_type">
          <template slot-scope="scope">{{ inspection_type[scope.row.inspection_type] }}</template>
        </el-table-column>
        <el-table-column label="学校名称" prop="scl_name" />
        <el-table-column label="得分" prop="si_score" />
        <el-table-column label="评分时间" prop="create_time">
          <template slot-scope="scope">{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A25002')" type="text" @click="score(scope.row.si_id, scope.row.scl_id)">评分</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="page_size" @pagination="getData" />
    </div>
    <el-dialog
      title="专项检查评分"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="720px"
      class="draw_dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <el-form v-if="showDialog" ref="form" label-width="80px">
          <el-form-item label="检查名称：" class="detail-el-form-item">
            {{ detail.si_name }}
          </el-form-item>
          <el-form-item label="检查方式：" class="detail-el-form-item">
            {{ inspection_type[detail.inspection_type] }}
          </el-form-item>
          <el-form-item label="开始时间：" class="detail-el-form-item">
            {{ formatDateTime(detail.start_time) }}
          </el-form-item>
          <el-form-item label="结束时间：" class="detail-el-form-item">
            {{ formatDateTime(detail.end_time) }}
          </el-form-item>
        </el-form>
        <el-divider class="my_divider" content-position="left">检查项目</el-divider>
        <div>
          <div v-for="(item, k) in detail.item_data" :key="k" style="margin-top: 16px; border: 1px solid #E1E3E6; padding: 12px">
            <div class="space_between" style="font-size: 16px; color: #313233; margin-bottom: 16px">
              <b>{{ item.item_title }}</b><span>得分：{{ item.score }}</span>
            </div>
            <el-form label-width="80px" style="margin-bottom: 16px">
              <el-form-item class="detail-el-form-item narrow_item" label="项目内容：">
                {{ item.item_content }}
              </el-form-item>
              <el-form-item class="detail-el-form-item narrow_item" label="项目分值：">
                {{ item.item_score }}分
              </el-form-item>
              <el-form-item class="detail-el-form-item narrow_item" label="评分标准：">
                {{ item.item_score_standrad }}
              </el-form-item>
            </el-form>
            <div v-if="item.report.length > 0">
              <el-tabs style="margin-bottom: 8px" type="card">
                <el-tab-pane v-for="(i, kk) in item.report" :key="kk" :label="'报告' + (kk + 1)">
                  <div :class="i.attachment.length > 0 ? 'step_border' : 'step_border_no_att'" style="padding: 0 16px">
                    <el-form label-width="80px">
                      <el-form-item class="detail-el-form-item" label="报告内容：">
                        {{ i.report_content }}
                      </el-form-item>
                    </el-form>
                  </div>
                  <AttachmentList v-if="i.attachment.length > 0" :attachment="i.attachment" style="padding: 0 16px" />
                </el-tab-pane>
              </el-tabs>
            </div>
            <div>
              <input :ref="'score_' + k" class="spp-input" :value="item.rate" size="mini" type="number" min="0" :max="item.item_score" style="width:100px;" @change="checkNumber(item.item_score, 'score_' + k)">
              <!-- <el-input-number v-model="item.rate" :min="0" :max="1000" size="mini" /> -->
              <span class="spp-btn" @click="scoreSubmit(item.sii_id, 'score_' + k)">评分</span>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn spp-btn-primary" @click="stepFinish">完成</span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { get_edu_scl, inspection_scl_list, get_inspection_detail, inspection_score } from '@/api/special_inspection'
import Pagination from '@/components/Pagination'
import AttachmentList from '@/components/AttachmentList'
import { formatDateTime } from '@/utils/index'
import { mapState } from 'vuex'
export default {
  name: 'SpecialScore',
  components: { Pagination, AttachmentList },
  data() {
    return {
      search: {
        scl_id: '',
        si_name: '',
        has_score: ''
      },
      inspection_type: {
        1: '上级督察',
        2: '学校自查',
        3: '部门联查'
      },
      height: window.innerHeight - 130,
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      showDialog: false,
      detail: {},
      stepList: [],
      schoolList: []
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
    this.height = window.innerHeight - 125
    get_edu_scl().then(response => {
      this.schoolList = response.data
    })
    this.getData()
  },
  methods: {
    formatDateTime: formatDateTime,
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      inspection_scl_list(this.search, this.page, this.page_size).then(response => {
        this.data = response.data.list
        this.total = response.data.totalRow
      })
    },
    score(si_id, scl_id) {
      this.showDialog = true
      get_inspection_detail(si_id, scl_id).then(response => {
        this.detail = response.data
        const item_data = {}
        this.detail.item_list.forEach(item => {
          item['report'] = []
          item['score'] = item['score'] ? item['score'] : 0
          item['rate'] = item['score'] ? item['score'] : 0
          item_data[item.sii_id] = item
        })
        const report = {}
        this.detail.report_list.forEach(item => {
          item['attachment'] = []
          report[item.report_id] = item
        })
        this.detail.report_attachment_list.forEach(item => {
          report[item.sir_id].attachment.push(item)
        })
        for (const i in report) {
          item_data[report[i].sii_id].report.push(report[i])
        }
        this.detail.item_data = item_data
      })
    },
    scoreSubmit(sii_id, ref) {
      const si_id = this.detail.si_id
      const scl_id = this.detail.scl_id
      const score = this.$refs[ref][0].value
      this.detail.item_data[sii_id].rate = score
      const data = {
        si_id: si_id,
        sii_id: sii_id,
        scl_id: scl_id,
        score: score
      }
      inspection_score(data).then(response => {
        this.detail.item_data[sii_id].score = score
        this.$message({
          message: '评分成功',
          type: 'success'
        })
      })
    },
    resetForm() {
      this.search = {
        scl_id: '',
        si_name: '',
        has_score: ''
      }
    },
    stepFinish() {
      this.showDialog = false
      this.getData()
    },
    downAttachment: function(url) {
      window.open(url)
    },
    checkNumber(max, ref) {
      const val = this.$refs[ref][0].value
      if (val > max) {
        this.$refs[ref][0].value = max
      }
      if (val < 0) {
        this.$refs[ref][0].value = 0
      }
    }
  }
}
</script>
