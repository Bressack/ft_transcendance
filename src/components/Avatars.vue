<template>
<q-avatar :style="avatar">
  <q-img :src="`/api/avatar/${username}/${avatarSize}`" />
  <q-badge v-if="badge" class="absolute-bottom-right" :class=getLoginStatus() rounded></q-badge>
</q-avatar>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Avatars',
  props: {
    username: { type: String, required: true },
    size: { type: Number, default: 30 },
    avatarSize: { type: String, default: 'thumbnail' },
    badge: { type: Boolean, default: false }
  },
  computed: {
    avatar() {
      return {
        'width': this.size + 'px',
        'height': this.size + 'px',
      }
    },
  },
  methods: {
    getLoginStatus() {
      if (this.$storeChat.connectedUsers.includes(this.username))
        return 'ONLINE-status'
      return 'OFFLINE-status'
    }
  },
})

</script>

<style lang="sass" scoped>
.ONLINE-status
  background-color: $onlineStatus-online
  box-shadow: 0px 0px 5px $onlineStatus-online
.OFFLINE-status
  background-color: $onlineStatus-offline
  box-shadow: 0px 0px 5px $onlineStatus-offline
.INGAME-status
  background-color: $onlineStatus-ingame
  box-shadow: 0px 0px 5px $onlineStatus-ingame
</style>
