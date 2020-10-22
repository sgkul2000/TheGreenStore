<template>
  <v-dialog :value="status" width="500px" @input="hideModal">
    <v-card
      :loading="loading"
      class=""
      :elevation="6"
    >
      <v-form
        v-model="isValid"
        class="py-4"
      >
        <v-card-title>Edit Address</v-card-title>
        <v-card-text v-if="address !== {}">
          <v-text-field
            v-model="address.buildingDetails"
            :rules="[rules.required]"
            label="Building Details"
            :disabled="loading"
            type="text"
            required
          />
          <v-text-field
            v-model="address.area"
            :rules="[rules.required]"
            label="Area"
            :disabled="loading"
            type="text"
            required
          />
          <v-text-field
            v-if="address.landmark"
            v-model="address.landmark"
            label="Landmark"
            :disabled="loading"
            type="text"
          />
          <v-text-field
            v-model="address.cityName"
            :rules="[rules.required]"
            label="City"
            :disabled="loading"
            type="text"
            required
          />
          <v-text-field
            v-model="address.stateName"
            :rules="[rules.required]"
            label="State"
            :disabled="loading"
            type="text"
            required
          />
          <v-text-field
            v-model="address.pincode"
            type="number"
            :rules="[rules.required]"
            label="Phone Number"
            required
            :disabled="loading"
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
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      loading: true,
      isValid: true,
      address: {
        buildingDetails: '',
        area: '',
        cityName: '',
        stateName: '',
        pincode: 0
      },
      rules: {
        required: v => !!v || 'This field is required',
        pincode: v => v.toString().length === 6 || 'Invalid pincode'
      }
    }
  },
  computed: {
    ...mapGetters({
      editAddressModal: 'modals/getEditAddressModal'
    }),
    status () {
      return this.editAddressModal.status
    }
  },
  watch: {
    editAddressModal (val) {
      if (val) {
        this.getAddress()
      }
    }
  },
  mounted () {
    this.loading = false
    this.newFullname = this.fullname
    this.newPhone = this.phone
  },
  methods: {
    submitForm () {
      this.loading = true
      this.$axios.put('api/address/' + this.address._id, this.address).then(({ data }) => {
        console.log(data)
        this.$notify.success({
          title: 'Edit Successful'
        })
        this.loading = false
        this.hideModal()
      }).catch((err) => {
        this.loading = false
        console.error(err)
        this.$notify.error({
          title: 'Edit failed!',
          message: err.response.data.message ? err.response.data.message : ''
        })
      })
    },
    hideModal () {
      this.$store.commit('modals/changeEditAddressModal', false)
    },
    getAddress () {
      this.loading = true
      console.log('getting address', this.editAddressModal)
      this.$axios.get('/api/address/' + this.editAddressModal.id).then(({ data }) => {
        console.log(data)
        this.address = data.data
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.error(err)
      })
    }
  }
}
</script>

<style>

</style>
