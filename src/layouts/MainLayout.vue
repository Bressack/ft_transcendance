<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="toolbar">
        <q-btn flat @click="$storeMe.drawerStatus = !$storeMe.drawerStatus" round dense icon="menu" />
        <q-item class="label q-px-md" clickable @click="goHome">ft_transcendence</q-item>
        <q-space />
        <q-item class="usercard-settings" clickable @click="goSettingsNotif">
          <q-icon name="settings" size="md" />
        </q-item>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="$storeMe.drawerStatus" show-if-above :breakpoint="500" :width="300">
      <q-scroll-area class="scroll">
        <ConversationList />
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 90px">
        <q-item class="usercard">
          <q-item-section @click="goHome" v-if="$storeMe.username">
            <q-img :src="`/api/avatar/${$storeMe.username}/thumbnail`" width="60px" height="60px"
              img-class="usercard-image" />
          </q-item-section>
          <q-item-section class="usercard-name" @click="goProfilePage">
            <q-item-label class="usercard-name-label">{{ $storeMe.username }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-img>
      <q-dialog v-model="settings">
        <settings />
      </q-dialog>
      <q-dialog persistent v-model="InvitationFrom">
        <GameInvitation :opponent="opponent" :map=maps :difficulty=difficulty />
      </q-dialog>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ConversationList from '../pages/ConversationList/ConversationList.vue'
import Settings from '../components/Settings.vue'
import GameInvitation from '../components/GameInvitation.vue'
import ld from 'lodash'

export default defineComponent({
  name: 'MainLayout',
  components: {
    ConversationList,
    Settings,
    GameInvitation
  },
  props: {},
  setup() {
    let InvitationFrom = ref(false)
    const settings = ref(false)
    return {
      settings,
      openSettings() { settings.value = true },
      InvitationFrom
    }
  },
  data: () => {
    return {
      opponent: "",
      maps: "",
      difficulty: "",
      listening_for_game_invite: false
    }
  },
  methods: {
    goProfilePage() {
      this.$router.push({
        path: '/profile/me',
      })
    },
    goSettingsNotif() {
      this.openSettings()
    },
    logout() {
      this.$router.push("/logout")
    },
    goHome() {
      this.$router.push("/")
    },
    onGameInviteBusy(data: any, callback: Function) {
      callback('DECLINED')
    },
    onGameInvite(data: any, callback: Function) {
      const that = this
      this.opponent = data.from
      this.maps = data.map
      this.difficulty = data.difficulty
      this.$ws.removeListener('game-invite')

      this.$ws.socket.once('game-invite-canceled', (res: any) => {
        that.InvitationFrom = false
        document.removeEventListener('invite-response-accept', accept);
        document.removeEventListener('invite-response-decline', decline);
        that.$ws.listen('game-invite', that.onGameInvite)
      })
      const accept = function (res: any) {
        console.log(res)
        callback('ACCEPTED')
        that.InvitationFrom = false
        that.$ws.socket.once('game-setup-and-init-go-go-power-ranger', (gameOptions: any, callback: Function) => {
          callback("OK")
          // console.log(`/game/${gameOptions.gameId}?map=${gameOptions.map}`)
          console.log(gameOptions)

          if (gameOptions.map == "3D")
            that.$router.push(`/game3d/${gameOptions.gameId}?playerOneName=${gameOptions.playerOneName}&playerTwoName=${gameOptions.playerTwoName}`)
          else
            that.$router.push(`/game/${gameOptions.gameId}?playerOneName=${gameOptions.playerOneName}&playerTwoName=${gameOptions.playerTwoName}`)
          // that.$router.push(`/game/${gameOptions.gameId}`)
          document.removeEventListener('invite-response-accept', accept);
        })
        document.removeEventListener('invite-response-decline', decline);
        that.$ws.removeListener('game-invite-canceled')
        that.$ws.listen('game-invite', that.onGameInvite) //might need to remove this until the game is finished
      }
      const decline = function (res: any) {
        console.log(res)
        callback('DECLINED')
        that.InvitationFrom = false
        document.removeEventListener('invite-response-accept', accept);
        document.removeEventListener('invite-response-decline', decline);
        that.$ws.removeListener('game-invite-canceled')
        that.$ws.listen('game-invite', that.onGameInvite)

      }
      console.log(data)
      this.InvitationFrom = true
      document.addEventListener('invite-response-accept', accept)
      document.addEventListener('invite-response-decline', decline)
    },
    listenForGameInvite() {
      if (!this.listening_for_game_invite) {
        this.$ws.removeListener('game-invite')
        this.$ws.listen('game-invite', this.onGameInvite)
        this.listening_for_game_invite = true;
      }
    },
    stopListeningForGameInvite() {
      if (this.listening_for_game_invite) {
        this.$ws.removeListener('game-invite')
        this.$ws.listen('game-invite', this.onGameInviteBusy)

        this.listening_for_game_invite = false;
      }
    },

    handleUserConnectedEvent(users: Array<string>) {
      console.log(`${users} connected`); // should update an array of connected users

      let nlogin = [] as Array<string>
      users.forEach((user) => {
        if (this.$storeChat.connectedUsers.includes(user) == false)
          nlogin.push(user);
      });

      users.forEach((user) => {
        if (this.$storeChat.connectedUsers.includes(user) == false)
          this.$storeChat.connectedUsers.push(user);
      });

      nlogin.forEach(e => {
        this.$q.notify({
          message: `${e} is connected !`,
          color: 'cyan',
          avatar: `/api/avatar/${e}/thumbnail`,
          progress: true,
        })
      });
    },
    handleUserDisconnectedEvent(username: string) {
      console.log(`${username} disconnected`); // should update an array of connected users
      this.$storeChat.connectedUsers = this.$storeChat.connectedUsers.filter(
        (elem: any) => {
          return elem !== username;
        }
      );
      this.$q.notify({
        message: `${username} disconnected !`,
        color: 'cyan',
        avatar: `/api/avatar/${username}/thumbnail`,
        progress: true,
      })
    }


  },
  created() {
    this.$ws.init(this.$q)
    this.$ws.connect()
    this.$storeChat.$reset()
    this.$storeChat.init(this.$ws, this) // set socket in the store
    // clean possibly old datas
    this.$storeMe.$reset()
    this.$storeMe.init(this.$q)
    this.$storeChat.leave()

    // connect and init WebSockets
    // fetch datas
    this.$storeMe.fetch()

    this.$ws.listen("user-connected", this.handleUserConnectedEvent);
    this.$ws.listen("user-disconnected", this.handleUserDisconnectedEvent);
  },
  mounted() {
    this.listenForGameInvite()
    document.addEventListener('can-listen-for-game-invite', this.listenForGameInvite)
    document.addEventListener('stop-listening-for-game-invite', this.stopListeningForGameInvite)
  },

  beforeUnMount() {
    console.log("beforeunmount login page")
    this.$ws.removeListener('game-invite')
    document.removeEventListener('can-listen-for-game-invite', this.listenForGameInvite)
    document.removeEventListener('stop-listening-for-game-invite', this.stopListeningForGameInvite)
    this.$ws.disconnect()
  }

});
</script>

<style lang="sass">
.usercard-image
  border-radius: 1000px
  z-index: 2

body
  background-color: $bg-primary !important
  color: grey
</style>

<style lang="sass" scoped>
.toolbar
  height: 90px
  background-color: $bg-secondary !important
  color: grey

.scroll
  height: calc(100% - 90px)
  margin-top: 90px
  background-color: $bg-secondary
  overflow-x: hidden


.usercard
  display: flex
  height: 90px
  width: 300px

.usercard-name
  flex-basis: 100px
  // add '...' to the end of name if it overflow the container
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
  font-size: 1.35em
  font-weight: bold
  color: $orange-7

.usercard-name-label
  padding: 5px

.usercard-name-label:hover
  border-radius: 15px
  background-color: $grey-7

</style>
