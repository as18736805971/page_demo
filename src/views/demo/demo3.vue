<template>
  <div class="page-index">
    <div class="demo">
      <div class="bpmn_canvas" ref="bpmn-canvas"></div>
    </div>
  </div>
</template>

<script>
import BpmnModeler from "bpmn-js/lib/Modeler"
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
      ]
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
  methods: {
    initBpmnModeler() {
      if (this.bpmnModeler) return
      this.bpmnModeler = new BpmnModeler({
        container: this.$refs["bpmn-canvas"],
        keyboard: this.keyboard ? { bindTo: document } : null,
        additionalModules: this.additionalModules
      });
      console.log(this.bpmnModeler, 'bpmnModeler')
      // 实例创建后 传递
      // this.$emit("init-finished", this.bpmnModeler);
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
</style>
