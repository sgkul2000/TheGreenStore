import Vue from 'vue'
export const state = () => ({
  loginModal: true
})

export const getters = {
  getLoginModal: state => state.loginModal

}

export const mutations = {
  changeLoginModal (state, value) {
    // state.loginModal = value
    Vue.set(state, 'loginModal', value)
  }
}

export const actions = {
  toggleSidebar ({ state, commit }) {
    commit('sidebarVisible', !state.sidebarVisible)
  }
}
