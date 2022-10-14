<template>
  <div class="app-container page-container">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
          <el-form-item label="学校：">
            <el-input v-model="search.data.scl_name" placeholder="请选择" @focus="choiceSchool(1)" />
          </el-form-item>
          <el-form-item label="摄像头名称：">
            <el-input v-model="search.keyword" placeholder="请输入" />
          </el-form-item>
        </div>
        <el-form-item class="btn-area">
          <span class="spp-btn spp-btn-primary" @click="searchData()">搜索</span>
          <span class="spp-btn" @click="resetForm()">重置</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-header">
      <div class="left">
        <span
          v-if="functionList.includes('A40010')"
          class="spp-btn spp-btn-primary"
          @click="addCamera()"
        >
          <svg-icon icon-class="add" />新增
        </span>
        <span v-if="functionList.includes('A40012')" class="spp-btn" @click="delBatch()">
          <svg-icon icon-class="delete" />删除
        </span>
        <span v-if="functionList.includes('A40013')" class="spp-btn" @click="openBatch()">
          <svg-icon icon-class="open-camera" />批量打开
        </span>
        <span v-if="functionList.includes('A40013')" class="spp-btn" @click="closeBatch()">
          <svg-icon icon-class="close-camera" />批量关闭
        </span>
      </div>
    </div>
    <div class="main-body">
      <el-table ref="table" :data="data">
        <el-table-column type="selection" width="55" />>
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="学校" prop="scl_name" />
        <el-table-column label="设备名称" prop="equ_name" />
        <el-table-column label="设备类型" prop="equ_type">
          <template slot-scope="scope">{{ device_type[scope.row.equ_type] }}</template>
        </el-table-column>
        <el-table-column label="支持协议" width="165">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.rtsp" size="mini">RTSP</el-tag>
            <el-tag v-if="scope.row.rtmp" type="warning" size="mini">RTMP</el-tag>
            <el-tag v-if="scope.row.hls" type="success" size="mini">HLS</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">{{ scope.row.camera_status === '1' ? '开启' : '关闭' }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">{{ scope.row.create_time ? formatDateTime(scope.row.create_time) : '--' }}</template>
        </el-table-column>
        <el-table-column label="创建人" prop="create_oper_name" width="130" />
        <el-table-column prop="address" label="操作" width="130">
          <template slot-scope="scope">
            <el-button v-if="functionList.includes('A40014')" type="text" :disabled="!scope.row.hls" @click="seeLive(scope.row.hls)">查看</el-button>
            <el-button type="text">
              <el-dropdown>
                <span class="el-dropdown-link">
                  更多
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="functionList.includes('A40013') && scope.row.camera_status === '0'"
                    @click.native="setCamera(scope.row.equ_id, '1')"
                  >打开</el-dropdown-item>
                  <el-dropdown-item
                    v-if="functionList.includes('A40013') && scope.row.camera_status === '1'"
                    @click.native="setCamera(scope.row.equ_id, '0')"
                  >关闭</el-dropdown-item>
                  <el-dropdown-item
                    v-if="functionList.includes('A40011')"
                    @click.native="edit(scope.row)"
                  >编辑</el-dropdown-item>
                  <el-dropdown-item
                    v-if="functionList.includes('A40012')"
                    @click.native="del(scope.row.equ_id)"
                  >删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="page_size"
        @pagination="getData"
      />
    </div>
    <el-drawer
      :title="dialogTitle"
      :visible.sync="showDialog"
      :wrapper-closable="false"
      class="spp-drawer right-noall-content right-side-dialog"
    >
      <el-scrollbar wrap-class="vertical_scrollbar">
        <el-form v-if="showDialog" ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="选择学校：" prop="scl_name">
            <div @click="choiceSchool">
              <el-input v-model="form.data.scl_name" placeholder="请选择学校" />
            </div>
          </el-form-item>
          <el-form-item label="设备名称：" prop="equ_name">
            <el-input v-model="form.equ_name" placeholder="请输入设备名称" />
          </el-form-item>
          <el-form-item label="设备类型：" prop="equ_type">
            <el-select v-model="form.equ_type" clearable placeholder="请选择设备类型">
              <el-option v-for="(item, k) in device_type" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="推流器id：">
            <el-input v-model="form.tlqid" placeholder="请输入推流器id" @input="change_tlqid" />
          </el-form-item>
          <el-form-item label="通道号：">
            <el-input v-model="form.tdh" placeholder="请输入通道号" @input="change_tlqid" />
          </el-form-item>
          <el-form-item label="RTSP地址：" prop="rtsp">
            <el-input v-model="form.rtsp" placeholder="请输入RTSP地址" />
          </el-form-item>
          <el-form-item label="HLS地址：" prop="hls">
            <el-input v-model="form.hls" placeholder="请输入HLS地址" />
          </el-form-item>
          <el-form-item label="RTMP地址：" prop="rtmp">
            <el-input v-model="form.rtmp" placeholder="请输入RTMP地址" />
          </el-form-item>
          <el-form-item label="设备厂商：" prop="equ_vender">
            <el-select v-model="form.equ_vender" clearable placeholder="请选择设备厂商">
              <el-option v-for="(item, k) in vender_type" :key="k" :label="item" :value="k" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备描述：" prop="equ_desc">
            <el-input v-model="form.equ_desc" type="textarea" :rows="4" placeholder="请输入设备描述" />
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <div class="dialog-btn" style="text-align: right">
        <span class="spp-btn" @click="showDialog = false">取消</span>
        <span class="spp-btn spp-btn-primary" @click="submit">保存</span>
      </div>
      <el-drawer
        title="选择学校"
        :append-to-body="true"
        :visible.sync="selectSchoolDialog"
        :wrapper-closable="false"
        class="spp-child-drawer"
      >
        <SelectSchool :type="2" @selectSchool="ensureSchool" />
      </el-drawer>
    </el-drawer>
    <el-drawer
      v-if="schoolDialog"
      title="选择学校"
      :visible.sync="schoolDialog"
      :wrapper-closable="false"
      class="spp-drawer"
      width="720px"
    >
      <SelectSchool :type="2" @selectSchool="selectSchool" />
    </el-drawer>
    <el-dialog
      title="查看视频"
      :width="'800px'"
      :visible.sync="showVideo"
      @close="closeLive"
      @opened="openLive"
    >
      <video ref="video" controls style="width:100%" />
    </el-dialog>
  </div>
