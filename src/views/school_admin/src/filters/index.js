// import parseTime, formatTime and set to filter
export { parseTime, formatTime } from '@/utils'
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

export function riskType(type) {
  let typeText = ''
  switch (type) {
    case '1':
      typeText = '建筑物风险'
      break
    case '2':
      typeText = '教学活动风险'
      break
  }
  return typeText
}

export function dangerStatus(type) {
  let typeText = ''
  switch (type) {
    case '1':
      typeText = '待确认'
      break
    case '2':
      typeText = '待指派'
      break
    case '3':
      typeText = '待治理'
      break
    case '4':
      typeText = '待验收'
      break
    case '5':
      typeText = '验收未通过'
      break
    case '6':
      typeText = '已归档'
      break
    case '0':
      typeText = '已取消'
      break
  }
  return typeText
}

/**
 * 格式化日期 20220325101042 -> 2022-03-25- 10:10:42
 * @param value
 * @returns {*}
 */
export function formatDate(value) {
  const pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/
  return value ? value.replace(pattern, '$1-$2-$3 $4:$5:$6') : ''
}

/**
 * 格式化日期 2022-03-25- 10:10:42 -> 20220325101042
 * @param val
 * @returns {*}
 */
export function formatStrDate(val) {
  let str = ''
  val = val.split(' ')
  val[0].split('-').map((item) => {
    str += item
  })
  val[1].split(':').map((item) => {
    str += item
  })
  return str
}
