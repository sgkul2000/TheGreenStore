<template>
  <v-dialog
    :value="dialog"
    width="500px"
    @input="$emit('hide')"
  >
    <v-card
      :loading="loading"
      class=""
      :elevation="6"
    >
      <v-form
        v-model="isValid"
        class="py-4"
        @submit.prevent="submitForm"
      >
        <v-card-title>Create Sub-Product</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="price"
            :rules="[rules.number, rules.required]"
            label="Price (in ₹)"
            :disabled="loading"
            type="number"
            required
          />
          <v-text-field
            v-model="quantity"
            :rules="[rules.required, rules.number]"
            label="Quantity (in Kilograms)"
            :disabled="loading"
            type="number"
            required
          />
          <v-row>
            <v-col>
              <v-btn
                elevation="3"
                large
                text
                block
                depressed
                color="primary"
                :loading="loading"
                class=""
                type="submit"
              >
                Submit
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                :loading="loading"
                text
                color="error"
                class=""
                block
                @click="$emit('hide')"
              >
                CANCEL
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    status: {
      type: Boolean,
      default: false
    },
    subproduct: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: true,
      isValid: true,
      price: 0,
      quantity: 0,
      rules: {
        required: v => !!v || 'This field is required',
        number: (v) => {
          return /^[0-9.]+$/.test(v) || 'This field should contain only numbers'
        }
      }
    }
  },
  computed: {
    dialog () {
      return this.status
    }
  },
  watch: {
    status (val) {
      if (val) {
        this.price = this.subproduct.price
        this.quantity = this.subproduct.quantity
      }
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    submitForm () {
      this.loading = true
      this.$axios.put(`/api/product/${this.productid}/subproduct/${this.subproduct._id}`, {
        price: this.price,
        quantity: this.quantity
      }).then(({ data }) => {
        this.$emit('hide')
        this.$emit('refresh')
        this.$notify.success({
          title: 'Edited sub-product successfully!'
        })
        this.loading = false
      }).catch((err) => {
        console.error(err)
        this.$notify.error({
          title: 'Edit Failed!',
          message: err.response ? err.response.data.message : ''
        })
        this.loading = false
      })
    }
  }
}
</script>

<style>
</style>
