<template>
  <v-dialog
    :value="dialog"
    width="600px"
    @input="hideModal"
  >
    <v-card
      :loading="loading"
      class=""
      :elevation="6"
    >
      <v-form
        v-model="isValid"
        class="py-4"
      >
        <v-card-title>Edit Product</v-card-title>
        <v-card-text v-if="product !== {}">
          <v-text-field
            v-model="name"
            :rules="[rules.required]"
            label="Name"
            :disabled="loading"
            type="text"
            required
          />
          <v-textarea
            v-model="description"
            :disabled="loading"
            label="Description"
            hint="Describe the product or maybe add a few fun facts."
          />
          <v-checkbox
            v-model="isSpecial"
            :disabled="loading"
            label="Mark as special"
          />
          <v-btn
            elevation="3"
            large
            text
            block
            depressed
            color="primary"
            :loading="loading"
            class="mb-5"
            @click="submitForm"
          >
            Submit
          </v-btn>
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
    product: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: true,
      isValid: true,
      isSpecial: false,
      name: '',
      description: '',
      rules: {
        required: v => !!v || 'This field is required',
        pincode: v => v.toString().length === 6 || 'Invalid pincode'
      }
    }
  },
  computed: {
    dialog () {
      return this.status
    }
  },
  watch: {
    dialog (val) {
      if (val === true) {
        this.isSpecial = this.product.isSpecial
        this.name = this.product.name
        this.description = this.product.description
      }
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    submitForm () {
      this.loading = true
      console.log('/api/product/' + this.product._id)
      this.$axios.put('/api/product/' + this.product._id, {
        name: this.name,
        description: this.description,
        isSpecial: this.isSpecial
      }).then(({ data }) => {
        console.log(data)
        this.$emit('hide')
        this.$emit('refresh')
        this.$notify.success({
          title: 'Edit successful'
        })
      }).catch((err) => {
        console.error(err)
        this.$notify.error({
          title: 'Edit Failed!',
          message: err.response ? err.response.data.message : ''
        })
      })
      this.loading = false
    },
    hideModal () {
      this.$emit('hide')
    }
  }
}
</script>

<style>
</style>
