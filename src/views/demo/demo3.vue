<template>
  <div class="page-index">
    <div class="btn" @click="onSee()">预览</div>
    <div class="btn" @click="onSubmit()">保存</div>
    <div class="demo">
      <div class="bpmn_canvas" ref="bpmn-canvas"></div>
    </div>

    <!-- 预览 -->
    <div class="block_item" v-if="show_see"></div>
    <div class="process-viewer" v-if="show_see">
      <div class="process-canvas" style="height: 100%" ref="processCanvas" v-show="!isLoading" />
      <div class="btn" style="position: absolute; top: 20px; left: 0;" @click="onClose()">关闭</div>
      <div style="position: absolute; top: 20px; right: 20px;">
        <div style="display: flex; justify-content: flex-end;align-items: center">
          <div class="btn" @click="processZoomOut()">缩小</div>
          <div>{{ Math.floor(this.defaultZoom * 10 * 10) + "%" }}</div>
          <div class="btn" @click="processZoomIn()">放大</div>
          <div class="btn" @click="processReZoom()">重置适应</div>
        </div>
        <!--<el-row type="flex" justify="end">
          <el-button-group key="scale-control" size="medium">
            <el-button size="medium" type="default" :plain="true" :disabled="defaultZoom <= 0.3" icon="el-icon-zoom-out" @click="processZoomOut()" />
            <el-button size="medium" type="default" style="width: 90px;">{{ Math.floor(this.defaultZoom * 10 * 10) + "%" }}</el-button>
            <el-button size="medium" type="default" :plain="true" :disabled="defaultZoom >= 3.9" icon="el-icon-zoom-in" @click="processZoomIn()" />
            <el-button size="medium" type="default" icon="el-icon-c-scale-to-original" @click="processReZoom()" />
            <slot />
          </el-button-group>
        </el-row>-->
      </div>
    </div>
  </div>
</template>

