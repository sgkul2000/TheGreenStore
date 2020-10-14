<template>
  <v-dialog :value="loginModal" width="500px" @input="hideModal">
    <v-card
      :loading="loading"
      class=""
      outlined
      :elevation="15"
    >
      <v-form
        v-model="isValid"
        class="py-4"
      >
        <v-card-title>Login</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="email"
            :rules="rules"
            label="E-mail / Username"
            :disabled="loading"
          />
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
            <NuxtLink
              class="nuxtLink"
              to="/"
            >
              Sign up
            </NuxtLink>
            <NuxtLink
              class="nuxtLink"
              to="/"
            >
              Forgot password
            </NuxtLink>
          </div>
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
      isValid: false,
      loading: true,
      email: '',
      password: '',
      isPassword: false,
      rules: [
        value => !!value || 'Required.',
        value => (value || '').length <= 20 || 'Max 20 characters',
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
      loginModal: 'modals/getLoginModal'
    })
  },
  mounted () {
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
        // redirect
        this.$store.commit('modals/changeLoginModal', null)
      } else {
        this.$notify.error({
          title: 'Login failed.',
          message: 'Please try again'
        })
      }
      console.log(this.$auth)
      this.loading = false
    },
    hideModal () {
      this.$store.commit('modals/changeLoginModal', null)
    }
  }
}
</script>

<style lang="scss" scoped src="~/assets/auth.scss" />
