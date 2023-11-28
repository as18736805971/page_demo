import Vue from 'vue'
import DialogView from './index.vue'
export const AllDialog = {}
const componentParse = async(component) => {
  const type = Object.prototype.toString.call(component)
  let view
  switch (type) {
    case '[object Module]':
      view = component.default
      break
    case '[object Promise]':
      const res = await component
      view = res.default
      break
    default:
      view = component
      break
  }
  return view
}
class BaseDialog {
  constructor(component) {
    this._component = component
    this._resolve
    this._close
    this._componentData = {}
    this._dialogWidth = '50%'
    this._dialogLocation = 'center'
    this._dialogClassName = ''
    this._dialogTitle
    this._dialogFooter
    this._dialogSave
    this._dialogCancel
    this._modalShow = false
    this._global = {}
  }

  /**
   * 传递给内部页面的数据
   * @param d
   * @returns {Dialog}
   */
  data(d) {
    this._componentData = d
    return this
  }

  /**
   * 弹窗宽度
   * @param w
   * @returns {Dialog}
   */
  width(w) {
    this._dialogWidth = w
    return this
  }

  /**
   * 弹窗位置
   * @param w
   * @returns {Dialog}
   */
  location(l) {
    this._dialogLocation = l
    return this
  }

  /**
   * 弹窗附加的类名
   * @param c
   * @returns {Dialog}
   */
  className(c) {
    this._dialogClassName = c
    return this
  }

  /**
   * 弹窗标题
   * @param t
   * @returns {Dialog}
   */
  title(t) {
    this._dialogTitle = t
    return this
  }

  size(s) {
    this._size = s
    return this
  }

  /**
   * 不显示底部按钮
   * @returns {Dialog}
   */
  noFooter() {
    this._dialogFooter = false
    return this
  }

  global(k, v) {
    this._global[k] = v
    return this
  }

  /**
   * 显示弹窗
   * @returns {Dialog}
   */
  show() {
    const dom = document.createElement('div')
    document.body.appendChild(dom)
    const tmpl = Vue.extend(DialogView)
    componentParse(this._component).then((view) => {
      // 弹窗标题 优先级 方法设置 > 页面设置
      let title = view.title || '弹窗标题'
      if (this._dialogTitle) {
        title = this._dialogTitle
      }
      // 是否显示底部按钮 默认显示 优先级 方法设置 > 页面设置
      let footer = true
      if (this._dialogFooter !== undefined) {
        footer = this._dialogFooter
      } else if (view.hasOwnProperty('dialogFooterShow')) {
        footer = view.dialogFooterShow
      }
      const opt = {
        data: {
          show: true,
          footerShow: footer,
          title: title,
          component: view,
          data: this._componentData,
          width: this._dialogWidth,
          location: this._dialogLocation,
          className: this._dialogClassName,
          modalShow: this._modalShow,
          global: this._global,
          save: this._dialogSave || '保存',
          cancel: this._dialogCancel || '取消',
          size: this._size || ''
        }
      }
      for (const k in this._global) {
        opt[k] = this._global[k]
      }
      const vm = new tmpl(opt).$mount(dom)
      vm.callBack = (res, close = true) => {
        if (close) {
          vm && vm.close && vm.close()
        }
        this._resolve && this._resolve(res)
      }
      vm.closeBack = (res, close = true) => {
        if (close) {
          vm && vm.close && vm.close()
        }
        this._close && this._close()
      }
    })
    return this
  }

  /**
   * 取消按钮显示文字
   * @param a
   * @returns {Dialog}
   */
  cancelBtnText(a) {
    this._dialogCancel = a
    return this
  }

  /**
   * 保存按钮显示文字
   * @param e
   * @returns {Dialog}
   */
  saveBtnText(e) {
    this._dialogSave = e
    return this
  }

  /**
   * 弹窗回调方法
   * @param callBack
   * @returns {Dialog}
   */
  then(callBack) {
    this._resolve = callBack
    return this
  }

  /**
   * 弹窗点击关闭按钮回调方法
   * @param callBack
   * @returns {Dialog}
   */
  close(callBack) {
    this._close = callBack
    return this
  }

  /**
   * 是否可以通过点击 modal 关闭 Dialog
   */
  modal() {
    this._modalShow = true
    return this
  }
}
export default BaseDialog
