import * as CryptoJS from 'crypto-js'

/**
 * 是否为开发环境
 * @returns {Boolean}
 */
export const isDev = () => {
  return import.meta.env.DEV
}

/**
 * 是否为生产环境
 * @returns {Boolean}
 */
export const isProd = () => {
  return import.meta.env.PROD
}

/**
 * 是否为链接地址
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 查询满足条件则直接返回数据
 * @param arr      查询数组数据
 * @param chi_name 子级数组名称
 * @param res_name 结束条件名称
 */
export function routePath(arr, chi_name = 'child_menu', res_name = 'menu_url') {
  for (const item of arr) {
    if (item[res_name]) {
      console.log('--*--')
      return item[res_name]
    } else {
      if (item[chi_name]) {
        const path = routePath(item[chi_name])
        if (path) {
          return path
        } else {
          routePath(item[chi_name])
        }
      }
    }
  }
}

/**
 * 查询满足条件的路径 并返回层级父级数据及本身数据
 * @param arr         查询数组数据
 * @param path        当前链接路径
 * @param child       父级数据
 * @param hierarchy   层级父级数据
 * @param path_name   结束条件名称
 * @param child_name  下级数组名称
 */
export function routePathInfo(arr, path, child, hierarchy, path_name = 'menu_url', child_name = 'child_menu') {
  for (const item of arr) {
    if (item[path_name] === path) {
      return { item, hierarchy }
    } else {
      if (item[child_name].length !== 0) {
        hierarchy.push(item)
        const info = routePathInfo(item[child_name], path, item, hierarchy)
        if (info) {
          return info
        } else {
          item.menu_order < 2 ? hierarchy = [] : hierarchy.splice(hierarchy.length - 1, 1)
        }
      }
    }
  }
}

/**
 * 加密
 */
export function setEncrypt(val) {
  return CryptoJS.AES.encrypt(val, import.meta.env.VITE_APP_AES_KEY).toString()
}

/**
 * 解密方法
 */
export function getDecrypt(val) {
  const bytes = CryptoJS.AES.decrypt(val, import.meta.env.VITE_APP_AES_KEY)
  return bytes.toString(CryptoJS.enc.Utf8)
}
