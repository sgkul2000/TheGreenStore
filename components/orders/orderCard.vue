<template>
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
        <TableItem v-for="item in order.cart" :key="item.product._id" :item="item" />
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
</template>

<script>
import TableItem from '~/components/cart/TableItem'
export default {
  components: {
    TableItem
  },
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    getTotal () {
      let sum = 0
      for (let i = 0; i < this.order.cart.length; i++) {
        for (let j = 0; j < this.order.cart[i].subProducts.length; j++) {
          sum += this.order.cart[i].subProducts[j].price * this.order.cart[i].subProducts[j].quantity
        }
      }
      return `₹${sum}`
    }
  }

}
</script>

<style>

</style>
