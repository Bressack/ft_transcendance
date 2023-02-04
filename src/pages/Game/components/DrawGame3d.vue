<template>
	<div>
		<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
		<ul>
				<div id="div3d">
					<canvas id="canvas_txt"></canvas>
					<div id='gameCanvas'></div>
					<!-- <q-btn id="fullscreen-btn" color="light-grey" @click="toggle" icon="fullscreen" padding="xs"></q-btn> -->
				</div>
		</ul>
	</div>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from 'vue'
import { watch } from 'vue'
import { throttle } from 'lodash'
import * as THREE from 'three';
import { useMeStore } from '../../../stores/me';
// import THREE from 'three';


var timeOutFunctionId = undefined as any;
// scene object variables
var renderer = null as any
var scene = null as any
var	camera = null as any
// var	pointLight = null as any
var spotLight= null as any

// field variables
var fieldWidth = 1150, fieldHeight = 725;

// paddle variables
var paddleWidth = 10;
var paddleHeight = 90;
var paddleDepth = 10;
// var paddleQuality = 10
// var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3;

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
			canvas: <HTMLCanvasElement> document.getElementById('gameCanvas'),
			canvas_txt : <HTMLCanvasElement>document.getElementById('canvas'),
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
			storeMe: useMeStore(),
			playerOneName: "p1",
			playerTwoName: "p2",
			prevviewside: false,
		}
	},
	props: 
	{
		viewside: {type: Boolean, default: false}
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
			renderer = new THREE.WebGLRenderer();
			
			camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
			scene = new THREE.Scene();
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
			var paddle1Material = new THREE.MeshBasicMaterial({color: 0x00ffff});
			var paddle2Material = new THREE.MeshBasicMaterial({color: 0xFF0000});	
			var planeMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
			var tableMaterial = new THREE.MeshBasicMaterial({color: 0x8c8c8c});
			var tableMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
			var sphereMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );
			var plane = new THREE.Mesh( new THREE.PlaneGeometry(planeWidth, planeHeight ), planeMaterial);
			scene.add(plane);
			var table = new THREE.Mesh(
			new THREE.PlaneGeometry( planeWidth * 1.03, planeHeight * 1.03), tableMaterial);
			table.position.z = -5;
			scene.add(table);
			var radius = 10;
			var	segments = 6;
			var	rings = 6;
			ball = new THREE.Mesh(new THREE.SphereGeometry( radius, segments, rings), sphereMaterial);
			scene.add(ball);

			ball.position.x = 0;
			ball.position.y = 0;
			ball.position.z = radius;	
			paddle1 = new THREE.Mesh(
			  new THREE.BoxGeometry(
				paddleWidth,
				paddleHeight,
				paddleDepth,
			  )
				,
			  paddle1Material);
			scene.add(paddle1);
			paddle1.receiveShadow = true;
    		paddle1.castShadow = true;
			paddle2 = new THREE.Mesh(
			  new THREE.BoxGeometry(
				paddleWidth,
				paddleHeight,
				paddleDepth,
			  )
				,
			  paddle2Material);
			scene.add(paddle2);
			paddle2.receiveShadow = true;
    		paddle2.castShadow = true;	
			paddle1.position.x = -fieldWidth/2 + paddleWidth + 15;
			paddle2.position.x = fieldWidth/2 - paddleWidth - 15;
			paddle1.position.z = paddleDepth;
			paddle2.position.z = paddleDepth;
    		spotLight = new THREE.SpotLight(0xF8D898);
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
			const elementsColor: string =  this.game_paused && this.info_value ? "#8c8c8c" : "white";

			// console.log(this.canvas)
        	var context = <CanvasRenderingContext2D>this.canvas_txt.getContext("2d");
				context.clearRect(0,0,this.canvas_txt.width,this.canvas_txt.height)
			if (this.game_paused == true)
			{
				context.globalAlpha = 0.5;
				context.fillStyle = "black";
				context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			}
			{
				context.globalAlpha = 1;
			}
        	context.fillStyle = elementsColor;
        	context.fill();
        	context.font = `${this.canvas_txt.height * 0.07}px 'Press Start 2P'`;
        	context.fillText(
        	    this.player1_score.toString(),
        	    this.canvas_txt.width / 2 -
        	        (this.canvas_txt.width * 0.05 + context.measureText(this.player1_score.toString()).width),
        	    this.canvas_txt.height * 0.1
        	);
        	context.fillText(
        	    this.player2_score.toString(),
        	    this.canvas_txt.width / 2 + this.canvas_txt.width * 0.05,
        	    this.canvas_txt.height * 0.1
        	);
        	if (this.game_paused && this.info_value) {
        	    const textSize = context.measureText(this.info_value);
        	    context.fillStyle = "white";
        	    context.fillText(this.info_value, this.canvas_txt.width / 2 - textSize.width / 2, this.canvas_txt.height / 2);
        	}
			renderer.render(scene, camera);
		},
		cameraPhysics()
		{
			if (this.prevviewside != this.viewside)
				this.travelingdesesmort()
			else if (this.storeMe.username == this.playerOneName || this.viewside)
			{
				// p1 position
				camera.position.y += (paddle1.position.y - camera.position.y) * 0.001;
				camera.position.x = paddle1.position.x - 300;
				camera.position.z = paddle1.position.z + 800;
				camera.rotation.y = -40 * Math.PI/180;
				camera.rotation.z = -90 * Math.PI/180;
			}
			else
			{
				// p2 position
				camera.position.y += (paddle2.position.y - camera.position.y) * 0.001;
				camera.position.x = paddle2.position.x + 300;
				camera.position.z = paddle2.position.z + 800;
				camera.rotation.y = 40 * Math.PI/180;
				camera.rotation.z = 90 * Math.PI/180;
			}
			
		},
		travelingdesesmort()
		{
			

			if (!this.viewside)
			{
				console.log("adwwadawdawdawdawd")
				if (camera.position.x < (paddle2.position.x + 300))
				{
					camera.position.x += ((paddle2.position.x + 300) - (paddle1.position.x - 300)) * 0.01
					camera.rotation.y += ((40 * Math.PI/180)  - (-40 * Math.PI/180)) * 0.01;
					camera.rotation.z += ((90 * Math.PI/180) - (-90 * Math.PI/180)) * 0.01;
				}
				else
					this.prevviewside = this.viewside

			}
			else
			{
				if (camera.position.x > (paddle1.position.x - 300))
				{
					camera.position.x -= ((paddle2.position.x + 300) - (paddle1.position.x - 300)) * 0.01
					camera.rotation.y -= ((40 * Math.PI/180)  - (-40 * Math.PI/180)) * 0.01;
					camera.rotation.z -= ((90 * Math.PI/180) - (-90 * Math.PI/180)) * 0.01;
				}
				else
					this.prevviewside = this.viewside
			}
			// this.prevviewside = this.viewside
		},
		toggle(e: any) {
			const target = <HTMLElement>document.getElementById('div3d')
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
					this.canvas_txt.height = window.innerWidth / 1.6;
					this.canvas_txt.width = window.innerWidth;
					var VIEW_ANGLE = 50, ASPECT = this.canvas_txt.width / this.canvas_txt.height, NEAR = 0.1, FAR = 5000;
					camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
					
				}
				else {
					renderer.setSize(window.innerWidth, window.innerHeight);
					this.canvas.width = window.innerWidth;
					this.canvas.height = window.innerHeight;
					this.canvas_txt.width = window.innerWidth;
					this.canvas_txt.height = window.innerHeight;
					var VIEW_ANGLE = 50, ASPECT = this.canvas_txt.width / this.canvas_txt.height, NEAR = 0.1, FAR = 5000;
					camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
				}
			}
			else {
				renderer.setSize( window.innerWidth / 1.5, window.innerWidth / 1.5 / 1.6);
				this.canvas.height = window.innerWidth / 1.5 / 1.6;
				this.canvas.width = window.innerWidth / 1.5;
				this.canvas_txt.height = window.innerWidth / 1.5 / 1.6;
				this.canvas_txt.width = window.innerWidth / 1.5;
				var VIEW_ANGLE = 50, ASPECT = this.canvas_txt.width / this.canvas_txt.height, NEAR = 0.1, FAR = 5000;
				camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
			}
			this.draw();
		},
		update_and_draw(data: any) {
			paddle1.position.y = -1 * (data.p1) + 310
			paddle2.position.y = -1 * (data.p2) + 310
			this.player1_score = data.scorep1
			this.player2_score = data.scorep2
			ball.position.x =  data.ball.x - 550
			ball.position.y = -1 * (data.ball.y) + 360
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
			this.canvas_txt = <HTMLCanvasElement>document.getElementById('canvas_txt');
			this.$ws.listen(`${this.gameId}___countdown`, this.handleCoundown);
			this.$ws.listen(`${this.gameId}___game-end`, this.handleGameEnd);
			this.$ws.listen(`${this.gameId}___frame-update`, this.update_and_draw);
			this.canvas_txt.addEventListener('dblclick', this.toggle);
			const onResizeThrottled = throttle(this.onResize, 200)
			window.addEventListener('resize', onResizeThrottled);
			watch(() => this.$q.fullscreen.isActive, val => {
				console.log(val ? 'In fullscreen now' : 'Exited fullscreen')
				onResizeThrottled();
			})
			this.setup();
			this.onResize()
		},
	},
	created() {
		this.gameId = this.$route.params.gameId.toString() as string;
		this.playerOneName = this.$route.query.playerOneName as string;
		this.playerTwoName = this.$route.query.playerTwoName as string;
	},
	mounted() {
		this.prevviewside = this.viewside;
		console.log("aled")
		setTimeout(this.ft_mounted, 10)
		
	},
	beforeUnmount() {
		console.log('quit');
		this.$ws.emit('quit', {})
	}
})
</script>

<style scoped>
#canvas_txt {
	opacity: 0.5;
	position:absolute;
	top:0;
	left:0;
	z-index: 1;
}
#gameCanvas {
  position:absolute;
  top:0;
  left:0; 
  z-index: 0;
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