const state = {
  opened: localStorage.getItem('sidebarStatus') ? !!+localStorage.getItem('sidebarStatus') : true,
  visitedViews: [{
    path: '1',
    query: '',
    fullPath: '',
    title: '应用管理'
  }],
  cachedViews: []
}

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || '无标题'
      })
    )
  },
  ADD_CACHED_VIEW: (state, view) => {
    if (state.cachedViews.includes(view.name)) return
    if (!view.meta.noCache) {
      state.cachedViews.push(view.name)
    }
  },
  TOGGLE_SIDEBAR: state => {
    state.opened = !state.opened
    if (state.opened) {
      localStorage.setItem('sidebarStatus', '1')
    } else {
      localStorage.setItem('sidebarStatus', '0')
    }
  },
  CLOSE_SIDEBAR: (state) => {
    localStorage.setItem('sidebarStatus', 0)
    state.opened = false
  }
}

const actions = {
  addView({ dispatch }, view) {
    dispatch('addVisitedView', view)
    dispatch('addCachedView', view)
  },
  addVisitedView({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView({ commit }, view) {
    commit('ADD_CACHED_VIEW', view)
  },
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }) {
    commit('CLOSE_SIDEBAR')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
