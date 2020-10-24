<template>
  <div id="ordersMain">
    <div class="text-h3">
      Orders
    </div>
    <v-divider class="my-3" />
    <div class="ordersMain">
      <v-row justify="center" class="px-4 py-2">
        <v-expansion-panels accordion>
          <v-expansion-panel v-for="order in orders" :key="order._id">
            <v-expansion-panel-header>
              #{{ order._id }} <v-spacer /> ₹{{ order.amount }} · <div style="flex: none !important;" :class="order.status === 'pending' ? 'red--text' : 'green--text'">
                {{ order.status }}
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <OrderCard :order="order" />
              <v-card outlined class="my-3">
                <v-card-title class="text-subtitle-1">
                  Delivery address:
                </v-card-title>
                <v-card-text class="black--text">
                  {{ order.address.buildingDetails }} <br>
                  {{ order.address.area }} <br>
                  {{ order.address.landmark }} <br>
                  {{ order.address.cityName }} - {{ order.address.pincode }} <br>
                  {{ order.address.stateName }} <br>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </div>
  </div>
</template>

<script>
import OrderCard from '~/components/orders/orderCard'
export default {
  middleware: 'user-auth',
  components: {
    OrderCard
  },
  async asyncData ({ app }) {
    try {
      const { data } = await app.$axios.get('/api/order/')
      return { orders: data.data }
    } catch (err) {
      console.error(err)
    }
  },
  data () {
    return {

    }
  },
  mounted () {
    console.log(this.orders)
  }

}
</script>

<style>

</style>
