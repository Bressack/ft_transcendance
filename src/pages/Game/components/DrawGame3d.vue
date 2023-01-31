<template>
	<q-page>
		<ul>
			<div class="q-ml-md q-gutter-sm">
				<q-btn color="blue" @click="toggle" icon="fullscreen" padding="xs"></q-btn>
				<p> {{ gameId }}</p>
				<div id="bidule">
					<div class="tarace">
						0
					</div>
					<div id='gameCanvas'></div>
					<q-btn id="fullscreen-btn" color="light-grey" @click="toggle" icon="fullscreen" padding="xs"></q-btn>
				</div>
			</div>
		</ul>
	</q-page>
</template>
<script lang="ts">
import { ref, defineComponent, computed } from 'vue'
import { watch } from 'vue'
import { throttle } from 'lodash'
import * as Three from 'three';


var timeOutFunctionId = undefined as any;
// scene object variables
var renderer = null as any
var scene = null as any
var	camera = null as any
// var	pointLight = null as any
var spotLight= null as any

// field variables
var fieldWidth = 1200, fieldHeight = 720;

// paddle variables
var paddleWidth = 10
var paddleHeight = 10
var paddleDepth = 10
// var paddleQuality = 10
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;

// ball variables
var ball = null as any
var paddle1= null as any
var paddle2 = null as any


