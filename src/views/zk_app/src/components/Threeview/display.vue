<template>
  <div style="position: relative" class="threeview_display_main">
    <div
      v-if="show3D"
      v-loading="loading"
      element-loading-text="正在加载模型图"
      style="position: relative; overflow: hidden"
    >
      <!-- <div ref="silder_left" class="silder_left" :style="{height: height + 'px'}">
        <div class="handle" :style="{top: (height - 82) / 2 + 'px'}" @click="show()">
          <img src="../../assets/icon/handle.png">
          <img class="arrow" :class="showMenu ? '' : 'arrow_hide'" src="../../assets/icon/arrow.png">
        </div>
        <el-tree
          :data="modelData"
          node-key="id"
          :expand-on-click-node="false"
          :style="{height: height + 'px'}"
          style="overflow: auto"
          class="building_tree"
        >
          <span slot-scope="{data}" class="custom-tree-node">
            <div>
              <img v-if="data.building_type == '1'" src="../../assets/icon/building.png">
              <img v-if="data.building_type == '2'" src="../../assets/icon/floor.png">
              <img v-if="data.building_type == '3'" src="../../assets/icon/room.png">
              <span>{{ data.label }}</span>
            </div>
            <span>
              <el-button v-if="data.id == 'all_school' || listData[data.id].model_url" type="text" size="mini" @click="(e) => changeModel(data.id)">切换</el-button>
            </span>
          </span>
        </el-tree>
      </div> -->
      <div
        style="
          position: absolute;
          top: 10px;
          z-index: 99;
          left: 10px;
          color: #ffffff;
          font-size: 22px;
          z-index: 1;
        "
      >
        <svg-icon
          style="color: #fff; margin-right: 12px"
          icon-class="screen-school"
        />{{ title }}
      </div>
      <el-tooltip
        class="item"
        effect="dark"
        content="平面视图"
        placement="bottom"
      >
        <span
          class="map_icon icon_2d"
          :class="is_2d ? 'icon_selected' : ''"
          @click="to2D()"
        >
          <img class="icon_img" src="../../assets/icon/2d.png">
        </span>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="三维视图"
        placement="bottom"
      >
        <span
          class="map_icon icon_3d"
          :class="!is_2d ? 'icon_selected' : ''"
          @click="to3D()"
        >
          <img class="icon_img" src="../../assets/icon/3d.png">
        </span>
      </el-tooltip>
      <div
        :id="threeId"
        :style="{ height: height + 'px', position: 'relative' }"
        class="test_css"
      />
      <!-- <div
        style="
          display: flex;
          justify-content: space-between;
          width: 400px;
          left: calc((100% - 400px) / 2);
          position: absolute;
          bottom: 10px;
          background-color: #162e74;
          padding: 8px;
          color: #fff;
          font-size: 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        "
      >
        <div style="display: flex; align-items: center">
          <i
            style="
              display: inline-block;
              width: 14px;
              height: 14px;
              background-color: #ff0000;
              margin-right: 5px;
            "
          />重大风险
        </div>
        <div style="display: flex; align-items: center">
          <i
            style="
              display: inline-block;
              width: 14px;
              height: 14px;
              background-color: #ff7725;
              margin-right: 5px;
            "
          />较大风险
        </div>
        <div style="display: flex; align-items: center">
          <i
            style="
              display: inline-block;
              width: 14px;
              height: 14px;
              background-color: #e6d300;
              margin-right: 5px;
            "
          />一般风险
        </div>
        <div style="display: flex; align-items: center">
          <i
            style="
              display: inline-block;
              width: 14px;
              height: 14px;
              background-color: #2e9aff;
              margin-right: 5px;
            "
          />低风险
        </div>
      </div> -->
      <div class="map_mark">
        <el-row :gutter="5">
          <el-col
            :span="6"
            class="item"
          ><i style="background-color: #ff0000" />重大风险</el-col>
          <el-col
            :span="6"
            class="item"
          ><i style="background-color: #ff7725" />较大风险</el-col>
          <el-col
            :span="6"
            class="item"
          ><i style="background-color: #e6d300" />一般风险</el-col>
          <el-col
            :span="6"
            class="item"
          ><i style="background-color: #2e9aff" />低风险</el-col>
        </el-row>
        <el-row :gutter="5" style="margin-top: 12px">
          <el-col
            :span="6"
            class="item"
          ><img src="../../assets/icon/day_mark.png">日巡检点</el-col>
          <el-col
            :span="6"
            class="item"
          ><img src="../../assets/icon/week_mark.png">周巡检点</el-col>
          <el-col
            :span="6"
            class="item"
          ><img src="../../assets/icon/month_mark.png">月巡检点</el-col>
          <el-col
            :span="6"
            class="item"
          ><img src="../../assets/icon/season_mark.png">季巡检点</el-col>
        </el-row>
        <el-row :gutter="5" style="margin-top: 12px">
          <el-col
            :span="6"
            class="item"
          ><img src="../../assets/icon/year_mark.png">年巡检点</el-col>
          <el-col
            :span="6"
            class="item"
          ><img src="../../assets/icon/cam_mark.png">摄像头</el-col>
        </el-row>
      </div>
    </div>
    <div v-else :style="{ height: height + 'px', position: 'relative' }">
      <div
        :style="{
          height: height + 'px',
          background: 'url(' + no_model + ')',
          backgroundSize: 'cover',
        }"
      />
      <div
        style="
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        "
        :style="{ height: height + 'px', width: '100%' }"
      >
        <span style="color: #fff; font-size: 32px">请先上传模型</span>
      </div>
    </div>
    <!-- 巡检点弹出框 -->
    <el-drawer
      v-if="drawer"
      style="position: absolute; z-index: 5"
      custom-class="display-drawer"
      :modal="false"
      :visible.sync="drawer"
      :with-header="false"
      :wrapper-closable="false"
    >
      <div class="display-drawer-top">
        <img
          src="../../assets/images/close_model.png"
          alt=""
          class="close_model"
          @click="drawer = false"
        >
        <div class="top_title">{{ patrol_detail.patrol_name }}</div>
        <div class="frequency">
          <span>排查频率：</span>
          <span class="text">{{ patrol_rate[patrol_detail.patrol_rate] }}</span>
        </div>
        <div class="top_tab">
          <span
            class="tab_item"
            :class="{ checked_tab: drawer_choice === 1 }"
            @click="drawer_choice = 1"
          >巡检点详情</span>
          <span
            class="tab_item"
            :class="{ checked_tab: drawer_choice === 2 }"
            @click="drawer_choice = 2"
          >排查报告</span>
        </div>
      </div>
      <div v-show="drawer_choice === 1" class="display-drawer-bot">
        <div class="common_type_1">
          <div class="left">计划名称:</div>
          <div class="right">{{ patrol_detail.patrol_name }}</div>
        </div>
        <div class="common_type_1">
          <div class="left">排查内容:</div>
          <div class="right">{{ patrol_detail.patrol_content }}</div>
        </div>
        <div class="common_type_1">
          <div class="left">排查频率:</div>
          <div class="right">{{ patrol_rate[patrol_detail.patrol_rate] }}</div>
        </div>
        <div class="common_type_1">
          <div class="left">负责人:</div>
          <div class="right">{{ patrol_detail.user_name }}</div>
        </div>
      </div>
      <div
        v-show="drawer_choice === 2"
        class="display-drawer-bot"
        style="padding: 0"
      >
        <div style="padding: 0 14px; padding-top: 8px">
          <el-date-picker
            v-model="choice_time"
            value-format="yyyy-MM-dd"
            type="month"
            placeholder="选择月"
            @change="patrolReport_change_date"
          />
        </div>

        <div class="patrol_list" style="overflow-x: hidden">
          <el-scrollbar
            class="small-scrollbar"
            style="overflow-x: hidden"
            :style="{ height: height - 187 + 'px'}"
          >
            <div
              v-for="(item, index) in patrol_list"
              :key="index"
              class="patrol_item"
            >
              <div class="time">{{ formatDateTime(item.create_time) }}</div>
              <div class="patrol_item_bot">
                <div class="patrol_item_bot_item">
                  <span class="left">排查人:</span>
                  <span>{{ item.user_name }}</span>
                </div>
                <div class="patrol_item_bot_item">
                  <span class="left">排查结果:</span>
                  <span
                    v-show="item.patrol_status === '1'"
                    style="color: #4dcd70"
                  >正常</span>
                  <span
                    v-show="item.patrol_status !== '1'"
                    style="color: #f75a53"
                  >异常</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div v-show="totalPage > 1" class="page_control">
          <span
            class="last_page"
            :class="{ no_control_page: firstPage }"
            @click="last_page"
          >上一页</span>
          <span
            class="next_page"
            :class="{ no_control_page: lastPage }"
            @click="next_page"
          >下一页</span>
        </div>
      </div>
    </el-drawer>
    <!-- 建筑物弹出框 -->
    <el-drawer
      v-if="building_drawer"
      style="position: absolute; z-index: 5"
      custom-class="display-drawer"
      :modal="false"
      :visible.sync="building_drawer"
      :with-header="false"
      :wrapper-closable="false"
      direction="ltr"
    >
      <div class="display-drawer-top">
        <img
          src="../../assets/images/close_model.png"
          alt=""
          class="close_model"
          @click="building_drawer = false"
        >
        <div class="top_title">{{ buildingInfo.building_name }}</div>
        <div class="risk_text">
          <span
            v-if="buildingInfo.max_risk_rank === '1'"
            class="text"
            style="background: #ff3f55"
          >重大风险</span>
          <span
            v-if="buildingInfo.max_risk_rank === '2'"
            class="text"
            style="background: #ff843b"
          >较大风险</span>
          <span
            v-if="buildingInfo.max_risk_rank === '3'"
            class="text"
            style="background: #ffc93f"
          >一般风险</span>
          <span
            v-if="buildingInfo.max_risk_rank === '4'"
            class="text"
            style="background: #47c5ff"
          >低风险</span>
        </div>
        <div class="top_tab">
          <span
            class="tab_item"
            :class="{ checked_tab: building_choice === 1 }"
            @click="building_choice = 1"
          >风险构成</span>
          <span
            class="tab_item"
            :class="{ checked_tab: building_choice === 2 }"
            @click="building_choice = 2"
          >建筑信息</span>
        </div>
      </div>
      <div
        v-show="building_choice === 1"
        class="display-drawer-bot"
        style="padding: 0"
      >
        <div class="risk_composition" style="overflow-x: hidden">
          <el-scrollbar
            class="small-scrollbar"
            :style="{ height: height - 121 + 'px'}"
            style="overflow-x: hidden"
          >
            <div id="riskProfileChart" style="height: 195px" />
            <div class="risk_list_main">
              <div
                v-for="(item, index) in risk_array"
                :key="index"
                class="risk_item"
              >
                <div class="item_title" @click="item.expand=!item.expand">
                  <div class="left">

                    <img
                      src="../../assets/images/expand_arrow.png"
                      alt=""
                      class="arrow_img"
                    >
                    <span class="risk_identify" :style="{background: item.bg}" />
                    <span>{{ item.title }}</span>
                  </div>
                  <div class="right">{{ item.child.length }}个</div>
                </div>
                <div v-if="item.expand" class="item_content">
                  <div v-for="(opt, key) in item.child" :key="key">{{ opt.risk_name }}</div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div v-show="building_choice === 2" class="display-drawer-bot">
        <div class="common_type_1">
          <div class="left building_left">安全等级:</div>
          <div class="right building_right">
            {{ safty_level[buildingInfo.building_safety_level] }}
          </div>
        </div>
        <div class="common_type_1">
          <div class="left building_left">建筑面积(m2):</div>
          <div class="right building_right">
            {{ buildingInfo.building_area }}
          </div>
        </div>
        <div class="common_type_1">
          <div class="left building_left">建筑层数:</div>
          <div class="right building_right">
            {{ buildingInfo.floor_count }}
          </div>
        </div>
        <div class="common_type_1">
          <div class="left building_left">楼层高度(m):</div>
          <div class="right building_right">
            {{ buildingInfo.floor_height }}
          </div>
        </div>
        <div class="common_type_1">
          <div class="left building_left">建筑高度(m):</div>
          <div class="right building_right">
            {{ buildingInfo.building_height }}
          </div>
        </div>
        <div class="common_type_1">
          <div class="left building_left">建筑时间:</div>
          <div class="right building_right">
            {{ formatDate(buildingInfo.building_time) }}
          </div>
        </div>
        <div class="common_type_1">
          <div class="left building_left">管理员数(人):</div>
          <div class="right building_right">
            {{ buildingInfo.teacher_count }}
          </div>
        </div>
        <div class="common_type_1">
          <div class="left building_left">成员数(人):</div>
          <div class="right building_right">
            {{ buildingInfo.student_count }}
          </div>
        </div>
        <div class="common_type_1">
          <div class="left building_left">楼梯数:</div>
          <div class="right building_right">
            {{ buildingInfo.stairs_count }}
          </div>
        </div>
        <div class="common_type_1">
          <div class="left building_left">电梯数:</div>
          <div class="right building_right">{{ buildingInfo.lift_count }}</div>
        </div>
      </div>
    </el-drawer>
    <el-dialog
      style="position: absolute; z-index: 5; top: 0"
      :title="equ_name"
      width="65%"
      custom-class="display-dialog"
      :top="'5vh'"
      :visible.sync="showVideo"
      :close-on-click-modal="false"
      :modal="false"
      @close="closeLive"
      @opened="openLive"
    >
      <video ref="video" controls style="width: 100%" />
    </el-dialog>
  </div>
