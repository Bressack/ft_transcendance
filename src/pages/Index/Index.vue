<template>
  <q-page>
    <!-- <q-img src="src/assets/pong_wallpaper.png"/> -->
    <SearchUser/>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SearchUser from './components/SearchUser.vue'

export default defineComponent({
  name: 'Index',
  components: { SearchUser },
  props: {},
  data() {
    return {

    }
  },
  methods: {

  },
});
</script>

<style lang="sass" scoped>

</style>
