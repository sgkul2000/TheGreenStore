import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export function createRouter (ssrContext, createDefaultRouter, routerOptions) {
  const options = routerOptions || createDefaultRouter(ssrContext).options
  const hostname = ssrContext ? ssrContext.req.headers.host : location.host
  return new Router({
    ...options,
    routes: fixRoutes(options.routes, hostname)
  })
}
function fixRoutes (defaultRoutes, hostname) {
  if (hostname.includes('admin')) { return adminRoutes(defaultRoutes) }
  return mainRoutes(defaultRoutes)
}
function mainRoutes (defaultRoutes) {
  return defaultRoutes
  // return defaultRoutes.filter(r => !(r.name.toString().includes('admin')))
}
function adminRoutes (defaultRoutes) {
  const route = defaultRoutes.filter(r => (r.name.toString().includes('admin') || r.name.toString().includes('login') || r.name.toString().includes('user'))).map((r) => {
    if (r.name.toString().includes('admin')) {
      r.path = '/' + r.path.split('/').slice(2).join('/')
    }
    return r
  })
  return route
}
