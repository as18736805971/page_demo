<template>
  <div>
    <div v-if="show3D" v-loading="loading" element-loading-text="正在加载3D图" style="position: relative; overflow: hidden">
      <div style="position: absolute;top: 10px;z-index: 99;left: 10px;color: #FFFFFF; font-size: 22px;z-index: 1;">
        <svg-icon style="color:#fff;margin-right: 12px;" icon-class="screen-school" />{{ title }}
      </div>
      <div :id="threeId" :style="{height: height + 'px', position:'relative'}" class="test_css" />
      <div style="display:flex;justify-content:space-between;width:400px;left:calc((100% - 400px)/2);position: absolute;bottom:10px;background-color:#162E74;padding:8px;color:#fff;font-size:14px;border:1px solid rgba(255, 255, 255, 0.1);border-radius:4px;">
        <div style="display:flex;align-items:center"><i style="display:inline-block; width:14px;height:14px;background-color:#ff0000; margin-right:5px;" />重大风险</div>
        <div style="display:flex;align-items:center"><i style="display:inline-block; width:14px;height:14px;background-color:#ff7725; margin-right:5px;" />较大风险</div>
        <div style="display:flex;align-items:center"><i style="display:inline-block; width:14px;height:14px;background-color:#e6d300; margin-right:5px;" />一般风险</div>
        <div style="display:flex;align-items:center"><i style="display:inline-block; width:14px;height:14px;background-color:#2e9aff; margin-right:5px;" />低风险</div>
      </div>
    </div>
    <div v-else :style="{height: height + 'px', position:'relative'}">
      <div :style="{height: height + 'px', background: 'url(' + no_model +')', backgroundSize: 'cover'}" />
      <div style="position:absolute; top:0;left:0; display:flex; justify-content: center; align-items: center" :style="{height: height + 'px', width: '100%'}">
        <span style="color: #fff; font-size: 32px;">请先上传模型</span>
      </div>
    </div>
  </div>
</template>
<script>
import { getBuildingRisk } from '@/api/risk_map'
import { getBuildingList } from '@/api/building'
import * as Three from 'three'
import { OBJLoader } from 'three-obj-mtl-loader'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { mapGetters } from 'vuex'
import { getaccessKey } from '@/api/file_libray'
import { client } from '@/utils/ali-oss'
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
      scene: null,
      renderer: null,
      text: new Three.Sprite(),
      object: null,
      mouseVector: new Three.Vector3(),
      container: null,
      controls: null,
      controlsOrtho: null,
      controlsPerspective: null,
      width: 0,
      modelData: [],
      listData: [],
      nowUrl: this.url,
      building_info: [],
      cam_x: 0,
      cam_y: 0,
      cam_z: 0,
      color: {
        '1': '#ff0000',
        '2': '#ff7725',
        '3': '#e6d300',
        '4': '#2e9aff'
      },
      remarks: [],
      no_model: require('@/assets/images/no_model.png'),
      loading: true,
      show3D: true
    }
  },
  computed: {
    ...mapGetters([
      'title'
    ])
  },
  watch: {
    url() {
      if (JSON.stringify(this.url) !== '{}') {
        getaccessKey().then(res => {
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
  },
  destroyed() {
    this.renderer.context.getExtension('WEBGL_lose_context').loseContext()
  },
  methods: {
    resize: function() {
      this.renderer.context.getExtension('WEBGL_lose_context').loseContext()
      this.init()
    },
    start: async function(flag) {
      await this.initData()
    },
    initData: function() {
      // 获取全校所有的模型，并组装成树
      getBuildingList().then(response => {
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
      getBuildingRisk(id).then(response => {
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
      })
      this.renderer = new Three.WebGLRenderer({ antialias: true, alpha: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
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
            rank_array.includes(this.building_info[child.name].risk_rank) ? child.material.color.set(this.color[this.building_info[child.name].risk_rank]) : child.material.color.set('#adedff')
            // 在模型顶部创建标记
            const text = this.makeSprite(this.building_info[child.name].building_name)
            const point = this.getCenter(child.geometry.boundingBox)
            text.position.set(point.x + this.building_info[child.name].label_offset_x, point.y + this.building_info[child.name].label_offset_y, point.z + this.building_info[child.name].label_offset_z)
            this.scene.add(text)
            this.remarks.push(text)
          } else {
            child.material.color.set('#adedff')
          }
        }
      })
      this.scene.add(this.object)

      const num = 100

      // 创建投影相机
      const aspect = this.container.clientWidth / this.container.clientHeight
      this.camera = new Three.PerspectiveCamera(75, aspect, 1, 5000)
      this.camera.position.z = this.cam_z * num
      this.camera.position.y = this.cam_y * num
      this.camera.position.x = this.cam_x * num
      this.scene.add(this.camera)

      // 设置投影相机用的控制器
      this.controlsPerspective = new MapControls(this.camera, this.renderer.domElement)
      this.controlsPerspective.enablePan = true
      this.controlsPerspective.autoRotate = true
      this.controlsPerspective.autoRotateSpeed = 1.5
      this.controlsPerspective.minDistance = 100
      this.controlsPerspective.maxDistance = 2000
      this.controlsPerspective.minPolarAngle = 0
      this.controlsPerspective.maxPolarAngle = Math.PI / 2.5

      this.animate()
    },
    drawPlane: function(box) {
      const border = 100
      const max_x = box.max.x
      const max_z = box.max.z
      const min_x = box.min.x
      const min_z = box.min.z
      const width = max_x - min_x + border
      const height = max_z - min_z + border
      const squareShape = new Three.Shape().moveTo(0, 0).lineTo(0, height).lineTo(width, height).lineTo(width, 0).lineTo(0, 0)
      const geometry = new Three.ShapeBufferGeometry(squareShape)
      const mesh = new Three.Mesh(geometry, new Three.MeshPhongMaterial({ color: new Three.Color(0x203c6e), side: Three.DoubleSide }))
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
      const spriteMaterial = new Three.SpriteMaterial({ map: new Three.CanvasTexture(canvas) })
      const TextSprite = new Three.Sprite(spriteMaterial)
      TextSprite.scale.set(100, 100, 1)
      return TextSprite
    }
  }
}
</script>
<style lang="scss" scoped>
  .test_css {
    background-color: #050505;
    background: radial-gradient(ellipse at center,  #1977BF 0%,#16388A 100%);
  }
  .silder_left{
    width: 300px;
    left: -300px;
    position:absolute;
    top: 0;
    background-color: #fff;
    z-index: 2;
    transition: left linear .2s;
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
    .icon_img{
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
  .handle{
    position: absolute;
    right: -20px;
    cursor: pointer;
  }
  .arrow{
    position: absolute;
    right: 7px;
    top: 36px;
  }
  .arrow_hide{
    transform: rotate(180deg);
  }
</style>
