import Vue from 'vue'

import store from './vuex/store'

import App from './App'

import router from './router.config'

import Mint from 'mint-ui'

import 'mint-ui/lib/style.css'

import './common/rem.js'

import { Tool } from './common/Tool'

import { getToken, getQuery } from '@/common/auth' // get token from cookie

import * as filters from '@/filters' // global filters

import '@/common/wxFont.js'

import preview from 'vue-photo-preview'

import 'vue-photo-preview/dist/skin.css'

import VueScroller from 'vue-scroller'
Vue.use(VueScroller)

Vue.config.productionTip = false;

let options = {
	fullscreenEl: false, //关闭全屏按钮
	clickToCloseNonZoomable: true,
	tapToClose: true, //点击滑动区域应关闭图库
}
Vue.use(preview, options)

const history = window.sessionStorage
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
router.beforeEach(function (to, from, next) {
	// 修改每个单页面路由标题
	window.document.title = to.meta.title

	const hasToken = getToken()
	if (store.state.loading) {
		Tool.close();
		next(false);
		return;
	}
	const toIndex = history.getItem(to.path)
	const fromIndex = history.getItem(from.path)
	if (toIndex) {
		if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
			store.commit('UPDATE_DIRECTION', 'forward')
		} else {
			store.commit('UPDATE_DIRECTION', 'reverse')
			history.removeItem(from.path)
		}
	} else {
		++historyCount
		history.setItem('count', historyCount)
		to.path !== '/' && history.setItem(to.path, historyCount)
		store.commit('UPDATE_DIRECTION', 'forward')
	}
	if (/\/http/.test(to.path)) {
		let url = to.path.split('http')[1]
		window.location.href = `http${url}`
	} else {
		if (to.query.token || hasToken) {
			if (to.path === '/login') {
				next({ path: '/' })
			} else {
				next();
			}

		} else {
			if (to.path === '/login') {
				next();
			} else {
				next("/login");
			}

		}

	}

})

Vue.use(Mint)

Vue.filter('dateFormate', function (date, formate) {
	return Tool.formate(date, formate)
})
// register global utility filters
Object.keys(filters).forEach(key => {
	Vue.filter(key, filters[key])
})

Vue.prototype.$selectPass = new Vue();

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {
		App
	}
})
