<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
      elevate-on-scroll
      skrink-on-scroll
      color="white"
      height="64px"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title class="cursor-pointer" @click="$router.push({path: '/admin'})" v-text="title" />
      <v-spacer />
      <v-btn icon @click="$router.push({path:'/'})">
        <v-icon>
          mdi-home
        </v-icon>
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="(item, index) in dropdown"
            :key="index"
            v-ripple
            class="cursor-pointer"
            @click="$router.push({path: item.link})"
          >
            <v-list-item-icon class="mr-3">
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
      :fixed="false"
      :absolute="true"
      app
      class="px-0 py-0"
    >
      <v-card
        flat
        tile
        class="primary lighten-1 white--text text-center"
      >
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4 white--text"
            icon
          >
            <v-icon size="24px">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit amet. Mauris cursus commodo interdum. Praesent ut risus eget metus luctus accumsan id ultrices nunc. Sed at orci sed massa consectetur dignissim a sit amet dui. Duis commodo vitae velit et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat augue vel ipsum ultrices, cursus iaculis dui sollicitudin. Vestibulum eu ipsum vel diam elementum tempor vel ut orci. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
        </v-card-text>

        <v-divider />

        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} — <strong>The Green Store</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: true,
      drawer: false,
      fixed: true,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Stats',
          to: '/admin/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Products',
          to: '/products'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Orders',
          to: '/orders'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Products',
          to: '/admins'
        }
      ],
      title: 'TGS Admin Panel',
      dropdown: [
        {
          title: 'Profile',
          link: '/user/'
        },
        {
          title: 'Orders',
          link: '/user/orders'
        },
        {
          title: 'Logout'
        }
      ],
      icons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-linkedin',
        'mdi-instagram'
      ]
    }
  },
  computed: {
    mobile: () => {
      return this.$breakpoints.sMd
    }
  },
  mounted () {
    this.$store.dispatch('fetchProducts')
  },
  methods: {
    onScroll () {
      console.log('hey')
    }
  }
}
</script>

<style lang="scss" src="~/assets/searchbar.scss" />
<style lang="scss" src="~/assets/main.scss"></style>
