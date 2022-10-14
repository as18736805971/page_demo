const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  pubkey: state => state.user.pubkey,
  name: state => state.user.name,
  orgName: state => state.user.orgName,
  title: state => state.user.title,
  logo: state => state.user.logo,
  is_admin: state => state.user.is_admin,
  user_type: state => state.user.user_type,
  functionList: state => state.permission.functionList,
  permission_routes: state => state.permission.routes,
  menus: state => state.permission.menus
}
export default getters
