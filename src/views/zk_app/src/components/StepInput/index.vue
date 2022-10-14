<template>
  <div>
    <div v-for="(item, index) in list" :key="index" class="step_item">
      <div class="space_between" style="line-height: 30px;">
        <b>({{ index + 1 }})</b>
        <svg-icon icon-class="step-del" @click="delete_step(index)" />
      </div>
      <div>
        <el-input v-model="item.text" type="textarea" placeholder="请输入步骤内容" />
      </div>
    </div>
    <div class="spp-add-btn" @click="add_step">新增步骤</div>
  </div>
</template>
<script>
export default {
  model: {
    prop: 'list',
    event: 'changeList'
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  watch: {
    list() {
      this.$emit('changeList', this.list)
    }
  },
  created() {
  },
  methods: {
    add_step() {
      const tmp = {
        text: ''
      }
      this.list.push(tmp)
    },
    delete_step(index) {
      this.list.forEach((item, i) => {
        if (i === index) {
          this.list.splice(i, 1)
          return
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.step_item{
  margin-bottom: 16px;
  padding: 0 8px 8px 8px;
  border: 1px solid #D7D9DB;
  border-radius:4px;
  b{
    color: #313233;
    font-size: 12px;
  }
  svg{
    margin-top:7px;
    cursor: pointer;
  }
}
</style>
