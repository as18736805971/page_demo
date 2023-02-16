<template>
  <div>
    <el-button @click="show = true">按钮</el-button>

    <el-dialog
      title="提示"
      :visible.sync="show"
      width="70%"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="活动名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="温度区间">
          <div class="form_block">
            <el-input class="form_item" v-model="form.name" />
            <span class="line">------</span>
            <el-input class="form_item" v-model="form.name" />°C
            <el-form-item label="低温度阔值">
              <el-input class="form_item" v-model="form.name" />°C
            </el-form-item>
            <el-form-item label="高温度阔值">
              <el-input class="form_item" v-model="form.name" />°C
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="show = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "demo6",
  data() {
    return {
      show: false,
      form: {
        name: ''
      }
    }
  },
  methods: {
    handle() {

    }
  }
}
</script>

<style scoped>
.form_block {
  display: flex;
  align-items: center;
}

.form_item {
  width: 100px;
  margin-right: 5px;
}
.line {
  margin: 0 5px;
}
</style>
