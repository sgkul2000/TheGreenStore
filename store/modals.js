import Vue from 'vue'
export const state = () => ({
  loginModal: false,
  editProfileModal: false,
  feedbackModal: false,
  editAddressModal: {
    status: false,
    id: null
  }
})

export const getters = {
  getLoginModal: state => state.loginModal,
  getEditProfileModal: state => state.editProfileModal,
  getEditAddressModal: state => state.editAddressModal,
  getFeedbackModal: state => state.feedbackModal

}

export const mutations = {
  changeLoginModal (state, value) {
    Vue.set(state, 'loginModal', value)
  },
  changeEditProfileModal (state, value) {
    Vue.set(state, 'editProfileModal', value)
  },
  changeEditAddressModal (state, value) {
    Vue.set(state, 'editAddressModal', value)
  },
  changeFeedbackModal (state, value) {
    Vue.set(state, 'feedbackModal', value)
  }
}

export const actions = {
  toggleSidebar ({ state, commit }) {
    commit('sidebarVisible', !state.sidebarVisible)
  }
}
