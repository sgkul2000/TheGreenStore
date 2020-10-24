<template>
  <div class="">
    <v-row no-gutters>
      <v-col :align-self="'center'">
        <v-card
          :loading="loading"
          class="mx-auto my-12 px-4"
          max-width="500px"
          outlined
          :elevation="15"
        >
          <v-form v-model="isValid" class="py-4">
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
                class="mb-5"
                @click="submitForm"
              >
                Login
              </v-btn>
              <div class="authLinks">
                <NuxtLink class="nuxtLink" to="/">
                  Sign up
                </NuxtLink>
                <NuxtLink class="nuxtLink" to="/">
                  Forgot password
                </NuxtLink>
              </div>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'basic',
  data () {
    return {
      isValid: false,
      loading: true,
      email: '',
      password: '',
      isPassword: false,
      rules: [
        value => !!value || 'Required.',
        (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          if (!value.includes('@')) {
            return true
          } else {
            return pattern.test(value) || 'Invalid e-mail.'
          }
        }
      ],
      passwordRules: [
        v => !!v || 'Password is required'
      ]
    }
  },
  computed: {
    ...mapGetters({
      loginError: 'hasAuthFailed'
    })

  },
  mounted () {
    console.log('showing errors', this.loginError)
    if (this.loginError) {
      this.$notify.warning({ title: 'Please login first!' })
      this.$store.commit('middlewareErrors', false)
    }
    this.loading = false
  },
  methods: {
    async submitForm () {
      this.loading = true
      if (!this.isValid) {
        this.$notify.error({
          title: 'Form validation failed!'
        })
        this.loading = false
        return
      }
      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        })
      } catch (err) {
        this.$notify.error({
          title: 'Login Failed',
          message: err.response.data.error
        })
        return
      }
      if (this.$auth.loggedIn) {
        this.$notify.success({
          title: 'Login Successful!'
        })
        // this.$router.push('/')
        this.$router.push({ path: '/' })
      } else {
        this.$notify.error({
          title: 'Login failed.',
          message: 'Please try again'
        })
      }
      console.log(this.$auth)
      this.loading = false
    }
  }

}
</script>

<style lang="scss" scoped src="~/assets/auth.scss" />
