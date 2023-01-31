<template>
	<q-page>
    <ul>
      <div id="container"></div>
    </ul>
	</q-page>
</template>

<script>
import * as Three from 'three'
// const Three = require('THREE')
	let camera = null
	let scene = null
    let renderer = null
    let mesh = null

export default {
  name: 'ThreeTest',
  data() {
    return {
    //   camera: null,
    //   scene: null,
    //   renderer: null,
    //   mesh: null
    }
  },
  methods: {
    init() {
        let container = document.getElementById('container');

		let clientWidth = 500;
		let clientHeight = 500

        camera = new Three.PerspectiveCamera(150, clientWidth/clientHeight, 0.01, 10);
        camera.position.z = 10;

        scene = new Three.Scene();

        let geometry = new Three.BoxGeometry(20, 5, 10);
        let material = new Three.MeshNormalMaterial();

        mesh = new Three.Mesh(geometry, material);
        scene.add(mesh);
        mesh.position.y = 0
        mesh.position.x = 0
        mesh.position.z = 0
        renderer = new Three.WebGLRenderer({antialias: true});
        renderer.setSize(clientWidth, clientHeight);
        container.appendChild(renderer.domElement);

    },
    animate: function() {
        // requestAnimationFrame(this.animate);
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;
        renderer.render(scene, camera);
		let render_2 = renderer
		render_2.render(scene, camera);
    }
  },
  mounted() {
      this.init();
      this.animate();
  }
}
</script>

<style scoped>
ul {
	text-align: center;
	list-style: none;
	padding: 0;
	flex-direction: column;
}
#container
{
	width: 100;
	height: 100
}
</style>