</template>

<script>
import { equtype, equVender } from '@/api/device_manage'
import { paginate, save, update, del, change } from '@/api/device_manage_camera'
import Pagination from '@/components/Pagination'
import SelectSchool from '@/components/SelectSchool'
import { mapState } from 'vuex'
import { formatDateTime } from '@/utils/index'
import Hls from 'hls.js'
export default {
  name: 'EquipCamera',
  components: { Pagination, SelectSchool },
  data() {
    const validateSclname = (rule, value, callback) => {
      if (!this.form.data.scl_id) {
        callback('请选择学校')
      } else {
        callback()
      }
    }
    const validateUrl = (rule, value, callback) => {
      if (this.form.rtsp === '' && this.form.hls === '' && this.form.rtmp === '') {
        callback('请至少填写一个直播地址')
      } else {
        callback()
      }
    }
    return {
      search: {
        keyword: '',
        data: { scl_id: '', scl_name: '' }
      },
      device_type: {},
      vender_type: {},
      data: [],
      page: 1,
      page_size: 10,
      total: 0,
      schoolDialog: false,
      selectSchoolDialog: false,
      showDialog: false,
      showVideo: false,
      dialogTitle: '',
      form: {
        id: '',
        data: {
          scl_id: '',
          scl_name: ''
        },
        equ_type: '',
        equ_name: '',
        equ_desc: '',
        equ_vender: '',
        tlqid: '',
        tdh: '',
        rtsp: '',
        hls: '',
        rtmp: ''
      },
      rules: {
        scl_name: [{ required: true, trigger: 'blur', validator: validateSclname }],
        equ_name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        equ_type: [{ required: true, message: '请选择设备类型', trigger: 'blur' }],
        hls: [{ required: true, validator: validateUrl, trigger: 'blur' }],
        rtsp: [{ required: true, validator: validateUrl, trigger: 'blur' }],
        rtmp: [{ required: true, validator: validateUrl, trigger: 'blur' }]
      },
      hls: null
    }
  },
  computed: {
    ...mapState({
      functionList: state => state.permission.functionList
    })
  },
  async created() {
    this.getData()
    this.getDeviceType()
    this.getVenderType()
  },
  methods: {
    formatDateTime: formatDateTime,
    searchData() {
      this.page = 1
      this.getData()
    },
    change_tlqid() {
      if (this.form.tlqid && this.form.tdh) {
        this.form.rtsp = 'http://simple.xst.pajx.com.cn:9502/' + this.form.tlqid + '/hlsram/' + this.form.tdh + '/index.m3u8'
        this.form.hls = 'https://spp_xst.pajx.com.cn/' + this.form.tlqid + '/hlsram/' + this.form.tdh + '/index.m3u8'
      } else {
        this.form.rtsp = ''
        this.form.hls = ''
      }
    },
    getData() {
      paginate(this.search, this.page, this.page_size).then(response => {
        this.data = response.data.list
        this.total = response.data.totalRow
      })
    },
    getDeviceType() {
      equtype().then(res => {
        this.device_type = res.data
      })
    },
    getVenderType() {
      equVender().then(res => {
        this.vender_type = res.data
      })
    },
    addCamera() {
      Object.assign(this.form, this.$options.data().form)
      this.showDialog = true
      this.dialogTitle = '新增摄像头设备'
    },
    edit(data) {
      this.form = {
        id: data.equ_id,
        data: {
          scl_id: data.scl_id,
          scl_name: data.scl_name
        },
        equ_type: data.equ_type,
        equ_name: data.equ_name,
        equ_desc: data.equ_desc,
        equ_vender: data.equ_vender,
        rtsp: data.rtsp,
        hls: data.hls,
        rtmp: data.rtmp
      }
      this.showDialog = true
      this.dialogTitle = '修改设备'
    },
    del(id) {
      this.$confirm('确定要删除吗？', '删除提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          del(id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getData()
          })
        })
        .catch(() => {})
    },
    delBatch() {
      let str = ''
      this.$refs.table.store.states.selection.forEach(item => {
        str += item.equ_id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      str ? this.del(str) : ''
      if (str) {
        this.$confirm('确定要删除吗？', '删除提示', {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            del(str).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getData()
            })
          })
          .catch(() => {})
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要删除的数据'
        })
      }
    },
    submit() {
      if (!this.form.id) {
        // 新增
        this.$refs.form.validate(valid => {
          if (valid) {
            const data = this.form
            save(data).then(response => {
              this.showDialog = false
              this.$message({
                message: '设备添加成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      } else {
        // 修改
        this.$refs.form.validate(valid => {
          if (valid) {
            const data = this.form
            update(data.id, data).then(response => {
              this.showDialog = false
              this.$message({
                message: '设备修改成功',
                type: 'success',
                duration: 3000
              })
              this.getData()
            })
          }
        })
      }
    },
    resetForm() {
      Object.assign(this.$data.search, this.$options.data().search)
    },
    // 选择学校
    choiceSchool(type) {
      type === 1
        ? (this.schoolDialog = true)
        : (this.selectSchoolDialog = true)
    },
    // 确认选择
    selectSchool(data) {
      this.search.data = {
        scl_id: data.scl_id,
        scl_name: data.scl_name
      }
      this.schoolDialog = false
    },
    ensureSchool(data) {
      this.selectSchoolDialog = false
      this.form.data = {
        scl_id: data.scl_id,
        scl_name: data.scl_name
      }
    },
    setCamera(id, status) {
      change(id, status).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
        this.getData()
      })
    },
    openBatch() {
      let str = ''
      this.$refs.table.store.states.selection.forEach(item => {
        str += item.equ_id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      str ? this.del(str) : ''
      if (!str) {
        this.$message({
          type: 'warning',
          message: '请选择要打开的摄像头'
        })
        return false
      }
      this.$confirm('确定要打开吗？', '批量打开摄像头提示', {
        confirmButtonText: '打开',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        change(str, '1').then(response => {
          this.$message({
            type: 'success',
            message: '打开成功!'
          })
          this.getData()
        })
      }).catch(() => {})
    },
    closeBatch() {
      let str = ''
      this.$refs.table.store.states.selection.forEach(item => {
        str += item.equ_id + ','
      })
      str ? (str = str.substring(0, str.length - 1)) : str
      str ? this.del(str) : ''
      if (!str) {
        this.$message({
          type: 'warning',
          message: '请选择要关闭的摄像头'
        })
        return false
      }
      this.$confirm('确定要关闭吗？', '批量关闭摄像头提示', {
        confirmButtonText: '关闭',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        change(str, '0').then(response => {
          this.$message({
            type: 'success',
            message: '关闭成功!'
          })
          this.getData()
        })
      }).catch(() => {})
    },
    seeLive(hls) {
      this.showVideo = true
      this.hls = new Hls()
      this.hls.loadSource(hls)
    },
    openLive() {
      this.hls.attachMedia(this.$refs.video)
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        this.$refs.video.play()
      })
    },
    closeLive() {
      if (this.hls) {
        this.$refs.video.pause()
        this.hls.destroy()
        this.hls = null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.device-detail-dialog {
  .common-item {
    .title {
      width: 120px;
    }
  }
}
</style>
