<template>
  <div class="top-panel row items-center">

    <q-toolbar>
		<span class="titlename" >{{ $store.currentChannelName }}</span>
		<q-space/>
    <!-- <div v-else-if="$store.currentChannelSub?.role === 'OWNER'">
      <div v-if="$store.currentChannelType !== `ONE_TO_ONE`" side>
      </div>
    </div> -->
    <div v-if="$store.currentChannelType !== 'ONE_TO_ONE'">
      <q-btn v-if="$store.currentChannelSub?.role === 'OWNER' && $store.current_channel_state === 'ACTIVE'" flat dense round icon="mdi-cog-outline" @click="settings = true"><q-tooltip>Channel settings</q-tooltip></q-btn>
      <q-btn v-if="$store.currentChannelSub?.role !== 'OWNER' && $store.currentChannelType === 'PRIVATE'" flat dense round size="14px" icon="mdi-logout" class="interpolate-btn" @click="confirmLeave = true"><q-tooltip>Leave channel</q-tooltip></q-btn>
      <q-btn v-else-if="$store.currentChannelSub?.role === 'OWNER'" flat dense round size="16px" icon="mdi-delete-forever" class="interpolate-btn" @click="confirmDelete = true"><q-tooltip>Delete channel</q-tooltip></q-btn>
    </div>
    <div class="q-ml-sm" v-if="$store.currentChannelType !== 'ONE_TO_ONE'">
      <q-icon v-if="$store.currentChannelSub?.role === 'ADMIN'" color="grey-6" size="35px" name="mdi-shield-sword-outline"><q-tooltip>Admin</q-tooltip></q-icon>
      <q-icon v-else-if="$store.currentChannelSub?.role === 'OWNER'" color="grey-6" size="35px" name="mdi-shield-crown-outline"><q-tooltip>Owner</q-tooltip></q-icon>
      <q-icon v-else color="grey-6" size="35px" name="mdi-shield-bug-outline"><q-tooltip>User</q-tooltip></q-icon>
    </div>
      <!-- <q-btn v-if="$store.currentChannelSub?.channel.passwordProtected === true"
        color="brown-9" class="q-mr-lg" @click="lockChannel" >Lock channel</q-btn> -->
    </q-toolbar>

    <q-dialog persistent v-model="settings">
      <CreateChannel settings :closeFn=closeSettings />
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
import Confirm from 'src/components/Confirm.vue'
import CreateChannel from 'src/components/CreateChannel.vue'
import * as storeTypes from "src/stores/store.types";

export default defineComponent({
  name: 'ChatUsersList',
  components: { CreateChannel, Confirm },
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
  font-weight: bold
  color: grey
  font-family: 'Press Start 2P'
  font-size: 1.5em

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
