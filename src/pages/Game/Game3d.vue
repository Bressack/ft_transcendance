<template>
	<q-page>
			<DrawGame3d>
			</DrawGame3d>
	</q-page>
</template>

<!-- window.innerHeight -->
<script lang="ts">
import { defineComponent } from 'vue'
import DrawGame3d from './components/DrawGame3d.vue'
import { throttle } from 'lodash'

export default defineComponent({
	name: 'Game',
	components: {DrawGame3d},
	data() {
		return {
			player_height: 100,
			// test: <HTMLCollection> document.getElementById("gameCanvas").getElementsByTagName("*"),
			canvas : <HTMLCanvasElement> document.getElementById('canvas'),
			height_ratio: 1,
			true_player_height: 100,
			gameId: "",
			animResize: 0,
			throttleValue: 10,
			playerOneName: "p1",
			playerTwoName: "p2",
			playermod : false,
		};
	},

	methods:
	{
		getPlayerPosition(event: any): any {
			const canvasLocation = this.canvas.getBoundingClientRect();
			this.canvas.width / 4

			this.height_ratio = this.canvas.height / 1100;
			// this.true_player_height = this.player_height * this.height_ratio;
			let mouseLocation = (event.type === "touchmove" ? event.changedTouches[0].clientX : event.clientX) - canvasLocation.x;
			let y = 50

			/* // mouseposition p1 */
			if ((this.playerOneName == this.$storeMe.username))
			{
				if (mouseLocation <= this.canvas.width / 4) {
					y = 0;
				} else if (mouseLocation >= (this.canvas.width * (3 / 4))) {
					y = 620;
				} else {
					y = ((mouseLocation - this.canvas.width / 4) * 620) / (this.canvas.width / 2);
				}
				return y
			}
			/* // mouseposition p2 */
			if (mouseLocation <= this.canvas.width / 4) {
				y = 620;
			} else if (mouseLocation >= (this.canvas.width * (3 / 4))) {
				y = 0;
			} else {
				y = 620 - ((mouseLocation - this.canvas.width / 4) * 620) / (this.canvas.width / 2);
			}
			return y
		},
		sendPosition(event: any) {
			this.$ws.socket.volatile.emit(`${this.gameId}___mousemove`, this.getPlayerPosition(event))
		},
	},
	beforeMount() {
		this.gameId = this.$route.params.gameId.toString() as string;
		this.playerOneName = this.$route.query.playerOneName as string;
		this.playerTwoName = this.$route.query.playerTwoName as string;
		},
		mounted() {

			document.dispatchEvent(new CustomEvent('stop-listening-for-game-invite'));
			this.canvas = <HTMLCanvasElement> document.getElementById('canvas_txt');
			const sendPositionThrottled = throttle(this.sendPosition, this.throttleValue)
			this.canvas.addEventListener('mousemove', sendPositionThrottled);

	},
	beforeUnmount() {
		console.log('quit');
		this.$ws.emit('quit', {})
		this.canvas.removeEventListener('mousemove', this.sendPosition); // player
		document.dispatchEvent(new CustomEvent('can-listen-for-game-invite'));

	}
})
</script>

<style scoped>
main {
	display: flex;
	flex-direction: column;
}

h1,
p,
ul {
	text-align: center;
	list-style: none;
	padding: 0;
	flex-direction: column;
}

li {
	display: inline-block;
}
</style>


