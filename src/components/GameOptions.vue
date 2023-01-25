<template>
	<div class="main">
		<div class="close-cross">
			<q-btn class="cross absolute-right" color="orange" icon="close" flat round v-close-popup />
		</div>
		<div class="q-px-xl r-py-md">
			<q-item-label class="bigger">Game Options</q-item-label>
		</div>
		<q-item-section class="q-pa-md">
			<q-separator color="white" />
			<q-option-group inline v-model="map" :options="maps" color="white" keep-color>
				<template v-slot:label="map">
					<div class="row items-center">
						<q-item-label class="label">{{ map.label }}</q-item-label>
						<q-img class="image q-ma-md" :src="`/src/assets/maps/${map.value}.png`" />
					</div>
				</template>
			</q-option-group>
			<q-separator color="white" />
			<div class="q-pa-md rounded-borders">
        <q-item-label class="label">
          Difficulty level
        </q-item-label>
        <!-- <q-slider v-model="difficulty" :min="1" :max="3" color="white"/> -->
				<q-option-group inline v-model="opt" :options="opts" color="white" keep-color>
					<template v-slot:label="dif">
						<div class="row items-center">
							<q-item-label class="q-pa-auto label">{{ dif.label }}</q-item-label>
						</div>
					</template>
				</q-option-group>
			</div>
		</q-item-section>
		<q-item class="justify-center centers bigger q-mb-lg">
			<q-btn class="label" v-if="opponent" :label="`Play against ${opponent}`" color="orange"
				@click="sendInviteAndOpen" />
			<q-btn class="label" v-else label="Matchmaking" color="orange" @click="InviteNotif = true" />
		</q-item>
		<q-dialog persistent v-model="InviteNotif">
			<GameInvitation :opponent="opponent" sent :map=map :difficulty=opt />
		</q-dialog>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import GameInvitation from './GameInvitation.vue'

export default defineComponent({
	components: { GameInvitation },
	name: 'GameOptions',
	setup() {
		const InviteNotif = ref(false)
		return {
			map: ref('map1'),
			maps: [
				{ label: 'Map 1', value: 'map1' },
				{ label: 'Map 2', value: 'map2' },
				{ label: 'Map 3', value: 'map3' },
				{ label: 'Map 4', value: 'map4' }
			],
			opt: ref('1'),
			opts: [
				{ label: '1', value: '1' },
				{ label: '2', value: '2' },
				{ label: '3', value: '3' },
			],
			InviteNotif
		}
	},
	props: {
		opponent: { type: String, default: null },
	},
	methods: {
		async invite() {
			this.$ws.removeListener('game-invite')
			return new Promise((resolve, reject) => {
				const that = this;
				const cancel = () => {
					that.$ws.emit('game-invite-canceled', {})
					document.removeEventListener('invite-response-canceled', cancel);
					reject();
				}
				document.addEventListener('invite-response-canceled', cancel)
				this.$ws.emit('game-invite', { target_user: this.opponent, map: this.map, difficulty: this.opt })
				this.$ws.socket.once('game-invite-accepted', (data: object) => {
					that.$ws.socket.once('game-setup-and-init-go-go-power-ranger', (gameId: string, callback: Function) => {
						callback("OK")
						console.log(gameId)
						that.$router.push(`/game/${gameId}`)
            
					})
					document.removeEventListener('invite-response-canceled', cancel);

					resolve({ status: 'ACCEPTED', gameOptions: data })
				})
				this.$ws.socket.once('game-invite-declined', () => {
					document.removeEventListener('invite-response-canceled', cancel);
					reject({ status: 'DECLINED', gameOptions: null })
				})
			})
		},
		async sendInviteAndOpen() {
			this.InviteNotif = true
			console.log('sendInviteAndOpen')
			try {
				await this.invite()
				this.InviteNotif = false
				this.$ws.removeListener('game-invite-accepted')
				this.$ws.removeListener('game-invite-declined')

			}
			catch (err) {
				console.error(err)
				this.InviteNotif = false
				this.$ws.removeListener('game-invite-accepted')
				this.$ws.removeListener('game-invite-declined')
			}
		},
		async closeDialog() {
			setTimeout(() => {
				this.InviteNotif = false
			}, 30000)
		}
		// this.$ws.emit('game-invite', { target_user: this.opponent })
	},
	mounted() {
		this.closeDialog()
		// this.$ws.listen('game-invite-accepted', (d: any, callback: Function) => {
		// 	console.log('game-invite-accepted')
		// 	this.InviteNotif = false
		// 	callback("ACCEPTED")
		// })
		// this.$ws.listen('game-invite-declined', (d: any) => {
		// 	this.InviteNotif = false
		// 	console.log('game-invite-declined')
		// })
	}
})
</script>

<style lang="sass" scoped>
@use "../css/interpolate" as r
.main
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
