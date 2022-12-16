<template>
  <q-page>
    <!-- <q-img src="src/assets/pong_wallpaper.png"/> -->
    <div class="lists">
      <SearchUser/>
      <FriendList/>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SearchUser from './components/SearchUser.vue'
import FriendList from './components/FriendList.vue'
import api from 'src/services/api.service'
import * as models from 'src/services/api.models'
import { useMeStore } from 'src/stores/me';

export default defineComponent({
  name: 'Index',
  components: { SearchUser, FriendList },
  props: {},
  data() {
    return {
      storeMe: useMeStore(),
    }
  },
  created () {
    this.storeMe.fetch() // useless
  },
  beforeUpdate () {
    this.storeMe.fetch() // useless
  },
  methods: {
  },
});
</script>

<style lang="sass" scoped>
.lists
  display: table
  width: 100%
  > div
    display: table-cell
</style>
