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
                    <v-img :aspect-ratio="1" width="100%" :src="'/api/' + product.image" :alt="'Product Image - ' + product.name" />
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
                      v-if="product.subProducts.length >0"
                      v-model="selected"
                      :items="product.subProducts"
                      :item-text="getItemText"
                      :item-value="(item) => item"
                      dense
                      hide-details
                      solo
                      class="py-3"
                    />
                    <v-row>
                      <v-col>
                        <v-btn color="primary" class="" block @click="productEditModal = true">
                          Edit
                        </v-btn>
                      </v-col>
                      <v-col>
                        <v-btn color="error" class="" block @click="productDeleteModal = true">
                          Delete
                        </v-btn>
                      </v-col>
                      <v-col>
                        <v-btn v-if="product.isSpecial === false" color="orange" class="secondary" block @click="changeSpeciality()">
                          Mark as special
                        </v-btn>
                        <v-btn v-else color="orange" class="secondary" block @click="changeSpeciality()">
                          Mark as regular
                        </v-btn>
                      </v-col>
                      <v-col>
                        <v-btn
                          v-if="product.isAvailable"
                          color="error"
                          class=""
                          block
                          @click="changeAvailability()"
                        >
                          Mark as Unavailable
                        </v-btn>
                        <v-btn
                          v-else
                          color="success"
                          class=""
                          block
                          @click="changeAvailability()"
                        >
                          Mark as available
                        </v-btn>
                      </v-col>
                    </v-row>
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
              <v-btn
                fab
                small
                color="primary"
                class="mx-2"
                @click="() => {
                  subProductToDelete = subProduct
                  subproductDeleteModal = true
                }"
              >
                <v-icon>
                  mdi-delete-outline
                </v-icon>
              </v-btn>
              <v-btn
                fab
                small
                color="primary"
                class="mx-2"
                @click="() => {
                  subProductToEdit = subProduct
                  editSubProductModal = true
                }"
              >
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
          <v-btn block text color="primary" @click="createSubProductModal = true">
            Add Sub-Product
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <EditProduct :product="product" :status="productEditModal" @hide="hide('productEditModal')" @refresh="refreshProduct" />
    <DeleteProduct :status="productDeleteModal" @hide="productDeleteModal = false" @delete="deleteProduct()" />
    <DeleteSubProduct
      :status="subproductDeleteModal"
      @delete="deleteSubProduct()"
      @hide="() => {
        subproductDeleteModal = false
        subProductToDelete = {}}"
    />
    <CreateSubProduct :status="createSubProductModal" :productid="product._id" @hide="createSubProductModal = false" @refresh="refreshProduct()" />
    <EditSubProduct
      :status="editSubProductModal"
      :subproduct="subProductToEdit"
      @hide="() => {
        editSubProductModal = false
        subProductToEdit = null
      }"
      @refresh="refreshProduct()"
    />
  </div>
</template>

<script>
import EditProduct from '~/components/modals/EditProduct'
import DeleteProduct from '~/components/modals/DeleteProduct'
import DeleteSubProduct from '~/components/modals/DeleteSubProduct'
import CreateSubProduct from '~/components/modals/CreateSubProduct'
import EditSubProduct from '~/components/modals/EditSubProduct'
export default {
  layout: 'admin_layout',
  middleware: ['user-auth', 'admin-auth'],
  components: {
    EditProduct,
    DeleteProduct,
    DeleteSubProduct,
    CreateSubProduct,
    EditSubProduct
  },
  async asyncData ({ app, params }) {
    const { data } = await app.$axios.get('/api/product/' + params.name)
    return { product: data.data }
  },
  data () {
    return {
      selected: {},
      productEditModal: false,
      productDeleteModal: false,
      subproductDeleteModal: false,
      editSubProductModal: false,
      subProductToEdit: null,
      createSubProductModal: false,
      subProductToDelete: null,
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
  watch: {
    product (newVal, oldVal) {
      if (newVal.subProducts.length > 0) {
        this.selected = this.product.subProducts[this.getLowest]
      }
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
      this.$axios.get('/api/product/' + this.product._id).then(({ data }) => {
        this.product = data.data
      }).catch((err) => {
        console.error(err)
        this.notify.error({
          title: 'Failed to load data!',
          message: err.reponse ? err.response.data.message : ''
        })
      })
    },
    deleteProduct () {
      this.$axios.delete('/api/product/' + this.product._id).then(({ data }) => {
        this.$notify.success({
          title: 'Successfully deleted product!'
        })
        this.productDeleteModal = false
        this.$router.push({ name: 'admin-products' })
      }).catch((err) => {
        console.error(err)
        this.productDeleteModal = false
        this.$notify.error({
          title: 'Failed to delete',
          message: err.response ? err.response.data.message : ''
        })
      })
    },
    deleteSubProduct () {
      this.$axios.delete(`/api/product/${this.product._id}/subproduct/${this.subProductToDelete._id}`).then(({ data }) => {
        this.refreshProduct()
        this.$notify.success({
          title: 'Successfully deleted Subproduct'
        })
        this.subProductToDelete = null
        this.subproductDeleteModal = false
      }).catch((err) => {
        this.subproductDeleteModal = false
        console.error(err)
        this.$notify.error({
          title: 'Failed to delete subproduct!',
          message: err.response ? err.response.data.message : ''
        })
      })
    },
    changeAvailability () {
      this.$axios.put(`/api/product/${this.product._id}`, {
        isAvailable: !this.product.isAvailable
      }).then(({ data }) => {
        this.$notify.success({
          title: `Changed availability to ${!this.product.isAvailable} successfully!`
        })
        this.refreshProduct()
      }).catch((err) => {
        console.log(err)
        this.$notify.error({
          title: 'Failed to change availability!',
          message: err.response ? err.response.data.message : ''
        })
      })
    },
    changeSpeciality () {
      this.$axios.put(`/api/product/${this.product._id}`, {
        isSpecial: !this.product.isSpecial
      }).then(({ data }) => {
        this.$notify.success({
          title: `Changed speciality to ${!this.product.isSpecial} successfully!`
        })
        this.refreshProduct()
      }).catch((err) => {
        console.log(err)
        this.$notify.error({
          title: 'Failed to change speciality!',
          message: err.response ? err.response.data.message : ''
        })
      })
    }
  }
}
</script>

<style scoped lang="scss" src="~/assets/product.scss" />
<style scoped lang="scss" src="~/assets/adminProduct.scss" />
