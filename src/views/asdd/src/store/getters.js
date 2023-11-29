const getters = {
  opened: state => state.tagsView.opened,
  visitedViews: state => state.tagsView.visitedViews,
  model: state => state.permission.model,
  page_home: state => state.permission.page_home,
  crumbs_list: state => state.permission.crumbs_list
}
export default getters
