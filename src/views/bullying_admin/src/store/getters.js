const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  title: state => state.user.title,
  logo: state => state.user.logo,
  logo_collapse: state => state.user.logo_collapse,
  permission: state => state.permission.permission,
  model: state => state.permission.model,
  model_menu: state => state.permission.model_menu,
  model_url: state => state.permission.model_url
}
export default getters
