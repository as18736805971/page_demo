/**
 * 在此封装各种工具类的方法
 */
import Vue from 'vue';
import md5 from 'js-md5'
import moment from 'moment'
import { Indicator, Toast, MessageBox } from 'mint-ui'; // 加载提示框  消息提示框  弹出式提示框

/*
 * 公共变量
 * */
export let Tool = {

	/*
	 * 提示信息，有确定按钮，参数可配置
	 * message：提示信息
	 * title：提示标题。可不填
	 * showCancelButton：默认false，布尔值
	 * scuessfun：确定按钮的回调
	 * cancelfun：取消按钮的回调
	 * */

	alert: function (message, title, showCancelButton, scuessfun, cancelfun, closeOnClickModal = false, confirmButtonText = '确定', cancelButtonText = '取消') {
		MessageBox({
			title: title || "",
			message: message,
			showCancelButton: showCancelButton,
			confirmButtonText: confirmButtonText,
			cancelButtonText: cancelButtonText,
			closeOnClickModal: closeOnClickModal
		}).then(action => {
			if (action === "confirm") {
				if (scuessfun) {
					scuessfun();
				}
			} else {
				if (cancelfun) {
					cancelfun();
				}
			}
		});
	},
	/*
	 * 自定义弹出框内容
	 */
	prompt: function (option, scuessfun, cancelfun) {
		MessageBox(option).then(action => {
			if (action === "confirm") {
				if (scuessfun) {
					scuessfun();
				}
			} else {
				if (cancelfun) {
					cancelfun();
				}
			}
		});
	},
	/*
	 'snake'
	'fading-circle' //默认
	'double-bounce'
	'triple-bounce'
	 * */
	loading: function (texts, spinnerType) {
		Indicator.open({
			text: texts || "",
			spinnerType: spinnerType || "fading-circle"
		});
	},

	close: function () {
		Indicator.close();
	},

	tip: function (message, duration, fun) {
		var instance = Toast({
			message: message
		});
		duration = duration ? duration : 3000;
		setTimeout(() => {
			instance.close();
			if (fun) {
				fun()
			}
		}, duration);
	},

	//处理时间的方法
	formate: function (data, format) {
		data = new Date(data);
		var o = {
			"M+": data.getMonth() + 1, //month
			"d+": data.getDate(), //day
			"h+": data.getHours(), //hour
			"m+": data.getMinutes(), //minute
			"s+": data.getSeconds(), //second
			"q+": Math.floor((data.getMonth() + 3) / 3), //quarter
			"S": data.getMilliseconds() //millisecond
		}
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	},

	getDateString: function (date, fmt) {
		var o = {
			'M+': date.getMonth() + 1,
			'd+': date.getDate(),
			'h+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds()
		}
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
		}
		for (var k in o) {
			if (new RegExp('(' + k + ')').test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
			}
		}
		return fmt
	},

	/*
	时间段选取
	日期类型 timetype：1 今天  2 本周  3 本月  4 今年
	传入日期参数 data
	日期格式 timeformat
	*/
	timeslot: function (timetype, data, timeformat) {
		data = new Date(data);
		var start = '',
			end = '',
			oneday = 1000 * 60 * 60 * 24,
			getday = data.getDay(),
			getmonth = data.getMonth(),
			getyear = data.getFullYear();
		switch (timetype) {
			case 1:
				start = data;
				end = data;
				break;
			case 2:
				start = new Date(data.getTime() - (getday - 1) * oneday);
				end = new Date(data.getTime() + (7 - getday) * oneday);
				break;
			case 3:
				start = new Date(getyear, getmonth, 1);
				end = new Date(new Date(getyear, getmonth + 1, 1).getTime() - oneday);
				break;
			case 4:
				start = new Date(getyear, 0, 1);
				end = new Date(getyear, 11, 31);
				break;
			default:
				start = new Date(getyear, getmonth, 1);
				end = data;
				break;
		}
		if (start) {
			start = Tool.formate(start, timeformat);
			end = Tool.formate(end, timeformat);
		}
		return {
			start: start,
			end: end
		}
	},
	/*
	 *设置刷新列表的最小高度
	 */
	minh: h => {
		let point = 20 * document.documentElement.clientWidth / 375;
		return document.documentElement.clientHeight / point - h + 'rem';
	},
	getHoursDiff: function (sDate2, sDate1) {
		var diff = new Date(sDate1).getTime() - new Date(sDate2).getTime()
		var iDays = Math.floor(diff / (24 * 3600 * 1000))  // 计算相差天数
		var level1 = diff % (24 * 3600 * 1000)
		var hours = Math.floor(level1 / (3600 * 1000))    // 计算相差小时数
		var level2 = level1 % (3600 * 1000)
		var minutes = Math.floor(level2 / (60 * 1000))    // 计算相差分钟数
		var level3 = level2 % (60 * 1000)
		var seconds = Math.floor(level3 / 1000)    // 计算相差秒数
		if (iDays > 0) {
			if (minutes > 0) {
				hours += 1
			}
			return iDays + '天' + hours + '小时'
		} else {
			if (hours > 0) {
				return hours + '小时' + minutes + '分钟'
			} else {
				if (minutes > 0) {
					return minutes + '分钟' + seconds + '秒'
				} else {
					return seconds + '秒'
				}

			}
		}
	},
	switchTime: time => {
		let date = new Date(time);
		return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0) + ' ' + date.getHours().toString().padStart(2, 0) + ':' + date.getMinutes().toString().padStart(2, 0) + ':00';
	},
	// 中国日期格式化 'YYYY-MM-DD HH:mm:ss'
	chinaFormatStr: function (val) {
		return moment(val).format('YYYY-MM-DD HH:mm:ss')
	},
	// 日期格式格式化为字符串
	handleFormatStr: function (val) {
		let str = ''
		val = val.split(' ')
		val[0].split('-').map((item) => {
			str += item
		})
		val[1].split(':').map((item) => {
			str += item
		})
		return str += '00'
	},
	handleFormat: function (val) {
		let str = ''
		val = val.split(' ')
		val[0].split('-').map((item) => {
			str += item
		})
		val[1].split(':').map((item) => {
			str += item
		})
		return str
	},
	// 日期格式格式化为字符串  20220129183525
	formatDate: function (val) {
		let pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
		return val.replace(pattern, '$1-$2-$3 $4:$5:$6');
	},
}

