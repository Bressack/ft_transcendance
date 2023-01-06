<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="q-mt-md">
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Auth from '../pages/Auth.vue'
import api from 'src/services/api.service'

export default defineComponent({
  name: 'LoginLayout',
  components: { Auth },
  props: {
    me: { type: Object, default: {} }
  },
  beforeCreate () {
    let that = this
    api.ping()
    .then(function (status) {
      if (status === 200) {

        that.$router.push('/')
      }
    })
    .catch(function () {})
  },
  unmounted () {

  },
  data() {
    return {
    }
  },
  methods: {},
});
</script>

<style lang="sass">
body
  background-color: $bg-primary !important
  color: grey
</style>

<style lang="sass" scoped>

</style>
