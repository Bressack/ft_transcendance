<template>
	<q-item id="PendingRequest" class="row">
		<q-item-section style="max-width: 44px;" @click="goProfilPage" id="avatar">

			<!-- <q-icon v-if="category === 'received'" class=" " name="call_received" color="cyan" />
			<q-icon v-else-if="category === 'sent'" class=" " name="call_made" color="orange" /> -->

			<q-avatar size="38px" class=" " :style="`background-color: ${$utils.usernameToColor(username)};`">
				<img  :src="`/api/avatar/${username}/thumbnail`">
				<!-- <q-badge floating rounded color="teal"></q-badge> -->
				<div :class="getLoginStatus()" class="loginstatus" />
			</q-avatar>
		</q-item-section>

		<q-item-section id="name" class="hideable" @click="goProfilPage">
			{{ username }}
		</q-item-section>

		<q-item-section side class="text-right  hideable">
			<!-- <q-icon v-if="shortcut_profile" class="shortcut" name="person" color="cyan" @click="goProfilPage" />
			<q-icon v-if="shortcut_block" class="shortcut" name="person_off" color="red" @click="block" /> -->
			<!-- <q-icon v-if="category === 'sent'" class="shortcut" name="cancel" color="red" @click="unfollow" />
			<q-icon v-if="category === 'received'" class="shortcut" name="done" color="green" @click="follow" /> -->
			<q-icon v-if="category === 'received'" class=" " name="mdi-account-arrow-down-outline" color="cyan" />
			<q-icon v-else-if="category === 'sent'" class=" " name="mdi-account-arrow-up-outline" color="orange" />

		</q-item-section>
		<q-item-section id="reqbuttons" class="toggleVisibility">

			<q-btn-group flat class="justify-end  text-right">
				<q-btn  dense flat 
				:color="category === 'received' ? 'red' : 'orange'" 
				:label="category === 'received' ? 'decline' : 'cancel'" 
				:icon="category === 'received' ?  'mdi-cancel' : 'mdi-close'" @click="unfollow"/>
				<q-btn v-if="category === 'received'" dense flat color="cyan" label="accept" icon="check"  @click="follow"/>
			</q-btn-group>
		</q-item-section>
		<q-item-section side class="toto">
        <q-icon name="more_vert" color="#F7F7FF" class="toto" style="padding-left: 0; width:5px">
          <q-menu class="bg-grey-9 text-white" auto-close>

            <q-list style="min-width: 100px">

              <q-item v-if="menu_profile" clickable @click="goProfilPage">
                <q-item-section>Profile</q-item-section>
              </q-item>

              <q-separator dark />

              <q-item v-if="menu_block" clickable class="text-red-7" @click="block">
                <q-item-section>Block</q-item-section>
              </q-item>

            </q-list>

          </q-menu>
        </q-icon>
      </q-item-section>
	</q-item>
	<q-separator />
</template>

<script lang="ts">
import { UserStatus } from 'src/stores/store.types';
import { defineComponent, ref } from 'vue';

export default defineComponent({
	name: 'PendingRequest',
	components: {},
	props: {
		username: { type: String, required: true },
		category: { type: String, required: true },

		menu_profile: { type: Boolean, default: false },
		menu_block: { type: Boolean, default: false },

		shortcut_profile: { type: Boolean, default: false },
		shortcut_block: { type: Boolean, default: false },
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
			const status = this.$store.getStatus(this.username)
			//TODO: check login status
			if (status === UserStatus.ONLINE)
				return 'ONLINE-status'

			return 'OFFLINE-status'
		},
		goProfilPage() {
			this.$router.push({
				path: '/profile/' + this.username,
			})
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
	},
});
</script>

<style lang="sass" scoped>


	
#PendingRequest:hover
  background-color: $blue-grey-14
#PendingRequest:hover .hideable
  display: none

.toggleVisibility
  display: none

#PendingRequest:hover .toggleVisibility
  display: flex



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


.usermenu:hover .toto
  visibility: visible

.usermenu:hover .tata
  visibility: visible

// .shortcut .toto
//   visibility: hidden

// .shortcut:hover .toto
//   visibility: visible

// .shortcut
//   margin-right: 10px

// .shortcut .tata
//   visibility: hidden

// .shortcut:hover .tata
//   visibility: visible

// .tata
//   width: 80px
//   flex-direction: row
</style>
