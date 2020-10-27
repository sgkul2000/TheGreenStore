import Vue from 'vue'

export const state = () => ({
  products: [],
  cart: [],
  orderAddress: {},
  authFailed: {
    status: false,
    message: ''
  }
})

export const getters = {
  routerLoading: state => state.routerLoading,
  getProducts: state => state.products,
  getCart: state => state.cart,
  getOrderAddress: state => state.orderAddress,
  hasAuthFailed: state => state.authFailed
}

export const mutations = {
  setRouterLoading (state, payload) {
    state.routerLoading = payload
  },
  setProducts (state, payload) {
    Vue.set(state, 'products', payload)
  },
  setCart (state, payload) {
    Vue.set(state, 'cart', payload)
  },
  setOrderAddress (state, payload) {
    Vue.set(state, 'orderAddress', payload)
  },
  setAuthStatus (state, payload) {
    Vue.set(state, 'authFailed', payload)
  },
  appendCart (state, payload) {
    console.log(payload)
    for (let i = 0; i < state.cart.length; i++) {
      if (state.cart[i].product._id === payload.product._id) {
        for (let j = 0; j < state.cart[i].subProducts.length; j++) {
          if (state.cart[i].subProducts[j].subProduct._id === payload.subProduct._id) {
            state.cart[i].subProducts[j].quantity += 1
            return
          }
        }
        state.cart[i].subProducts.push({
          subProduct: payload.subProduct,
          price: payload.subProduct.price,
          quantity: 1
        })
        return
      }
    }
    state.cart.push({
      product: payload.product,
      subProducts: [
        {
          subProduct: payload.subProduct,
          price: payload.subProduct.price,
          quantity: 1
        }
      ]
    })
  },
  popCart (state, payload) {
    var PObj = state.cart.find(product => product.product._id === payload.product._id)
    var subPObj = PObj.subProducts.find(subProduct => subProduct.subProduct._id === payload.subProduct._id)
    if (subPObj.quantity < 2) {
      if (PObj.subProducts.length < 2) {
        state.cart = state.cart.filter(product => product.product._id !== PObj.product._id)
      } else {
        PObj.subProducts = PObj.subProducts.filter(item => item.subProduct._id !== subPObj.subProduct._id)
      }
      return
    }
    subPObj.quantity -= 1
  }
}

export const actions = {
  toggleSidebar ({ state, commit }) {
    commit('sidebarVisible', !state.sidebarVisible)
  },
  fetchProducts ({ state, commit }) {
    this.$axios.get('/api/product').then((res) => {
      commit('setProducts', res.data.data)
    }).catch((err) => {
      console.error(err)
    })
  }
}
