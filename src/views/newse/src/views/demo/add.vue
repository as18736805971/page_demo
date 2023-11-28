<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="110px">
    <el-form-item label="设备名称：" prop="equ_name">
      <el-input v-model="form.equ_name" placeholder="请输入设备名称" />
    </el-form-item>
    <el-form-item label="设备位置：">
      <el-input v-model="form.equ_position" placeholder="请输入设备位置" />
    </el-form-item>
    <el-form-item label="设备描述：">
      <el-input v-model="form.equ_desc" placeholder="请输入设备描述" />
    </el-form-item>
    <el-form-item label="设备IMSI号：">
      <el-input v-model="form.imsi_no" placeholder="请输入设备IMSI号" />
    </el-form-item>
    <el-form-item label="设备SIM卡号：">
      <el-input v-model="form.sim_no" placeholder="请输入设备SIM卡号" />
    </el-form-item>
    <el-form-item label="设备IMEI号：" prop="imei_no">
      <el-input v-model="form.imei_no" placeholder="请输入设备IMEI号" />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Add',
  data() {
    return {
      id: '',
      form: {
        equ_name: '',
        imei_no: '',
        equ_position: '',
        equ_desc: '',
        imsi_no: '',
        sim_no: ''
      },
      rules: {
        equ_name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        imei_no: [
          { required: true, message: '请输入设备IMEI号', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    console.log(this.id, '编辑')
  }
}
</script>