/**
 * 将base64转换为File文件类型
 * @param urlData  base64 地址
 * @param imgName  文件名
 * @returns {File}
 */
export function dataURLtoFile(urlData, imgName) {
	let arr = urlData.split(',')
	let mime = arr[0].match(/:(.*?);/)[1]
	let bstr = atob(arr[1])
	let n = bstr.length
	let u8arr = new Uint8Array(n)
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}
	return new File([u8arr], imgName, { type: mime })
}

/**
 * 压缩图片
 * @param file 文件地址
 * @returns {Promise<unknown>}
 */
export function compressImg(file, options){
	var files;
	var read = new FileReader();
	read.readAsDataURL(file);
	return new Promise(function(resolve, reject){
		read.onload = function (e) {
			var img = new Image();
			img.src = e.target.result;
			img.onload = function(){
				//默认按比例压缩
				var w = this.width,
					h = this.height,
					scale = w / h;
				w = options.width || w;
				h = options.height || (w / scale);
				//生成canvas
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				var base64;
				// 创建属性节点
				canvas.setAttribute("width", w);
				canvas.setAttribute("height", h);
				ctx.drawImage(this, 0, 0, w, h);
				base64 = canvas.toDataURL(file['type'], options.quality);
				// 回调函数返回file的值（将base64编码转成file）
				files = dataURLtoFile(base64, file.name);
				resolve(files)
			};
		};
	})
}

/**
 * md5加密
 */
