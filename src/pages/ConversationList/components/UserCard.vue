<template>

    <q-item clickable v-ripple class="usermenu">
      <q-item-section style="max-width: 50px;" @click="goProfilePage">
        <Avatars :username=username badge />
      </q-item-section>
      <q-item-section class="name" @click="goProfilePage">
        <q-tooltip anchor="center left" self="center left">{{ username }}'s profile</q-tooltip>
        {{ username }}
      </q-item-section>

      <q-item-section side thumbnail class="q-mb-xs tata">
        <q-icon v-if="shortcut_profile"   class="shortcut" name="person"     color="cyan"   @click="goProfilePage" />
        <q-icon v-if="shortcut_block"     class="shortcut" name="person_off" color="red"    @click="block" />
        <q-icon v-if="shortcut_unblock"   class="shortcut" name="cancel"     color="red"    @click="confirmUnblock = true"><q-tooltip>Unblock</q-tooltip></q-icon>
        <q-icon v-if="shortcut_play"      class="shortcut" name="play_arrow" color="green"  @click="goGameOptions"><q-tooltip>Play</q-tooltip></q-icon>
        <q-icon v-if="shortcut_chat"      class="shortcut" name="chat"       color="orange" @click="userSelected"><q-tooltip>Chat</q-tooltip></q-icon>
        <q-icon v-if="shortcut_unfollow"  class="shortcut" name="cancel"     color="red"    @click="unfollow"><q-tooltip>Cancel</q-tooltip></q-icon>
        <q-icon v-if="shortcut_follow"    class="shortcut" name="done"       color="green"  @click="follow"><q-tooltip>Accept</q-tooltip></q-icon>
        <q-icon name="more_vert" color="white" class="shortcut">
          <q-tooltip>More</q-tooltip>
          <q-menu class="bg-grey-9 text-white" auto-close>

            <q-list style="min-width: 100px">

              <q-item v-if="menu_profile" clickable @click="goProfilePage">
                <q-item-section>Profile</q-item-section>
              </q-item>

              <q-item v-if="menu_play" clickable @click="goGameOptions">
                <q-item-section>Invite to play</q-item-section>
              </q-item>

              <q-item v-if="menu_chat" clickable @click="userSelected">
                <q-item-section>Chat</q-item-section>
              </q-item>

              <q-item v-if="menu_unblock" clickable @click="confirmUnblock = true">
                <q-item-section>Unblock</q-item-section>
              </q-item>

              <q-item v-if="menu_follow" clickable @click="follow">
                <q-item-section>Follow</q-item-section>
              </q-item>

              <q-separator dark />

              <q-item v-if="menu_block" clickable class="text-red-7" @click="confirmBlock = true">
                <q-item-section>Block</q-item-section>
              </q-item>

              <q-item v-if="menu_unfollow" clickable class="text-red-7" @click="confirmUnfollow = true">
                <q-item-section>Unfollow</q-item-section>
              </q-item>
            </q-list>

          </q-menu>
        </q-icon>
      </q-item-section>
      <q-dialog persistent v-model=confirmUnfollow>
        <Confirm :what="`unfollow ${username}`" :accept="unfollow" />
      </q-dialog>
      <q-dialog persistent v-model=confirmBlock>
        <Confirm :what="`block ${username}`" :accept="block" />
      </q-dialog>
      <q-dialog persistent v-model=confirmUnblock>
        <Confirm :what="`unblock ${username}`" :accept="block" />
      </q-dialog>

  </q-item>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Confirm from 'src/components/Confirm.vue'
import Avatars from 'src/components/Avatars.vue'

export default defineComponent({
  name: 'UserCard',
  components: { Confirm, Avatars },
  props: {
    username          : { type: String,  required: true },
    icon_name         : { type: String,  default : ''   },
    icon_color        : { type: String,  default : ''   },

    menu_profile      : { type: Boolean, default: false },
    menu_block        : { type: Boolean, default: false },
    menu_unblock      : { type: Boolean, default: false },
    menu_play         : { type: Boolean, default: false },
    menu_chat         : { type: Boolean, default: false },
    menu_follow       : { type: Boolean, default: false },
    menu_unfollow     : { type: Boolean, default: false },

    shortcut_profile  : { type: Boolean, default: false },
    shortcut_block    : { type: Boolean, default: false },
    shortcut_unblock  : { type: Boolean, default: false },
    shortcut_play     : { type: Boolean, default: false },
    shortcut_chat     : { type: Boolean, default: false },
    shortcut_follow   : { type: Boolean, default: false },
    shortcut_unfollow : { type: Boolean, default: false },
  },
  setup() {
    const confirmUnfollow = ref(false)
    const confirmBlock = ref(false)
    const confirmUnblock = ref(false)
    return {
      confirmUnfollow,
      confirmBlock,
      confirmUnblock
    }
  },
  methods: {
    goProfilePage() {
      this.$router.push({
        path: '/profile/' + this.username,
      })
    },
    goGameOptions() {
      this.$emit('goGameOptions', this.username)
    },
    follow() {
      let that = this
      this.$api.follow(this.username)
        .then(() => { })
        .catch(() => { })
    },
    unfollow() {
      let that = this
      this.$api.unfollow(this.username)
        .then(() => { })
        .catch(() => { })
    },
    block() {
      let that = this
      this.$api.block(this.username)
        .then(() => { })
        .catch(() => { })
    },
    userSelected() {
      const channelID = this.$storeMe.getChannelIDByUsername(this.username)
      console.log('toto:', channelID);
      this.$router.push({
        path: `/conversation/${channelID}`,
      })
    },
  },
});
</script>

<style lang="sass" scoped>

.name
  margin-left: 0
.avatar
  width: 30px
  height: 30px
  border-radius: 50%
  margin-right: 0


.usermenu .tata
  width: auto
  visibility: hidden
  padding: 0
  padding-left: 5px
  display: flex
  justify-content: flex-end

.usermenu:hover .tata
  visibility: visible

.loginstatus
  width: 12px
  height: 12px
  border-radius: 100px
  position: absolute
  margin-top: 20px
  margin-left: 20px

.ONLINE-status
  background-color: $onlineStatus-online
  box-shadow: 0px 0px 5px $onlineStatus-online
.OFFLINE-status
  background-color: $onlineStatus-offline
  box-shadow: 0px 0px 5px $onlineStatus-offline
.INGAME-status
  background-color: $onlineStatus-ingame
  box-shadow: 0px 0px 5px $onlineStatus-ingame

.shortcut
  margin-left: 10px

.shortcut .tata
  visibility: hidden

.shortcut:hover .tata
  visibility: visible

.tata
  width: 80px
  flex-direction: row
</style>
