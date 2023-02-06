<template>
	<div>

		<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
		<ul>
			<div class="q-ml-md q-gutter-sm">
				<!-- <q-btn color="blue" @click="toggle" icon="fullscreen" padding="xs"></q-btn> -->
				<!-- <p> {{ gameId }}</p> -->
				<div id="2ddiv">
					<canvas id="canvas"></canvas>
					<!-- <q-btn id="fullscreen-btn" color="light-grey" @click="toggle" icon="fullscreen" padding="xs"></q-btn> -->
				</div>
			</div>
		</ul>
	</div>
</template>
<script lang="ts">
import { ref, defineComponent, computed } from 'vue'
import { watch } from 'vue'
import { throttle } from 'lodash'
import { useMeStore } from '../../../stores/me';

var timeOutFunctionId = undefined as any;


export default defineComponent({
	name: 'DrawGame',
	data() {
		return {
			game_paused: true,
			info_value: null,
			canvas: <HTMLCanvasElement> document.getElementById('canvas'),
			gameId: "",
			throttleValue: 15,
			height_ratio: 1,
			width_ratio: 1,
			player_height: 90,
			player_width: 5,
			ball_x: 550,
			ball_y: 360,
			ball_r: 5,
			player1_y: 310,
			player2_y: 310,
			player1_score: 0,
			player2_score: 0,
			playerOneName: "p1",
			playerTwoName: "p2",
			storeMe: useMeStore(),
		};
	},
	methods:
	{
		draw() {
			const elementsColor: string = this.game_paused && this.info_value ? "#242729" : "white";
        	var context = <CanvasRenderingContext2D>this.canvas.getContext("2d");
        	// Draw field
			context.fillStyle = "#242729";
        	context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        	// Draw middle line
        	context.strokeStyle = elementsColor;
        	context.beginPath();
        	context.moveTo(this.canvas.width / 2, 0);
        	context.lineTo(this.canvas.width / 2, this.canvas.height);
        	context.stroke();
        	// Draw players
        	context.fillStyle = elementsColor;
			context.fillRect(
        	    2,
        	    (this.player1_y + 5) * this.height_ratio,
        	    this.player_width * this.width_ratio,
        	    this.player_height * this.height_ratio
        	);
			context.fillStyle = elementsColor;
        	context.fillRect(
        	    (this.canvas.width - this.player_width * this.width_ratio)- 2,
        	    (this.player2_y + 5) * this.height_ratio,
        	    this.player_width * this.width_ratio,
        	    this.player_height * this.height_ratio
        	);
        	// Draw ball
        	context.beginPath();
        	context.fillStyle = elementsColor;
        	context.arc(
        	    this.ball_x * this.width_ratio,
        	    this.ball_y * this.height_ratio,
        	    this.ball_r * this.height_ratio,
        	    0,
        	    7,
        	    false
        	);
        	context.fill();
        	context.font = `${this.canvas.height * 0.07}px 'Press Start 2P'`;
        	context.fillText(
        	    this.player1_score.toString(),
        	    this.canvas.width / 2 -
        	        (this.canvas.width * 0.05 + context.measureText(this.player1_score.toString()).width),
        	    this.canvas.height * 0.1
        	);
        	context.fillText(
        	    this.player2_score.toString(),
        	    this.canvas.width / 2 + this.canvas.width * 0.05,
        	    this.canvas.height * 0.1
        	);
        	if (this.game_paused && this.info_value) {
        	    const textSize = context.measureText(this.info_value);
        	    context.fillStyle = "white";
        	    context.fillText(this.info_value, this.canvas.width / 2 - textSize.width / 2, this.canvas.height / 2);
        	}
    	},
		waitEndResize() {
			clearTimeout(timeOutFunctionId);
			timeOutFunctionId = setTimeout(this.onResize, 200);
		},
		onResize() {
			if (this.$q.fullscreen.isActive == true) {

				if (window.screen.orientation.type == "portrait-primary") {
					this.canvas.height = window.innerWidth / 1.6;
					this.canvas.width = window.innerWidth;
				}
				else {
					this.canvas.width = window.innerWidth;
					this.canvas.height = window.innerHeight;
				}
			}
			else {
				this.canvas.height = window.innerWidth / 1.5 / 1.6;
				this.canvas.width = window.innerWidth / 1.5;
			}
			this.height_ratio = this.canvas.height / 720;
        	this.width_ratio = this.canvas.width / 1100;
			this.draw();
		},
		toggle(e: any) {
			const target = <HTMLElement>document.getElementById('2ddiv')
			console.log("toggle 1", this.$q.fullscreen.isActive)
			this.$q.fullscreen.toggle(target)
				.then(() => {
				})
				.catch((err) => {
					alert(err)
				})
			console.log("toggle 2 ", this.$q.fullscreen.isActive)
			this.draw();
		},
		update_and_draw(data: any) {
			this.player1_y = data.p1
			this.player2_y = data.p2
			this.player1_score = data.scorep1
			this.player2_score = data.scorep2
			this.ball_x = data.ball.x
			this.ball_y = data.ball.y
			this.draw();
		},
		handleCoundown(data: any) {
			if (data.status == 'done') {
				this.game_paused = false;
				this.info_value = null;

			}
			else if (data.status == 'pending') {
				this.game_paused = true;
				this.info_value = data.value;
			}
			this.draw()
		},
		handleGameEnd(data: any) {
			this.game_paused = true;
			this.info_value = data.value;
			this.draw()
			setTimeout(() => {
				this.$router.push("/profile/me")
			}, 1000)
		}
	},
	created() {
		this.gameId = this.$route.params.gameId.toString() as string;
		this.playerOneName = this.$route.query.playerOneName as string;
		this.playerTwoName = this.$route.query.playerTwoName as string;
	},
	mounted() {
		this.canvas = <HTMLCanvasElement>document.getElementById('canvas')
		this.$ws.listen(`${this.gameId}___countdown`, this.handleCoundown);
		this.$ws.listen(`${this.gameId}___game-end`, this.handleGameEnd);
		this.$ws.listen(`${this.gameId}___frame-update`, this.update_and_draw);
		this.canvas.addEventListener('dblclick', this.toggle);
		const onResizeThrottled = throttle(this.onResize, 200)
		window.addEventListener('resize', onResizeThrottled);
		watch(() => this.$q.fullscreen.isActive, val => {
			console.log(val ? 'In fullscreen now' : 'Exited fullscreen')
			onResizeThrottled();
		})
		this.onResize();
	},
	beforeUnmount() {
		console.log('quit');
		this.$ws.emit('quit', {})
	}
})
</script>

<style scoped>
main {
	display: flex;
	flex-direction: column;
}
#canvas {
	/* opacity: 0.5; */
	position:absolute;
	/* top:5%; */
	left:50%;
    transform: translateX(-50%);
	z-index: 0;
	border: 5px solid white;
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


