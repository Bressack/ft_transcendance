<template>
		<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="toolbar">
        <q-btn flat @click="$storeMe.drawerStatus = !$storeMe.drawerStatus" round dense icon="menu" />
        <q-item class="label center thetitle glow" clickable @click="goHome" style="">Transcendence</q-item>

        <q-space />

        <q-btn flat @click="notifyCenterLever = !notifyCenterLever" round dense icon="notifications" class="justify-right">
          <div class="notif-count justify-center items-center circle" v-if="nc.notifications.size > 0" />
          <div class="notif-count justify-center items-center" v-if="nc.notifications.size > 0">
            {{ nc.notifications.size < 99 ? nc.notifications.size : '99+' }}
          </div>
          <q-menu anchor="bottom left" class="notifmenu hide-scrollbar">
            <q-item class="n-info">
              <q-item-section class="items-center text-h6">{{ nc.notifications.size }} notification(s)</q-item-section>
              <q-space/>
              <q-btn icon="cancel" flat @click="nc.clear()" v-if="nc.notifications.size > 0" />
            </q-item>
            <q-list class="n-list">
              <q-item
                v-for="[key, tmp] of nc.notifications" :key="key"
                class="row notif-item q-ma-sm"
                :class="notifcolor(tmp.options)"
              >

                <q-img v-if="tmp.options.avatar" :src="tmp.options.avatar" class="notify-avatar q-mr-sm"/>
                <!-- <q-icon v-if="tmp.options?.type == 'info' "     name="info" size="32px" class="q-mr-sm"/> -->
                <!-- <q-icon v-if="tmp.options?.type == 'negative' " name="error" size="32px" class="q-mr-sm"/> -->
                <!-- <q-icon v-if="tmp.options?.type == 'positive' " name="done" size="32px" class="q-mr-sm"/> -->
                <!-- <q-icon v-if="tmp.options?.type == 'warning' "  name="warning" size="32px" class="q-mr-sm"/> -->
                <!-- <q-icon v-if="tmp.options?.type == 'message' "  name="chat" size="32px" class="q-mr-sm"/> -->

                <q-item-section class="notify-message">
                  {{ tmp.options.message }}
                  <q-separator/>
                  {{ getRelativeDate(tmp.createdAt) }}
                </q-item-section>

                <q-space/>

                <q-btn icon="cancel" flat @click="nc.pop(tmp.id)"/>

              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

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
import ncc, { NotifyOptions, NotifyCenter, Notifications } from 'src/services/notifyCenter'


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
    const notifyCenterLever = ref(false)
    return {
      notifyCenterLever,
      settings,
      openSettings() { settings.value = true },
      InvitationFrom,
    }
  },
  data() {
    return {
      nc: ncc,
      opponent: "",
      maps: "",
      difficulty: "",
      listening_for_game_invite: false
    }
  },
  methods: {
    notifcolor(options: NotifyOptions) {
      if (options.type)
      {
        switch (options.type) {
          case 'info':     return 'n-info'
          case 'negative': return 'n-negative'
          case 'positive': return 'n-positive'
          case 'warning':  return 'n-warning'
          case 'message':  return 'n-message'
        }
      }
      return 'n-other'
    },
    getRelativeDate(cdate: Date): string {
      function floorStr(n: number) {
        return (n < 10 ? '0' : '') + n
      }

      const now = new Date()

      if (now.getDate() - cdate.getDate() == 0)
        return 'Today at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
      else if (now.getDate() - cdate.getDate() == 1)
        return 'Yesterday at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
      else if (now.getDate() - cdate.getDate() == -1)
        return 'Tomorrow at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
      else
      {
        const d = cdate.getDate()
        const m = (cdate.getMonth() + 1)
        return floorStr(d) + '/'
             + floorStr(m) + '/'
             + cdate.getFullYear() + ' '
             + floorStr(cdate.getHours()) + ':'
             + floorStr(cdate.getMinutes())
      }
    },
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
        console.log(e, this.$storeMe.username);

        if (e != this.$storeMe.username)
          this.nc.send({
            message: `${e} is connected !`,
            color: 'cyan',
            avatar: `/api/avatar/${e}/thumbnail`,
          })
        else
          this.nc.send({
            message: `Welcome back ${e} ! Ready to lose ?`,
            type: 'positive',
            avatar: `/api/avatar/${e}/thumbnail`,
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
      this.nc.send({
        message: `${username} disconnected !`,
        color: 'cyan',
        avatar: `/api/avatar/${username}/thumbnail`,
      })
    },
    handleNotifMessageEvent(payload: any) {
      interface __NotifMessage {
          username: string;
          message: string;
      }
      const notif : __NotifMessage = payload as __NotifMessage

      this.nc.send({
        message: `New message from ${notif.username}: ${notif.message}`,
        type: 'message',
        avatar: `/api/avatar/${notif.username}/thumbnail`,
      })
    },
    listenForMatchmaking()
		{
			// console.log("YssssssssssssssssssO")

			// if (!this.listening_for_matchmaking)
			// {
				this.stopListeningForGameInvite();
				// this.listening_for_matchmaking = true;
				// console.log("YOOOOOOOOOO")
				this.$ws.socket.once('game-setup-and-init-go-go-power-ranger', (gameOptions: any, callback: Function) => {
					callback("OK")
					console.log(gameOptions)
					this.$router.push(`/game${(gameOptions.map == "3D") ? '3d' : ''}/${gameOptions.gameId}?playerOneName=${gameOptions.playerOneName}&playerTwoName=${gameOptions.playerTwoName}`)
					this.StoplisteningForMatchmaking()
					this.stopListeningForGameInvite()
					
				})
			// }
		},
		StoplisteningForMatchmaking()
		{
			// if (this.listening_for_matchmaking)
			// {
				// this.listenForGameInvite()
				this.$ws.socket.removeListener('game-setup-and-init-go-go-power-ranger')
				this.listening_for_matchmaking = false;
			// }
		}


  },
  async created() {
    this.nc.init(this.$q)
	this.$storeChat.$reset()
	this.$storeMe.$reset()
	this.$storeMe.init(this)
	await this.$storeMe.fetch()
    await this.$ws.connect().then(async () => {

		this.$storeChat.init(this.$ws, this) // set socket in the store
		// clean possibly old datas
		this.$storeChat.leave()
		
		// connect and init WebSockets
	
		console.log('HEEEERE');
		this.$ws.listen("user-connected", this.handleUserConnectedEvent);
		this.$ws.listen("user-disconnected", this.handleUserDisconnectedEvent);
		this.$ws.listen("notifmessage", this.handleNotifMessageEvent);
	}).catch((err) => {console.log(err)})
    // fetch datas
  },
  mounted() {
    this.listenForGameInvite()
    document.addEventListener('can-listen-for-game-invite', this.listenForGameInvite)
    document.addEventListener('stop-listening-for-game-invite', this.stopListeningForGameInvite)
    document.addEventListener('ready-for-matchmaking',this.listenForMatchmaking);
		document.addEventListener('stop-for-matchmaking',this.StoplisteningForMatchmaking)
  },

  beforeUnMount() {
    console.log("beforeunmount login page")
    this.$ws.removeListener('game-invite')
    document.removeEventListener('can-listen-for-game-invite', this.listenForGameInvite)
    document.removeEventListener('stop-listening-for-game-invite', this.stopListeningForGameInvite)
    document.removeEventListener('ready-for-matchmaking',this.listenForMatchmaking);
		document.removeEventListener('stop-for-matchmaking',this.StoplisteningForMatchmaking)
    this.$ws.disconnect()
  }

});
</script>

