<template>
  <div class="app-container page-container right-side-dialog">
    <div class="sclprofile_main" :style="{ height: height - 47 + 'px' }">
      <el-form ref="form" :model="form" :rules="rules" label-width="132px">
        <el-form-item label=" 学校简介内容：" prop="scl_intro">
          <editor-bar v-model="form.scl_intro" :is-clear="isClear" />
        </el-form-item>
        <el-form-item label="是否在首页展示：" prop="index_show">
          <el-radio-group v-model="form.index_show">
            <el-radio :label="'1'">是</el-radio>
            <el-radio :label="'0'">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span
        v-if="functionList.includes('A54001')"
        class="spp-btn spp-btn-primary"
        style="float: right"
        @click="saveIntroduce"
      >保存</span>
    </div>
  </div>
</template>

<script>
import { getIntroduceDetail, addIntroduce } from '@/api/scl_news_profile'
import EditorBar from '@/components/wangEnduit'
import { mapState } from 'vuex'
export default {
  name: 'SclProfile',
  components: { EditorBar },
  data() {
    return {
      isClear: false,
      form: {
        scl_intro: '',
        index_show: '1'
      },
      rules: {
        index_show: [
          { required: true, message: '请选择是否在首页展示', trigger: 'blur' }
        ],
        scl_intro: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      },
      height: window.innerHeight - 114
    }
  },
  computed: {
    ...mapState({
      functionList: (state) => state.permission.functionList
    })
  },
  created() {
    this.getIntroduceDetail()
  },
  methods: {
    saveIntroduce() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { scl_intro, index_show } = this.form
          addIntroduce(scl_intro, index_show).then((response) => {
            this.showDialog = false
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 3000
            })
          })
        }
      })
    },
    getIntroduceDetail() {
      getIntroduceDetail().then((res) => {
        if (res.data) {
          this.form = {
            scl_intro: res.data.scl_intro,
            index_show: res.data.index_show
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.sclprofile_main {
  background: #ffffff;
  padding: 50px;
  border-radius: 4px;
}
</style>
