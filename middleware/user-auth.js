export default function ({ store, redirect, app }) {
  if (!app.$auth.loggedIn) {
    store.commit('modals/changeLoginModal', true)
    store.commit('setAuthStatus', true)
    return redirect('/login')
  }
}