<style lang="sass">
.usercard-image
  border-radius: 1000px
  z-index: 2

.notifmenu
  width: 420px !important
  background-color: $bg-primary

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

.notify-avatar
  border-radius: 100px
  width: 42px
  height: 42px

.notif-item
  color: black

.n-info
  background-color: $grey-7

.n-negative
  background-color: $red

.n-positive
  background-color: $green

.n-warning
  background-color: $yellow

.n-other
  background-color: $grey-7

.n-message
  background-color: $yellow-4

.notif-count
  width: 20px
  height: 20px
  position: absolute
  margin-bottom: 29px
  margin-left: 22px
  font-size: 14px
  font-weight: bold
  color: white

.circle
  background-color: red
  border-radius: 100px
  margin-bottom: 27px

.n-info
  background-color: $bg-primary
  z-index: 1
  position: fixed
  width: 420px

.n-list
  margin-top: 60px
.thetitle
  font-family: 'Press Start 2P'
  font-size: 1.5rem
  font-weight: bold
  left: 50%
  transform: translateX(-60%)

.glow
  text-shadow: 1px 1px 2px white
  color: transparent
  --bg-size: 200%
  background: -webkit-linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)  0 0 / var(--bg-size) 100%
  -webkit-background-clip: text
  background-clip: text
  -webkit-text-fill-color: transparent
  animation: glowing 18s infinite linear


@keyframes glowing
  0%
    background-position: 0 0
  50%
    background-position: 400% 0
  100%
    background-position: 0 0

</style>
