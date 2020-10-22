<template>
  <v-dialog :value="feedbackDialog" width="500px" @input="hideModal">
    <v-card elevation="5">
      <v-card-title>
        We would love to hear from you!
      </v-card-title>
      <v-card-subtitle class="pb-0">
        your feedback is very valuable to us.
      </v-card-subtitle>
      <v-card-text>
        <v-row>
          <v-col cols="12" class="d-flex justify-start align-start pb-0">
            <v-rating
              v-model="stars"
              hover
              length="5"
              size="20"
              color="amber"
              class="mx-auto"
            />
          </v-col>
          <v-col cols="12" class="py-0">
            <v-textarea
              v-model="description"
              label="Describe your experience"
              hint="Write what you feel about us!"
            />
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" block>
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      stars: 0,
      description: ''
    }
  },
  computed: {
    ...mapGetters({
      feedbackDialog: 'modals/getFeedbackModal'
    })
  },
  methods: {
    hideModal () {
      this.$store.commit('modals/changeFeedbackModal')
    }
  }
}
</script>

<style>

</style>
