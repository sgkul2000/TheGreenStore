<template>
  <div id="productsMain">
    <div class="text-h3">
      Products
    </div>
    <v-divider class="my-6" light />
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Filters
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-select
            :items="['None','Price - low to high','Price - high to low']"
            label="Sort By"
            value="None"
            solo
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-container fluid>
      <v-row
        v-if="isLoading"
        dense
      >
        <v-col
          v-for="product in products"
          :key="product.name"
          cols="6"
          sm="4"
        >
          <productCard :product="product" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// import axios from 'axios'
import { mapGetters } from 'vuex'
import productCard from '~/components/products/productCard'
export default {
  components: {
    productCard
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters({
      products: 'getProducts'
    }),
    isLoading () {
      return this.products !== {}
    }
  },
  created () {
    this.$store.dispatch('fetchProducts')
  }
}
</script>

<style lang="scss" src="~/assets/products.scss" scoped />
