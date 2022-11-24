import Vue from 'vue'
import DialogView from './index.vue'
export const AllDialog = {}
const componentParse = async (component) => {
    let type = Object.prototype.toString.call(component)
    let view
    switch (type) {
        case '[object Module]':
            view = component.default
            break
        case '[object Promise]':
            let res = await component
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
        this._componentData = {}
        this._dialogWidth = '50%'
        this._dialogClassName = ''
        this._dialogTitle
        this._dialogFooter
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

    size800x600() {
        this._size = 'dialog_size_800_600'
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
        let dom = document.createElement('div')
        document.body.appendChild(dom)
        let tmpl = Vue.extend(DialogView)
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
            let opt = {
                data: {
                    show: true,
                    footerShow: footer,
                    title: title,
                    component: view,
                    data: this._componentData,
                    width: this._dialogWidth,
                    className: this._dialogClassName,
                    global: this._global,
                    size: this._size || ''
                }
            }
            for (let k in this._global) {
                opt[k] = this._global[k]
            }
            let vm = new tmpl(opt).$mount(dom)
            vm.callBack = (res, close = true) => {
                if (close) {
                    vm && vm.close && vm.close()
                }
                this._resolve && this._resolve(res)
            }
        })
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
}
export default BaseDialog
