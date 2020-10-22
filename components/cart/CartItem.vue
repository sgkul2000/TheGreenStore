<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <v-avatar
        tile
        :width="56"
        :height="56"
        :max-width="56"
        size="64px"
        class="mr-3"
      >
        <v-img :aspect-ratio="1" :src="'http://localhost:8000/' + item.product.image" :alt="'Product Image - ' + item.product.name" />
      </v-avatar> {{ item.product.name }} <v-spacer /> {{ getTotalWeight }} · {{ getTotal }}
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Price
              </th>
              <th class="text-left">
                Quantity
              </th>
              <th class="text-right">
                Manage
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="subProduct in item.subProducts"
              :key="subProduct._id"
            >
              <td>{{ subProduct.price }}</td>
              <td>{{ subProduct.quantity*subProduct.subProduct.quantity }} Kg</td>
              <td class="text-right">
                <v-btn icon color="red" @click="removeFromCart(subProduct)">
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
                {{ subProduct.quantity }}
                <v-btn icon color="green" @click="addToCart(subProduct)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <!-- <v-list-item v-for="subProduct in item.subProducts" :key="subProduct._id">
        <v-list-item-content>
          <v-list-item-title> {{ subProduct.quantity }}  X  {{ subProduct.price }} = {{ subProduct.price*subProduct.quantity }} </v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  name: 'CartItem',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    getTotal () {
      let sum = 0
      for (let j = 0; j < this.item.subProducts.length; j++) {
        sum += this.item.subProducts[j].price * this.item.subProducts[j].quantity
      }
      return `₹${sum}`
    },
    getTotalWeight () {
      let sum = 0
      for (let j = 0; j < this.item.subProducts.length; j++) {
        sum += this.item.subProducts[j].quantity
      }
      return `${sum} Kg`
    }
  },
  methods: {
    addToCart (subProduct) {
      this.$store.commit('appendCart', {
        product: this.item.product,
        subProduct: subProduct.subProduct
      })
    },
    removeFromCart (subProduct) {
      this.$store.commit('popCart', {
        product: this.item.product,
        subProduct: subProduct.subProduct
      })
    }
  }

}
</script>

<style>

</style>
