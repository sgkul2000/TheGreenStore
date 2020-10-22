<template>
  <div id="cartMain">
    <div class="text-h3">
      Cart
    </div>
    <v-divider class="my-6" light />
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step
          :complete="step > 1"
          step="1"
        >
          Finalize cart
        </v-stepper-step>

        <v-divider />

        <v-stepper-step
          :complete="step > 2"
          step="2"
        >
          Delivery details
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="3">
          Payment details
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-row justify="center" class="px-4 py-2">
            <v-expansion-panels accordion>
              <CartItem v-for="item in cart" :key="item.product._id" :item="item" />
            </v-expansion-panels>
          </v-row>
          <v-divider class="my-6" light />
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    Vegitable
                  </th>
                  <th class="text-left">
                    Quantity
                  </th>
                  <th class="text-left">
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody>
                <TableItem v-for="item in cart" :key="item.product._id" :item="item" />
                <tr>
                  <td>Delivery charge</td>
                  <td>1</td>
                  <td>Free</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td />
                  <td>{{ getTotal }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>

          <v-row>
            <v-spacer />
            <v-col cols="auto">
              <v-btn
                color="primary"
                @click="step = 2"
              >
                Continue
              </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-content step="2">
          <AddressComp />
          <v-row>
            <v-spacer />
            <v-col cols="auto">
              <v-btn text @click="step = 1">
                Back
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="primary"
                @click="step = 3"
              >
                Continue
              </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-content step="3">
          <Payment />
          <v-row>
            <v-spacer />
            <v-col cols="auto">
              <v-btn text @click="step = 2">
                Back
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="primary"
                @click="step = 3"
              >
                Continue
              </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CartItem from '~/components/cart/CartItem'
import TableItem from '~/components/cart/TableItem'
import AddressComp from '~/components/cart/AddressComp'
import Payment from '~/components/cart/Payment'
export default {
  components: {
    CartItem,
    TableItem,
    AddressComp,
    Payment
  },
  data () {
    return {
      step: 1
    }
  },
  computed: {
    ...mapGetters({
      cart: 'getCart'
    }),
    getTotal () {
      let sum = 0
      for (let i = 0; i < this.cart.length; i++) {
        for (let j = 0; j < this.cart[i].subProducts.length; j++) {
          sum += this.cart[i].subProducts[j].price * this.cart[i].subProducts[j].quantity
        }
      }
      return `₹${sum}`
    }
  },
  methods: {
  }
}
</script>

<style>

</style>
