/**
 * 底层网络请求封装
 */
import Vue from 'vue';
import axios from 'axios';
import { Tool, encryption, getTimestamp } from "./Tool.js";
import { getSign, nowTime, getToken, removeToken } from "./auth.js";
import { cancleHTTP } from "./env.js";
import router from '@/router.config'
Vue.prototype.$http = axios;
import store from '@/vuex/store'
import * as qiniu from 'qiniu-js'
var CancelToken = axios.CancelToken;

/*
 *form表单post提交
 */
export function httpFormPostMethod(methond, param, ishowload = true, appoint_url, integral = false) {
	let urls = "";
	let app_id = "";
	if (appoint_url) {
		urls = appoint_url + methond;
	} else {
		let baseUrl = "";
		const area = sessionStorage.area
		if (process.env.NODE_ENV == 'development') {
			switch (area) {
				case 'ha':
					// baseUrl = "http://192.168.1.189/app_api_pgsql/index.php/WebApi/api/"
					baseUrl = "http://192.168.1.189/app_api_pgsql/index.php/WebApi/api/"
					app_id = "d430ced51790d858d6fcc30b89eea39d"
					break;
					// baseUrl = "http://app.pajx.com.cn/app_api_v4/index.php/WebApi/api/"
					// app_id = "d430ced51790d858d6fcc30b89eea39d"
					// break;
				case 'he':
					baseUrl = "http://192.168.1.90:8080/api/"
					app_id = "9e46994f52584df8bee244cb078dd05a"
					break;
				case 'sn':
					// baseUrl = "https://sn.pajx.com.cn/api/"
					baseUrl = "http://192.168.1.123:8080/api/"
					// app_id = "9e46994f52584df8bee244cb078dd05a"
					// app_id = "bbdaa08ebfbd46f1953530911f7d98d7"
					app_id = sessionStorage.getItem("client_type") == '2' ? "28c0a7fb0e654a95b5921cb1b499dbb7" : 'bbdaa08ebfbd46f1953530911f7d98d7' // 教师端
					break;
				case 'sc':
					// baseUrl = "https://sc.pajx.com.cn/api/"
					baseUrl = "http://192.168.1.90:8082/api/" // 孙卫丹
					// baseUrl = "http://192.168.1.158:8080/api/"   // 伊振威
					app_id = sessionStorage.getItem("client_type") == '2' ? "cf70a7fb0e654a95b5921cb1b499dbb7" : '4e23e18582124afaa4e58fd45efd58f1' // 教师端
					// baseUrl = "http://192.168.1.222:8080/api/"
					// app_id = "4e23e18582124afaa4e58fd45efd58f1" // 家长端
					// baseUrl = "https://sc.pajx.com.cn/api/"
					// app_id = "4e23e18582124afaa4e58fd45efd58f1"
					break;
				case 'sd':
					baseUrl = "http://192.168.1.189/app_api_pgsql/index.php/WebApi/api/"
					app_id = "d430ced51790d858d6fcc30b89eea39d"
					break;
				default:
					baseUrl = ""
					app_id = ""
					break;
			}
			urls = baseUrl + methond;
		} else if (process.env.NODE_ENV == 'production') {
			switch (area) {
				case 'ha':  // 河南
					baseUrl = "http://app.pajx.com.cn/app_api_v4/index.php/WebApi/api/"
					app_id = "d430ced51790d858d6fcc30b89eea39d"
					break;
				case 'he':  // 河北
					baseUrl = "https://he.pajx.com.cn/api/"
					app_id = "c405855d0f4c427c90126c0ac51fc0a0"
					break;
				case 'sn':  // 陕西
					baseUrl = "https://sn.pajx.com.cn/api/"
					// app_id = "bbdaa08ebfbd46f1953530911f7d98d7" // 原家长appid
					app_id = sessionStorage.getItem("client_type") == '2' ? "28c0a7fb0e654a95b5921cb1b499dbb7" : 'bbdaa08ebfbd46f1953530911f7d98d7' // 教师端
					break;
				case 'sc': // 四川
					baseUrl = "https://sc.pajx.com.cn/api/"
					// app_id = "4e23e18582124afaa4e58fd45efd58f1" // 原家长appid
					app_id = sessionStorage.getItem("client_type") == '2' ? "cf70a7fb0e654a95b5921cb1b499dbb7" : '4e23e18582124afaa4e58fd45efd58f1' // 教师端
					break;
				case 'sd':   // 山东
					baseUrl = ""
					app_id = ""
					break;
				default:
					baseUrl = ""
					app_id = ""
					break;
			}
			urls = baseUrl + methond;
		}
	}
	if (ishowload) {
		Tool.loading();
	}
	let cancleHttp = new CancelToken(function executor(c) {
		cancleHTTP.push(c);
	});
	return new Promise((resolve, reject) => {
		axios({
			url: urls,
			method: 'post',
			cancelToken: cancleHttp,
			data: param,
			transformRequest: [data => {
				data['app_id'] = app_id
				data['timestamp'] = nowTime()
				data['token'] = getToken()
				data['sign'] = getSign(data)
				let ret = '';
				for (let it in param) {
					ret += encodeURIComponent(it) + '=' + encodeURIComponent(param[it]) + '&'
				}
				ret = ret.substr(0, ret.length - 1);
				return ret;
			}],
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			}
		})
			.then(response => {
				if (ishowload) {
					Tool.close();
				}
				if (response.status == 200) {
					if (response.data.status == 200) {
						resolve(response.data);
					} else if (response.data.status == 300) {
						Tool.alert(response.data.message, '', '', () => {
							store.commit('UPDATE_INCLUDE_PAGE', {
								pageName: "index",
								sign: false,
							});
							store.commit("UPDATE_INDEXTYPE", 1);
							removeToken();
							sessionStorage.removeItem("roles")
							sessionStorage.removeItem("area")
							router.push("/login")
						})
					} else if (integral && response.data.status == 303) {
						resolve(response.data);
					} else {
						Tool.tip(response.data.message)
					}
				}
			}, err => {
				Tool.tip(err.message)
				if (ishowload) {
					Tool.close();
				}
			})
			.catch((error) => {
				Tool.tip(error.message)
				if (ishowload) {
					Tool.close();
				}
				reject(error)
			});
	})
}