<script>
// 编辑流程图
import BpmnModeler from "bpmn-js/lib/Modeler"
// 预览流程图
import BpmnViewer from 'bpmn-js/lib/Viewer'
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas'
// 初始xml流程图
import DefaultEmptyXML from "../../utils/plugins/defaultEmpty"
// 英文翻译中文
import customTranslate from "../../utils/plugins/translate/customTranslate"
import translationsCN from "../../utils/plugins/translate/zh"
export default {
  name: "demo3",
  data() {
    return {
      bpmnModeler: null,
      previewResult: '', // 存储xml数据
      value: '', // 刚开始初始化xml数据
      namespace: '', // 类别
      events: [
        'element.click',
        'connection.added',
        'connection.removed',
        'connection.changed'
      ],
      show_see: false,
      // 是否正在加载流程图
      isLoading: false,
      defaultZoom: 1,
      bpmnViewer: undefined,
    }
  },
  computed: {
    additionalModules() {
      const Modules = []
      // 翻译模块
      const TranslateModule = {
        translate: ["value", customTranslate(translationsCN)]
      }
      Modules.push(TranslateModule)
      return Modules;
    }
  },
  mounted() {
    this.initBpmnModeler()
    this.createNewDiagram(this.value)
  },
  // 页面销毁时 清除流程图
  destroyed() {
    this.clearViewer()
  },
  methods: {
    initBpmnModeler() {
      if (this.bpmnModeler) return
      this.bpmnModeler = new BpmnModeler({
        container: this.$refs["bpmn-canvas"],
        keyboard: this.keyboard ? { bindTo: document } : null,
        additionalModules: this.additionalModules
      });
      this.initModelListeners()
    },
    initModelListeners() {
      const EventBus = this.bpmnModeler.get("eventBus");
      const that = this;
      // 注册需要的监听事件, 将. 替换为 - , 避免解析异常
      this.events.forEach(event => {
        EventBus.on(event, function(eventObj) {
          let eventName = event.replace(/\./g, "-");
          let element = eventObj ? eventObj.element : null;
          that.$emit(eventName, element, eventObj);
          that.$emit('event', eventName, element, eventObj);
        });
      });
      // 监听图形改变返回xml
      EventBus.on("commandStack.changed", async event => {
        try {
          let { xml } = await this.bpmnModeler.saveXML({ format: true });
          this.$emit("commandStack-changed", event);
          this.$emit("input", xml);
          this.$emit("change", xml);
        } catch (e) {
          console.error(`[Process Designer Warn]: ${e.message || e}`);
        }
      });
      // 监听视图缩放变化
      this.bpmnModeler.on("canvas.viewbox.changed", ({ viewbox }) => {
        this.$emit("canvas-viewbox-changed", { viewbox });
        const { scale } = viewbox;
        this.defaultZoom = Math.floor(scale * 100) / 100;
      });

    },
    /* 创建新的流程图 */
    async createNewDiagram(xml) {
      // 将字符串转换成图显示出来
      let newId = `id_${new Date().getTime()}`;
      let newName =  `名称_${new Date().getTime()}`;
      let xmlString = xml || DefaultEmptyXML(newId, newName, this.namespace);
      try {
        let { warnings } = await this.bpmnModeler.importXML(xmlString);
        if (warnings && warnings.length) {
          warnings.forEach(warn => console.warn(warn));
        }
      } catch (e) {
        console.error(`[Process Designer Warn]: ${e.message || e}`);
      }
    },
    // 预览时 重置到 100%
    processReZoom() {
      this.defaultZoom = 1;
      this.bpmnViewer.get('canvas').zoom('fit-viewport', 'auto');
    },
    // 预览时 缩小
    processZoomIn(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 100 + zoomStep * 100) / 100;
      if (newZoom > 4) {
        throw new Error('[Process Designer Warn ]: The zoom ratio cannot be greater than 4');
      }
      this.defaultZoom = newZoom;
      this.bpmnViewer.get('canvas').zoom(this.defaultZoom);
    },
    // 预览时 放大
    processZoomOut(zoomStep = 0.1) {
      let newZoom = Math.floor(this.defaultZoom * 100 - zoomStep * 100) / 100;
      if (newZoom < 0.2) {
        throw new Error('[Process Designer Warn ]: The zoom ratio cannot be less than 0.2');
      }
      this.defaultZoom = newZoom;
      this.bpmnViewer.get('canvas').zoom(this.defaultZoom);
    },
    // 流程图预览清空
    clearViewer() {
      if (this.$refs.processCanvas) {
        this.$refs.processCanvas.innerHTML = ''
      }
      if (this.bpmnViewer) {
        this.bpmnViewer.destroy()
      }
      this.bpmnViewer = null
    },
    // 显示流程图
    async importXML(xml) {
      this.clearViewer();
      if (xml != null && xml !== '') {
        try {
          this.bpmnViewer = new BpmnViewer({
            additionalModules: [MoveCanvasModule],
            container: this.$refs.processCanvas,
          });
          this.isLoading = true
          await this.bpmnViewer.importXML(xml)
        } catch (e) {
          this.clearViewer()
        } finally {
          this.isLoading = false
        }
      }
    },
    // 预览
    onSee() {
      this.show_see = true
      this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
        this.$nextTick(() => {
          this.importXML(xml)
        })
      })
    },
    // 关闭预览
    onClose() {
      this.show_see = false
      this.clearViewer()
    },
    // 保存流程图数据
    onSubmit() {
      return new Promise((resolve, reject) => {
        if (this.bpmnModeler == null) {
          reject();
        }
        this.bpmnModeler.saveXML({ format: true }).then(({ xml }) => {
          console.log(xml, '需要传递的xml数据')
          resolve(xml);
        });
      })
    }
  }
}
</script>

<style scoped>
.demo {
  width: 100%;
  height: 800px;
}
.bpmn_canvas {
  width: 100%;
  height: 100%;
}
.block_item {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000000;
}
.process-viewer {
  position: fixed;
  height: 800px;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  opacity:1;
}
.btn {
  margin-left: 20px;
  width: 80px;
  height: 30px;
  background: #3BCCFF;
  color: #ffffff;
  line-height: 30px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
}
</style>
