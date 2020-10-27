export default function ({ store, redirect, app }) {
  if (!app.$auth.user.isAdmin) {
    store.commit('modals/changeLoginModal', true)
    store.commit('setAuthStatus', {
      status: true,
      message: 'Not a Valid Admin!'
    })
    return redirect('/login')
  }
}
