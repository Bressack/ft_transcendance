<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<q-toolbar class="toolbar">

				<q-btn flat @click="drawer = !drawer" round dense icon="menu" />
				<q-toolbar-title>
					<!-- <span class="q-pr-lg">PONG ARENA</span> -->
					<!-- <q-btn class="q-mr-sm" to="/login"       color="blue">Login</q-btn> -->
					<q-btn class="q-mr-sm" to="/" color="orange">Home</q-btn>
					<q-btn class="q-mr-sm" to="/feeddb" color="green">Auto Feed Database</q-btn>
					<q-btn class="q-mr-sm" to="/profile/me" color="green">Profile</q-btn>
					<q-btn class="q-mr-sm" to="/play" color="green">Play</q-btn>
					<div class="q-mr-lg logout">
						<q-btn class="absolute-right" @click="logout()" color="red" label="LOGOUT" />
					</div>
				</q-toolbar-title>
			</q-toolbar>
		</q-header>

		<q-drawer v-model="drawer" show-if-above :breakpoint="500" :width="300">
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
			drawer: ref(false),
			storeMe: useMeStore(),
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
					that.$router.push('/login')
					that.storeMe.$reset()
				})
		},

	},
	created() {
		this.storeMe.fetch()
		this.$ws.connect()
	},
	mounted() {

		// RECEPTION
		this.$ws.listen('game-invite', (data: any, callback: Function) => {
			const that = this
			const accept = function (res: any) {
				console.log(res)
				callback('ACCEPTED')
				that.InvitationFrom = false
				document.removeEventListener('invite-response-accept', accept);
				document.removeEventListener('invite-response-decline', decline);
			}
			const decline = function (res: any) {
				console.log(res)
				callback('DECLINED')
				that.InvitationFrom = false
				document.removeEventListener('invite-response-accept', accept);
				document.removeEventListener('invite-response-decline', decline);
			}
			console.log(data)
			this.opponent = data.username
			this.InvitationFrom = true
			document.addEventListener('invite-response-accept', accept)
			document.addEventListener('invite-response-decline', decline)
		})

	},

	beforeUnMount() {
		console.log("beforeunmount login page")
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

.name
  font-weight: bold
  color: v-bind(nameColor)
  font-size: v-bind(textSize)
  margin-right: 0.8vw

  // add '...' to the end of name if it overflow the container
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis

.main
  display: flex-start
  align-items: flex-start
  margin:  0.1em
  padding: 0.1em
  flex-direction: row

</style>