/**
 * 文件上传方法
 */
export function httpUploadFile(methond, param, file, ishowload = true, appoint_url) {
	let urls = ''
	let app_id = ''
	if (appoint_url) {
		urls = appoint_url + methond;
	} else {
		let baseUrl = "";
		const area = sessionStorage.area
		if (process.env.NODE_ENV == 'development') {
			switch (area) {
				case 'ha':
					// baseUrl = "http://192.168.1.189/app_api_pgsql/index.php/WebApi/api/"
					baseUrl = "http://192.168.1.189/app_api_pgsql/index.php/WebApi/api/"
					app_id = "d430ced51790d858d6fcc30b89eea39d"
					break;
					// baseUrl = "http://app.pajx.com.cn/app_api_v4/index.php/WebApi/api/"
					// app_id = "d430ced51790d858d6fcc30b89eea39d"
					// break;
				case 'he':
					baseUrl = "http://192.168.1.90:8080/api/"
					app_id = "9e46994f52584df8bee244cb078dd05a"
					break;
				case 'sn':
					baseUrl = "http://192.168.1.123:8080/api/"
					// baseUrl = "https://sn.pajx.com.cn/api/"
					// app_id = "bbdaa08ebfbd46f1953530911f7d98d7" // 原
					app_id = sessionStorage.getItem("client_type") == '2' ? "28c0a7fb0e654a95b5921cb1b499dbb7" : 'bbdaa08ebfbd46f1953530911f7d98d7' // 教师端
					break;
				case 'sc':
					baseUrl = "http://192.168.1.90:8082/api/"
					// baseUrl = "https://sc.pajx.com.cn/api/"
					// app_id = "4e23e18582124afaa4e58fd45efd58f1" // 原
					app_id = sessionStorage.getItem("client_type") == '2' ? "cf70a7fb0e654a95b5921cb1b499dbb7" : '4e23e18582124afaa4e58fd45efd58f1' // 教师端
					break;
				case 'sd':
					baseUrl = "http://192.168.1.189/app_api_pgsql/index.php/WebApi/api/"
					app_id = "d430ced51790d858d6fcc30b89eea39d"
					break;
				default:
					baseUrl = ""
					app_id = ""
					break;
			}
			urls = baseUrl + methond;
		} else if (process.env.NODE_ENV == 'production') {
			switch (area) {
				case 'ha':  // 河南
					baseUrl = "http://app.pajx.com.cn/app_api_v4/index.php/WebApi/api/"
					app_id = "d430ced51790d858d6fcc30b89eea39d"
					break;
				case 'he':  // 河北
					baseUrl = "https://he.pajx.com.cn/api/"
					app_id = "c405855d0f4c427c90126c0ac51fc0a0"
					break;
				case 'sn':  // 陕西
					baseUrl = "https://sn.pajx.com.cn/api/"
					app_id = sessionStorage.getItem("client_type") == '2' ? "28c0a7fb0e654a95b5921cb1b499dbb7" : 'bbdaa08ebfbd46f1953530911f7d98d7' // 教师端
					break;
				case 'sc': // 四川
					baseUrl = "https://sc.pajx.com.cn/api/"
					app_id = sessionStorage.getItem("client_type") == '2' ? "cf70a7fb0e654a95b5921cb1b499dbb7" : '4e23e18582124afaa4e58fd45efd58f1' // 教师端
					// app_id = "4e23e18582124afaa4e58fd45efd58f1"
					break;
				case 'sd':   // 山东
					baseUrl = ""
					app_id = ""
					break;
				default:
					baseUrl = ""
					app_id = ""
					break;
			}
			urls = baseUrl + methond;
		}
	}
	if (ishowload) {
		Tool.loading();
	}
	let cancleHttp = new CancelToken(function executor(c) {
		cancleHTTP.push(c);
	});
	let data = {
		app_id: app_id,
		timestamp: nowTime(),
		token: getToken(),
		stu_id: param.stu_id
	}
	let formData = new FormData()
	formData.append('app_id', data.app_id)
	formData.append('timestamp', data.timestamp)
	formData.append('token', data.token)
	formData.append('sign', getSign(data))
	for (let v in param) {
		formData.append(v, param[v])
	}
	return new Promise((resolve, reject) => {
		axios({
			url: urls,
			method: 'post',
			cancelToken: cancleHttp,
			data: formData,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			}
		})
			.then(response => {
				if (ishowload) {
					Tool.close();
				}
				if (response.status == 200) {
					if (response.data.status == 200) {
						resolve(response.data);
					} else if (response.data.status == 300) {
						Tool.alert(response.data.message, '', '', () => {
							store.commit('UPDATE_INCLUDE_PAGE', {
								pageName: "index",
								sign: false,
							});
							store.commit("UPDATE_INDEXTYPE", 1);
							removeToken();
							sessionStorage.removeItem("roles")
							sessionStorage.removeItem("area")
							router.push("/login")
						})
					} else {
						Tool.tip(response.data.message)
					}
				}
			}, err => {
				Tool.tip(err.message)
				if (ishowload) {
					Tool.close();
				}
			})
			.catch((error) => {
				Tool.tip(error.message)
				if (ishowload) {
					Tool.close();
				}
				reject(error)
			});
	})
}

/** 七牛云存储 **/
export function uploadQinuImage(file, pic_token) {
	let key = encryption(getTimestamp())
	let observable = qiniu.upload(file, key, pic_token)
	return new Promise((resolve, reject) => {
		observable.subscribe({
			error: err => {
				reject(err)
			},
			complete: res => {
				resolve(res.key)
			}
		})
	})

}
