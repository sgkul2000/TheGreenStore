<template>
  <div class="main">
    <v-container>
      <v-row>
        <v-col
          cols="12"
        >
          <v-card elevation="0">
            <div class="d-flex flex-no-wrap">
              <v-row style="width:100%;">
                <v-col cols="12" sm="6">
                  <v-avatar
                    class=""
                    tile
                    size="100%"
                  >
                    <v-img :aspect-ratio="1" width="100%" :src="'http://localhost:8000/' + product.image" :alt="'Product Image - ' + product.name" />
                    <v-icon v-if="product.isSpecial" class="specialProductStar" color="yellow">
                      mdi-star
                    </v-icon>
                  </v-avatar>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-card-subtitle class="mt-3" v-text="'#'+product._id" />
                  <v-card-title
                    class="pt-0"
                  >
                    <span class="headline">
                      {{ product.name }}
                    </span>
                  </v-card-title>
                  <v-card-text v-if="product.isAvailable && product.subProducts.length>1" class="price">
                    starting from ₹ {{ product.subProducts[getLowest].price }} / {{ product.subProducts[getLowest].quantity }} Kg
                  </v-card-text>
                  <v-card-text v-else-if="product.isAvailable && product.subProducts.length===1" class="price">
                    ₹ {{ product.subProducts[0].price }} / {{ product.subProducts[0].quantity }} Kg
                  </v-card-text>
                  <v-card-text v-else class="price">
                    Not Available
                  </v-card-text>
                  <v-card-text>
                    <v-select
                      v-model="selected"
                      :items="product.subProducts"
                      :item-text="getItemText"
                      :item-value="(item) => item"
                      dense
                      hide-details
                      solo
                    />
                    <v-btn class="mt-4" color="primary" block @click="addToCart()">
                      Add to cart
                    </v-btn>
                    <v-simple-table v-if="cartSubProducts.length > 0">
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
                            v-for="subProduct in cartSubProducts"
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
                  </v-card-text>
                  <v-card-text class="pt-0">
                    Description:<br>
                    {{ product.description }}
                  </v-card-text>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  async asyncData ({ app, params }) {
    const { data } = await app.$axios.get('/api/product/' + params.name)
    return { product: data.data }
  },
  data () {
    return {
      selected: {}
    }
  },
  computed: {
    ...mapGetters({
      cart: 'getCart'
    }),
    cartSubProducts () {
      try {
        return (this.cart.find(product => product.product._id === this.product._id)).subProducts
      } catch (err) {
        return []
      }
    },
    getLowest () {
      let lowest = 0
      for (let i = 0; i < this.product.subProducts.length; i++) {
        if (this.product.subProducts[i].price < this.product.subProducts[lowest].price) {
          lowest = i
        }
      }
      return lowest
    }
  },
  mounted () {
    this.selected = this.product.subProducts[this.getLowest]
  },
  methods: {
    addToCart (subProduct) {
      this.$store.commit('appendCart', {
        product: this.product,
        subProduct: subProduct ? subProduct.subProduct : this.selected
      })
    },
    getItemText (item) {
      return `₹${item.price} / ${item.quantity} Kg`
    },
    removeFromCart (subProduct) {
      this.$store.commit('popCart', {
        product: this.product,
        subProduct: subProduct.subProduct
      })
    }
  }

}
</script>

<style scoped lang="scss" src="~/assets/product.scss" />
