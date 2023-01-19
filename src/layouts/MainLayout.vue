<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar class="toolbar">

				<q-btn flat @click="storeMe.drawerStatus = !storeMe.drawerStatus" round dense icon="menu" />
				<q-toolbar-title>
					<!-- <span class="q-pr-lg">PONG ARENA</span> -->
					<!-- <q-btn class="q-mr-sm" to="/login"       color="blue">Login</q-btn> -->
					<q-btn class="q-mr-sm" to="/" color="orange">Home</q-btn>
					<q-btn class="q-mr-sm" to="/game" color="brown">TEST_GAME</q-btn>
					<q-btn class="q-mr-sm" to="/profile/me" color="green">Profile</q-btn>
					<q-btn class="q-mr-sm" to="/play" color="green">Play</q-btn>
					<div class="q-mr-lg logout">
						<q-btn class="absolute-right" @click="logout()" color="red" label="LOGOUT" />
					</div>
				</q-toolbar-title>
			</q-toolbar>
		</q-header>

		<q-drawer v-model="storeMe.drawerStatus" show-if-above :breakpoint="500" :width="300">
			<q-scroll-area class="scroll">
				<ConversationList />
			</q-scroll-area>

			<q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 90px">
				<UserCard v-if="(storeMe.username)" :iconfun="goSettingsNotif" :profilefun="goProfilePage"
					class="absolute-top" :name="storeMe.username" avatar="/api/avatar/me/medium" icon="settings"
					size="large" nameColor="orange" :ratio="0.42" />
			</q-img>
			<q-dialog v-model="settings">
				<settings />
			</q-dialog>
			<q-dialog persistent v-model="InvitationFrom">
				<GameInvitation :opponent="opponent" />
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
import UserCard from '../components/common/UserCard.vue'
import Settings from '../components/Settings.vue'
import GameInvitation from '../components/GameInvitation.vue'
import { IUserBasicInfo, OnlineStatus } from '../models/models'
// import { randomDate } from '../models/fakedatas'
// import api from 'src/services/api.service'
import { useMeStore } from 'src/stores/me';
import { useChatSocketStore } from 'src/stores/chatSocket';
import { callbackify } from 'util';
// import WsService from 'src/services/ws.service';

let _me = {
	name: 'tharchen',
	avatar: 'https://cdn.intra.42.fr/users/d1ae701a3af5f3dd3070d5c8406e77fe/tharchen.jpg',
	onlineStatus: OnlineStatus.ONLINE,
} as IUserBasicInfo
// const ws = WsService;

export default defineComponent({
	name: 'MainLayout',
	components: {
		ConversationList,
		UserCard,
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
			// drawer: ref(false),
			storeMe: useMeStore(),
			storeChat: useChatSocketStore(),
			// invite_cb: null,
			// invite_data: undefined
			opponent: ""

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
			let that = this
			this.$api.logout()
				.then(function (status) {
          that.$ws.disconnect()
          that.storeMe.$reset()
          that.storeChat.leaveCurrentRoom()
          that.storeChat.$reset()
          that.$router.push('/login')
				})
		},
		onGameInvite(data: any, callback: Function) {
			const that = this
			this.opponent = data.from
			that.$ws.removeListener('game-invite')

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
				that.$ws.socket.once('game-setup-and-init-go-go-power-ranger', (gameId: string, callback: Function) => {
					callback("OK")
					console.log(gameId)
					that.$router.push(`/game/${gameId}`)

				})

				document.removeEventListener('invite-response-accept', accept);
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
			this.opponent = data.username
			this.InvitationFrom = true
			document.addEventListener('invite-response-accept', accept)
			document.addEventListener('invite-response-decline', decline)
		}

	},
	created() {
    // clean possibly old datas
    this.storeMe.$reset()
    this.storeChat.leaveCurrentRoom()
    this.storeChat.$reset()
    // connect and init WebSockets
    this.$ws.connect()
    this.storeChat.init_socket(this.$ws) // set socket in the store
    // fetch datas
    this.storeMe.fetch()
	},
	mounted() {

		// RECEPTION
		this.$ws.listen('game-invite', this.onGameInvite)


	},

	beforeUnMount() {
		console.log("beforeunmount login page")
		this.$ws.removeListener('game-invite')
		this.$ws.disconnect()
		// this.$ws.sendInvite({})
		// this.$ws.removeListener('game-invitation-error') //  composant dialog
		//  this.$ws.removeListener('game-invitation-accepted') // composant dialog

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

</style>
