const state = {
  model: [
    {
      menu_id: 'bfaaf6bc086342439f2c7c8215d13afc',
      menu_name: '智慧教务',
      menu_url: '',
      menu_target: 'self',
      menu_icon: 'sys',
      menu_type: 1,
      menu_order: 1,
      menu_pid: '0',
      child_menu: [
        {
          menu_id: 'ac3963ce98e14f53b7dd9a736adb4628',
          menu_name: '基础教务',
          menu_url: '',
          menu_target: 'self',
          menu_icon: 'menu',
          menu_order: 1,
          menu_type: 1,
          menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
          child_menu: [
            {
              menu_id: '2e719b9822fb4b6d911fd94760a5de63',
              menu_name: '角色管理',
              menu_url: 'admin/platform/role',
              menu_target: 'self',
              menu_icon: 'role',
              menu_order: 1,
              menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
              child_menu: []
            },
            {
              menu_id: 'a1c85a34c02e4646bc0fa80018832991',
              menu_name: '年级管理',
              menu_url: 'admin/sys/dept',
              menu_target: 'self',
              menu_icon: 'dept',
              menu_order: 1,
              menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
              child_menu: []
            },
            {
              menu_id: '31ddbc6cb17347a5a9d30ef9d3e588b6',
              menu_name: '班级管理',
              menu_url: 'admin/sys/user',
              menu_target: 'self',
              menu_icon: 'user',
              menu_order: 1,
              menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
              child_menu: []
            }
          ]
        },
        {
          menu_id: 'ac3963ce98e14f53b7dd9a736adb4628',
          menu_name: '迎新管理',
          menu_url: '',
          menu_target: 'self',
          menu_icon: 'menu',
          menu_order: 1,
          menu_type: 1,
          menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
          child_menu: [
            {
              menu_id: '2e719b9822fb4b6d911fd94760a5de63',
              menu_name: '教师信息采集',
              menu_url: 'admin/platform/menu',
              menu_target: 'self',
              menu_icon: 'role',
              menu_order: 1,
              menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
              child_menu: []
            },
            {
              menu_id: 'a1c85a34c02e4646bc0fa80018832991',
              menu_name: '学生信息采集',
              menu_url: 'admin/sys/dept',
              menu_target: 'self',
              menu_icon: 'dept',
              menu_order: 1,
              menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
              child_menu: []
            }
          ]
        }
      ]
    },
    {
      menu_id: 'bfaaf6bc086342439f2c7c8215d13afc',
      menu_name: '平台管理',
      menu_url: '',
      menu_target: 'self',
      menu_icon: 'sys',
      menu_order: 1,
      menu_type: 1,
      menu_pid: '0',
      child_menu: [
        {
          menu_id: 'ac3963ce98e14f53b7dd9a736adb4628',
          menu_name: '菜单管理',
          menu_url: 'admin/platform/menu',
          menu_target: 'self',
          menu_icon: 'menu',
          menu_order: 1,
          menu_type: 2,
          menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
          child_menu: []
        },
        {
          menu_id: '2e719b9822fb4b6d911fd94760a5de63',
          menu_name: '角色管理',
          menu_url: 'admin/platform/role',
          menu_target: 'self',
          menu_icon: 'role',
          menu_order: 1,
          menu_type: 2,
          menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
          child_menu: []
        },
        {
          menu_id: '31ddbc6cb17347a5a9d30ef9d3e588b6',
          menu_name: '用户管理',
          menu_url: 'admin/platform/user',
          menu_target: 'self',
          menu_icon: 'user',
          menu_order: 1,
          menu_type: 2,
          menu_pid: 'bfaaf6bc086342439f2c7c8215d13afc',
          child_menu: []
        }
      ]
    }
  ],
  show_model: [],
  model_url: [],
  model_menu: {},
  permission: []
}

const mutations = {
  SET_MODEL: (state, model) => {
    state.model = model
  },
  SET_MODEL_URL: (state, model_url) => {
    state.model_url = model_url
  },
  SET_MODEL_MENU: (state, model_menu) => {
    state.model_menu = model_menu
  },
  SET_PERMISSION(state, val) {
    state.permission = val
  },
  DEL_PERMISSION: state => {
    state.permission = []
  }
}

const actions = {
  /**
   * 在这里同时生成菜单和路由，把路由返回，把菜单保存起来
   * @param commit
   * @param val
   */
  setPermission({ commit }, val) {
    commit('SET_PERMISSION', val.permission)
  },
  delPermission({ commit }) {
    commit('DEL_PERMISSION')
    commit('SET_MODEL')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
