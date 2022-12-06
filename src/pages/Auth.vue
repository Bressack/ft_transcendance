<template>
  <q-page class="row justify-center items-center">
    <q-card class="form q-pa-lg" style="width: 400px">
      <q-form
        @submit="onSubmit"
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
    }
  },
  methods: {
    onSubmit() {
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
