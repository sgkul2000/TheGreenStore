<template>
  <div id="userMain">
    <v-card id="profileMain" class="my-4 BtnWrapper">
      <v-btn icon class="editBtn">
        <v-icon>
          mdi-pencil-outline
        </v-icon>
      </v-btn>
      <v-card-title>
        <div class="text-h4">
          Profile
        </div>
      </v-card-title>
      <v-card-text class="black--text">
        <v-divider light class="my-2" />
        <div class="Info">
          <v-row>
            <v-col cols="12" md="6" class="black--text text-subtitle-1 px-8">
              Id : {{ user._id }}
            </v-col>
            <v-col cols="12" md="6" class="black--text text-subtitle-1 px-8">
              Email : {{ user.email }}
            </v-col>
            <v-col cols="12" md="6" class="black--text text-subtitle-1 px-8">
              Fullname : {{ user.fullname }}
            </v-col>
            <v-col cols="12" md="6" class="black--text text-subtitle-1 px-8">
              Username : {{ user.username }}
            </v-col>
            <v-col cols="12" md="6" class="black--text text-subtitle-1 px-8">
              Phone Number : {{ user.phone }}
            </v-col>
            <v-col cols="12" md="6" class="black--text text-subtitle-1 px-8">
              Referral Code : {{ user.referralCode }}
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
    <v-card id="addressesMain" class="my-4">
      <v-card-title>
        <div class="text-h4">
          Addresses
        </div>
      </v-card-title>
      <v-card-text class="black--text">
        <v-divider light class="my-2" />
        <div class="Info">
          <v-row>
            <v-col v-for="address in user.addresses" :key="address._id" cols="12" md="6" class="black--text text-subtitle-1 px-8">
              <AddressCard :address="address" @refresh="getUser()" />
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
    <EditProfile :fullname="user.fullname" :phone="user.phone" />
    <EditAddressModal />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import EditProfile from '~/components/modals/EditProfile'
import EditAddressModal from '~/components/modals/EditAddressModal'
import AddressCard from '~/components/profile/AddressCard'
export default {
  middleware: 'user-auth',
  components: {
    EditProfile,
    AddressCard,
    EditAddressModal
  },
  async asyncData ({ app, store }) {
    try {
      var { data } = await app.$axios.get('/api/auth/')
    } catch (err) {
      console.error(err)
    }
    return { user: data.user }
  },
  data () {
    return {
      user: {}
    }
  },
  computed: {
    ...mapGetters({
      editProfileModal: 'modals/getEditProfileModal',
      editAddressModal: 'modals/getEditAddressModal'
    })
  },
  watch: {
    editProfileModal (val) {
      if (val === false) {
        this.getUser()
      }
    },
    editAddressModal (val) {
      if (val === false) {
        this.getUser()
      }
    }
  },
  methods: {
    getUser () {
      this.$axios.get('/api/auth').then(({ data }) => {
        this.user = data.user
      }).catch((err) => {
        console.error(err)
      })
    }
  }
}
</script>

<style scoped lang="scss" src="~/assets/profile.scss" />
