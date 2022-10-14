<template>
  <div>
    <el-form label-width="120px">
      <el-form-item label="应急设施" style="margin: 16px 0 8px 0px;" />
      <div style="margin-bottom: 16px;">
        <el-select v-model="equipment_info_selected" clearable placeholder="请选择应急设施">
          <el-option v-for="(item, k) in equipment_info" :key="k" :label="item.equipment_name" :value="item.id" />
        </el-select>
        <span class="spp-btn spp-btn-primary" style="margin-left: 16px;" @click="addEquipment">添加</span>
      </div>
      <el-table class="static_table" :data="equipment_info_detail" border>
        <el-table-column prop="equipment_name" label="名称" />
        <el-table-column prop="euqipment_count" label="数量" />
        <el-table-column prop="equipment_location" label="位置" />
        <el-table-column prop="equipment_status" label="状态">
          <template slot-scope="scope">{{ scope.row.equipment_status == 1 ? '完好' : '损坏' }}</template>
        </el-table-column>
        <el-table-column prop="response_man" label="负责人" />
        <el-table-column prop="response_man_phone" label="电话" width="140">
          <template slot-scope="scope">
            {{ scope.row.response_man_phone }}
            <div class="tab_del_btn" @click="delEquipment(scope.row.eq_pl_id)">
              <svg-icon icon-class="delete" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item label="救援队伍" style="margin: 16px 0 8px 0px;" />
      <div style="margin-bottom: 16px;">
        <el-select v-model="emergency_group_selected" clearable placeholder="请选择救援队伍">
          <el-option v-for="(item, k) in emergency_group" :key="k" :label="item.group_name" :value="item.id" />
        </el-select>
        <span class="spp-btn spp-btn-primary" style="margin-left: 16px;" @click="addGroup">添加</span>
      </div>
      <el-table class="static_table" :data="emergency_group_detail" border>
        <el-table-column prop="group_name" label="队伍名称" />
        <el-table-column prop="group_phone" label="队伍电话">
          <template slot-scope="scope">
            {{ scope.row.group_phone }}
            <div class="tab_del_btn" @click="delGroup(scope.row.id)">
              <svg-icon icon-class="delete" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>
<script>
import { gainPlanInfo, getGroupList, getEquipment, saveEquipment, delEquipment, saveGroup, deleteGroup } from '@/api/plan'
export default {
  props: {
    equipmentInfoDetail: {
      type: Array,
      default: () => []
    },
    emergencyGroupDetail: {
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
      equipment_info_detail: this.equipmentInfoDetail,
      emergency_group_detail: this.emergencyGroupDetail,
      equipment_info_selected: '',
      equipment_info: [],
      emergency_group_selected: '',
      emergency_group: []
    }
  },
  created() {
    this.getEquipment()
    this.getGroupList()
  },
  methods: {
    getEquipment: function() {
      // 获取应急装备
      getEquipment().then(res => {
        this.equipment_info = res.data
      })
    },
    getGroupList: function() {
      getGroupList().then(res => {
        this.emergency_group = res.data
      })
    },
    refreshData: function() {
      gainPlanInfo(this.planId).then(res => {
        this.equipment_info_detail = res.data.equipment_info
        this.emergency_group_detail = res.data.emergency_group
      })
    },
    addEquipment: function() {
      if (!this.equipment_info_selected) {
        this.$message({
          type: 'warning',
          message: '请选择应急装备'
        })
        return false
      }
      saveEquipment(this.planId, this.equipment_info_selected).then(res => {
        this.refreshData()
      })
    },
    delEquipment: function(id) {
      delEquipment(id).then(res => {
        this.refreshData()
      })
    },
    addGroup: function() {
      if (!this.emergency_group_selected) {
        this.$message({
          type: 'warning',
          message: '请选择救援小组'
        })
        return false
      }
      saveGroup(this.planId, this.emergency_group_selected).then(res => {
        this.refreshData()
      })
    },
    delGroup: function(id) {
      deleteGroup(id).then(res => {
        this.refreshData()
      })
    }
  }
}
</script>
