<template>
  <div :id="threeId" v-loading="loading" element-loading-text="正在加载模型图" style="position:relative" class="test_css" />
</template>

<script>
import * as Three from 'three'
import { OBJLoader } from 'three-obj-mtl-loader'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
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
    buildingInfo: {
      type: Object,
      default: () => {}
    },
    canSelect: {
      type: Boolean,
      default: () => false
    },
    selected: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      text: new Three.Sprite(),
      object: null,
      selectedObject: null,
      raycaster: new Three.Raycaster(),
      mouseVector: new Three.Vector3(),
      container: null,
      controls: null,
      remarks: [],
      loading: true,
      now_url: '',
      cam_x: 0,
      cam_y: 0,
      cam_z: 0
    }
  },
  watch: {
    url() {
      this.now_url = this.url.url
      this.cam_x = this.url.cam_init_x
      this.cam_y = this.url.cam_init_y
      this.cam_z = this.url.cam_init_z
      this.init()
    },
    selected() {
      this.object.traverse((child) => {
        if (child.isMesh) {
          child.material = new Three.MeshPhongMaterial()
          if (child.name === this.selected) {
            child.material.color.set('#3399FF')
          } else {
            child.material.color.set('#adedff')
          }
        }
      })
    },
    buildingInfo() {
      this.disposeText()
      this.initObj()
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    this.renderer.context.getExtension('WEBGL_lose_context').loseContext()
  },
  methods: {
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
      loader.load(this.now_url, (obj) => {
      // loader.load('http://localhost:9527/aa.obj', (obj) => {
        this.object = obj
      })
    },
    disposeText: function() {
      this.remarks.forEach(item => {
        this.scene.remove(item)
      })
    },
    initObj: function() {
      this.object.traverse((child) => {
        if (child.isMesh) {
          child.material = new Three.MeshPhongMaterial()
          if (this.buildingInfo && this.buildingInfo.hasOwnProperty(child.name)) {
            child.geometry.computeBoundingBox()
            // 在模型顶部创建标记
            const text = this.makeSprite(this.buildingInfo[child.name].building_name)
            const point = this.getCenter(child.geometry.boundingBox)
            text.position.set(point.x + this.buildingInfo[child.name].label_offset_x, point.y + this.buildingInfo[child.name].label_offset_y, point.z + this.buildingInfo[child.name].label_offset_z)
            this.scene.add(text)
            this.remarks.push(text)
          }
          if (child.name === this.selected) {
            child.material.color.set('#3399FF')
          } else {
            child.material.color.set('#adedff')
          }
        }
      })
    },
    loadModel: function() {
      this.loading = false
      const b = new Three.Box3()
      b.expandByObject(this.object)
      this.drawPlane(b)
      this.initObj()
      this.scene.add(this.object)
      // const width = b.max.x - b.min.x
      // const height = b.max.z - b.min.z
      // const max = Math.max(width, height)
      // const num = Math.pow(10, Math.floor(max).toString().length - 1) / 10
      const num = 100
      this.camera = new Three.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 1, 5000)
      this.camera.position.z = this.cam_z * num
      this.camera.position.y = this.cam_y * num
      this.camera.position.x = this.cam_x * num
      this.scene.add(this.camera)
      this.renderer = new Three.WebGLRenderer({ antialias: true, alpha: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      this.container.innerHTML = ''
      this.container.appendChild(this.renderer.domElement)
      this.container.addEventListener('mousedown', this.onDocumentMouseDown, false)
      this.controls = new MapControls(this.camera, this.renderer.domElement)
      this.controls.enablePan = true
      this.controls.minZoom = -100
      this.controls.maxZoom = 100
      this.controls.minPolarAngle = 0
      this.controls.maxPolarAngle = Math.PI / 2.5
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
    onDocumentMouseDown: function(e) {
      if (!this.canSelect) {
        return false
      }
      const intersects = this.getIntersects(event.layerX, event.layerY)
      if (intersects.length > 0) {
        const res = intersects.filter(function(res) {
          return res && res.object
        })[0]
        if (res && res.object) {
          if (this.buildingInfo.hasOwnProperty(res.object.name)) {
            return false
          }
          this.object.traverse((child) => {
            if (child.isMesh) {
              child.material.color.set('#adedff')
            }
          })
          this.selectedObject = res.object
          this.selectedObject.material.color.set('#3399FF')
          this.$emit('updateSelected', res.object.name)
        }
      }
    },
    getIntersects: function(x, y) {
      x = (x / this.container.clientWidth) * 2 - 1
      y = -(y / this.container.clientHeight) * 2 + 1
      this.mouseVector.set(x, y)
      this.raycaster.setFromCamera(this.mouseVector, this.camera)
      return this.raycaster.intersectObject(this.object, true)
    },
    animate: function() {
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
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
</style>
