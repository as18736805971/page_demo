<template>
  <div>
    <div class="common-filter">
      <div class="filter-left">
        <div v-if="type === 1" class="filter-item">
          <label class="label">年级/班级：</label>
          <el-cascader
            v-model="attendanceObj.pajx_cls_id"
            :options="gra_list"
            clearable
            :props="{ checkStrictly: true }"
            @change="handleChange"
          />
        </div>
        <div v-if="type === 2" class="filter-item">
          <label class="label">宿舍：</label>
          <el-cascader
            v-model="attendanceObj.pajx_bld_id"
            :options="bld_list"
            clearable
            :props="{ checkStrictly: true }"
            @change="handleBldChange"
          />
        </div>
        <div class="filter-item">
          <label class="label">学生名称：</label>
          <el-input v-model="attendanceObj.stu_name" placeholder="请输入" />
        </div>
        <div class="filter-item">
          <label class="label">考勤开始时间：</label>
          <el-date-picker
            v-model="attendanceObj.start_time"
            value-format="yyyyMMddHHmmss"
            type="datetime"
            placeholder="考勤开始时间"
            default-time="00:00:00"
          />
        </div>
        <div class="filter-item">
          <label class="label">考勤结束时间：</label>
          <el-date-picker
            v-model="attendanceObj.end_time"
            value-format="yyyyMMddHHmmss"
            type="datetime"
            placeholder="考勤结束时间"
            default-time="23:59:59"
          />
        </div>
      </div>
      <div class="filter-right">
        <div class="filter-btn">
          <span class="spp-btn spp-btn-primary" @click="getData()">搜索</span>
          <span class="spp-btn" @click="resetData">重置</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { classInfo, dormInfo } from '@/api/campus_attendance'
import { parseTime } from '@/utils'
export default {
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      attendanceObj: {
        pajx_gra_id: '',
        pajx_cls_id: '',
        pajx_bld_id: '',
        pajx_dor_id: '',
        stu_name: '',
        start_time: parseTime(new Date(), '{y}{m}{d}') + '000000',
        end_time: parseTime(new Date(), '{y}{m}{d}') + '235959'
      },
      gra_list: [],
      bld_list: []
    }
  },
  created() {
    if (this.type === 1) {
      this.getclassInfo()
    } else {
      this.getdormInfo()
    }
  },
  methods: {
    // 重置搜索选项
    resetData() {
      Object.assign(
        this.$data.attendanceObj,
        this.$options.data().attendanceObj
      )
    },
    getData() {
      this.$emit('getData', this.attendanceObj)
    },

    // 选择班级年级
    handleChange(value) {
      if (value.length === 1) {
        this.attendanceObj.pajx_gra_id = value[0]
        this.attendanceObj.pajx_cls_id = ''
      } else if (value.length === 2) {
        this.attendanceObj.pajx_gra_id = value[0]
        this.attendanceObj.pajx_cls_id = value[1]
      } else {
        this.attendanceObj.pajx_gra_id = ''
        this.attendanceObj.pajx_cls_id = ''
      }
    },

    // 选择宿舍
    handleBldChange(value) {
      if (value.length === 1) {
        this.attendanceObj.pajx_bld_id = value[0]
        this.attendanceObj.pajx_dor_id = ''
      } else if (value.length === 2) {
        this.attendanceObj.pajx_bld_id = value[0]
        this.attendanceObj.pajx_dor_id = value[1]
      } else {
        this.attendanceObj.pajx_bld_id = ''
        this.attendanceObj.pajx_dor_id = ''
      }
    },

    // 获取年级班级数据
    getclassInfo() {
      classInfo().then(res => {
        this.gra_list = this.processData(res.data.pajx_result.data)
      })
    },

    // 获取宿舍数据
    getdormInfo() {
      dormInfo().then(res => {
        this.bld_list = this.processbldData(res.data.pajx_result.data)
      })
    },

    processData(data) {
      if (data.length > 0) {
        let gra_list = data.map(opt => {
          return {
            label: opt.gra_name + '年级',
            value: opt.gra_id,
            children: []
          }
        })
        const obj = {}
        gra_list = gra_list.reduce((item, next) => {
          obj[next.value] ? ' ' : (obj[next.value] = true && item.push(next))
          return item
        }, [])
        gra_list.forEach(opt => {
          data.forEach(item => {
            if (item.gra_id === opt.value) {
              opt.children.push({
                label: item.cls_name,
                value: item.cls_id
              })
            }
          })
        })
        return gra_list
      }
    },

    processbldData(data) {
      if (data.length > 0) {
        let bld_list = data.map(opt => {
          return {
            label: opt.bld_show_name,
            value: opt.bld_id,
            children: []
          }
        })
        const obj = {}
        bld_list = bld_list.reduce((item, next) => {
          obj[next.value] ? ' ' : (obj[next.value] = true && item.push(next))
          return item
        }, [])
        bld_list.forEach(opt => {
          data.forEach(item => {
            if (item.bld_id === opt.value) {
              opt.children.push({
                label: item.dor_name,
                value: item.dor_id
              })
            }
          })
        })
        return bld_list
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
