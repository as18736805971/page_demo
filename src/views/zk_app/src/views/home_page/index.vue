<template>
  <div
    v-if="user_type === '0'"
    style="padding: 30px; text-align: center; font-size: 30px"
  >
    欢迎欢迎，热烈欢迎
  </div>
  <div v-else-if="user_type === '1'" class="homepage-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <mapDisplay style="width: 100%; height: 540px; border-radius: 10px" />
      </el-col>
      <el-col :span="6">
        <realtimeReport />
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px; margin-bottom: 20px">
      <el-col :span="6">
        <eduSituation :type="1" />
      </el-col>
      <el-col :span="6">
        <eduSituation :type="2" />
      </el-col>
      <el-col :span="12">
        <riskProfile />
      </el-col>
    </el-row>
    <hiddenTrouble />
  </div>
  <div v-else-if="user_type === '2'" class="homepage-container">
    <el-row v-if="index_show==='1'" :gutter="20">
      <div class="home_scl_main">
        <homeHeader title="学校简介" :type="4" />
        <el-scrollbar wrap-class="vertical_scrollbar" style="min-height: 490px;">
          <div class="home_scl_main_content" v-html="scl_intro" />
        </el-scrollbar>
      </div>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="18">
        <plan-img :height="540" :url="url" />
      </el-col>
      <el-col :span="6">
        <patrolRecord />
      </el-col>
    </el-row>
    <centerColumn />
    <hiddenTrouble />
    <el-row :gutter="20">
      <el-col :span="12">
        <riskProfile />
      </el-col>
      <el-col :span="12">
        <hiddenDanger />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PlanImg from '@/components/Threeview/plan_img'
import patrolRecord from './admin/components/patrolRecord'
import centerColumn from './admin/components/centerColumn'
import riskProfile from './admin/components/riskProfile'
import hiddenDanger from './admin/components/hiddenDanger'
import hiddenTrouble from './admin/components/hiddenTrouble'
import realtimeReport from './admin/components/realtimeReport'
import eduSituation from './admin/components/eduSituation'
import { getSchoolModel } from '@/api/risk_map'
import { mapGetters } from 'vuex'
import mapDisplay from '@/components/BaiduMap/display'
import homeHeader from './admin/components/homeHeader'
import { getIntroduceDetail } from '@/api/scl_news_profile'
export default {
  name: 'Homepage',
  components: {
    patrolRecord,
    centerColumn,
    riskProfile,
    hiddenDanger,
    hiddenTrouble,
    realtimeReport,
    eduSituation,
    mapDisplay,
    homeHeader,
    PlanImg
  },
  data() {
    return {
      three_id: 'index_three',
      url: '',
      index_show: '0',
      scl_intro: ''
    }
  },
  computed: {
    ...mapGetters(['user_type'])
  },
  created() {
    if (this.user_type === '2') {
      this.getSchoolModel()
      this.getIntroduceDetail()
    }
  },
  methods: {
    getSchoolModel: function() {
      getSchoolModel().then((response) => {
        if (response.data.scl_model && response.data.scl_model !== '') {
          this.url = process.env.VUE_APP_BASE_API + '/' + response.data.scl_model
        }
        // this.url = {
        //   url: response.data.scl_model,
        //   cam_init_x: response.data.model_cam_init_x,
        //   cam_init_y: response.data.model_cam_init_y,
        //   cam_init_z: response.data.model_cam_init_z
        // }
      })
    },
    getIntroduceDetail() {
      getIntroduceDetail().then((res) => {
        if (res.data) {
          this.index_show = res.data.index_show
          this.scl_intro = res.data.scl_intro
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.homepage-container {
  padding: 0 20px 16px 20px;
}
.home_scl_main {
  background: #ffffff;
  border-radius: 4px;
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
  .homeHeader-main {
    border-bottom: 1px solid #ebf0f5;
  }
  .home_scl_main_content {
    padding: 0 16px;
  }
}
</style>
