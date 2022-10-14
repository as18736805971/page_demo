<template>
  <div>
    <el-form ref="planStepForm" :model="planStepForm" :rules="planStepRules" label-width="120px" style="padding-right: 40px;">
      <el-form-item label="步骤编号" prop="step_order">
        <el-input v-model="planStepForm.step_order" type="number" placeholder="请输入步骤编号" />
      </el-form-item>
      <el-form-item label="步骤类型" prop="step_type">
        <el-select v-model="planStepForm.step_type" placeholder="请选择步骤类型">
          <el-option label="广播" value="1" />
          <el-option label="通知" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="planStepForm.step_type == '2'" label="通知内容" prop="step_content">
        <el-input v-model="planStepForm.step_content" type="textarea" :rows="4" placeholder="请输入通知内容" />
      </el-form-item>
      <el-form-item v-if="planStepForm.step_type == '2'" label="通知人员" prop="send_user">
        <SelectUserMuti @changeSelected="getNotifyPeople" />
      </el-form-item>
      <el-form-item v-if="planStepForm.step_type == '1'" label="广播内容" prop="step_broadcast_url">
        <Uploadfile :accept="'.mp3'" :limit="true" :slot-tip="'只能上传mp3文件，且不超过20MB'" :file-list="fileList" @getFileList="getFileList" />
      </el-form-item>
      <el-form-item v-if="planStepForm.step_type == '1'" label="播放类型" prop="broadcast_type">
        <el-select v-model="planStepForm.broadcast_type" placeholder="请选择播放类型">
          <el-option label="循环播放" value="1" />
          <el-option label="单次播放" value="2" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="dialog-btn" style="text-align: right">
      <span class="spp-btn" @click="cancelExeStep">取消</span>
      <span class="spp-btn spp-btn-primary" @click="addExeStep">保存</span>
    </div>
  </div>
</template>
<script>
import SelectUserMuti from '@/components/SelectUserMuti'
import Uploadfile from '@/components/Uploadfile'
export default {
  components: { SelectUserMuti, Uploadfile },
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
      step_type: {
        1: '广播',
        2: '通知'
      },
      broadcast_type: {
        1: '循环播放',
        2: '单次播放'
      },
      planStepForm: {
        step_type: '1',
        step_content: '',
        step_broadcast_url: '',
        broadcast_type: '1',
        step_order: '',
        send_user: []
      },
      planStepRules: {
        step_content: [
          { required: true, message: '请输入通知内容', trigger: 'blur' }
        ],
        step_broadcast_url: [
          { required: true, message: '请上传广播内容', trigger: 'blur' }
        ],
        step_order: [
          { required: true, message: '请输入步骤编号', trigger: 'blur' }
        ],
        send_user: [
          { required: true, message: '请选择通知人员', trigger: 'blur' }
        ]
      },
      fileList: []
    }
  },
  watch: {
    planSteps() {
      this.plan_steps = this.planSteps
    }
  },
  methods: {
    getFileList(files) {
      this.planStepForm.step_broadcast_url = ''
      for (const i in files) {
        this.planStepForm.step_broadcast_url = files[i].attachment_url
      }
    },
    getNotifyPeople(value) {
      const tmp = []
      if (value) {
        value.forEach(item => {
          tmp.push(item[item.length - 1])
        })
        this.planStepForm.send_user = tmp.join(',')
      }
    },
    addExeStep() {
      this.$refs.planStepForm.validate(valid => {
        if (valid) {
          this.$emit('submit', this.planStepForm)
        } else {
          return false
        }
      })
    },
    cancelExeStep() {
      this.$emit('cancel')
    }
  }
}
</script>
