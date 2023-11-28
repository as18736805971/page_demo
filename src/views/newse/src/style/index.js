/**
 * 加载主题
 */
// import './themes/default.scss'
// import './themes/green.scss'
export const defaultTheme = {
  themeName: 'default'
}
document.body.className = `zm-theme-${defaultTheme.themeName}`

// const themeModules = import.meta.glob('./themes/*.scss')
// const themes = {}
// // 遍历所有匹配的文件
// for (const path in themeModules) {
//   const themeName = path.replace('./themes/', '').replace('.scss', '')
//   themes[themeName] = () => import(`${path}?import`)
// }
// export default themes
