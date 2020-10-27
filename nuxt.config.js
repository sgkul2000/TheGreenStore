import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: true,

  // Target (https://go.nuxtjs.dev/config-target)
  // target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - The Green Store',
    title: 'greenStore',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'server.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'server.crt'))
    // }
  },
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['izitoast/dist/css/iziToast.min.css'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [{ src: '~/plugins/persistedState.js' }],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    'nuxt-breakpoints',
    [
      '@nuxtjs/router',
      {
        path: 'router',
        fileName: 'index.js',
        keepDefaultRouter: true
      }
    ]
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'nuxt-izitoast',
    'cookie-universal-nuxt'
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL: process.env.BASE_URL || 'http://0.0.0.0:3000/'
  },
  env: {
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: colors.green.darken1,
          accent: colors.green.accent2,
          secondary: colors.blue.darken2,
          info: colors.orange.darken1,
          warning: colors.yellow.darken1,
          error: colors.red.darken1,
          success: colors.green.base
        }
      }
    },
    icons: {
      iconfont: 'mdi'
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    devMiddleware: {
      headers: {
        'Cache-Control': 'no-store',
        Vary: '*'
      }
    },
    terser: {
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    }
  },
  izitoast: {
    position: 'topCenter',
    transitionIn: 'bounceInDown',
    transitionOut: 'fadeOut',
    timeout: 3000,
    animateInside: true
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: 'api/auth/login', method: 'post', propertyName: 'token' },
          logout: { url: 'api/auth/logout', method: 'get' },
          user: { url: 'api/auth/', method: 'get', propertyName: 'user' }
        },
        redirect: {
          login: false,
          logout: '/',
          callback: '/login',
          home: false
        },
        token: {
          prefix: '_token.'
        }
        // tokenRequired: true,
        // tokenType: 'bearer',
        // globalToken: true,
        // autoFetchUser: true
      }
    }
  },
  // serverMiddleware: process.env.NODE_ENV === 'development' ? [
  //   {
  //     path: '/api',
  //     handler: '~/api/index.js'
  //   }
  // ] : []
  serverMiddleware: [
    {
      path: '/api',
      handler: '~/api/index.js',
      prefix: true
    }
  ]
}

// export default config
