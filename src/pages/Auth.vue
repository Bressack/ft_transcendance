<template>
  <q-page class="row justify-center items-center q-flex">
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
          {label: 'SIGN IN', value: true},
          {label: 'SIGN UP', value: false}
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
      <q-form>
        <q-card class="q-pa-md q-ma-sm text-center text-bold text-h6" v-for="user in preSetUsers" :key="user" @click="quickconnect(user)">
          {{ user.username }}
        </q-card>
      </q-form>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const _preSetUsers = [
  {
    username: 'MelindaScott',
    password: 'null',
  },
  {
    username: 'GrâceChaï',
    password: 'null',
  },
  {
    username: 'SvenRaphaëlle',
    password: 'null',
  },
  // {
  //   username: 'toto',
  //   password: 'totototo',
  // },
]

export default defineComponent({
  name: 'Auth',
  components: {},
  props: {},
  data() {
    return {
      preSetUsers: _preSetUsers as [],
      username: '' as string,
      password: '' as string,
      email: '' as string,
      signOpt: true as boolean
    }
  },
  methods: {
    quickconnect(user: object) {
      this.username = user.username
      this.password = user.password
      this.onSubmitSignIn()
    },
    switchMode() {
      this.username = ''
      this.password = ''
      this.email = ''
    },
    signIn(username: string, password: string) {
      let that = this
      let payload: object = Object({
        username: username,
        password: password,
      })

      this.$api.login(payload)
      .then( (/* data */) => {
		console.log('success')
        this.$router.push('/')
      })
      .catch((error) =>  {
        that.$q.notify({
            // position: 'center',
            // multiLine: true,
            type: 'negative',
            message: 'incorrect username or password'
          })
        console.log(error);
      })
    },
    onSubmitSignIn() {
      this.signIn(this.username, this.password)
    },
    onSubmitSignUp() {
      let that = this
      let payload: object = Object({
        username: this.username,
        email: this.email,
        password: this.password,
      })

      this.$api.signup(payload)
      .then(function (/* data */) {
        that.$router.replace('/')
      })
      .catch(function (error) {
        // if (error.response)
        console.log(error.response.data)
        for (let i = 0; i < error.response.data.message.length; i++) {
          that.$q.notify({
              type: 'negative',
              message: error.response.data.message[i]
            })
        }
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
  background-color: white

.submitbutton
  width: 100%

.q-flex
  display: flexbox

</style>
