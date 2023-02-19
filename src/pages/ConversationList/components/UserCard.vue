<template>
    <q-item clickable v-ripple class="usermenu">
      <q-item-section style="max-width: 50px;" @click="goProfilPage">
        <q-avatar class="avatar">
          <img size="20px" :src="`/api/avatar/${username}/thumbnail`">
          <div :class="getLoginStatus()" class="loginstatus"/>
        </q-avatar>
      </q-item-section>
      <q-item-section class="name" @click="goProfilPage">
        {{ username }}
      </q-item-section>
      <q-item-section side v-if="shortcut_profile">
        <q-icon :name="icon_name" :color="icon_color" @click="goProfilPage" />
      </q-item-section>
      <q-item-section side v-if="shortcut_block">
        <q-icon :name="icon_name" :color="icon_color" @click="block" />
      </q-item-section>
      <q-item-section side v-if="shortcut_unblock">
        <q-icon :name="icon_name" :color="icon_color" @click="block" />
      </q-item-section>
      <q-item-section side v-if="shortcut_play">
        <q-icon :name="icon_name" :color="icon_color" @click="goGameOptions" />
      </q-item-section>
      <q-item-section side v-if="shortcut_chat">
        <q-icon :name="icon_name" :color="icon_color" @click="userSelected" />
      </q-item-section>
      <q-item-section side v-if="shortcut_unfollow">
        <q-icon :name="icon_name" :color="icon_color" @click="unfollow" />
      </q-item-section>
      <q-item-section side v-if="shortcut_follow">
        <q-icon :name="icon_name" :color="icon_color" @click="follow" />
      </q-item-section>

      <q-item-section side class="toto">
        <q-icon name="more_vert" color="white" class="toto">
          <q-menu class="bg-grey-9 text-white" auto-close>

            <q-list style="min-width: 100px">

              <q-item v-if="menu_profile" clickable @click="goProfilPage">
                <q-item-section>Profile</q-item-section>
              </q-item>

              <q-item v-if="menu_block" clickable @click="goGameOptions">
                <q-item-section>Invite to play</q-item-section>
              </q-item>

              <q-item v-if="menu_play" clickable @click="userSelected">
                <q-item-section>Chat</q-item-section>
              </q-item>

              <q-item v-if="menu_chat" clickable @click="block">
                <q-item-section>Unblock</q-item-section>
              </q-item>

              <q-separator dark />

              <q-item v-if="menu_chat" clickable class="text-red-7" @click="block">
                <q-item-section>Block</q-item-section>
              </q-item>

              <q-item v-if="menu_follow" clickable class="text-red-7" @click="follow">
                <q-item-section>Unfriend</q-item-section>
              </q-item>

              <q-item v-if="menu_unfollow" clickable class="text-red-7" @click="unfollow">
                <q-item-section>Unfriend</q-item-section>
              </q-item>
            </q-list>

          </q-menu>
        </q-icon>
      </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'UserCard',
  components: {},
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
  data() {
    return {

    }
  },
  methods: {
    getLoginStatus() {
      if (this.$storeChat.connectedUsers.includes(this.username))
        return 'ONLINE-status'
      return 'OFFLINE-status'
    },
    goProfilPage() {
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
        .then(function () { that.$storeMe.fetch() })
        .catch(function () { })
    },
    unfollow() {
      let that = this
      this.$api.unfollow(this.username)
        .then(function () { that.$storeMe.fetch() })
        .catch(function () { })
    },
    block() {
      let that = this
      this.$api.block(this.username)
        .then(function () { that.$storeMe.fetch() })
        .catch(function () { })
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

.usermenu .toto
  visibility: hidden
  width: 25px !important
  padding: 0
  padding-left: 5px

.usermenu:hover .toto
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

</style>
