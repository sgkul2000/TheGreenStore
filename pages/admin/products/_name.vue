<template>
  <div id="adminProductMain">
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
                    <v-btn color="primary" class="my-3" block @click="productEditModal = true">
                      Edit
                    </v-btn>
                    <v-btn color="error" class="my-3" block>
                      Delete
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
        <v-col v-for="subProduct in product.subProducts" :key="subProduct._id">
          <v-card outined class="my-3">
            <div class="editBtns">
              <v-btn fab small color="primary" class="mx-2">
                <v-icon>
                  mdi-delete-outline
                </v-icon>
              </v-btn>
              <v-btn fab small color="primary" class="mx-2">
                <v-icon>
                  mdi-pencil-outline
                </v-icon>
              </v-btn>
            </div>
            <v-card-subtitle class="pb-2">
              #{{ subProduct._id }}
            </v-card-subtitle>
            <v-card-text class="black--text">
              Price : {{ subProduct.price }} <br>
              Quantity : {{ subProduct.quantity }}
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-btn block text color="primary">
            Add Sub-Product
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <EditProduct :product="product" :status="productEditModal" @hide="hide('productEditModal')" @refresh="refreshProduct" />
  </div>
</template>

<script>
import EditProduct from '~/components/modals/editProduct'
export default {
  components: {
    EditProduct
  },
  async asyncData ({ app, params }) {
    const { data } = await app.$axios.get('/api/product/' + params.name)
    return { product: data.data }
  },
  data () {
    return {
      selected: {},
      productEditModal: false,
      product: {}
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
    }
  },
  mounted () {
    this.selected = this.product.subProducts[this.getLowest]
  },
  methods: {
    getItemText (item) {
      return `₹${item.price} / ${item.quantity} Kg`
    },
    hide (variable) {
      this[variable] = false
    },
    refreshProduct () {
      this.axios.get('/api/product/' + this.product._id).then(({ data }) => {
        this.product = data.data
      }).catch((err) => {
        console.error(err)
        this.notify.error({
          title: 'Failed to load data!',
          message: err.reponse ? err.response.data.message : ''
        })
      })
    }
  }

}
</script>

<style scoped lang="scss" src="~/assets/product.scss" />
<style scoped lang="scss" src="~/assets/adminProduct.scss" />
