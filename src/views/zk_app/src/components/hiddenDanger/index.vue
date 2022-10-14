<template>
  <div class="danger-container spp-hidden-danger-progress">
    <el-timeline-item
      v-for="(item, index) in handleLog"
      :key="index"
      :hide-timestamp="true"
      placement="top"
    >
      <div v-if="item.hd_status === '0'" slot="dot" class="slot-item">
        <div class="icon-wrapper">
          <img src="../../assets/images/confirmed.png" alt class="icon-img">
        </div>
        <span class="status">已取消</span>
        <span class="time">确认时间：{{ item.create_time | fgTime }}</span>
      </div>
      <div v-if="item.hd_status === '1'" slot="dot" class="slot-item">
        <div class="icon-wrapper">
          <img
            src="../../assets/images/report_success.png"
            alt
            class="icon-img"
          >
        </div>
        <span class="status">上报成功</span>
        <span class="time">上报时间：{{ item.create_time | fgTime }}</span>
      </div>
      <div v-if="item.hd_status === '2'" slot="dot" class="slot-item">
        <div class="icon-wrapper">
          <img src="../../assets/images/confirmed.png" alt class="icon-img">
        </div>
        <span class="status">已确认</span>
        <span class="time">确认时间：{{ item.create_time | fgTime }}</span>
      </div>
      <div v-if="item.hd_status === '3'" slot="dot" class="slot-item">
        <div class="icon-wrapper">
          <img src="../../assets/images/have_assign.png" alt class="icon-img">
        </div>
        <span class="status">已指派</span>
        <span class="time">指派时间：{{ item.create_time | fgTime }}</span>
      </div>
      <div v-if="item.hd_status === '4'" slot="dot" class="slot-item">
        <div class="icon-wrapper">
          <img src="../../assets/images/have_manage.png" alt class="icon-img">
        </div>
        <span class="status">已治理</span>
        <span class="time">治理时间：{{ item.create_time | fgTime }}</span>
      </div>
      <div v-if="item.hd_status === '5'" slot="dot" class="slot-item">
        <div class="icon-wrapper" style="background: #f75a53">
          <img src="../../assets/images/failed.png" alt class="icon-img">
        </div>
        <span class="status">验收不通过</span>
        <span class="time">验收时间：{{ item.create_time | fgTime }}</span>
      </div>
      <div v-if="item.hd_status === '6'" slot="dot" class="slot-item">
        <div class="icon-wrapper">
          <img src="../../assets/images/filed.png" alt class="icon-img">
        </div>
        <span class="status">已归档</span>
        <span class="time">验收时间：{{ item.create_time | fgTime }}</span>
      </div>
      <el-card v-if="item.hd_status === '0'" class="steps-content">
        <div class="portrait-title">
          <img src="../../assets/images/avatardefault.png" alt class="image">
          <span class="name">{{ item.user_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">确认结果:</span>
          <span class="content">{{ item.log_info.hd_remark }}</span>
        </div>
      </el-card>
      <el-card v-if="item.hd_status === '1'" class="steps-content">
        <div class="portrait-title">
          <img src="../../assets/images/avatardefault.png" alt class="image">
          <span class="name">{{ item.user_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">隐患位置:</span>
          <span class="content">{{ item.log_info.position }}</span>
        </div>
        <div class="common-item">
          <span class="title">隐患描述:</span>
          <span class="content">{{ item.log_info.hd_desc }}</span>
        </div>
        <div class="common-item">
          <span class="title">隐患类型:</span>
          <span class="content">{{ categoryObj[item.log_info.hd_type] }}</span>
        </div>
        <AttachmentList
          v-if="item.fileList && item.fileList.length > 0"
          :attachment="item.fileList"
          style="margin-top: 10px"
        />
      </el-card>
      <el-card v-if="item.hd_status === '2'" class="steps-content">
        <div class="portrait-title">
          <img src="../../assets/images/avatardefault.png" alt class="image">
          <span class="name">{{ item.user_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">隐患等级:</span>
          <span
            v-show="item.log_info.hd_level === '1'"
            class="content"
          >一般隐患</span>
          <span
            v-show="item.log_info.hd_level === '2'"
            class="content"
          >重大隐患</span>
        </div>
        <div class="common-item">
          <span class="title">隐患后果:</span>
          <span class="content">{{ item.log_info.hd_result }}</span>
        </div>
        <div class="common-item">
          <span class="title">处理意见:</span>
          <span class="content">{{ item.log_info.hd_handle_tips }}</span>
        </div>
        <div v-if="item.hd_except_time" class="common-item">
          <span class="title" style="width: 90px">治理截止时间:</span>
          <span class="content" style="calc(100% - 90px)">
            <span>{{ item.hd_except_time | fgTime }}</span>
            <span
              v-if="compareDate(item.hd_except_time)"
              style="margin-left: 5px"
            >
              <img
                src="../../assets/images/overdue.png"
                alt=""
                style="position: relative; top: 1px"
              >
              <span style="color:#FF7646">已逾期</span>
            </span>
          </span>
        </div>
      </el-card>
      <el-card v-if="item.hd_status === '3'" class="steps-content">
        <div class="portrait-title">
          <img src="../../assets/images/avatardefault.png" alt class="image">
          <span class="name">{{ item.user_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">指派处理人:</span>
          <span class="content">{{ item.log_info.hd_response_man_name }}</span>
        </div>
      </el-card>
      <el-card v-if="item.hd_status === '4'" class="steps-content">
        <div class="portrait-title">
          <img src="../../assets/images/avatardefault.png" alt class="image">
          <span class="name">{{ item.user_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">治理结果:</span>
          <span class="content">{{ item.log_info.hd_treat_result }}</span>
        </div>
        <AttachmentList
          v-if="item.fileList && item.fileList.length > 0"
          :attachment="item.fileList"
          style="margin-top: 10px"
        />
      </el-card>
      <el-card v-if="item.hd_status === '5'" class="steps-content">
        <div class="portrait-title">
          <img src="../../assets/images/avatardefault.png" alt class="image">
          <span class="name">{{ item.user_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">验收结果:</span>
          <span class="content" style="color: #f75a53">验收不合格</span>
        </div>
        <div class="common-item">
          <span class="title">验收意见:</span>
          <span class="content">{{ item.log_info.hd_reject_reason }}</span>
        </div>
      </el-card>
      <el-card v-if="item.hd_status === '6'" class="steps-content">
        <div class="portrait-title">
          <img src="../../assets/images/avatardefault.png" alt class="image">
          <span class="name">{{ item.user_name }}</span>
        </div>
        <div class="common-item">
          <span class="title">验收结果:</span>
          <span class="content" style="color: #4dcd70">通过</span>
        </div>
        <div class="common-item">
          <span class="title">验收意见:</span>
          <span class="content">{{ item.log_info.hd_remark }}</span>
        </div>
      </el-card>
    </el-timeline-item>
  </div>
</template>

<script>
import AttachmentList from '@/components/AttachmentList'
import { formatDateTime } from '@/utils'
export default {
  name: 'Danger',
  components: { AttachmentList },
  props: {
    handleLog: {
      required: true,
      type: Array
    },
    categoryObj: {
      required: true,
      type: Object
    }
  },
  mounted() {},
  methods: {
    // 比较时间大小
    compareDate(date1, date2) {
      var oDate1 = new Date(formatDateTime(date1))
      var oDate2 = new Date()
      if (oDate1.getTime() > oDate2.getTime()) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang='scss'>
.danger-container {
  .el-card.is-always-shadow {
    box-shadow: none;
  }
  .el-card {
    border: none;
  }
}
</style>
