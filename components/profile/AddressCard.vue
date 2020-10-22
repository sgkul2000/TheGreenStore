<template>
  <div class="addressCardMain">
    <v-card outlined class="BtnWrapper">
      <v-card-text class="black--text">
        <div class="editBtn">
          <div class="d-flex align-items-center justify-content-center flex-column">
            <v-btn icon class="" @click="showEditor">
              <v-icon>
                mdi-pencil-outline
              </v-icon>
            </v-btn>
            <v-btn icon class="" @click="deleteDialog = true">
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </div>
        </div>
        <div class="pr-5">
          {{ address.buildingDetails }} <br>
          {{ address.area }} <br>
          {{ address.landmark }} <br>
          {{ address.cityName }} - {{ address.pincode }} <br>
          {{ address.stateName }} <br>
        </div>
      </v-card-text>
    </v-card>
    <v-dialog :value="deleteDialog" width="500px" @input="deleteDialog = false">
      <v-card
        :elevation="6"
      >
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-btn
                elevation="3"
                large
                text
                block
                depressed
                color="primary"
                class=""
                @click="deleteAddress()"
              >
                Delete
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                elevation="3"
                large
                text
                block
                depressed
                color="error"
                class=""
                @click="deleteDialog = false"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    address: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      deleteDialog: false,
      delete: false
    }
  },
  mounted () {
    this.$emit('helloworld')
  },
  methods: {
    showEditor () {
    //   console.log('this.address = ', this.address._id)
      this.$store.commit('modals/changeEditAddressModal', {
        status: true,
        id: this.address._id
      })
    },
    deleteAddress () {
      this.$axios.delete('/api/address/' + this.address._id).then(({ data }) => {
        this.$notify.success({
          title: 'Address deleted successfully'
        })
        this.deleteDialog = false
        this.$emit('refresh')
      }).catch((err) => {
        console.error(err)
        this.$notify.error({
          title: 'Failed to delete',
          message: err.response.data.message || ''
        })
      })
      this.deleteDialog = false
    }
  }
}
</script>

<style scoped lang="scss" src="~/assets/profile.scss" />
