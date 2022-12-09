<template>
  <q-page>
    <!-- <q-img src="src/assets/pong_wallpaper.png"/> -->
    <SearchUser/>

    <FriendList
      v-if="me"
      :friends=friends
      :friendRequestSent=friendRequestSent
      :friendRequestRecevied=friendRequestRecevied
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SearchUser from './components/SearchUser.vue'
import FriendList from './components/FriendList.vue'
import api from 'src/services/api.service'
import ld from 'lodash'

export default defineComponent({
  name: 'Index',
  components: { SearchUser, FriendList },
  props: {},
  data() {
    return {
      me: ref(undefined),
      friends: [] as Array<any>,
      friendRequestSent: [] as Array<any>,
      friendRequestRecevied: [] as Array<any>,
    }
  },
  created () {
    let that = this
    api.me()
    .then(function (me) {
      that.me = me
      console.log(me);

      let followedBy = [] ; for (let f of me.followedBy) { followedBy.push(f.followerId) }
      let following = [] ; for (let f of me.following) { following.push(f.followingId) }
      that.friends = ld.intersection(followedBy, following)
      that.friendRequestSent = ld.difference(followedBy, following)
      that.friendRequestRecevied = ld.difference(following, followedBy)
    })
    .catch(function () {})
  },
  methods: {
  },
});
</script>

<style lang="sass" scoped>

</style>
