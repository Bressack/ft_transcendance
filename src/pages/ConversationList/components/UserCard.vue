<template>

    <q-item clickable v-ripple class="usermenu"
					manual-focus
					:focused="$store.active_channel === channelId">
      <q-item-section style="max-width: 50px;" @click="goProfilPage">
        <q-avatar size="38px" class="avatar" :style="`background-color: ${$utils.usernameToColor(username)};`">
          <img :src="`/api/avatar/${username}/thumbnail`">
          <div :class="getLoginStatus()" class="loginstatus"/>
        </q-avatar>
      </q-item-section>
      <q-item-section class="name" @click="goProfilPage">
        {{ username }}
      </q-item-section>

      <q-item-section side class="tata text-right">
        <q-icon v-if="shortcut_profile"   class="shortcut" name="person"     color="cyan"   @click="goProfilPage" />
        <q-icon v-if="shortcut_block"     class="shortcut" name="person_off" color="red"    @click="block" />
        <q-icon v-if="shortcut_unblock"   class="shortcut" name="done"       color="green"  @click="block" />
        <q-icon v-if="shortcut_play"      class="shortcut" name="mdi-gamepad-variant-outline" color="green"  @click="goGameOptions" />
        <q-icon v-if="shortcut_chat"      class="shortcut" name="chat"       color="orange" @click="goChat" />
        <q-icon v-if="shortcut_unfollow"  class="shortcut" name="cancel"     color="red"    @click="unfollow" />
        <q-icon v-if="shortcut_follow"    class="shortcut" name="done"       color="green"  @click="follow" />
      </q-item-section>

      <q-item-section side class="toto">
        <q-icon name="more_vert" color="#F7F7FF" class="toto">
          <q-menu class="bg-grey-9 text-white" auto-close>

            <q-list style="min-width: 100px">

              <q-item v-if="menu_profile" clickable @click="goProfilPage">
                <q-item-section>Profile</q-item-section>
              </q-item>

              <q-item v-if="menu_play" clickable @click="goGameOptions">
                <q-item-section>Invite to play</q-item-section>
              </q-item>

              <q-item v-if="menu_chat" clickable :to="channelPath">
                <q-item-section>Chat</q-item-section>
              </q-item>

              <q-item v-if="menu_unblock" clickable @click="block">
                <q-item-section>Unblock</q-item-section>
              </q-item>

              <q-item v-if="menu_follow" clickable @click="follow">
                <q-item-section>Follow</q-item-section>
              </q-item>

              <q-separator dark />

              <q-item v-if="menu_block" clickable class="text-red-7" @click="block">
                <q-item-section>Block</q-item-section>
              </q-item>

              <q-item v-if="menu_unfollow" clickable class="text-red-7" @click="unfollow">
                <q-item-section>Unfollow</q-item-section>
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
  computed: {
	channelId() {
		return this.$store.getChannelIDByUsername(this.username)
	},
	channelPath() {
		return `/channel/${this.channelId}`
	}
  },
  methods: {
    getLoginStatus() {
	//TODO: check login status
    //   if (this.$storeChat.connectedUsers.includes(this.username))
    //     return 'ONLINE-status'
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
      this.$api.follow(this.username)
        .then(() => { })
        .catch(() => { })
    },
    unfollow() {
      this.$api.unfollow(this.username)
        .then(() => { })
        .catch(() => { })
    },
    block() {
      this.$api.block(this.username)
        .then(() => { })
        .catch(() => { })
    },
    goChat() {
      if (this.channelId)
        this.$router.push({
          path: `/conversation/${this.channelId}`,
        })
      else
        console.error('user one-to-one channelId undefined')
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
  width: 10px !important
  padding: 0
  padding-left: 5px

.usermenu .tata
  visibility: hidden
  padding: 0
  padding-left: 5px
  display: flex
  justify-content: flex-end

.usermenu:hover .toto
  visibility: visible

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

.shortcut .toto
  visibility: hidden

.shortcut:hover .toto
  visibility: visible

.shortcut
  margin-right: 10px

.shortcut .tata
  visibility: hidden

.shortcut:hover .tata
  visibility: visible

.tata
  width: 80px
  flex-direction: row
</style>
