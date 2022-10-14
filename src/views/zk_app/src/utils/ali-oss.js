// 引入ali-oss
const OSS = require('ali-oss')
import store from '../store/index'
/**
 *  [accessKeyId] {String}：通过阿里云控制台创建的AccessKey。
 *  [accessKeySecret] {String}：通过阿里云控制台创建的AccessSecret。
 *  [bucket] {String}：通过控制台或PutBucket创建的bucket。
 *  [region] {String}：bucket所在的区域， 默认oss-cn-hangzhou。
 */
export function client(accessKeyId, accessKeySecret, stsToken) { // data后端提供数据
  return new OSS({
    region: 'oss-cn-zhangjiakou',
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    bucket: 'spp-img',
    stsToken: stsToken
  })
}

export const getFileNameUUID = () => {
  const folder = store.state.user.user_type === '0' ? 'admin' : store.state.user.user_type === '1' ? 'edu' : 'sch'
  function rx() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return `${folder}/${+new Date()}_${rx()}${rx()}`
}
