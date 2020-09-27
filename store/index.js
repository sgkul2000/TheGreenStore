import Vue from 'vue'

export const state = () => ({

})

export const getters = {
  routerLoading: state => state.routerLoading

}

export const mutations = {
  setRouterLoading (state, payload) {
    state.routerLoading = payload
  },
  showLoginModal (state, value) {
    Vue.set(state, 'loginModal', value)
  }
}

export const actions = {
  toggleSidebar ({ state, commit }) {
    commit('sidebarVisible', !state.sidebarVisible)
  }
}
