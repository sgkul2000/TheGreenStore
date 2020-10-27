<template>
  <v-dialog :value="dialog" width="500px" @input="$emit('hide')">
    <v-card
      :loading="loading"
      class=""
      :elevation="6"
    >
      <v-form
        class="py-4"
      >
        <v-card-title>Are you sure?</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-btn
                elevation="3"
                large
                text
                block
                depressed
                color="primary"
                :loading="loading"
                class=""
                @click="$emit('delete')"
              >
                Yes
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn text color="error" class="" block @click="$emit('hide')">
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
    }
  },
  data () {
    return {
      loading: true
    }
  },
  computed: {
    dialog () {
      return this.status
    }
  },
  mounted () {
    this.loading = false
  }
}
</script>

<style>

</style>
