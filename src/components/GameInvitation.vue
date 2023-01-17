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
			<q-btn v-else label="Cancel" color="red" @click="gameInviteCancel" v-close-popup />
		</q-item>
    <q-linear-progress v-if="sent" ref="bar" color="orange" size="20px" :value="progress"/>
    <q-linear-progress v-else reverse ref="bar" color="orange" size="20px" :value="progress"/>
		<!-- Replace by a linear loading bar -->
		<!-- <q-ajax-bar v-if="sent" class="relative" ref="bar" position="bottom" color="orange" size="20px" />
    <q-ajax-bar v-else reverse class="relative" ref="bar" position="bottom" color="orange" size="20px" /> -->
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	components: {},
	name: 'GameInvitation',
	setup() {
		const visible = ref(false)
    const progress = ref(0.00)
		return {
			visible,
			loader() {
				visible.value = true
			},
      progress
		}
	},
	data() {
		return {
			$refs: undefined as any,
		}
	},
	props: {
		opponent: { type: String, default: null },
		sent: { type: Boolean, default: false },
	},
	mounted() {
    this.recursiveProgress()
		this.loader()
	},
	methods: {
    async recursiveProgress() {
      this.progress += 0.011
      if (this.progress < 1.0)
        setTimeout(this.recursiveProgress, 300)
    },
		gameInviteResponse(res: string) {
			console.log(res)
			if (res === 'ACCEPTED')
				document.dispatchEvent(new CustomEvent('invite-response-accept', { detail: { status: res } }));
			else
				document.dispatchEvent(new CustomEvent('invite-response-decline', { detail: { status: res } }));
			// this.$emit('invite-response', res)
		},
		gameInviteCancel() {
			document.dispatchEvent(new CustomEvent('invite-response-canceled'));
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