export function encryption (string) {
	function md5_RotateLeft (lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
	}
	function md5_AddUnsigned (lX, lY) {
		var lX4, lY4, lX8, lY8, lResult
		lX8 = (lX & 0x80000000)
		lY8 = (lY & 0x80000000)
		lX4 = (lX & 0x40000000)
		lY4 = (lY & 0x40000000)
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
			}
		} else {
			return (lResult ^ lX8 ^ lY8)
		}
	}
	function md5_F (x, y, z) {
		return (x & y) | ((~x) & z)
	}
	function md5_G (x, y, z) {
		return (x & z) | (y & (~z))
	}
	function md5_H (x, y, z) {
		return (x ^ y ^ z)
	}
	function md5_I (x, y, z) {
		return (y ^ (x | (~z)))
	}
	function md5_FF (a, b, c, d, x, s, ac) {
		a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac))
		return md5_AddUnsigned(md5_RotateLeft(a, s), b)
	}
	function md5_GG (a, b, c, d, x, s, ac) {
		a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac))
		return md5_AddUnsigned(md5_RotateLeft(a, s), b)
	}
	function md5_HH (a, b, c, d, x, s, ac) {
		a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac))
		return md5_AddUnsigned(md5_RotateLeft(a, s), b)
	}
	function md5_II (a, b, c, d, x, s, ac) {
		a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac))
		return md5_AddUnsigned(md5_RotateLeft(a, s), b)
	}
	function md5_ConvertToWordArray (string) {
		var lWordCount
		var lMessageLength = string.length
		var lNumberOfWords_temp1 = lMessageLength + 8
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16
		var lWordArray = Array(lNumberOfWords - 1)
		var lBytePosition = 0
		var lByteCount = 0
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4
			lBytePosition = (lByteCount % 4) * 8
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition))
			lByteCount++
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4
		lBytePosition = (lByteCount % 4) * 8
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
		return lWordArray
	}
	function md5_WordToHex (lValue) {
		var WordToHexValue = ''
		var WordToHexValue_temp = ''
		var lByte
		var lCount
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255
			WordToHexValue_temp = '0' + lByte.toString(16)
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2)
		}
		return WordToHexValue
	}
	function md5_Utf8Encode (string) {
		string = string.replace(/\r\n/g, '\n')
		var utftext = ''
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n)
			if (c < 128) {
				utftext += String.fromCharCode(c)
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192)
				utftext += String.fromCharCode((c & 63) | 128)
			} else {
				utftext += String.fromCharCode((c >> 12) | 224)
				utftext += String.fromCharCode(((c >> 6) & 63) | 128)
				utftext += String.fromCharCode((c & 63) | 128)
			}
		}
		return utftext
	}
	var x = []
	var k
	var AA
	var BB
	var CC
	var DD
	var a
	var b
	var c
	var d
	var S11 = 7
	var S12 = 12
	var S13 = 17
	var S14 = 22
	var S21 = 5
	var S22 = 9
	var S23 = 14
	var S24 = 20
	var S31 = 4
	var S32 = 11
	var S33 = 16
	var S34 = 23
	var S41 = 6
	var S42 = 10
	var S43 = 15
	var S44 = 21
	string = md5_Utf8Encode(string)
	x = md5_ConvertToWordArray(string)
	a = 0x67452301
	b = 0xEFCDAB89
	c = 0x98BADCFE
	d = 0x10325476
	for (k = 0; k < x.length; k += 16) {
		AA = a
		BB = b
		CC = c
		DD = d
		a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
		d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
		c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
		b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
		a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
		d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
		c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
		b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
		a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
		d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
		c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
		b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
		a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
		d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
		c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
		b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821)
		a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
		d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
		c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
		b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
		a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
		d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453)
		c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
		b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
		a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
		d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
		c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
		b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
		a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
		d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
		c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
		b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
		a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
		d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
		c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
		b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
		a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
		d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
		c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
		b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
		a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
		d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
		c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
		b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
		a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
		d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
		c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
		b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
		a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244)
		d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
		c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
		b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
		a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
		d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
		c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
		b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
		a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
		d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
		c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314)
		b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
		a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
		d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
		c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
		b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391)
		a = md5_AddUnsigned(a, AA)
		b = md5_AddUnsigned(b, BB)
		c = md5_AddUnsigned(c, CC)
		d = md5_AddUnsigned(d, DD)
	}
	return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase()
}

/**
 * 获取时间戳
 */
export function getTimestamp () {
	return Date.parse(new Date()).toString().substring(0, 10)
}
