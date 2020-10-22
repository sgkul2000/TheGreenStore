<template>
  <div id="addressMain">
    <v-row>
      <v-col
        v-for="address in addresses"
        :key="address._id"
        cols="12"
        md="6"
      >
        <v-card
          v-ripple="{ class: 'primary--text' }"
          class=""
          :class="address._id === addressSelected._id ? 'primaryBG' : ''"
          outlined
          :elevation="0"
          @click="select(address)"
        >
          <v-card-text>
            {{ address.buildingDetails }} <br>
            {{ address.area }} <br>
            {{ address.landmark }} <br>
            {{ address.cityName }} - {{ address.pincode }} <br>
            {{ address.stateName }} <br>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  async fetch () {
    const { data } = await this.$axios.get('/api/address/')
    this.addresses = data.data
  },
  data () {
    return {
      addressSelected: {},
      addresses: []
    }
  },
  computed: {
    ...mapGetters({
      selectedAddress: 'getOrderAddress'
    })
  },
  methods: {
    select (item) {
      this.$store.commit('setOrderAddress', item)
    }
  }
}
</script>

<style lang="scss" scoped src="~/assets/address.scss" />
