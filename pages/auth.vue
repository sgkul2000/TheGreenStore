<template>
  <div class="">
    <v-row no-gutters>
      <v-col :align-self="'center'">
        <v-card
          :loading="loading"
          class="mx-auto my-12 py-4 px-4"
          max-width="500px"
          outlined
          :elevation="15"
        >
          <v-card-title>Login</v-card-title>
          <v-card-text>
            <v-text-field v-model="email" :rules="rules" label="E-mail" :disabled="loading" />
            <v-text-field
              v-model="password"
              :append-icon="isPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="isPassword ? 'text' : 'password'"
              :rules="passwordRules"
              label="Password"
              required
              :disabled="loading"
              @click:append="isPassword = !isPassword"
            />
            <v-btn
              elevation="3"
              large
              text
              block
              depressed
              color="primary"
              :loading="loading"
              @click="submitForm"
            >
              Login
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  layout: 'none',
  data () {
    return {
      loading: true,
      email: '',
      password: '',
      isPassword: false,
      rules: [
        value => !!value || 'Required.',
        value => (value || '').length <= 20 || 'Max 20 characters',
        (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      ],
      passwordRules: [
        v => !!v || 'Password is required'
      ]
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    async submitForm () {
      this.loading = true
      await this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      })
      // console.log(this.$auth.user)
      this.loading = false
    }
  }
}
</script>
