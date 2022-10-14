<template>
  <div>
    <div v-if="canDelete && functionList.includes('A36003')" class="space_between table_line" style="padding-top: 0px">
      <el-checkbox v-model="check_all" style="margin-top: 8px;" :indeterminate="isIndeterminate" @change="handleCheckAllChange" />
      <span class="spp-btn" style="margin-right: 0" @click="del"><svg-icon icon-class="delete" />删除</span>
    </div>
    <div v-if="list.length > 0">
      <el-checkbox-group v-model="checked" @change="handleCheckedChange">
        <div v-for="(item, index) in list" :key="index" class="space_between table_line table_click" style="align-items:center" @click="showDetail(item.notice_id)">
          <el-checkbox v-if="canDelete && functionList.includes('A36003')" class="table_check" style="margin-top: 8px;" :label="item.notice_id" @click.stop.native />
          <div class="space_between" style="width: calc(100% - 30px); align-items:center">
            <div style="width: 48px">
              <Avatar :img="item.avatar" :text="item.user_name" />
            </div>
            <div style="width: calc(100% - 64px)">
              <div class="space_between">
                <span class="notice_user_name">{{ item.user_name }}</span>
                <span class="notice_data_time">{{ formatDateTime(item.create_time) }}</span>
              </div>
              <div class="notice_title">{{ item.notice_title }}</div>
              <div class="notice_content"> {{ item.notice_content }} </div>
            </div>
          </div>
        </div>
      </el-checkbox-group>
    </div>
    <div v-else class="notice_no_data table_line">
      暂无数据
    </div>
  </div>
</template>
<script>
import Avatar from '@/components/Avatar'
import { del } from '@/api/notice'
import { formatDateTime } from '@/utils/index'
export default {
  components: { Avatar },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    functionList: {
      type: Array,
      default: () => []
    },
    canDelete: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
      check_all: false,
      checked: [],
      check_labels: [],
      isIndeterminate: false
    }
  },
  watch: {
    list() {
      this.getCheckLabels()
    }
  },
  created() {
    this.getCheckLabels()
  },
  methods: {
    formatDateTime: formatDateTime,
    showDetail: function(notice_id) {
      this.$emit('showDetail', notice_id)
    },
    getCheckLabels() {
      this.check_labels = []
      this.list.forEach(item => {
        this.check_labels.push(item.notice_id)
      })
    },
    handleCheckAllChange: function(val) {
      this.checked = val ? this.check_labels : []
    },
    handleCheckedChange(value) {
      const checkedCount = value.length
      this.check_all = checkedCount === this.check_labels.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.check_labels.length
    },
    del: function() {
      let str = ''
      this.checked.forEach(item => {
        str += item + ','
      })
      str ? str = str.substring(0, str.length - 1) : str
      if (str) {
        this.$confirm('确定要删除吗？', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(str).then(res => {
            this.$emit('update')
          })
        }).catch(() => {})
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.table_line {
  border-bottom: 1px solid #EBF0F5;
  padding: 15px 0;
}
.table_click {
  cursor: pointer;
}
.notice_user_name {
  font-size: 14px;
  color: #626466;
}
.notice_data_time {
  color: #939699;
  font-size: 12px;
  line-height: 14px;
}
.notice_title {
  color: #313233;
  font-size: 16px;
  margin-top: 10px;
}
.notice_content {
  color: #939699;
  font-size: 14px;
  margin-top: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.notice_no_data{
  text-align: center;
  line-height: 28px;
  color: #626466;
  font-size: 14px;
}
</style>
