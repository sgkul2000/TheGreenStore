<template>
  <div id="paymentMain">
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card
          v-ripple="{ class: 'primary--text' }"
          class=""
          outlined
          :elevation="0"
        >
          <v-card-text>
            Cash on Delivery
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card
          v-ripple="{ class: 'primary--text' }"
          class=""
          outlined
          :elevation="0"
        >
          <v-card-text>
            Pay with Razor Pay
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
