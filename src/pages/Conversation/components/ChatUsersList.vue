<template>
  <div class="top-panel row items-center">
    <span class="titlename">{{ $storeChat.name }}</span>

    <q-btn flat @click="minidrawerStatus = !minidrawerStatus" round dense icon="menu" class="justify-right">
      <q-menu class="menuusers">
        <q-list class="userlist">

          <q-item class="q-bg q-flex">
            <q-item-section side class="card">
              <q-item-label class="menuusers-username">User count:</q-item-label>
            </q-item-section>
            <q-item-section side class="card">
              <q-item-label>{{ subs.size }}</q-item-label>
            </q-item-section>
            <q-space />
            <q-item-section v-if="$storeChat.channelType !== `ONE_TO_ONE` && $storeChat.role !== 'OWNER'" side>
              <q-btn color="red" label="quit" @click="confirm = true" />
            </q-item-section>
            <q-item-section v-if="$storeChat.channelType !== `ONE_TO_ONE` && $storeChat.role === 'OWNER'" side>
              <q-btn color="orange" label="settings" @click="settings = true" />
            </q-item-section>
            <q-item-section side>
              <q-btn color="pink" label="debug" @click="debug" />
            </q-item-section>
          </q-item>

          <q-item v-for="user in subs.values()" :key="user.username" class="q-bg">
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
              <BanMute :subscription="getUserSubscription(user.username)" />
            </q-item-section>
          </q-item>

        </q-list>
      </q-menu>
    </q-btn>
    <q-dialog persistent v-model="settings">
      <CreateChannel settings :oldname=$storeChat.name :closeFn=closeSettings />
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import BanMute from './BanMute.vue'
import CreateChannel from '../../../components/CreateChannel.vue'

export default defineComponent({
  name: 'ChatUsersList',
  components: { BanMute, CreateChannel },
  props: {},
  setup () {
    const confirm = ref(false)
    const settings = ref(false)
    return {
      closeConfirm() {
        confirm.value = false
      },
      closeSettings() {
        settings.value = false
      },
      confirm,
      settings
    }
  },
  data() {
    return {
      minidrawerStatus: false as boolean,
      subs: computed(() => this.$storeChat.SubscribedUsers),
    }
  },
  methods: {
    getUserSubscription(username: string) {
      return this.subs.get(username)
    },
    getLoginStatus(username: string) {
      if (this.$storeChat.connectedUsers.includes(username))
        return 'ONLINE-status'
      return 'OFFLINE-status'
    },
    avatarstr(username: string) {
      return `/api/avatar/${username}/thumbnail`
    },
    debug () {
      console.log('ICI', this.$storeChat.channelType)
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
  height: 50px
  padding: 10px 0px 10px 10px
  background-color: #303030
  width: 100%

.titlename
  font-size: 20px
  font-weight: bold
  color: white

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
  background-color: green
.OFFLINE-status
  background-color: #707070
</style>
