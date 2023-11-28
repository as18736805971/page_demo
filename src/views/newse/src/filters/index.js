/**
 * 格式化日期 20220325101042 -> 2022-03-25- 10:10:42
 * @param value
 * @returns {*}
 */
export function formatDate(value) {
  const pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/
  return value ? value.replace(pattern, '$1-$2-$3 $4:$5:$6') : ''
}
