<!--
  This vue file have to handle :
  - Invitation from an other player to you  -> You are requested to accept or decline the invitation, 30s delay before it declines automaticaly
  - Invitation from you to an other player  -> You wait at most 30s to the opponent to accept your game request, you can cancel anytime
  - Matchmaking launch                      -> You will look for other player indefintely, you can cancel anytime. If you find an opponent, you will enter in the game (Aymeric's problem)
 -->
<template>
	<div class="main">
		<q-item class="r-pt-md flex-center">
			<q-item-label v-if="sent" class="label">
				Waiting <span style="color:orange;" class="bigger">{{ opponent }}</span> to accept your game invitation
			</q-item-label>
			<q-item-label v-else class="label">
				You recieved a game invitation from <span style="color:orange;" class="bigger">{{ opponent }}</span>
			</q-item-label>
		</q-item>
		<q-item v-if="sent" class="q-mt-xl">
			<q-inner-loading size="50px" class="load" :showing="visible" color="orange" ref="load" />
		</q-item>
		<q-item class="q-py-xl flex-center">
			<q-btn v-if="!sent" class="q-mx-lg" label="Decline" color="red" @click="gameInviteResponse('DECLINED')"
				v-close-popup />
			<q-btn v-if="!sent" class="q-mx-lg" label="Accept" color="green" @click="gameInviteResponse('ACCEPTED')"
				v-close-popup />
			<q-btn v-else label="Cancel" color="red" v-close-popup />
		</q-item>
		<!-- Replace by a linear loading bar -->
		<q-ajax-bar v-if="!sent" skip-hijack class="relative" ref="bar" position="bottom" color="orange" size="20px" />
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	components: {},
	name: 'GameInvitation',
	setup() {
		const visible = ref(false)
		return {
			visible,
			loader() {
				visible.value = true
				setTimeout(() => {
					visible.value = false
				}, 30000)
			}
		}
	},
	data() {
		return {
			$refs: undefined as any
		}
	},
	props: {
		opponent: { type: String, default: null },
		sent: { type: Boolean, default: false },
		invite_cb: { type: Function, default: undefined },
		invite_data: { type: Object, default: undefined }
	},
	mounted() {
		if (!this.sent) {
			this.trigger()
		}
		this.loader()
	},
	methods: {
		trigger() {
			this.$refs.bar.start()
			setTimeout(() => {
				if (this.$refs.bar) {
					this.$refs.bar.stop()
					console.log(this.$refs)
				}
			}, 30000)
		},
		gameInviteResponse(res: string) {
			console.log(res)
			if (res === 'ACCEPTED')
				document.dispatchEvent(new CustomEvent('invite-response-accept', { detail: { status: res } }));
			else
				document.dispatchEvent(new CustomEvent('invite-response-decline', { detail: { status: res } }));
			// this.$emit('invite-response', res)
		},
	},
})
</script>

<style lang="sass" scoped>
@use "../css/interpolate" as r

.load
  background: 0

.relative
  position: relative

.main
  overflow: hidden
  background-color: #696969
  text-align: center

.image
  border: solid 1px black
  @include r.interpolate(width, 320px, 2560px, 30px, 60px)

.close-cross
  position: relative
  cursor: pointer

.cross
  @include r.interpolate(font-size, 320px, 2560px, 10px, 35px)

</style>
