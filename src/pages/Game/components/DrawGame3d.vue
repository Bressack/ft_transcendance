<template>
	<div>
		<!-- <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"> -->
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
import {defineComponent} from 'vue'
import { watch } from 'vue'
import * as THREE from 'three';
import { useMeStore } from '../../../stores/me';
// import {neonCursor} from "truc.js"
// import THREE from 'three';

var	paddle1Material = new THREE.MeshLambertMaterial({color: 0x00ffff});
var	paddle2Material = new THREE.MeshLambertMaterial({color: 0xFF0000});
var	loader = new THREE.TextureLoader();
var	planeMaterial = new THREE.MeshLambertMaterial({color: 0x242729});

// var planeMaterial = new THREE.MeshBasicMaterial({ map: loader.load( 'https://cdn.intra.42.fr/users/d0f4dd0d898a9e9cdb2df466d0e5c944/aribesni.jpg' )});
// var planeMaterial = new THREE.MeshBasicMaterial({ map: loader.load( 'https://upload.wikimedia.org/wikipedia/commons/3/38/Xavier_Niel004.jpg' )});

// var planeMaterial = new THREE.MeshLambertMaterial({ map: loader.load( 'https://cdn.intra.42.fr/users/d7a1da210f5052f9a1a93ca6d9f45ee2/mprigent.jpg' )});
// var	tableMaterial = new THREE.MeshBasicMaterial({color: 0x00e0f9});

// light.position.set( 50, 50, 50 );

var	tableMaterial = new THREE.MeshLambertMaterial({color: 0x9f9f9f, emissiveIntensity: 100, emissive: new THREE.Color(1, 1, 1),});
// tableMaterial.emissive(new THREE.color(0xFFFFFF));
var	sphereMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFFFF} );

var		timeOutFunctionId = undefined as any;
// scene object variables
var		scene = new THREE.Scene();
var		renderer = new THREE.WebGLRenderer();
var		camera = null as any

// field const
const	fieldWidth = 1150, fieldHeight = 725;

// paddle const
const	paddleWidth = 10, paddleHeight = 90, paddleDepth = 10;

// ball const
const	radius = 10, segments = 6, rings = 6;

// camera const
const	VIEW_ANGLE = 50, NEAR = 0.1, FAR = 5000;

// geometric elements
var light_ball = new THREE.PointLight( 0xFFFFFF, 10, 30 );
var ball =  new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings), sphereMaterial);
var paddle1=  new THREE.Mesh(new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth), paddle1Material);
var paddle2 =  new THREE.Mesh(new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth,),paddle2Material);
var plane =  new THREE.Mesh(new THREE.PlaneGeometry(fieldWidth, fieldHeight ), planeMaterial);
var table =  new THREE.Mesh(new THREE.PlaneGeometry(fieldWidth + 15, fieldHeight + 15), tableMaterial);
var light = new THREE.HemisphereLight(0xFFFFFF, 0x101010, 1);
 

