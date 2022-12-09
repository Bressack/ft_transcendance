<template>
  <q-page class="row justify-center items-center">
    <q-card class="form q-pa-lg" style="width: 400px">
      <q-btn-toggle
        v-model="signOpt"
        @click="switchMode"
        spread
        class="my-custom-toggle q-pa-md"
        no-caps
        rounded
        unelevated
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
          {label: 'SingIn', value: true},
          {label: 'SignUp', value: false}
        ]"
      />
      <q-form
        v-if="signOpt"
        @submit="onSubmitSignIn"
        class="q-gutter-md"
      >
        <q-input
        class="input"
          filled
          v-model="username"
          label="Username"
          lazy-rules
        />

        <q-input
        class="input"
          filled
          v-model="password"
          label="Password"
          lazy-rules
          type="password"
        />
        <q-card-actions class="q-mt-md">
          <q-btn label="Connect" type="submit" color="primary" class="submitbutton"/>
        </q-card-actions>
        <q-card-actions>
          <q-btn label="Connect with 42" type="submit" color="primary" class="submitbutton"/>
        </q-card-actions>
      </q-form>

      <q-form
        v-else
        @submit="onSubmitSignUp"
        class="q-gutter-md"
      >
        <q-input
        class="input"
          filled
          v-model="username"
          label="Username"
          lazy-rules
        />

        <q-input
        class="input"
          filled
          v-model="email"
          label="Email"
          lazy-rules
        />

        <q-input
        class="input"
          filled
          v-model="password"
          label="Password"
          lazy-rules
          type="password"
        />
        <q-card-actions class="q-mt-md">
          <q-btn label="signup" type="submit" color="primary" class="submitbutton"/>
        </q-card-actions>
        <q-card-actions>
          <q-btn label="signup with 42" type="submit" color="primary" class="submitbutton"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
// import axios from 'axios'
import api from '../services/api.service'

export default defineComponent({
  name: 'Auth',
  components: {},
  props: {},
  data() {
    return {
      username: '' as string,
      password: '' as string,
      email: '' as string,
      signOpt: true as boolean
    }
  },
  methods: {
    switchMode() {
      this.username = ''
      this.password = ''
      this.email = ''
    },
    onSubmitSignIn() {
      let that = this
      let payload: object = Object({
        username: this.username,
        password: this.password,
      })

      api.login(payload)
      .then(function (/* data */) {
        that.$router.replace('/')
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    onSubmitSignUp() {
      let that = this
      let payload: object = Object({
        username: this.username,
        email: this.email,
        password: this.password,
      })

      api.signup(payload)
      .then(function (/* data */) {
        that.$router.replace('/')
      })
      .catch(function (error) {
        console.log(error);
      })
    },
  },
});
</script>

<style lang="sass" scoped>
.form
  justify-content: center
  align-items: center
  background-color: $bg-secondary

.input
  background-color: $bg-primary

.submitbutton
  width: 100%


</style>
