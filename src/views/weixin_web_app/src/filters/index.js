// import parseTime, formatTime and set to filter
/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function fgTime(datestring) {
  if (datestring) {
    return datestring.substr(0, 4) + '/' + datestring.substr(4, 2) + '/' + datestring.substr(6, 2) + ' ' + datestring.substr(8, 2) + ':' + datestring.substr(10, 2) + ':' + datestring.substr(12, 2)
  }
}

export function fgTimeMin(datestring) {
  if (datestring) {
    return datestring.substr(0, 4) + '/' + datestring.substr(4, 2) + '/' + datestring.substr(6, 2) + ' ' + datestring.substr(8, 2) + ':' + datestring.substr(10, 2)
  }
}

export function fgAccurateTime(datestring) {
  if (datestring) {
    return datestring.substr(8, 2) + ':' + datestring.substr(10, 2)
  }
}

export function interceptName(value) {
  if (value) {
    if (value.length > 2) {
      return value.substring(value.length - 2, value.length)
    } else {
      return value
    }
  }
}

export function formatSeconds(value) {
  let result = parseInt(value)
  let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
  let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
  let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

  let res = '';
  if (h !== '00') res += `${h}时`;
  if (m !== '00') res += `${m}分`;
  res += `${s}秒`;
  return res;
}

export function getLocalTime(nS) {
  return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

export function inout_type(type) {
  let typeText = ''
  switch (type) {
    case '0':
      typeText = '通过'
      break
    case '1':
      typeText = '进入'
      break
    case '2':
      typeText = '出'
      break
  }
  return typeText
}

export function att_type(type) {
  let typeText = ''
  switch (type) {
    case '0':
      typeText = '普通'
      break
    case '1':
      typeText = '宿舍'
      break
    case '2':
      typeText = '请假'
      break
    case '3':
      typeText = '教师普通'
      break
    case '4':
      typeText = '教学区'
      break
    case '5':
      typeText = '校车'
      break
  }
  return typeText
}