export default defineComponent({
	name: 'DrawGame',
	data() {
		return {
			game_paused: true,
			info_value: null,
			canvas: <HTMLCanvasElement> document.getElementById('gameCanvas'),
			canvas_txt : <HTMLCanvasElement>document.getElementById('canvas'),
			gameId: "",
			player1_score: 0,
			player2_score: 0,
			storeMe: useMeStore(),
			playerOneName: "p1",
			playerTwoName: "p2",
			prevviewside: false,
			context: null as any,
			namedisplay : "",
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
			camera = new THREE.PerspectiveCamera( VIEW_ANGLE,  WIDTH / HEIGHT, NEAR, FAR);
			scene.background = loader.load( 'https://cdn.sortiraparis.com/images/1001/94880/721017-espace-un-objet-mysterieux.jpg' );
			renderer.setSize(WIDTH, HEIGHT);
			renderer.domElement.id = 'testid';
			camera.sha
			// planecamera.sha
			// tablecamera.sha
			// ballcamera.sha
			// paddle1camera.sha
			// paddle2camera.sha

			scene.add(camera);
			scene.add(plane);
			scene.add(table);
			scene.add(ball);
			scene.add(paddle1);
			scene.add(paddle2);
			scene.add(light);
			scene.add(light_ball);
			this.canvas.appendChild(renderer.domElement);	
			/*
				setup elements pos
			*/ 
			camera.position.z = 320;
			table.position.z = -1;
			ball.position.x = 0;
			ball.position.y = 0;
			light.position.z = 20;
			light_ball.position.z = radius;
			ball.position.z = radius;
			paddle1.position.x = -fieldWidth/2 + paddleWidth + 15;
			paddle2.position.x = fieldWidth/2 - paddleWidth - 15;
			paddle1.position.z = paddleDepth;
			paddle2.position.z = paddleDepth;
			camera.position.z = paddleDepth + 800;
			this.cameraPhysics()	
		},
		draw()
		{
			// paddle1.position.y = 310
			this.cameraPhysics();
			const elementsColor: string = "white";
        	this.context = <CanvasRenderingContext2D>this.canvas_txt.getContext("2d");
				this.context.clearRect(0,0,this.canvas_txt.width,this.canvas_txt.height)
			if (this.game_paused == true)
			{
				this.context.globalAlpha = 0.5;
				this.context.fillStyle = "#242729";
				this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			}
			else
			{
				this.context.globalAlpha = 1;
			}

			this.context.font = `${this.canvas.height * 0.03}px 'Press Start 2P'`;
			this.context.fillStyle = elementsColor;
			this.context.strokeStyle = 'black';
			this.context.fillText(
				this.playerOneName,
        	    this.canvas_txt.width / 2 -
        	        (this.canvas_txt.width * 0.2 + this.context.measureText(this.playerOneName).width),
        	    this.canvas_txt.height * 0.08
        	);
			this.context.fillText(
				this.playerTwoName,
        	    this.canvas_txt.width / 2 + this.canvas_txt.width * 0.2,
        	    this.canvas_txt.height * 0.08
        	);
        	this.context.fillStyle = elementsColor;
        	this.context.fill();
        	this.context.font = `${this.canvas_txt.height * 0.07}px 'Press Start 2P'`;
        	this.context.fillText(
        	    this.player1_score.toString(),
        	    this.canvas_txt.width / 2 -
        	        (this.canvas_txt.width * 0.05 + this.context.measureText(this.player1_score.toString()).width),
        	    this.canvas_txt.height * 0.1
        	);
        	this.context.fillText(
        	    this.player2_score.toString(),
        	    this.canvas_txt.width / 2 + this.canvas_txt.width * 0.05,
        	    this.canvas_txt.height * 0.1
        	);
        	if (this.game_paused && this.info_value) {
        	    const textSize = this.context.measureText(this.info_value);
				const textSize_name = this.context.measureText(this.namedisplay);
        	    this.context.fillStyle = "white";
        	    this.context.fillText(this.info_value, this.canvas_txt.width / 2 - textSize.width / 2, this.canvas_txt.height / 2);
				this.context.fillText(this.namedisplay, this.canvas_txt.width / 2 - textSize_name.width / 2, this.canvas_txt.height * 0.60);
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
				camera.rotation.x = 0;
				// camera.position.z = paddleDepth + 800;
				camera.rotation.y = -40 * Math.PI/180;
				camera.rotation.z = -90 * Math.PI/180;
			}
			else
			{
				// p2 position
				camera.position.y += (paddle2.position.y - camera.position.y) * 0.001;
				camera.position.x = paddle2.position.x + 300;
				camera.rotation.x = 0;
				// camera.position.z = paddleDepth + 800;
				camera.rotation.y = 40 * Math.PI/180;
				camera.rotation.z = 90 * Math.PI/180;
			}
		},
		travelingdesesmort()
		{
			if (!this.viewside)
			{
				if (camera.position.x < (paddle2.position.x + 300))
				{
					camera.position.x += ((paddle2.position.x + 300) - (paddle1.position.x - 300)) * 0.01
					camera.position.y = Math.sqrt(Math.pow(paddle1.position.x - 300, 2) - Math.pow(camera.position.x, 2))
					camera.rotation.z = ((camera.position.x >= 0 ) ? 90 * Math.PI/180 : -90 * Math.PI/180) + Math.atan(camera.position.y / camera.position.x)
					camera.rotation.y = -40 * Math.PI/180 * Math.sin(-camera.rotation.z)
					camera.rotation.x = 40 * Math.PI/180 * Math.cos(-camera.rotation.z)
				}
				else
					this.prevviewside = this.viewside
			}
			else
			{
				if (camera.position.x > (paddle1.position.x - 300))
				{
					camera.position.x -= ((paddle2.position.x + 300) - (paddle1.position.x - 300)) * 0.01 
					camera.position.y = -Math.sqrt(Math.pow(paddle1.position.x - 300, 2) - Math.pow(camera.position.x, 2))
					camera.rotation.z = ((camera.position.x >= 0 ) ? 90 * Math.PI/180 : -90 * Math.PI/180) + Math.atan(camera.position.y / camera.position.x)
					camera.rotation.y = -40 * Math.PI/180 * Math.sin(-camera.rotation.z)
					camera.rotation.x = 40 * Math.PI/180 * Math.cos(-camera.rotation.z)
				}
				else
					this.prevviewside = this.viewside
			}
		},
		toggle(e: any) {
			const target = <HTMLElement>document.getElementById('div3d')
			this.$q.fullscreen.toggle(target)
				.then(() => {
				})
				.catch((err) => {
					alert(err)
				})
			// console.log("toggle 2 ", this.$q.fullscreen.isActive)
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
					camera = new THREE.PerspectiveCamera( VIEW_ANGLE, this.canvas_txt.width / this.canvas_txt.height, NEAR, FAR);
					camera.position.z = paddleDepth + 800;
					
				}
				else {
					renderer.setSize(window.innerWidth, window.innerHeight);
					this.canvas.width = window.innerWidth;
					this.canvas.height = window.innerHeight;
					this.canvas_txt.width = window.innerWidth;
					this.canvas_txt.height = window.innerHeight;
					camera = new THREE.PerspectiveCamera( VIEW_ANGLE, this.canvas_txt.width / this.canvas_txt.height, NEAR, FAR);
					camera.position.z = paddleDepth + 800;
				}
			}
			else {
				renderer.setSize( window.innerWidth / 1.5, window.innerWidth / 1.5 / 1.6);
				this.canvas.height = window.innerWidth / 1.5 / 1.6;
				this.canvas.width = window.innerWidth / 1.5;
				this.canvas_txt.height = window.innerWidth / 1.5 / 1.6;
				this.canvas_txt.width = window.innerWidth / 1.5;
				camera = new THREE.PerspectiveCamera( VIEW_ANGLE, this.canvas_txt.width / this.canvas_txt.height, NEAR, FAR);
				camera.position.z = paddleDepth + 800;
			}
			this.draw();
		},
		update_and_draw(data: any) {
			// console.log(data);
			let bidule = new Uint16Array(data.gamedata)
			// this.player1_y = bidule[0]
			// this.player2_y = bidule[1]
			// this.ball_x = bidule[2]
			// this.ball_y = bidule[3]
			// this.player1_score = bidule[4]
			// this.player2_score = bidule[5]

			// console.log(bidule[0])
			paddle1.position.y = -1 * (bidule[0]) + 310
			paddle2.position.y = -1 * (bidule[1]) + 310
			ball.position.x =  bidule[2] - 550
			ball.position.y = -1 * (bidule[3]) + 360
			light_ball.position.x =  bidule[2] - 550
			light_ball.position.y = -1 * (bidule[3]) + 360
			this.player1_score = bidule[4]
			this.player2_score = bidule[5]
			this.draw();
		},
		handleCoundown(data: any) {
			// console.log(data);
			if (data.status == 'done') {
				this.game_paused = false;
				this.info_value = null;
				this.namedisplay = "";

			}
			else if (data.status == 'pending') {
				this.game_paused = true;
				this.info_value = data.value;
				this.namedisplay = (data.name == undefined) ? "": data.name;
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
			window.addEventListener('resize', this.waitEndResize);
			watch(() => this.$q.fullscreen.isActive, val => {
				this.waitEndResize();
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
		// console.log("aled")
		setTimeout(this.ft_mounted, 10)
		
	},
	beforeUnmount() {
		this.$ws.removeListener(`${this.gameId}___countdown`)
		this.$ws.removeListener(`${this.gameId}___game-end`)
		this.$ws.removeListener(`${this.gameId}___frame-update`)
		this.canvas_txt.removeEventListener('dblclick',this.toggle )
		window.removeEventListener('resize', this.waitEndResize);
		// console.log('quit');
		this.$ws.emit('quit', {})
	}
})
</script>

<style scoped>
#canvas_txt {
	opacity: 1;
	position:absolute;
	top:0;
	/* left:0; */
		left: 50%;
			transform: translateX(-50%);
	z-index: 1;
	border: 5px solid white;
}
#gameCanvas {
  position:absolute;
  top:0;
  /* left:0;  */
	left: 50%;
		transform: translateX(-50%);
  z-index: 0;
	border: 5px solid white;
}
body {
	background-color: #242729;
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