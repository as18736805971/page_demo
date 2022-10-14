<template>
  <div>
    <el-collapse v-model="tabMeasure" accordion @change="switchTabMeasure">
      <el-collapse-item
        v-for="(item, k) in measures_name"
        :key="k"
        :title="item"
        :name="k"
      >
        <div v-if="tabMeasure===k">
          <section class="measure-tab-main">
            <el-form label-width="120px">
              <div v-if="count > 0">
                <div
                  v-for="(item, k) in measuresList"
                  :key="k"
                  class="measures-list"
                  :class="{ haveattach: item.attach_list.length > 0 }"
                >
                  <div class="title">
                    <div class="left">
                      <span class="text">{{ item.measures_title }}</span>
                    </div>
                  </div>
                  <ul class="detail-el-form">
                    <li
                      v-for="(opt, index) in item.measures_content"
                      :key="index"
                      class="detail-el-form-item"
                      v-html="opt.text.replace(/\n/g, '<br>')"
                    />
                  </ul>
                  <AttachmentList
                    v-if="item.attach_list.length > 0"
                    :attachment="item.attach_list"
                  />
                </div>
              </div>
              <div v-else-if="tabMeasure !== '2' && count <= 0">
                <div style="height: 60px; text-align: center; margin-top: 40px">
                  暂无措施
                </div>
              </div>
            </el-form>
          </section>
          <section v-if="tabMeasure === '2'">
            <div v-if="emergency_measure_detail.length > 0">
              <el-table
                class="static_table"
                :data="emergency_measure_detail"
                border
              >
                <el-table-column
                  prop="plan_name"
                  label="应急预案名称"
                  width="300"
                />
                <el-table-column prop="risk_category" label="风险类型">
                  <template slot-scope="scope">
                    <span class="riskcategory">{{
                      riskCategory[scope.row.risk_category]
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="plan_start_type" label="启动类型">
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.plan_start_type === '1'"
                      class="plan_start_type_first plan_start_type"
                    >自启动</span>
                    <span
                      v-if="scope.row.plan_start_type === '0'"
                      class="plan_start_type_second plan_start_type"
                    >非自启动</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="response_man_phone"
                  label="内容"
                  width="100"
                >
                  <template slot-scope="scope">
                    <span
                      style="color: #3399ff; cursor: pointer"
                      @click="viewEmergencyDetail(scope.row.emer_id)"
                    >详情</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else-if="count <= 0 && emergency_measure_detail.length <= 0">
              <div style="height: 60px; text-align: center; margin-top: 40px">
                暂无措施
              </div>
            </div>
          </section>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import {
  getMeasuresList,
  getMeasuresAttach,
  getEmergencyrelation
} from '@/api/risk_point'
import AttachmentList from '@/components/AttachmentList'
export default {
  components: { AttachmentList },
  props: {
    selectedId: {
      type: String,
      default: () => ''
    },
    riskCategory: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tabMeasure: '1',
      measures_name: {
        1: '管理措施',
        2: '应急措施',
        3: '工程技术措施',
        4: '培训教育措施',
        5: '个人防护措施'
      },
      measuresList: {},
      emergency_measure_detail: [],
      showDetailEmergencyDialog: false,
      emer_selected_id: '',
      count: 0
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.measuresList = {}
      // 获取内容
      getMeasuresList(this.selectedId, this.tabMeasure).then((res) => {
        const data = res.data
        const measure_list = {}
        for (const i in data) {
          data[i]['attach_list'] = []
          data[i].measures_content = JSON.parse(data[i].measures_content)
          measure_list[data[i].measure_id] = data[i]
        }
        // 获取附件
        getMeasuresAttach(this.selectedId, this.tabMeasure).then((res) => {
          const attach_list = res.data
          // 将内容和附件拼起来
          attach_list.forEach((item) => {
            if (measure_list.hasOwnProperty(item.mid)) {
              measure_list[item.mid].attach_list.push(item)
            }
          })
          this.measuresList = measure_list
          this.count = Object.getOwnPropertyNames(measure_list).length - 1
        })
      })
      if (this.tabMeasure === '2') {
        this.emergency_measure_detail = []
        this.getEmergencyrelation()
      }
    },
    switchTabMeasure() {
      if (this.tabMeasure) {
        this.getData()
      }
    },

    // 获取该风险点下的应急措施列表
    getEmergencyrelation() {
      getEmergencyrelation(this.selectedId).then((res) => {
        this.emergency_measure_detail = res.data
      })
    },

    // 查看应急预案详情
    viewEmergencyDetail(id) {
      this.$emit('viewEmergencyDetail', id)
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-wrapper {
  margin-bottom: 30px;
  text-align: center;
}
.riskcategory {
  border: 1px solid #f76d02;
  border-radius: 2px;
  color: #f76d02;
  padding: 2px 4px;
}
.plan_start_type {
  border-radius: 2px;
  padding: 2px 4px;
}
.plan_start_type_first {
  color: #4dcd70;
  border: 1px solid #4dcd70;
}
.plan_start_type_second {
  color: #999999;
  border: 1px solid #999999;
}

.measure-tab-main {
  .measures-list {
    border-bottom: 1px solid rgba(225, 227, 230, 1);
    font-size: 14px;
    color: #313233;
    margin-bottom: 20px;
    .title {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      padding: 0 10px;
      border: 1px solid rgba(225, 227, 230, 1);
      .text {
        font-weight: bold;
      }
    }
    .content {
      padding: 10px;
      min-height: 80px;
      color: #626466;
    }
    .detail-el-form {
      padding-left: 30px;
      border: 1px solid rgba(225, 227, 230, 1);
      border-top: none;
      border-bottom: none;
    }
    .detail-el-form-item {
      padding: 5px 10px 5px 0;
      line-height: 24px;
    }
  }
  .haveattach {
    border-bottom: none;
  }
}
</style>
