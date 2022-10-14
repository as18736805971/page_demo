<template>
  <div>
    <el-scrollbar wrap-class="vertical_scrollbar" :style="{height: height + 'px'}">
      <el-form label-width="80px">
        <el-form-item class="detail-el-form-item" label="预案名称：">{{ detail.plan_name }}</el-form-item>
        <el-form-item class="detail-el-form-item" label="风险类型">{{ riskCategory[detail.risk_category] }}</el-form-item>
        <el-form-item class="detail-el-form-item" label="预案分类：">{{ plan_type[detail.plan_type] }}</el-form-item>
        <el-form-item class="detail-el-form-item" label="预案知识：">{{ detail.plan_knowledge }}</el-form-item>
        <el-form-item class="detail-el-form-item" label="预案内容：">
          <div v-for="(item, k) in detail.plan_content" :key="k">
            {{ k + 1 }}. {{ item.text }}
          </div>
        </el-form-item>
        <el-form-item class="detail-el-form-item" label="应急设备：" />
        <div>
          <el-table class="static_table" :data="detail.equipment_info" border style="margin:7px 0">
            <el-table-column prop="equipment_name" label="名称" />
            <el-table-column prop="euqipment_count" label="数量" />
            <el-table-column prop="equipment_location" label="位置" />
            <el-table-column prop="equipment_status" label="状态">
              <template slot-scope="scope">{{ scope.row.equipment_status == 1 ? '完好' : '损坏' }}</template>
            </el-table-column>
            <el-table-column prop="response_man" label="负责人" />
            <el-table-column prop="response_man_phone" label="电话" />
          </el-table>
        </div>
        <el-form-item class="detail-el-form-item" label="救援队伍：" />
        <div>
          <el-table class="static_table" :data="detail.emergency_group_detail" border style="margin:7px 0">
            <el-table-column prop="group_name" label="救援队伍名称" />
            <el-table-column prop="group_phone" label="联系电话" />
          </el-table>
        </div>
        <el-form-item v-if="detail.plan_steps.length > 0" class="detail-el-form-item" label="执行步骤：" />
        <div v-for="(item, k) in detail.plan_steps" :key="k">
          <div v-if="item.step_type == '2'" class="plan_step">
            <div class="header">
              <b>步骤{{ item.step_order }}</b>
              <span>通知</span>
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
              <b>步骤{{ item.step_order }}</b>
              <span>广播</span>
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
    </el-scrollbar>
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
import { gainPlanInfo } from '@/api/plan'
import AudioPlayer from '@/components/AudioPlayer'
import { getPushPeople } from '@/api/plan'
import PushUser from '@/views/plan/components/push_user'
export default {
  components: { AudioPlayer, PushUser },
  props: {
    id: {
      required: true,
      type: String
    },
    riskCategory: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      plan_type: {
        1: '应急行动指南',
        2: '应急响应预案',
        3: '互助应急预案',
        4: '应急管理预案'
      },
      step_type: {
        1: '广播',
        2: '通知'
      },
      broadcast_type: {
        1: '循环播放',
        2: '单次播放'
      },
      detail: {
        plan_steps: []
      },
      VUE_APP_BASE_API: process.env.VUE_APP_BASE_API,
      height: window.innerHeight - 90,
      showPushDialog: false,
      user_list: []
    }
  },
  watch: {
    id() {
      this.getDetail()
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      gainPlanInfo(this.id).then(res => {
        const detail = res.data
        const plan_content = detail.plan_content
        detail.plan_content = JSON.parse(plan_content)
        const emergency_group = detail.emergency_group
        const emergency_group_member = []
        emergency_group.forEach(item => {
          const tmp = {
            id: item['id'],
            group_name: item['group_name'],
            group_phone: item['group_phone']
          }
          emergency_group_member.push(tmp)
        })
        detail.emergency_group_detail = emergency_group_member
        this.detail = detail
      })
    },
    seePeople(id) {
      this.showPushDialog = true
      this.user_list = []
      getPushPeople(id).then(res => {
        this.user_list = res.data
      })
      this.$emit('people', id)
    }
  }
}
</script>
