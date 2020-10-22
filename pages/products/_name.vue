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

                  <v-card-subtitle class="d-flex flex-row">
                    <v-rating
                      :value="starCount(product.reviews)"
                      color="amber"
                      dense
                      half-increments
                      readonly
                      size="14"
                      class=""
                    />
                    <div class="grey--text ml-4 text-subtitle-1">
                      {{ starCount(product.reviews) }} ({{ product.reviews.length }})
                    </div>
                  </v-card-subtitle>
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
                    <v-btn class="mt-4" color="primary" block @click="addToCart(product)">
                      Add to cart
                    </v-btn>
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
      <v-row>
        <v-col v-for="review in getReviews" :key="review._id" cols="12">
          <v-hover v-slot:default="{ hover }">
            <v-card :elevation="hover ? 5 : 0" class="reviewCard" :class="hover ? 'cardHover' : ''">
              <v-card-title class="text-subtitle-1 pb-2">
                <v-row class="px-3">
                  <div class="text-subtitle-1">
                    {{ review.user.fullname }}
                  </div>
                  <v-rating
                    :value="review.stars"
                    color="amber"
                    dense
                    half-increments
                    readonly
                    size="14"
                    class="ml-1"
                  />
                </v-row>
              </v-card-title>
              <v-card-subtitle />
              <v-card-text>
                {{ review.description }}
              </v-card-text>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
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
    getLowest () {
      let lowest = 0
      for (let i = 0; i < this.product.subProducts.length; i++) {
        if (this.product.subProducts[i].price < this.product.subProducts[lowest].price) {
          lowest = i
        }
      }
      return lowest
    },
    getReviews () {
      return this.product.reviews.filter(review => review.description !== '')
    }
  },
  mounted () {
    this.selected = this.product.subProducts[this.getLowest]
  },
  methods: {
    addToCart () {
      this.$store.commit('appendCart', {
        product: this.product,
        subProduct: this.selected
      })
    },
    starCount (reviews) {
      let starSum = 0
      for (let i = 0; i < reviews.length; i++) {
        starSum += reviews[i].stars
      }
      return parseFloat((reviews.length !== 0 ? starSum / reviews.length : 0).toFixed(1))
    },
    getItemText (item) {
      return `₹${item.price} / ${item.quantity} Kg`
    }
  }

}
</script>

<style scoped lang="scss" src="~/assets/product.scss" />
