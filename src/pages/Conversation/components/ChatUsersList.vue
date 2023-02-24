<template>
  <div class="top-panel row items-center">
    <q-toolbar>

      <span class="titlename">{{ $store.currentChannelName }}</span>

      <q-space/>

      <q-btn v-if="$store.currentChannelSub?.channel.passwordProtected === true"
        color="brown-9" class="q-mr-lg" @click="lockChannel" >Lock channel</q-btn>

      <q-btn flat @click="minidrawerStatus = !minidrawerStatus" round dense icon="menu" class="justify-right">
        <q-menu class="menuusers">

          <q-item class="q-bg q-flex pannel">
            <q-item-section side class="card">
              <q-item-label class="menuusers-username">User count:</q-item-label>
            </q-item-section>
            <q-item-section side class="card">
              <q-item-label>{{ $store.currentChannelUserCount }}</q-item-label>
            </q-item-section>
            <q-space />
            <q-item-section v-if="$store.currentChannelSub.channel.channelType !== `ONE_TO_ONE`" side>
              <q-btn v-if="$store.currentChannelSub.role !== storeTypes.Role.OWNER && $store.currentChannelSub.channel.channelType === 'PRIVATE'" color="red" label="quit" class="interpolate-btn" @click="confirmLeave = true" />
              <q-btn v-else-if="$store.currentChannelSub.role === 'OWNER'" color="red" label="delete" class="interpolate-btn" @click="confirmDelete = true" />
            </q-item-section>
            <q-item-section v-if="$store.currentChannelSub.channel.channelType !== `ONE_TO_ONE` && $store.currentChannelSub.role === 'OWNER'" side>
              <q-btn color="orange" label="settings" class="interpolate-btn" @click="settings = true" />
            </q-item-section>
            <q-item-section side>
              <q-btn color="pink" label="debug" @click="debug" />
            </q-item-section>
          </q-item>

          <q-list class="userlist">

            <q-item v-for="user in $store.currentChannelUsers" :key="user.username" class="q-bg">
              <q-item-section class="avatar">
                <img :src="avatarstr(user?.username)" class="image" />
                <div :class="getLoginStatus(user?.username)" class="loginstatus" />
              </q-item-section>
              <q-item-section side class="">
                <q-item-label class="menuusers-username">{{ user.username }}</q-item-label>
              </q-item-section>
              <q-item-section side class="q-pa-sm">
                <q-img></q-img>
              </q-item-section>
              <q-item-section side class="card role">
                <q-item-label>Role</q-item-label>
                <q-item-label>{{ user.role }}</q-item-label>
              </q-item-section>
              <q-item-section>
                <BanMute :subscription="user" />
              </q-item-section>
            </q-item>

          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
    <q-dialog persistent v-model="settings">
      <CreateChannel settings :oldname=$store.currentChannelSub?.channel.name :closeFn=closeSettings />
    </q-dialog>
    <q-dialog persistent v-model=confirmDelete>
      <Confirm what="delete the channel" :accept=leaveChannel />
    </q-dialog>
    <q-dialog persistent v-model=confirmLeave>
      <Confirm what="leave the channel" :accept=leaveChannel />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import BanMute from './BanMute.vue'
import Confirm from 'src/components/Confirm.vue'
import CreateChannel from 'src/components/CreateChannel.vue'
import * as storeTypes from "src/stores/store.types";

export default defineComponent({
  name: 'ChatUsersList',
  components: { BanMute, CreateChannel, Confirm },
  setup () {
    const confirmDelete = ref(false)
    const confirmLeave = ref(false)
    const settings = ref(false)
    return {
      closeSettings() {
        settings.value = false
      },
      confirmDelete,
      confirmLeave,
      settings
    }
  },
  data() {
    return {
      minidrawerStatus: false as boolean,
      subs: computed(() => this.$store.currentChannelSub?.channel?.subscribedUsers),
    }
  },
  methods: {
    lockChannel() {
      this.$emit('lockChannel')
    },
    // getUserSubscription(username: string): Subscription {
    //   return this.subs.get(username) as Subscription
    // },
    getLoginStatus(username: string) {
      // if (this.$store.user.includes(username))
      //   return 'ONLINE-status'
      return 'OFFLINE-status'
    },
    avatarstr(username: string) {
      return `/api/avatar/${username}/thumbnail`
    },
    debug () {
      console.log('ICI', this.$store.currentChannelSub?.channelId)
    },
    leaveChannel() {
    //   console.log(this.$store.currentChannelSub?.channel.channelId)
      this.$api.leaveChannel(this.$store.active_channel)
      .then(() => {
        // await this.$store.leave()
        this.$router.push('/')
      })
      .catch((err) => {
        console.error(err)
      })
    }
  },
});
</script>

<style lang="sass" scoped>
.image
  width: 42px
  height: 42px
  border-radius: 250px

.top-panel
  display: flexbox
  justify-content: space-between
  padding: 10px 0px 10px 10px
  background-color: #303030
  width: 100%

.titlename
  font-size: 20px
  font-weight: bold
  color: white
  height: 40px

.menuusers-username
  width: 200px
  font-size: 17px
  word-break: break-word

.menuusers
  height: 500px
  display: flexbox
  justify-content: space-between

.q-bg
  background-color: $bg-primary !important

.card
  background-color: #424242
  color: orange
  border-radius: 10px
  padding: 5px 15px
  margin-right: 5px
  margin-top: 0


.userlist
  height: 100%
  margin-top: 50px

.role
  min-width: 80px

.avatar
  max-width: 42px !important
  // margin-top: 10px
  margin-left: 10px
  margin-right: 10px

.loginstatus
  width: 15px
  height: 15px
  border-radius: 100px
  position: absolute
  margin-top: 27px
  margin-left: 27px

.ONLINE-status
  background-color: $onlineStatus-online
  box-shadow: 0px 0px 5px $onlineStatus-online
.OFFLINE-status
  background-color: $onlineStatus-offline
  box-shadow: 0px 0px 5px $onlineStatus-offline
.INGAME-status
  background-color: $onlineStatus-ingame
  box-shadow: 0px 0px 5px $onlineStatus-ingame

.pannel
  position: fixed
  width: 631px
  z-index: 1

</style>
