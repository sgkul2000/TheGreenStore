<template>
  <div id="adminOrdersMain">
    <div class="text-h3">
      Orders
    </div>
    <v-divider
      class="mt-6"
      light
    />
    <v-list class="pt-0">
      <v-list-item-group>
        <template v-for="(order, index) in orders">
          <v-list-item :key="order._id" :selectable="true" :nuxt="true" :link="true" :to="`/orders/${order._id}`">
            <v-list-item-content>
              <v-list-item-title v-text="order.user.fullname" />

              <v-list-item-subtitle
                v-text="getProductsList(order)"
              />

              <!-- <v-list-item-subtitle v-text="item.subtitle" /> -->
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-action-text v-text="getTime(order.createdAt)" />
            </v-list-item-action>
            <!-- <v-icon
                    v-if="!active"
                    color="grey lighten-1"
                  >
                    mdi-star-outline
                  </v-icon> -->

            <v-list-item-action>
              <v-btn icon @click.prevent="">
                <v-icon
                  color="success"
                >
                  mdi-check
                </v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider
            v-if="index < orders.length - 1"
            :key="index"
          />
        </template>
      </v-list-item-group>
    </v-list>
    <v-card v-intersect="lazyLoad" />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  layout: 'admin_layout',
  middleware: ['user-auth', 'admin-auth'],
  async asyncData ({ app }) {
    try {
      var { data } = await app.$axios.get('/api/order/', {
        params: {
          admin: 1,
          all: 1
        }
      })
      return { orders: data.data.docs, page: data.data.page, nextPage: data.data.hasNextPage }
    } catch (err) {
      console.error(err)
    }
  },
  data () {
    return {
      orders: [],
      page: 1,
      nextPage: true
    }
  },
  methods: {
    getProductsList (order) {
      let result = ''
      for (let i = 0; i < order.cart.length; i++) {
        result += order.cart[i].product.name
        if (i !== order.cart.length - 1) {
          result += ', '
        }
      }
      return result
    },
    getTime (time) {
      const m = moment(time)
      return m.fromNow()
    },
    lazyLoad (entries, observer, isIntersecting) {
      if (isIntersecting && this.nextPage) {
        setTimeout(() => {
          this.page += 1
          this.$axios.get('/api/order/', {
            params: {
              admin: true,
              all: true,
              page: this.page
            }
          }).then(({ data }) => {
            for (let i = 0; i < data.data.docs.length; i++) {
              this.orders.push(data.data.docs[i])
            }
            // this.orders = this.orders.concat(data.data.docs)
            this.page = data.data.page
            this.nextPage = data.data.hasNextPage
          }).catch((err) => {
            console.error(err)
            this.$notify.error({
              title: 'Failed to load orders.',
              message: err.response ? err.response.data.message : ''
            })
          })
        }, 500)
      }
    }
  }

}
</script>

<style>
</style>
