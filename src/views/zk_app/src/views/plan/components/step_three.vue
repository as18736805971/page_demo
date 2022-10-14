<template>
  <div>
    <el-form label-width="120px">
      <div class="spp-add-btn" @click="openAddExeDialog">新增执行步骤</div>
      <div v-for="(item, k) in plan_steps" :key="k">
        <div v-if="item.step_type == '2'" class="plan_step">
          <div class="header">
            <b>步骤{{ k + 1 }}</b>
            <span>通知</span>
            <span class="right_del_icon" @click="delExeStep(item.id)">
              <svg-icon icon-class="delete" />
            </span>
          </div>
          <el-form label-width="80px">
            <el-form-item class="detail-el-form-item" label="通知内容：">{{ item.step_content }}</el-form-item>
            <el-form-item class="detail-el-form-item" label="接收人：">
              <el-button type="text" @click="seePeople(item.id)">查看</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="item.step_type == '1'" class="plan_step">
          <div class="header">
            <b>步骤{{ k + 1 }}</b>
            <span>广播</span>
            <span class="right_del_icon" @click="delExeStep(item.id)">
              <svg-icon icon-class="delete" />
            </span>
          </div>
          <el-form label-width="80px">
            <el-form-item class="detail-el-form-item" label="广播内容：">
              <AudioPlayer :audio-src="item.step_broadcast_url" />
            </el-form-item>
            <el-form-item class="detail-el-form-item" label="播放类型：">{{ broadcast_type[item.broadcast_type] }}</el-form-item>
          </el-form>
        </div>
      </div>
    </el-form>
    <el-dialog
      title="查看接收人"
      :visible.sync="showPushDialog"
      width="480px"
      class="draw_dialog"
      :modal="false"
    >
      <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
        <PushUser :user-list="user_list" />
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
import AudioPlayer from '@/components/AudioPlayer'
import PushUser from './push_user'
import { gainPlanInfo, delteps, getPushPeople } from '@/api/plan'
export default {
  components: { AudioPlayer, PushUser },
  props: {
    planSteps: {
      type: Array,
      default: () => []
    },
    planId: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      plan_steps: this.planSteps,
      VUE_APP_BASE_API: process.env.VUE_APP_BASE_API,
      step_type: {
        1: '广播',
        2: '通知'
      },
      broadcast_type: {
        1: '循环播放',
        2: '单次播放'
      },
      user_list: [],
      height: window.innerHeight - 90,
      showPushDialog: false
    }
  },
  watch: {
    planSteps() {
      this.plan_steps = this.planSteps
    }
  },
  methods: {
    delExeStep: function(id) {
      delteps(id).then(res => {
        gainPlanInfo(this.planId).then(res => {
          this.plan_steps = res.data.plan_steps
        })
      })
    },
    openAddExeDialog: function() {
      this.$emit('open')
    },
    seePeople: function(id) {
      this.showPushDialog = true
      this.user_list = []
      getPushPeople(id).then(res => {
        this.user_list = res.data
      })
    }
  }
}
</script>
