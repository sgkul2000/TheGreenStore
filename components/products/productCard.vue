<template>
  <div class="main">
    <v-card>
      <v-img
        v-ripple
        :src="'http://localhost:8000/'+product.image"
        class="white--text align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="200px"
        @click="redirectProduct(product._id)"
      >
        <v-card-title class="pb-2" v-text="product.name" />
        <v-card-subtitle class="py-2">
          <v-row
            align="center"
            class="mx-0"
          >
            <v-rating
              color="amber"
              :value="4.5"
              dense
              half-increments
              readonly
              size="14"
            />
            <div class="white--text ml-4">
              {{ starCount(product.reviews) }} ({{ product.reviews.length }})
            </div>
            <v-spacer />
          </v-row>
        </v-card-subtitle>
        <v-btn class="productShareBtn" icon>
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-img>
      <!-- <v-card-text>
            </v-card-text> -->
      <v-card-subtitle v-if="product.subProducts.length>1" class="pt-2 pb-0">
        Starting from ₹{{ product.subProducts[getLowest].price }} / {{ product.subProducts[getLowest].quantity }} Kg
      </v-card-subtitle>
      <v-card-actions>
        <v-row
          align="center"
          class="mx-0"
        >
          <v-col class="py-1" cols="12" lg="6">
            <v-select
              v-model="selected"
              dense
              hide-details="true"
              :items="product.subProducts"
              :item-text="getItemText"
              :item-value="(item) => item"
              solo
            />
          </v-col>
          <v-col class="py-1" cols="12" lg="6">
            <v-btn text block color="primary">
              Add to cart
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      selected: ''
    }
  },
  computed: {
    getLowest () {
      let lowest = 0
      for (let i = 0; i < this.product.subProducts.length; i++) {
        if (this.product.subProducts[i].price < this.product.subProducts[lowest].price) {
          lowest = i
        }
      }
      return lowest
    },
    getItems () {
      return this.product.subProducts.map(subProduct => `₹${subProduct.price} / ${subProduct.quantity} Kg`)
    }
  },
  mounted () {
    this.selected = this.product.subProducts[this.getLowest]
  },
  methods: {
    getItemText (item) {
      return `₹${item.price} / ${item.quantity} Kg`
    },
    starCount (reviews) {
      let starSum = 0
      for (let i = 0; i < reviews.length; i++) {
        starSum += reviews[i].stars
      }
      return (reviews.length !== 0 ? starSum / reviews.length : 0).toFixed(1)
    },
    redirectProduct (id) {
      this.$router.push({ path: '/products/' + id })
    }
  }
}
</script>

<style lang="scss" src="~/assets/products.scss" scoped />
