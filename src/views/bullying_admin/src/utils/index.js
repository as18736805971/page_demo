/**
 * Created by PanJiaChen on 16/11/18.
 */
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}/{m}/{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function date_str_to_time(time_string) {
  if (!time_string) {
    return ''
  }
  time_string = time_string.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3')
  const timestamp = new Date(time_string + ' 00:00:00')
  return timestamp
}

export function formatDateTime(time) {
  return time ? time.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1-$2-$3 $4:$5:$6') : ''
}

export function unformatDateTime(time_string) {
  if (!time_string) {
    return ''
  }
  return time_string.replace(/ /g, '').replace(/-/g, '').replace(/:/g, '')
}

export function formatDate(time) {
  return time ? time.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3') : ''
}

export function getDateString(date, fmt) {
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
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url === null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export function formatMenuTree(menus) {
  const level_one = {}
  const level_two = {}
  const level_three = {}
  // 这里图省事儿，直接分成四步走
  // 1.把三级菜单分别放进三个对象中
  menus.forEach(menu => {
    menu.level = menu.menu_level
    if (menu.menu_level === 1) {
      level_one[menu.menu_id] = menu
    } else if (menu.menu_level === 2) {
      level_two[menu.menu_id] = menu
    } else {
      level_three[menu.menu_id] = menu
    }
  })
  // 2.把第三级菜单塞入第二级中
  if (Object.getOwnPropertyNames(level_three).length > 0 && Object.getOwnPropertyNames(level_two).length > 0) {
    for (const i in level_three) {
      if (level_two.hasOwnProperty(level_three[i].menu_pid)) {
        if (!level_two[level_three[i].menu_pid].hasOwnProperty('children')) {
          level_two[level_three[i].menu_pid].children = []
        }
        level_two[level_three[i].menu_pid].children.push(level_three[i])
      }
    }
  }
  // 3.把第二级菜单塞入第一级中
  if (Object.getOwnPropertyNames(level_two).length > 0 && Object.getOwnPropertyNames(level_one).length > 0) {
    for (const i in level_two) {
      if (level_one.hasOwnProperty(level_two[i].menu_pid)) {
        if (!level_one[level_two[i].menu_pid].hasOwnProperty('children')) {
          level_one[level_two[i].menu_pid].children = []
        }
        level_one[level_two[i].menu_pid].children.push(level_two[i])
      }
    }
  }
  // 4.把第一级菜单放入菜单树数组中
  const tree = []
  for (const i in level_one) {
    tree.push(level_one[i])
  }
  return tree
}

export function formatMenuAuth(data) {
  // 建立菜单与权限之间的树形
  const menu = data.menuList
  const fp = data.allFpList
  const menuTree = []
  // 第一步，先把权限塞进菜单里面
  for (const i in menu) {
    for (const j in fp) {
      if (menu[i].menu_id === fp[j].menu_id) {
        if (!menu[i].hasOwnProperty('children')) {
          menu[i].children = []
        }
        const tmp = {
          id: fp[j].fp_id,
          level: 4,
          label: fp[j].fp_name,
          desc: fp[j].fp_desc,
          code: fp[j].fp_code
        }
        menu[i].children.push(tmp)
      }
    }
  }
  const level_one = {}
  const level_two = {}
  const level_three = {}
  // 这里图省事儿，直接分成四步走
  // 1.把三级菜单分别放进三个对象中
  menu.forEach(item => {
    item.level = item.menu_level
    if (item.menu_level === 1) {
      level_one[item.menu_id] = item
    } else if (item.menu_level === 2) {
      level_two[item.menu_id] = item
    } else {
      level_three[item.menu_id] = item
    }
  })
  // 2.把第三级菜单塞入第二级中
  if (Object.getOwnPropertyNames(level_three).length > 0 && Object.getOwnPropertyNames(level_two).length > 0) {
    for (const i in level_three) {
      if (level_two.hasOwnProperty(level_three[i].menu_pid)) {
        if (!level_two[level_three[i].menu_pid].hasOwnProperty('children')) {
          level_two[level_three[i].menu_pid].children = []
        }
        const tmp = {
          id: level_three[i].menu_id,
          label: level_three[i].menu_name,
          level: 3,
          children: level_three[i].children
        }
        level_two[level_three[i].menu_pid].children.push(tmp)
      }
    }
  }
  // 3.把第二级菜单塞入第一级中
  if (Object.getOwnPropertyNames(level_two).length > 0 && Object.getOwnPropertyNames(level_one).length > 0) {
    for (const i in level_two) {
      if (level_one.hasOwnProperty(level_two[i].menu_pid)) {
        if (!level_one[level_two[i].menu_pid].hasOwnProperty('children')) {
          level_one[level_two[i].menu_pid].children = []
        }
        const tmp = {
          id: level_two[i].menu_id,
          label: level_two[i].menu_name,
          level: 2,
          children: level_two[i].children
        }
        level_one[level_two[i].menu_pid].children.push(tmp)
      }
    }
  }
  // 4.把第一级菜单放入菜单树数组中
  for (const i in level_one) {
    const tmp = {
      id: level_one[i].menu_id,
      label: level_one[i].menu_name,
      level: 1,
      children: level_one[i].children
    }
    menuTree.push(tmp)
  }

  const checked = []
  data.hsFpList.forEach(item => {
    checked.push(item.fp_id)
  })
  const return_data = {
    menuTree: menuTree,
    authChecked: checked,
    authSelected: data.hsFpList
  }
  return return_data
}

export function getQuery(name) {
  let search = window.location.search
  if (search.indexOf('?') >= 0) search = search.substr(1)
  var params = search.match(new RegExp('(^|&)' + name + '=([^&]*)(&|$)'))
  if (params != null && params.length > 2) return window.unescape(params[2])
  return ''
}

export function processAttach(files) {
  const data = {}
  let attachment_url = ''
  let attachment_name = ''
  let attachment_ext = ''
  for (const i in files) {
    attachment_url += files[i].attachment_url + '|'
    attachment_name += files[i].attachment_name + '|'
    attachment_ext += files[i].attachment_ext + '|'
  }
  data.attachment_url = attachment_url.substring(0, attachment_url.length - 1)
  data.attachment_name = attachment_name.substring(0, attachment_name.length - 1)
  data.attachment_ext = attachment_ext.substring(0, attachment_ext.length - 1)
  return data
}

export function formatClass(result) {
  // 这里直接循环两次来拼年级班级信息，比递归循环的次数少，先拼年级，再拼班级
  var grade_list = {}
  for (var i in result) {
    if (grade_list.hasOwnProperty(result[i].hxy_gra_id)) {
      continue
    }
    grade_list[result[i].hxy_gra_id] = {
      hxy_gra_id: result[i].hxy_gra_id,
      gra_name: result[i].gra_name,
      classes: []
    }
  }
  for (var c in result) {
    if (result[i].hxy_cls_id === null) {
      continue
    }
    var class_tmp = {
      hxy_cls_id: result[c].hxy_cls_id,
      cls_name: result[c].cls_name
    }
    grade_list[result[c].hxy_gra_id].classes.push(class_tmp)
  }
  return grade_list
}

export function checkShowName(name, show_name) {
  var str = name || '--'
  if (show_name && name !== show_name) {
    str += '(' + show_name + ')'
  }
  return str
}

export function formatDormTreeObject(data) {
  var frame = {}
  for (var i in data) {
    if (frame.hasOwnProperty(data[i].bld_id)) {
      var floor_id = data[i].room_name.substr(0, 2)
      if (frame[data[i].bld_id].children.hasOwnProperty(floor_id)) {
        frame[data[i].bld_id].children[floor_id].children[data[i].room_id] = {
          name: data[i].room_name + '(' + data[i].room_show_name + ')',
          id: data[i].room_id,
          type: 'room',
          data: data[i],
          bld_id: data[i].bld_id
        }
      } else {
        floor_id = data[i].room_name.substr(0, 2)
        frame[data[i].bld_id].children[floor_id] = {
          name: floor_id + '层',
          id: floor_id,
          type: 'floor',
          spread: false,
          bld_id: data[i].bld_id,
          data: {},
          children: {}
        }
        frame[data[i].bld_id].children[floor_id].children[data[i].room_id] = {
          name: data[i].room_name + '(' + data[i].room_show_name + ')',
          id: data[i].room_id,
          bld_id: data[i].bld_id,
          type: 'room',
          data: data[i]
        }
      }
    } else {
      frame[data[i].bld_id] = {
        name: data[i].bld_name + '(' + data[i].bld_show_name + ')',
        id: data[i].bld_id,
        bld_id: data[i].bld_id,
        type: 'build',
        data: data[i],
        spread: 'true',
        children: {}
      }
      if (data[i].room_id != null) {
        floor_id = data[i].room_name.substr(0, 2)
        frame[data[i].bld_id].children[floor_id] = {
          name: floor_id + '层',
          id: floor_id,
          bld_id: data[i].bld_id,
          type: 'floor',
          spread: false,
          data: {},
          children: {}
        }
        frame[data[i].bld_id].children[floor_id].children[data[i].room_id] = {
          name: data[i].room_name + '(' + data[i].room_show_name + ')',
          id: data[i].room_id,
          bld_id: data[i].bld_id,
          type: 'room',
          data: data[i]
        }
      }
    }
  }
  return frame
}

export function formatDormTreeArray(frame) {
  var tree = []
  var build_tmp = {}
  for (var i in frame) {
    build_tmp = frame[i]
    var floor = build_tmp.children
    var tmp_floor = []
    var build_id = frame[i].id
    for (var j in floor) {
      var tmp_room = []
      var room = floor[j].children
      var floor_id = floor[j].id
      for (var k in room) {
        var tmp_r = {
          id: build_id + '|' + floor_id + '|' + room[k].id,
          parentId: build_id + '|' + floor_id,
          type: 'room',
          label: room[k].name,
          data: room[k].data
        }
        tmp_room.push(tmp_r)
      }
      var tmp_f = {
        id: build_id + '|' + floor_id,
        parentId: build_id,
        label: floor[j].name,
        type: 'floor',
        children: tmp_room
      }
      tmp_floor.push(tmp_f)
    }
    var tmp_b = {
      label: frame[i].name,
      children: tmp_floor,
      id: build_id,
      type: 'build',
      parentId: 0,
      data: frame[i].data
    }
    tree.push(tmp_b)
  }
  return tree
}

export function formatClassTreeArray(frame) {
  var tree = []
  for (var k in frame) {
    var cls_list = frame[k].classes
    var cls_arr = []
    for (var c in cls_list) {
      var cls = {
        label: cls_list[c].cls_name,
        hxy_gra_id: frame[k].hxy_gra_id,
        hxy_cls_id: cls_list[c].hxy_cls_id,
        type: 'cls'
      }
      cls_arr.push(cls)
    }
    var obj = {
      label: frame[k].gra_name,
      hxy_gra_id: frame[k].hxy_gra_id,
      children: cls_arr,
      type: 'gra'
    }
    tree.push(obj)
  }
  return tree
}

export function getToday(frame) {
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  return year + '-' + month + '-' + strDate
}

export function formatArea(city_data, area_pcode) {
  var city_list = []
  for(var i in city_data){
    if(city_data[i].area_pcode === area_pcode){
      var newNode = {
        area_pcode: city_data[i].area_pcode,
        area_code: city_data[i].area_code,
        area_name: city_data[i].area_name,
        sub_area: formatArea(city_data, city_data[i].area_code)
      };
      if(newNode.sub_area.length == 0){
        delete newNode.sub_area;
      }
      city_list.push(newNode); 
    }
  }
  return city_list
}

export function getTimestamp() {
  return Date.parse(new Date()).toString().substring(0, 10)
}

