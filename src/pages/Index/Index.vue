<template>
  <q-page>
    <q-img src="src/assets/pong_wallpaper.png"/>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from 'src/services/api.service'
import * as models from 'src/services/api.models'
import { useMeStore } from 'src/stores/me';

export default defineComponent({
  name: 'Index',
  components: { },
  props: {},
  data() {
    return {
      storeMe: useMeStore(),
    }
  },
  methods: {
  },
});
</script>

<style lang="sass" scoped>
</style>
