<template>
  <div class="app-container insideuser-container">
    <div class="main-header">
      <div class="left">
        <span v-if="functionList.includes('A06001')" class="spp-btn spp-btn-primary" @click="addTopDic()">
          <svg-icon icon-class="add" />
          <span>新增字典类型</span>
        </span>
        <span v-if="functionList.includes('A06002')" class="spp-btn" @click="syncDic()">
          <svg-icon icon-class="synchro" />
          <span>同步到缓存</span>
        </span>
        <span v-if="functionList.includes('A06002')" class="spp-btn" @click="syncArea()">
          <svg-icon icon-class="synchro" />
          <span>更新区域信息</span>
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table
        :data="dicData"
        row-key="dic_id"
      >
        <el-table-column label="序号" prop="seq" width="120" />
        <el-table-column label="类型名称" prop="dic_type_name" />
        <el-table-column label="类型编码" prop="dic_type_code" />
        <el-table-column label="字典名称" prop="dic_name" />
        <el-table-column label="字典编码" prop="dic_code" />
        <el-table-column label="字典描述" prop="dic_desc" />
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status_flag == '1' && functionList.includes('A06003')" class="red" type="text" @click="disableDic(scope.row.dic_id)">停用</el-button>
            <el-button v-if="scope.row.status_flag == '0' && functionList.includes('A06004')" class="green" type="text" @click="enableDic(scope.row.dic_id)">启用</el-button>
            <el-button v-if="scope.row.status_flag != '999' && functionList.includes('A06005')" class="red" type="text" @click.native="delDic(scope.row.dic_id)">删除</el-button>
            <el-button v-if="scope.row.status_flag == '999' && functionList.includes('A06001')" type="text" @click.native="addDic(scope.row)">新增条目</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="添加字典"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      width="650px"
    >
      <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="80px" class="model_form insider_form">
        <el-form-item label="类型编码" prop="dic_type_code">
          <el-input v-model="form.dic_type_code" placeholder="请输入字典类型编码" :readonly="form.status_flag == 1" />
        </el-form-item>
        <el-form-item label="类型名称" prop="dic_type_name">
          <el-input v-model="form.dic_type_name" placeholder="请输入字典类型名称" :readonly="form.status_flag == 1" />
        </el-form-item>
        <el-form-item label="字典编码" prop="dic_code">
          <el-input v-model="form.dic_code" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="字典名称" prop="dic_name">
          <el-input v-model="form.dic_name" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典描述" prop="dic_desc">
          <el-input v-model="form.dic_desc" type="textarea" :rows="3" placeholder="请输入字典描述" />
        </el-form-item>
        <el-form-item class="model_btn_group">
          <span class="spp-btn spp-btn-primary" @click="submit()">提交</span>
          <span class="spp-btn" @click="reset">重置</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDic, addDic, enableDic, disableDic, delDic, syncDic, syncArea } from '@/api/dict'
import { mapState } from 'vuex'
export default {
  name: 'Dict',
  data() {
    return {
      dicData: [],
      showDialog: false,
      showAuthDialog: false,
      form: {
        dic_type_code: '',
        dic_type_name: '',
        dic_code: '',
        dic_name: '',
        dic_desc: '',
        status_flag: 0
      },
      rules: {
        dic_type_code: [
          { required: true, message: '请输入字典类型编码', trigger: 'blur' }
        ],
        dic_type_name: [
          { required: true, message: '请输入字典类型名称', trigger: 'blur' }
        ],
        dic_code: [
          { required: true, message: '请输入字典编码', trigger: 'blur' }
        ],
        dic_name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getDic().then(response => {
        this.formatDic(response.data)
      })
    },
    formatDic(dics) {
      const dic_data = []
      const dic_type_group = []
      const dic_type_dic = {}
      let i = 0
      let j = 1
      dics.forEach(item => {
        const tmp = item
        if (dic_type_group.includes(item.dic_type_code)) {
          tmp['seq'] = i + '.' + j
          dic_data[dic_type_dic[item.dic_type_code]].children.push(tmp)
          j++
        } else {
          dic_type_dic[item.dic_type_code] = i
          dic_type_group.push(item.dic_type_code)
          const dic_type_tmp = {
            seq: i + 1,
            dic_id: '1-' + item.dic_id,
            dic_type_code: item.dic_type_code,
            dic_type_name: item.dic_type_name,
            dic_code: '',
            dic_name: '',
            dic_desc: '',
            status_flag: 999,
            children: []
          }
          tmp['seq'] = (i + 1) + '.1'
          dic_type_tmp.children.push(tmp)
          dic_data.push(dic_type_tmp)
          j = 2
          i++
        }
      })
      this.dicData = dic_data
    },
    syncDic() {
      syncDic().then(response => {
        this.$message({
          type: 'success',
          message: '字典同步成功!'
        })
        this.getData()
      })
    },
    syncArea() {
      syncArea().then(response => {
        this.$message({
          type: 'success',
          message: '区域信息同步成功!'
        })
      })
    },
    addTopDic() {
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
    },
    addDic(data) {
      this.form = {
        dic_type_code: data.dic_type_code,
        dic_type_name: data.dic_type_name,
        dic_code: '',
        dic_name: '',
        dic_desc: '',
        status_flag: 1
      }
      this.showDialog = true
    },
    disableDic(dic_id) {
      disableDic(dic_id).then(response => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.getData()
      })
    },
    enableDic(dic_id) {
      enableDic(dic_id).then(response => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.getData()
      })
    },
    delDic(dic_id) {
      delDic(dic_id).then(response => {
        this.$message({
          type: 'success',
          message: '字典删除成功!'
        })
        this.getData()
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          addDic(this.form).then(response => {
            this.showDialog = false
            this.$message({
              message: '菜单添加成功',
              type: 'success',
              duration: 3000
            })
            this.getData()
          })
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
    color: #3399ff;
    font-size: 14px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
