<template>
  <div id="productsMain">
    <div class="text-h3">
      Products
    </div>
    <v-divider class="my-6" light />
    <v-text-field
      v-model="search"
      label="Search"
      placeholder="Search"
      solo
      dense
      hide-details="true"
      prepend-inner-icon="mdi-magnify"
      class="SearchBar grey my-5 mx-3"
    />
    <!-- <v-expansion-panels>
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
    </v-expansion-panels> -->
    <v-container fluid>
      <v-row
        v-if="isLoading"
        dense
      >
        <v-col
          v-for="product in filteredProducts"
          :key="product.name"
          cols="6"
          sm="4"
        >
          <ProductCard :product="product" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ProductCard from '~/components/products/ProductCard'
export default {
  components: {
    ProductCard
  },
  data () {
    return {
      search: ''
    }
  },
  computed: {
    ...mapGetters({
      products: 'getProducts'
    }),
    isLoading () {
      return this.products !== {}
    },
    filteredProducts () {
      if (this.search) {
        return this.products.filter(product => product.name.toUpperCase().includes(this.search.toUpperCase()))
      } else {
        return this.products
      }
    }
  },
  created () {
    this.$store.dispatch('fetchProducts')
  }
}
</script>

<style lang="scss" src="~/assets/products.scss" scoped />