export default defineComponent({
	name: 'DrawGame',
	data() {
		return {
			game_paused: true,
			info_value: null,
			canvas: <HTMLCanvasElement> document.getElementById('canvas'),
			canvas_txt : <HTMLCanvasElement>document.getElementById('testid'),
			gameId: "",
			throttleValue: 15,
			player_height: 90,
			player_width: 5,
			ball_x: 550,
			ball_y: 360,
			ball_r: 5,
			player1_y: 310,
			player2_y: 310,
			player1_score: 0,
			player2_score: 0,
		}
	},
	methods:
	{
		setup()
		{	
			this.createScene();
			this.draw();
		},
		createScene()
		{
			let HEIGHT = window.innerWidth / 1.5 / 1.6;
			let WIDTH = window.innerWidth / 1.5;
			var VIEW_ANGLE = 50, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 5000;
			renderer = new Three.WebGLRenderer();
			
			camera = new Three.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
			scene = new Three.Scene();
			scene.add(camera);
			camera.position.z = 320;
			
			// var c = <HTMLCanvasElement>document.getElementById("gameCanvas");
			renderer.setSize(WIDTH, HEIGHT);
			renderer.domElement.id = 'testid';
			this.canvas.appendChild(renderer.domElement);

			// 	setTimeout(() =>
			// 	{
			// 		this.canvas_txt = <HTMLCanvasElement>document.getElementById('testid');
			// 		console.log(renderer.getContext('2d'));
			// 		console.log(this.canvas_txt.getContext('2d'));
			// 		var context = renderer.getContext('2d');
			// 		context.fillText(
        	//     this.player1_score.toString(),
        	//     this.canvas.width / 2 -
        	//         (this.canvas.width * 0.05 + 100),
        	//     this.canvas.height * 0.1
        	// );
				// }
					// ,100);

			
			var planeWidth = fieldWidth
			var	planeHeight = fieldHeight		
			var paddle1Material = new Three.MeshBasicMaterial({color: 0x00ffff});
			var paddle2Material = new Three.MeshBasicMaterial({color: 0xFF0000});	
			var planeMaterial = new Three.MeshBasicMaterial({color: 0x000000});
			var tableMaterial = new Three.MeshBasicMaterial({color: 0x8c8c8c});
			var sphereMaterial = new Three.MeshBasicMaterial( {color: 0xFFFFFF} );
			var plane = new Three.Mesh( new Three.PlaneGeometry(planeWidth, planeHeight ), planeMaterial);
			scene.add(plane);
			var table = new Three.Mesh(
			new Three.PlaneGeometry( planeWidth * 1.03, planeHeight * 1.03), tableMaterial);
			table.position.z = -5;
			scene.add(table);
			var radius = 10;
			var	segments = 6;
			var	rings = 6;
			ball = new Three.Mesh(new Three.SphereGeometry( radius, segments, rings), sphereMaterial);
			scene.add(ball);

			ball.position.x = 0;
			ball.position.y = 0;
			ball.position.z = radius;	
			paddleWidth = 20;
			paddleHeight = 100;
			paddleDepth = 20;
			paddle1 = new Three.Mesh(
			  new Three.BoxGeometry(
				paddleWidth,
				paddleHeight,
				paddleDepth,
			  )
				,
			  paddle1Material);
			scene.add(paddle1);
			paddle1.receiveShadow = true;
    		paddle1.castShadow = true;
			paddle2 = new Three.Mesh(
			  new Three.BoxGeometry(
				paddleWidth,
				paddleHeight,
				paddleDepth,
			  )
				,
			  paddle2Material);
			scene.add(paddle2);
			paddle2.receiveShadow = true;
    		paddle2.castShadow = true;	
			paddle1.position.x = -fieldWidth/2 + paddleWidth;
			paddle2.position.x = fieldWidth/2 - paddleWidth;
			paddle1.position.z = paddleDepth;
			paddle2.position.z = paddleDepth;
    		spotLight = new Three.SpotLight(0xF8D898);
    		spotLight.position.set(0, 0, 460);
    		spotLight.intensity = 1.5;
    		spotLight.castShadow = true;
    		scene.add(spotLight);
			this.cameraPhysics()	
		},
		draw()
		{
			// paddle1.position.y = 310
			this.cameraPhysics();
			// ball.position.x = 0 - 550;
			// ball.position.y = 0+350
			// var context = <CanvasRenderingContext2D>this.canvas_txt.getContext("2d");
			renderer.render(scene, camera);
			// context.fill();
        	// context.font = `${this.canvas.height * 0.07}px 'PressStart2P'`;
        	// context.fillText(
        	//     this.player1_score.toString(),
        	//     this.canvas.width / 2 -
        	//         (this.canvas.width * 0.05 + context.measureText(this.player1_score.toString()).width),
        	//     this.canvas.height * 0.1
        	// );
        	// context.fillText(
        	//     this.player2_score.toString(),
        	//     this.canvas.width / 2 + this.canvas.width * 0.05,
        	//     this.canvas.height * 0.1
        	// );
        	// if (this.game_paused && this.info_value) {
        	//     const textSize = context.measureText(this.info_value);
        	//     context.fillStyle = "white";
        	//     context.fillText(this.info_value, this.canvas.width / 2 - textSize.width / 2, this.canvas.height / 2);
        	// }
			// console.log(this.canvas)
		},
		cameraPhysics()
		{
			// camera.position.x = paddle1.position.x - 300;
			camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
			// camera.position.z = paddle1.position.z + 800 + 0.04 * (-ball.position.x + paddle1.position.x);
			// camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
			// camera.rotation.y = -40 * Math.PI/180;
			// camera.rotation.z = -90 * Math.PI/180;

			camera.position.x = paddle1.position.x - 300;
			camera.position.z = paddle1.position.z + 800;
			camera.rotation.x = 0;
			camera.rotation.y = -40 * Math.PI/180;
			camera.rotation.z = -90 * Math.PI/180;
		},
		toggle(e: any) {
			const target = <HTMLElement>document.getElementById('bidule')
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
		waitEndResize() {
			clearTimeout(timeOutFunctionId);
			timeOutFunctionId = setTimeout(this.onResize, 200);
		},
		onResize() {
			if (this.$q.fullscreen.isActive == true) {

				if (window.screen.orientation.type == "portrait-primary") {
					renderer.setSize(window.innerWidth, window.innerHeight / 1.6);
					this.canvas.height = window.innerWidth / 1.6;
					this.canvas.width = window.innerWidth;
					
				}
				else {
					renderer.setSize(window.innerWidth, window.innerHeight * 0.90);
					this.canvas.width = window.innerWidth;
					this.canvas.height = window.innerHeight * 0.90;
				}
			}
			else {
				renderer.setSize( window.innerWidth / 1.5, window.innerWidth / 1.5 / 1.6);
				this.canvas.height = window.innerWidth / 1.5 / 1.6;
				this.canvas.width = window.innerWidth / 1.5;
			}
			this.draw();
		},
		update_and_draw(data: any) {
			paddle1.position.y = -1 * (data.p1) + 310
			paddle2.position.y = -1 * (data.p2) + 310
			this.player1_score = data.scorep1
			this.player2_score = data.scorep2
			ball.position.x =  data.ball.x - 550
			ball.position.y = -1 * (data.ball.y) + 350
			// this.ball_x =
			// this.ball_y = 
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
		},
		ft_mounted() {
			this.canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
			// console.log(this.canvas)
			this.$ws.listen(`${this.gameId}___countdown`, this.handleCoundown);
			this.$ws.listen(`${this.gameId}___game-end`, this.handleGameEnd);
			this.$ws.listen(`${this.gameId}___frame-update`, this.update_and_draw);
			this.canvas.addEventListener('dblclick', this.toggle);
			const onResizeThrottled = throttle(this.onResize, 200)
			var fullscreenButton = <HTMLElement>document.getElementById('fullscreen-btn');
			fullscreenButton.style.display = "none";
			window.addEventListener('resize', onResizeThrottled);
			watch(() => this.$q.fullscreen.isActive, val => {
				console.log(val ? 'In fullscreen now' : 'Exited fullscreen')
				onResizeThrottled();
				if (this.$q.fullscreen.isActive == true) {
					fullscreenButton.style.display = "block";
				}
				else {
					fullscreenButton.style.display = "none";
				}
			})
			this.setup();
			// this.onResize()
		},
	},
	beforeMount() {
		this.gameId = this.$route.params.gameId.toString() as string;
	},
	mounted() {
		setTimeout(this.ft_mounted, 10)
		
	},
	beforeUnmount() {
		console.log('quit');
		this.$ws.emit('quit', {})
	}
})
</script>

<style scoped>
.tarace{
	font-family: 'PressStart2P';
	font-size: 40px;
	position: absolute;
	margin: 5% 45%;

}
body {
	background-color: black;
}
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
/*


*/