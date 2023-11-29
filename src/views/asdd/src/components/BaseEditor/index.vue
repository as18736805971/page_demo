<template>
  <div style="border: 1px solid #E6E7EB;">
    <Toolbar
      style="border-bottom: 1px solid #E6E7EB"
      :editor="editor"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <Editor
      v-model="html"
      style="overflow-y: hidden;"
      :style="{ height: height + 'px' }"
      :default-config="{
        placeholder: placeholder,
        readOnly:readOnly,
        autoFocus: autoFocus,
        MENU_CONF: menu_config
      }"
      :mode="mode"
      @onCreated="onCreated"
      @onChange="onChange"
    />
  </div>
</template>

<script>
// import { DomEditor } from '@wangeditor/editor'
// import { uploadQinuImage } from '@/utils/auth'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
// import { Message } from 'element-ui'

/**
 * 配置自定义方法
 */
const menu_config = {}

// 自定义选择图片上传
menu_config['uploadImage'] = {
  async customUpload(file, insertFn) {
    // const pic_url = process.env.VUE_APP_PIC_URL
    // if (file.type === 'image/jpeg' || file.type === 'image/png') {
    //   uploadQinuImage(file).then((key) => {
    //     const url = pic_url + key
    //     insertFn(url, file.name, url)
    //   })
    // } else {
    //   Message({
    //     message: '请上传.png,.jpg图片类型文件',
    //     type: 'error'
    //   })
    // }
  }
}

export default {
  name: 'BaseEditor',
  components: { Editor, Toolbar },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 输入内容
    value: {
      type: [String, Number],
      default: ''
    },
    // 默认文本框高度
    height: {
      type: [Number],
      default: 500
    },
    // 输入文字提示
    placeholder: {
      type: String,
      default: '请输入文本内容...'
    },
    // 是否只读
    readOnly: {
      type: Boolean,
      default: false
    },
    // 是否默认选中输入
    autoFocus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editor: null,
      html: '',
      toolbarConfig: {
        // 隐藏工具栏其他菜单
        excludeKeys: ['uploadVideo', 'fullScreen', 'codeBlock', 'insertTable', 'todo']
      },
      menu_config,
      mode: 'default'
    }
  },
  watch: {
    value: function(value) {
      if (value !== this.html) {
        this.html = this.value
      }
    }
  },
  created() {
    this.html = this.value
  },
  // 组件销毁时，及时销毁编辑器
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy()
  },
  methods: {
    // 编辑器创建完毕时的回调函数。
    onCreated(editor) {
      this.editor = Object.seal(editor)
    },
    // 内容修改
    onChange(editor) {
      this.$emit('change', this.html)
      // 查看工具栏配置参数
      // const toolbar = DomEditor.getToolbar(editor)
      // const curToolbarConfig = toolbar.getConfig()
      // console.log(curToolbarConfig.toolbarKeys)
    }
  }
}
</script>
