<template>
  <div class="">
    <v-row no-gutters>
      <v-col :align-self="'center'">
        <v-card
          :loading="loading"
          class="mx-auto my-12 px-4"
          max-width="60%"
          outlined
          :elevation="15"
        >
          <v-form v-model="isValid" refs="form" class="py-4">
            <v-card-title>Signup</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="fullname"
                :rules="[rules.required]"
                label="Fullname"
                :disabled="loading"
              />
              <v-text-field
                v-model="username"
                :rules="[rules.required]"
                label="Username"
                :disabled="loading"
              />
              <v-text-field
                v-model="email"
                :rules="rules.email"
                label="E-mail"
                :disabled="loading"
              />
              <v-text-field
                v-model="phone"
                type="number"
                :rules="[rules.phone, rules.required]"
                label="Phone number"
                :disabled="loading"
              />
              <v-text-field
                v-model="password"
                :append-icon="isPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="isPassword ? 'text' : 'password'"
                :rules="[rules.required]"
                label="Password"
                required
                :disabled="loading"
                @click:append="isPassword = !isPassword"
              />
              <v-text-field
                v-model="confirmPassword"
                :append-icon="isPasswordconfirm ? 'mdi-eye' : 'mdi-eye-off'"
                :type="isPasswordconfirm ? 'text' : 'password'"
                :rules="[rules.required, rules.confirm]"
                label="Confirm Password"
                required
                :disabled="loading"
                @click:append="isPasswordconfirm = !isPasswordconfirm"
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
                Signup
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
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  layout: 'basic',
  data () {
    return {
      isValid: false,
      loading: true,
      username: '',
      fullname: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      isPassword: false,
      isPasswordconfirm: false,
      rules: {
        email: [
          value => !!value || 'This field is required.',
          (value) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Invalid e-mail.'
          }
        ],
        required: v => !!v || 'This field is required',
        phone: v => v.toString().length === 10 || 'Valid phone number required',
        confirm: v => this.confirmPassword === this.password || 'Passwords don\'t match'
      }
    }
  },
  mounted () {
    this.loading = false
  },
  methods: {
    submitForm () {
      this.loading = true
      // this.$refs.form.validate()
      if (!this.isValid) {
        this.$notify.error({
          title: 'Form validation failed'
        })
        this.loading = false
        return
      }
      this.$axios.post('/auth/signup', {
        email: this.email,
        password: this.password,
        username: this.username,
        phone: this.phone,
        fullname: this.fullname

      }).then((res) => {
        console.log(res.data)
        this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        }).then(() => {
          this.$notify.success({
            title: 'Login successful!'
          })
        }).catch((err) => {
          this.$notify({
            title: 'Login failed',
            message: err.response.data.error
          })
        })
        this.$router.push('/login')
      }).catch((err) => {
        this.$notify.error({
          title: 'Signup Failed',
          message: err.response.data.error ? err.response.data.error : ''
        })
      })
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped src="~/assets/auth.scss" />
