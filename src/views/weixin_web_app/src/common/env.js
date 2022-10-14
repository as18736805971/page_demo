/**
 * 配置编译环境和线上环境之间的切换
 *
 * 以及静态变量
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 *
 */
let pic_url = '';

let routerMode = 'hash';

let DEBUG = false;

let cancleHTTP = [];//取消请求头设置

if (process.env.NODE_ENV == 'development') {
	pic_url = "http://img.pajx.com.cn/"
	DEBUG = true;
} else if (process.env.NODE_ENV == 'production') {
	// 正式环境
	pic_url = "http://img.pajx.com.cn/"
	DEBUG = false;
}

export {
	pic_url,
	routerMode,
	DEBUG,
	cancleHTTP
}
