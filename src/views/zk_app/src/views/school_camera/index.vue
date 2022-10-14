<template>
  <div class="app-container page-container">
    <div class="header-search single_line">
      <el-form ref="search_form" :model="search" :inline="true" label-width="120px">
        <div class="form-area">
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
    <div class="main-body">
      <el-row v-if="data.length > 0" :gutter="20">
        <el-col v-for="(o, v) in data" :key="v" :span="6">
          <el-card style="text-align:center">
            <div v-if="o.hls" style="cursor: pointer; " @click="seeLive(o.hls)">
              <el-image :src="o.preview" :fit="'cover'" class="cam_no_pic">
                <div slot="error" class="image-slot">
                  <div>
                    <img src="../../assets/images/cam_no_pic.png" style="">
                    <p style="font-size: 14px; color: #fff">暂无预览图</p>
                  </div>
                  <img src="../../assets/images/cam_no_pic_bk.png" class="img">
                </div>
              </el-image>
            </div>
            <div v-else style="background-color:#4c515f;">
              <div class="unplayable">
                <div>
                  <img src="../../assets/images/unplayable.png">
                  <p style="font-size: 14px; color: #fff">暂不支持网页预览</p>
                </div>
              </div>
            </div>
            <div style="margin-top: 10px;">
              <span>{{ o.equ_name }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div v-else style="text-align:center; padding: 40px;">
        <img src="../../assets/images/home-no-content.png">
        <p style="color:#909399">暂无数据</p>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="page"
        :limit.sync="page_size"
        @pagination="getData"
      />
    </div>
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
import { paginate } from '@/api/device_manage_camera'
import Pagination from '@/components/Pagination'
import { mapState } from 'vuex'
import Hls from 'hls.js'
import md5 from 'js-md5'
export default {
  name: 'SchoolCamera',
  components: { Pagination },
  data() {
    return {
      search: {
        keyword: '',
        data: { scl_id: '', scl_name: '' }
      },
      data: [],
      page: 1,
      page_size: 12,
      total: 0,
      showVideo: false,
      dialogTitle: '',
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
  },
  methods: {
    searchData() {
      this.page = 1
      this.getData()
    },
    getData() {
      paginate(this.search, this.page, this.page_size).then(response => {
        const data = response.data.list
        data.forEach(v => {
          if (v.hls) {
            v['preview'] = 'https://spp.zm-teach.com/pics/' + md5(v.rtsp) + '.jpg'
          }
        })
        this.data = data
        this.total = response.data.totalRow
      })
    },
    resetForm() {
      Object.assign(this.$data.search, this.$options.data().search)
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
.unplayable{
  height: 200px;
  display:flex;
  align-items: center;
  width: 100%;
  justify-content: center;
}
.cam_no_pic {
  background-color: #1249e7;
  height: 200px;
  display:flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  position:relative;
  .img {
    position:absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
