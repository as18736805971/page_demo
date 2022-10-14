import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'
// import router from '@/router.config'

Vue.use(Vuex)

const state = {
  indextype: 1,
  pubkey: '',
  direction: 'forward',
  includePage: [],
  check_user: {}
}

const actions = {

}

const getters = {
  indextype: state => state.indextype,
  direction: state => state.direction,
  includePage: state => state.includePage,
  check_user: state => state.check_user
}


const mutations = {
  [types.UPDATE_INDEXTYPE](state, indextype) {
    state.indextype = indextype;
  },
  [types.UPDATE_DIRECTION](state, direction) {
    state.direction = direction;
  },
  [types.UPDATE_PUBKEY](state, pubkey) {
    state.pubkey = pubkey;
  },
  [types.UPDATE_CHECK_USER](state, check_user) {
    state.check_user = check_user;
  },
  [types.UPDATE_INCLUDE_PAGE](state, { pageName, sign = true }) {
    if (sign) {
      if (state.includePage.indexOf(pageName) === -1) {
        state.includePage.push(pageName);
      }
    } else {
      if (state.includePage.indexOf(pageName) !== -1) {
        state.includePage.splice(state.includePage.indexOf(pageName), 1);
      }
    }
  }
}


export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  actions,
  getters,
  mutations
})