</template>
<script>
import { getBuildingRisk } from '@/api/risk_map'
import { getLabelList } from '@/api/school_label'
import {
  getBuildingList,
  getBuildingDetail,
  getBuildRisk
} from '@/api/building'
import { getPatrolDetail, getPatrolReport } from '@/api/patrol'
import { getPatrolRrate } from '@/api/dic'
import { get_camera_detail } from '@/api/device_manage_camera'
import * as Three from 'three'
import { OBJLoader } from 'three-obj-mtl-loader'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { mapGetters } from 'vuex'
import { getaccessKey } from '@/api/file_libray'
import { client } from '@/utils/ali-oss'
import cam_mark from '@/assets/icon/cam_mark.png'
import day_mark from '@/assets/icon/day_mark.png'
import week_mark from '@/assets/icon/week_mark.png'
import month_mark from '@/assets/icon/month_mark.png'
import season_mark from '@/assets/icon/season_mark.png'
import year_mark from '@/assets/icon/year_mark.png'
import Hls from 'hls.js'
import echarts from 'echarts'
import {
  initDate,
  getCurrentMonthLast,
  getCurrentMonthFirst,
  formatDateTime,
  formatDate
} from '@/utils/index'
export default {
  props: {
    threeId: {
      type: String,
      default: () => 'three_container'
    },
    url: {
      type: Object,
      default: () => {}
    },
    height: {
      type: Number,
      default: () => 480
    }
  },
  data() {
    return {
      top_title: '全校',
      showMenu: false,
      camera: null,
      cameraOrtho: null,
      cameraPerspective: null,
      scene: null,
      renderer: null,
      text: new Three.Sprite(),
      object: null,
      mouseVector: new Three.Vector3(),
      raycaster: new Three.Raycaster(),
      container: null,
      controls: null,
      controlsOrtho: null,
      controlsPerspective: null,
      width: 0,
      modelData: [],
      listData: [],
      nowUrl: this.url,
      cam_x: 0,
      cam_y: 0,
      cam_z: 0,
      building_info: [],
      color: {
        1: '#ff0000',
        2: '#ff7725',
        3: '#e6d300',
        4: '#2e9aff'
      },
      remarks: [],
      is_2d: false,
      show3D: true,
      no_model: require('@/assets/images/no_model.png'),
      loading: true,
      group: new Three.Group({ name: 'main_group' }),
      mouse_x: 0,
      mouse_y: 0,
      drawer: false,
      drawer_choice: 1,
      patrol_detail: {},
      patrol_rate: {},
      patrol_list: [],
      choice_time: initDate(new Date(), 'yyyy-MM-dd'),
      showVideo: false,
      hls: null,
      equ_name: '',
      page_num: 1,
      page_size: 10,
      firstPage: true,
      lastPage: true,
      totalPage: 1,
      building_drawer: false,
      building_choice: 1,
      buildingInfo: {},
      safty_level: {
        1: '一级',
        2: '二级',
        3: '三级'
      },
      risk_array: []
    }
  },
  computed: {
    ...mapGetters(['title'])
  },
  watch: {
    url() {
      if (this.url.url) {
        getaccessKey().then((res) => {
          this.nowUrl = client(
            res.data.accesskeyid,
            res.data.accesskeysecret,
            res.data.securitytoken
          ).signatureUrl(this.url.url.replace(/\\/g, '/'))
          this.cam_x = this.url.cam_init_x
          this.cam_y = this.url.cam_init_y
          this.cam_z = this.url.cam_init_z
          this.start()
        })
      } else {
        this.show3D = false
      }
    }
  },
  created() {
    // this.initData()
    window.addEventListener('resize', this.resize, false)
    this.getPatrolRate()
  },
  destroyed() {
    this.renderer.context.getExtension('WEBGL_lose_context').loseContext()
  },
  methods: {
    formatDateTime: formatDateTime,
    formatDate: formatDate,
    getPatrolRate() {
      getPatrolRrate().then((response) => {
        this.patrol_rate = response.data
      })
    },
    resize: function() {
      this.renderer.context.getExtension('WEBGL_lose_context').loseContext()
      this.init()
    },
    start: async function(flag) {
      await this.initData()
    },
    initData: function() {
      // 获取全校所有的模型，并组装成树
      getBuildingList().then((response) => {
        const data = response.data
        for (const i in data) {
          this.listData[data[i].id] = data[i]
        }
        const modelData = [
          {
            id: 'all_school',
            label: '全校',
            building_type: '1',
            children: this.listToTree(data, '0')
          }
        ]
        this.modelData = modelData
        this.getBuildingInfo()
      })
    },
    listToTree: function(data, parent) {
      const tree = []
      let temp = []
      for (var i = 0; i < data.length; i++) {
        if (data[i].parent_id === parent) {
          var obj = {
            id: data[i].id,
            label: data[i].building_name,
            building_type: data[i].building_type
          }
          temp = this.listToTree(data, data[i].id)
          if (temp.length > 0) {
            obj.children = temp
          }
          tree.push(obj)
        }
      }
      return tree
    },
    getBuildingInfo: function(id) {
      getBuildingRisk(id).then((response) => {
        const data = response.data
        const data_formated = {}
        data.forEach(function(item) {
          if (item.bind_model_name) {
            data_formated[item.bind_model_name] = item
          }
        })
        this.building_info = data_formated
        this.init()
      })
    },
    init: function() {
      this.container = document.getElementById(this.threeId)
      this.scene = new Three.Scene()

      const ambientLight = new Three.AmbientLight(0xffffff, 0.7)
      this.scene.add(ambientLight)
      const directionalLight = new Three.DirectionalLight(0xffffff, 0.3)
      directionalLight.position.set(1, 1, 0).normalize()
      this.scene.add(directionalLight)
      var manager = new Three.LoadingManager(this.loadModel)
      var loader = new OBJLoader(manager)
      loader.load(this.nowUrl, (obj) => {
      // loader.load('http://localhost:9527/aa.obj', (obj) => {
        this.object = obj
        this.group.add(obj)
      })
      this.renderer = new Three.WebGLRenderer({ antialias: true, alpha: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight
      )
      this.container.innerHTML = ''
      this.container.appendChild(this.renderer.domElement)
    },
    loadModel: function() {
      this.loading = false
      const b = new Three.Box3()
      b.expandByObject(this.object)
      this.drawPlane(b)
      this.object.traverse((child) => {
        if (child.isMesh) {
          child.material = new Three.MeshPhongMaterial()
          if (this.building_info.hasOwnProperty(child.name)) {
            child.geometry.computeBoundingBox()
            const rank_array = ['1', '2', '3', '4']
            rank_array.includes(this.building_info[child.name].risk_rank)
              ? child.material.color.set(
                this.color[this.building_info[child.name].risk_rank]
              )
              : child.material.color.set('#adedff')
            child.isBuilding = true
            child.riskRank = this.building_info[child.name].risk_rank
            child.buildingId = this.building_info[child.name].id
            // 在模型顶部创建标记
            const text = this.makeSprite(
              this.building_info[child.name].building_name
            )
            const point = this.getCenter(child.geometry.boundingBox)
            text.position.set(
              point.x + this.building_info[child.name].label_offset_x,
              point.y + this.building_info[child.name].label_offset_y,
              point.z + this.building_info[child.name].label_offset_z
            )
            this.scene.add(text)
            this.remarks.push(text)
          } else {
            child.material.color.set('#adedff')
          }
        }
      })
      // this.scene.add(this.object)

      const num = 100

      // 创建投影相机
      const aspect = this.container.clientWidth / this.container.clientHeight
      this.cameraPerspective = new Three.PerspectiveCamera(75, aspect, 1, 5000)
      this.cameraPerspective.position.z = this.cam_z * num
      this.cameraPerspective.position.y = this.cam_y * num
      this.cameraPerspective.position.x = this.cam_x * num
      this.scene.add(this.cameraPerspective)

      // 创建正交相机
      const number = 4 * num
      this.cameraOrtho = new Three.OrthographicCamera(
        -number * aspect,
        number * aspect,
        number,
        -number,
        1,
        5000
      )
      this.cameraOrtho.position.x = this.cam_x * num
      this.cameraOrtho.position.z = this.cam_z * num
      this.cameraOrtho.position.y = this.cam_y * num
      this.scene.add(this.cameraOrtho)

      this.camera = this.cameraPerspective

      // 设置投影相机用的控制器
      this.controlsPerspective = new MapControls(
        this.cameraPerspective,
        this.renderer.domElement
      )
      this.controlsPerspective.enablePan = true
      this.controlsPerspective.minDistance = 100
      this.controlsPerspective.maxDistance = 1000
      this.controlsPerspective.minPolarAngle = 0
      this.controlsPerspective.maxPolarAngle = Math.PI / 2.5

      // 设置正交相机用的控制器
      this.controlsOrtho = new MapControls(
        this.cameraOrtho,
        this.renderer.domElement
      )
      this.controlsOrtho.enablePan = true
      this.controlsOrtho.minZoom = 0.5
      this.controlsOrtho.maxZoom = 5000
      this.controlsOrtho.minPolarAngle = 0
      this.controlsOrtho.maxPolarAngle = 0

      // 在这里拉取标记，并将其展示在图上
      getLabelList().then((res) => {
        const data = res.data
        data.forEach((icon_data) => {
          const text = this.makeIcon(icon_data)
          text.position.set(
            icon_data.mark_x,
            icon_data.mark_y,
            icon_data.mark_z
          )
          const group = new Three.Object3D()
          group.name = 'icon_group'
          group.add(text)
          this.group.add(group)
        })
      })

      this.container.addEventListener(
        'mousedown',
        this.onDocumentMouseDown,
        false
      )
      this.container.addEventListener('mouseup', this.onDocumentMouseUp, false)

      this.scene.add(this.group)
      this.animate()
    },
    makeIcon: function(iconData) {
      const textureLoader = new Three.TextureLoader()
      let icon = null
      switch (iconData.mark_type) {
        case '1':
          switch (iconData.patrol_rate) {
            case '1':
              icon = day_mark
              break
            case '2':
              icon = week_mark
              break
            case '3':
              icon = month_mark
              break
            case '4':
              icon = season_mark
              break
            case '5':
              icon = year_mark
              break
          }
          break
        case '2':
          icon = cam_mark
          break
      }
      const sprite = textureLoader.load(icon)
      sprite.needsUpdate = true
      const material = new Three.SpriteMaterial({
        map: sprite,
        sizeAttenuation: false
      })
      const s = new Three.Sprite(material)
      // 这里把事件需要的参数给带上
      s.name = iconData.mark_id
      s.markType = iconData.mark_type
      s.relationId = iconData.relation_id
      s.isBuilding = false
      s.scale.set(0.08, 0.08, 1)
      return s
    },
    onDocumentMouseDown: function(e) {
      if (e.button !== 0) {
        return false
      }
      this.mouse_x = e.layerX
      this.mouse_y = e.layerY
    },
    onDocumentMouseUp: function(event) {
      if (event.button !== 0) {
        return false
      }
      if (
        event.button !== 0 ||
        this.mouse_x !== event.layerX ||
        this.mouse_y !== event.layerY
      ) {
        return false
      }
      const intersects = this.getIntersects(event.layerX, event.layerY)
      if (intersects.length < 1) {
        return false
      }
      const res = intersects.filter(function(res) {
        return res && res.object
      })[0]
      if (res.object.isBuilding) {
        getBuildingDetail(res.object.buildingId).then((response) => {
          this.building_choice = 1
          this.buildingInfo = response.data
          this.buildingInfo.max_risk_rank = res.object.riskRank
          this.building_drawer = true
          this.getBuildRisk(res.object.buildingId)
        })
      }
      if (res.object.relationId) {
        if (res.object.markType === '1') {
          getPatrolDetail(res.object.relationId).then((response) => {
            this.patrol_detail = response.data
            this.getPatrolReport()
            this.drawer_choice = 1
            this.choice_time = initDate(new Date(), 'yyyy-MM-dd')
            this.drawer = true
          })
        } else if (res.object.markType === '2') {
          get_camera_detail(res.object.relationId).then((response) => {
            this.equ_name = response.data.equ_name
            this.seeLive(response.data.hls)
          })
        }
      }
    },
    last_page() {
      if (!this.firstPage) {
        this.page_num--
        this.getPatrolReport()
      }
    },
    next_page() {
      if (!this.lastPage) {
        this.page_num++
        this.getPatrolReport()
      }
    },
    patrolReport_change_date() {
      this.page_num = 1
      this.totalPage = 1
      this.firstPage = true
      this.lastPage = true
      this.getPatrolReport()
    },
    getPatrolReport() {
      getPatrolReport(
        this.patrol_detail.id,
        getCurrentMonthFirst(this.choice_time) + '000000',
        getCurrentMonthLast(this.choice_time) + '235959',
        this.page_num,
        this.page_size
      ).then((res) => {
        this.patrol_list = res.data.list
        this.totalPage = res.data.totalPage
        this.firstPage = res.data.firstPage
        this.lastPage = res.data.lastPage
      })
    },
    getBuildRisk(id) {
      this.risk_array = [
        {
          risk_rank: '1',
          title: '重大风险',
          child: [],
          bg: '#FF3F55',
          expand: false
        },
        {
          risk_rank: '2',
          title: '较大风险',
          child: [],
          bg: '#FF843B',
          expand: false
        },
        {
          risk_rank: '3',
          title: '一般风险',
          child: [],
          bg: '#FFC93F',
          expand: false
        },
        {
          risk_rank: '4',
          title: '低风险',
          child: [],
          bg: '#47C5FF',
          expand: false
        }
      ]
      getBuildRisk(id).then((res) => {
        const myChart = echarts.init(
          document.getElementById('riskProfileChart')
        )
        res.data.build_risk_list.forEach((item) => {
          this.risk_array.forEach((opt) => {
            if (item.risk_rank === opt.risk_rank) {
              opt.child.push(item)
            }
          })
        })
        myChart.setOption({
          series: [
            {
              name: '访问来源',
              type: 'pie',
              label: {
                position: 'outside',
                align: 'left'
              },
              labelLine: {
                length: 2
              },
              radius: ['40%', '70%'],
              data: [
                {
                  value: this.risk_array[0].child.length === 0 ? null : this.risk_array[0].child.length,
                  name: '重大风险',
                  itemStyle: { color: '#FF3F55' }
                },
                {
                  value: this.risk_array[1].child.length === 0 ? null : this.risk_array[1].child.length,
                  name: '较大风险',
                  itemStyle: { color: '#FF843B' }
                },
                {
                  value: this.risk_array[2].child.length === 0 ? null : this.risk_array[2].child.length,
                  name: '一般风险',
                  itemStyle: { color: '#FFC93F' }
                },
                {
                  value: this.risk_array[3].child.length === 0 ? null : this.risk_array[3].child.length,
                  name: '低风险',
                  itemStyle: { color: '#47C5FF' }
                }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      })
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
    },
    getIntersects: function(x, y) {
      x = (x / this.container.clientWidth) * 2 - 1
      y = -(y / this.container.clientHeight) * 2 + 1
      this.mouseVector.set(x, y)
      this.raycaster.setFromCamera(this.mouseVector, this.camera)
      return this.raycaster.intersectObject(this.group, true)
    },
    drawPlane: function(box) {
      const border = 100
      const max_x = box.max.x
      const max_z = box.max.z
      const min_x = box.min.x
      const min_z = box.min.z
      const width = max_x - min_x + border
      const height = max_z - min_z + border
      const squareShape = new Three.Shape()
        .moveTo(0, 0)
        .lineTo(0, height)
        .lineTo(width, height)
        .lineTo(width, 0)
        .lineTo(0, 0)
      const geometry = new Three.ShapeBufferGeometry(squareShape)
      const mesh = new Three.Mesh(
        geometry,
        new Three.MeshPhongMaterial({
          color: new Three.Color(0x203c6e),
          side: Three.DoubleSide
        })
      )
      mesh.position.set(min_x - border / 2, -1, min_z - border / 2)
      mesh.rotation.set(Math.PI / 2, 0, 0)
      this.scene.add(mesh)
    },
    getCenter: function(box) {
      const max = box.max
      const min = box.min
      const point = {
        x: (max.x + min.x) / 2,
        y: max.y + 15,
        z: (max.z + min.z) / 2
      }
      return point
    },
    animate: function() {
      requestAnimationFrame(this.animate)
      this.controlsPerspective.update()
      this.controlsOrtho.update()
      this.renderer.render(this.scene, this.camera)
    },
    show: function() {
      this.showMenu = !this.showMenu
      this.$refs.silder_left.style.left = this.showMenu ? '0px' : '-300px'
    },
    changeModel: function(id) {
      if (id === 'all_school') {
        this.nowUrl = this.url
        this.top_title = '全校'
      } else {
        this.nowUrl = this.listData[id].model_url
        this.top_title = this.listData[id].building_name
      }
      this.init()
    },
    makeSprite: function(message) {
      const fontsize = 32
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 256
      const context = canvas.getContext('2d')
      const width = message.length * 32 + 20
      context.fillStyle = 'rgba(0, 0, 0, 0.8)'
      context.fillRect((256 - width) / 2, 85, width, 64)
      context.font = fontsize + 'px Arial'
      context.fillStyle = 'rgba(255, 255, 255, 1.0)'
      context.textAlign = 'center'
      context.fillText(message, 128, 128)
      const spriteMaterial = new Three.SpriteMaterial({
        map: new Three.CanvasTexture(canvas)
      })
      const TextSprite = new Three.Sprite(spriteMaterial)
      TextSprite.scale.set(100, 100, 1)
      return TextSprite
    },
    to2D: function() {
      this.camera = this.cameraOrtho
      this.is_2d = true
    },
    to3D: function() {
      this.camera = this.cameraPerspective
      this.is_2d = false
    }
  }
}
</script>
<style lang="scss" scoped>
.test_css {
  background-color: #050505;
  background: radial-gradient(ellipse at center, #1977bf 0%, #16388a 100%);
}
.silder_left {
  width: 300px;
  left: -300px;
  position: absolute;
  top: 0;
  background-color: #fff;
  z-index: 2;
  transition: left linear 0.2s;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.map_icon {
  height: 36px;
  width: 36px;
  cursor: pointer;
  position: absolute;
  top: 5px;
  z-index: 1;
  text-align: center;
  &:hover {
    border: 1px solid #3399ff;
    border-radius: 4px;
  }
  .icon_img {
    margin-top: 2px;
  }
}
.icon_2d {
  right: 50px;
}
.icon_3d {
  right: 10px;
}
.icon_selected {
  border: 1px solid #3399ff;
  border-radius: 4px;
}
.handle {
  position: absolute;
  right: -20px;
  cursor: pointer;
}
.arrow {
  position: absolute;
  right: 7px;
  top: 36px;
}
.arrow_hide {
  transform: rotate(180deg);
}
</style>
<style lang="scss">
.display-drawer {
  width: 280px !important;
  background: rgba(0, 0, 0, 0);
  .display-drawer-top {
    height: 121px;
    background: rgba(61, 77, 110, 0.9);
    border-bottom: 1px solid #64718c;
    position: relative;
    padding: 0 14px;
    .close_model {
      width: 18px;
      height: 18px;
      position: absolute;
      right: 14px;
      top: 5px;
      cursor: pointer;
    }
    .top_title {
      padding-top: 26px;
      font-size: 18px;
      color: #ffffff;
      line-height: 24px;
      font-weight: bold;
    }
    .risk_text {
      margin-top: 4px;
      .text {
        padding: 3px 4px;
        font-size: 12px;
        color: #fff;
        border-radius: 1px;
      }
    }
    .frequency {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      margin-top: 5px;
      .text {
        color: #66d2ff;
      }
    }
    .top_tab {
      margin-top: 14px;
      width: 252px;
      height: 28px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
      display: flex;
      text-align: center;
      align-items: center;
      .tab_item {
        flex: 1;
        cursor: pointer;
      }
      .checked_tab {
        width: 100%;
        height: 100%;
        background: #3399ff;
        border-radius: 4px 0px 0px 4px;
        line-height: 26px;
        color: #fff;
      }
    }
  }
  .display-drawer-bot {
    height: calc(100% - 121px);
    background: rgba(50, 66, 97, 0.9);
    padding: 16px 14px;
    font-size: 14px;
    .common_type_1 {
      display: flex;
      justify-content: space-between;
      line-height: 20px;
      margin-bottom: 10px;
      .left {
        width: 70px;
        color: rgba(255, 255, 255, 0.6);
      }
      .building_left {
        width: 95px;
      }
      .right {
        width: calc(100% - 70px);
        color: #3feeff;
        text-align: right;
      }
      .building_right {
        width: calc(100% - 95px);
      }
      &:last-of-type {
        margin-bottom: 0;
      }
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }
    .el-input--medium .el-input__inner {
      height: 28px;
      line-height: 28px;
      font-size: 14px;
      background: rgba(61, 77, 110, 0.9);
      border: 1px solid #64718c;
      color: #3399ff;
    }
    .el-input--medium .el-input__icon {
      line-height: 28px;
    }
    .patrol_list {
      padding: 0 14px;
      .patrol_item {
        width: 252px;
        height: 56px;
        background: rgba(68, 84, 117, 0.9);
        border-radius: 4px;
        margin-top: 8px;
        padding: 8px;
        color: rgba(255, 255, 255, 0.8);
        font-size: 12px;
        .patrol_item_bot {
          display: flex;
          margin-top: 8px;
          .patrol_item_bot_item {
            flex: 1;
            .left {
              color: rgba(255, 255, 255, 0.6);
            }
          }
        }
      }
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    .risk_composition {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      .risk_list_main {
        padding: 0 14px;
        .risk_item {
          background: rgba(68, 84, 117, 0.9);
          border-radius: 4px;
          margin-bottom: 8px;
          .item_title {
            font-size: 14px;
            color: #fff;
            display: flex;
            justify-content: space-between;
            padding: 0 5px;
            height: 28px;
            align-items: center;
            cursor: pointer;
            .left {
              display: flex;
              align-items: center;
              .arrow_img {
                width: 16px;
                height: 16px;
              }
              .risk_identify {
                display: inline-block;
                width: 12px;
                height: 12px;
                background: #ff3f55;
                border-radius: 2px;
                margin: 0 4px;
              }
            }
          }
          .item_content {
            padding: 0 23px;
            font-size: 14px;
            color: #45C7FF;
            line-height: 20px;
          }
        }
      }
    }
    .page_control {
      display: flex;
      line-height: 30px;
      .last_page,
      .next_page {
        flex: 1;
        text-align: center;
        cursor: pointer;
        color: rgba(255, 255, 255, 0.9);
        &:hover {
          color: #3399ff;
        }
      }
      .no_control_page {
        color: rgba(255, 255, 255, 0.5);
        &:hover {
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}
.threeview_display_main {
  .el-drawer__wrapper {
    z-index: 5 !important;
  }
}
.display-dialog {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  height: 410px;
  background: transparent;
  .el-dialog__header {
    height: 32px;
    line-height: 32px;
    background: #3d4d6e;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.16);
    border-bottom: none;
    .el-dialog__headerbtn {
      top: 6px;
    }
    .el-dialog__title {
      color: #ffffff;
      text-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
      font-size: 14px;
    }
  }
  .el-dialog__body {
    padding: 0;
    height: 378px;
  }
}
</style>
