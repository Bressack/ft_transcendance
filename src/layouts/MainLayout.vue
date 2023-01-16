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
import { IUserBasicInfo, OnlineStatus } from '../models/models'
// import { randomDate } from '../models/fakedatas'
// import api from 'src/services/api.service'
import { useMeStore } from 'src/stores/me';
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
		Settings
	},
	props: {},
	setup() {
		const settings = ref(false)
		return {
			settings,
			openSettings() { settings.value = true },
		}
	},
	data: () => {
		return {
			drawer: ref(false),
			storeMe: useMeStore(),
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
		// EXAMPLE
		// this.$ws.emitcb('join-channel', { channelId: '#gecacaneral' }, console.log, console.error)
		// console.log(this.storeMe.username)
		// if (this.storeMe.username == 'Alice99') {
		// this.$ws.emitcb('game-invite', { target_user: 'admin' }, console.log, console.error)

		// }
		//   this.$ws.listen('game-invitation', (data : any) => { // main-layout
		//   })
		//   this.$ws.listen('game-invitation-error', (data: any) => {  // composant dialog
		//   })
		//   this.$ws.listen('game-invitation-accepted', (data: any) => {  // composant dialog

		//   })


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
