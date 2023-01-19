<template>
	<q-page>
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
		<!-- <p>
			<Score :scoreP1="gameInfo.game.computer.score" :scoreP2="gameInfo.game.player.score" />
		</p> -->
		<ul>
			<div class="q-ml-md q-gutter-sm">
				<!-- <q-btn icon="play_arrow" padding="xs" @click="startGame()" color="green" no-caps /> -->
				<q-btn icon="stop_circle" padding="xs" @click="stop()" color="red" no-caps />
				<q-btn color="blue" @click="toggle" icon="fullscreen" padding="xs"></q-btn>
				<p> {{ gameId }}</p>
				<div id="bidule">
					<canvas id="canvas"></canvas>
					<q-btn id="test" color="light-grey" @click="toggle" icon="fullscreen" padding="xs"></q-btn>
				</div>
			</div>
		</ul>
	</q-page>
</template>

<!-- window.innerHeight -->
<script lang="ts">
import { ref, defineComponent, computed } from 'vue'
import { useQuasar } from 'quasar'
import Score from '../components/Game/Score.vue'
import { GameInfo } from '../models/gameCalculation'
import { watch } from 'vue'

var timeOutFunctionId = undefined as any;

export default defineComponent({
	name: 'Game',
	components: { Score },
	data() {

		return {
			gameId: this.$route.params.gameId.toString() as string,
			animResize: 0,
			gameInfo: new GameInfo,
			test: useQuasar(),
			intdesesmort: 0,
		};
	},
	methods:
	{
		playerMove(event: any) {
			var canvasLocation = this.gameInfo.canvas.getBoundingClientRect();
			var mouseLocation = (event.type === "touchmove" ? event.changedTouches[0].clientY : event.clientY) - canvasLocation.y;
			// console.log(mouseLocation);

			if (mouseLocation < (this.gameInfo.player_height / 2 * this.gameInfo.height_ratio)) {
				this.gameInfo.game.player.y = 0;
			} else if (mouseLocation > this.gameInfo.canvas.height - (this.gameInfo.player_height / 2 * this.gameInfo.height_ratio)) {
				this.gameInfo.game.player.y = this.gameInfo.canvas.height - (this.gameInfo.player_height * this.gameInfo.height_ratio);
			} else {
				this.gameInfo.game.player.y = mouseLocation - ((this.gameInfo.player_height * this.gameInfo.height_ratio)) / 2;
			}
			this.gameInfo.game.player.y = (this.gameInfo.game.player.y / this.gameInfo.height_ratio)

			// this.$ws.emit('mousemove', new Uint16Array(this.gameInfo.game.player.y))
			// this.$ws.emit('mousemove', new Uint16Array(this.gameInfo.game.computer.y))

		},
		// startGame() {
		// 	this.gameInfo.game.computer.score = 0;
		// 	this.gameInfo.game.player.score = 0;
		// 	this.play();
		// },
		// play() {
		// 	this.gameInfo.draw();
		// 	this.gameInfo.computerMove();
		// 	this.gameInfo.anim = requestAnimationFrame(this.play);
		// },
		stop() {
			cancelAnimationFrame(this.gameInfo.anim);
			this.gameInfo.draw();
		},
		waitEndResize() {
			clearTimeout(timeOutFunctionId);
			timeOutFunctionId = setTimeout(this.onResize, 200);
		},
		onResize() {
			if (this.test.fullscreen.isActive == true) {

				if (window.screen.orientation.type == "portrait-primary") {
					this.gameInfo.canvas.height = window.innerWidth / 1.6;
					this.gameInfo.canvas.width = window.innerWidth;
				}
				else {
					this.gameInfo.canvas.width = window.innerWidth;
					this.gameInfo.canvas.height = window.innerHeight * 0.90;
				}

			}
			else {
				this.gameInfo.canvas.height = window.innerWidth / 1.5 / 1.6;
				this.gameInfo.canvas.width = window.innerWidth / 1.5;
			}
			this.gameInfo.draw();
		},
		toggle(e: any) {
			const target = <HTMLElement>document.getElementById('bidule')
			console.log("toggle 1", this.test.fullscreen.isActive)
			this.test.fullscreen.toggle(target)
				.then(() => {
				})
				.catch((err) => {
					alert(err)
				})
			console.log("toggle 2 ", this.test.fullscreen.isActive)
			this.gameInfo.draw();
		},
		update_and_draw(data: any) {
			/*
				update game value
				
			*/
			this.gameInfo.game.player.y = data.p1
			this.gameInfo.game.computer.y = data.p2
			this.gameInfo.game.computer.score = data.scorep2
			this.gameInfo.game.player.score = data.scorep1
			this.gameInfo.game.ball.x = data.ball.x
			this.gameInfo.game.ball.y = data.ball.y
			this.gameInfo.draw();
		},

	},
	beforeMount() {
		/* receive game from serv */
		this.gameInfo = new GameInfo;
	},
	mounted() {
		this.$ws.listen(`${this.gameId}___frame-update`, this.update_and_draw);

		this.test = useQuasar()
		this.gameInfo.canvas = <HTMLCanvasElement>document.getElementById('canvas')
		// this.gameInfo.canvas.addEventListener('mousemove', this.playerMove);
		// this.gameInfo.canvas.addEventListener('touchmove', this.playerMove);
		var fullscreenButton = <HTMLElement>document.getElementById('test');
		fullscreenButton.style.display = "none";
		window.addEventListener('resize', this.waitEndResize);
		watch(() => this.test.fullscreen.isActive, val => {
			console.log(val ? 'In fullscreen now' : 'Exited fullscreen')
			this.waitEndResize();
			if (this.test.fullscreen.isActive == true) {
				fullscreenButton.style.display = "block";
			}
			else {
				fullscreenButton.style.display = "none";
			}
		})
		this.onResize();
		console.log(`${this.gameId}___frame-update`)
		// this.$ws.listen('game-end', this.stop)
	},
	unmouted() {
		this.gameInfo.canvas.removeEventListener('mousemove', this.playerMove);
		this.gameInfo.canvas.removeEventListener('touchmove', this.playerMove);
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


