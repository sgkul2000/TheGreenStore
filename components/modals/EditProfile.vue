<template>
  <v-dialog :value="editProfileModal" width="500px" @input="hideModal">
    <v-card
      :loading="loading"
      class=""
      :elevation="6"
    >
      <v-form
        v-model="isValid"
        class="py-4"
      >
        <v-card-title>Edit Profile</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newFullname"
            :rules="[rules.required]"
            label="Fullname"
            :disabled="loading"
            type="text"
            required
          />
          <v-text-field
            v-model="newPhone"
            type="text"
            :rules="[rules.required, rules.phone]"
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
  props: {
    fullname: {
      type: String,
      default: ''
    },
    phone: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      newFullname: '',
      newPhone: 0,
      loading: true,
      isValid: true,
      rules: {
        required: v => !!v || 'This field is required',
        phone: v => v.toString().length === 10 || 'Valid phone number required'
      }
    }
  },
  computed: {
    ...mapGetters({
      editProfileModal: 'modals/getEditProfileModal'
    })
  },
  mounted () {
    this.loading = false
    this.newFullname = this.fullname
    this.newPhone = this.phone
  },
  methods: {
    submitForm () {
      this.loading = true
      this.$axios.put('api/auth/', {
        fullname: this.newFullname,
        phone: this.newPhone
      }).then(({ data }) => {
        console.log(data)
        this.$notify.success({
          title: 'Edit Successful'
        })
        this.loading = false
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
      this.$store.commit('modals/changeEditProfileModal', false)
    }
  }
}
</script>

<style>

</style>
