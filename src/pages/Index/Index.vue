<template>
  <q-page>
    <!-- <q-img src="src/assets/pong_wallpaper.png"/> -->
    <div class="lists">
      <SearchUser
        @reloadme="getMe"
      />

      <FriendList
        v-if="me"
        :me=me
        @reloadme="getMe"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SearchUser from './components/SearchUser.vue'
import FriendList from './components/FriendList.vue'
import api from 'src/services/api.service'

export default defineComponent({
  name: 'Index',
  components: { SearchUser, FriendList },
  props: {},
  data() {
    return {
      me: ref(undefined),
    }
  },
  created () {
    this.getMe()
  },
  beforeUpdate () {
    this.getMe()
  },
  methods: {
    getMe()
    {
      let that = this
      api.me()
      .then(function (me) {
        that.me = me
        console.log(me)
      })
      .catch(function () {})
    }
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
