<template>
	<q-page>
		<q-btn id="switchbtn" color="blue" @click="switchViewMod" :label="viewmod ? 'to 2d' : 'to 3d'" padding="xs"></q-btn>
		<q-btn id="viewsidebtn" color="red" @click="changeViewSide" icon="fullscreen" padding="xs"></q-btn>
		<div id="2d">
			<DrawGame>
			</DrawGame>
		</div>
		<div id="3d">
			<DrawGame3d :viewside="viewside">
			</DrawGame3d >
		</div>
	</q-page>
</template>


<script lang="ts">
import {defineComponent} from 'vue'
import DrawGame from './components/DrawGame.vue'
import DrawGame3d from './components/DrawGame3d.vue'


export default defineComponent({
	name: 'Spectate',
	data()
	{
		return {
			div2d : <HTMLElement>document.getElementById('2d'),
			div3d : <HTMLElement>document.getElementById('3d'),
			viewmod: false,
			viewside:true,
		}
	},
	components: {DrawGame,DrawGame3d},
	methods :
	{
		changeViewSide()
		{
			console.log(this.viewside);
			if (this.viewside)
				this.viewside = false;
			else
				this.viewside = true;
		},
		switchViewMod()
		{
			console.log()
			if (this.div3d.style.display == 'none')
			{
				console.log("to 3d")
				this.viewmod = true;
				this.div2d.style.display = 'none';
				this.div3d.style.display = 'block';
			}
			else
			{
				console.log("to 2d")
				this.viewmod = false
				this.div3d.style.display = 'none';
				this.div2d.style.display = 'block';
			}
		}
	},
	mounted() {
		this.div2d = <HTMLElement>document.getElementById('2d')
		this.div3d = <HTMLElement>document.getElementById('3d')
		this.div3d.style.display = 'none';
		this.$ws.socket.emit("watch-game", this.$route.params.gameId, (response : string) => {
			if (response === "NOT_FOUND")
				return
		});
	},
	beforeUnmount() {
		this.$ws.socket.emit("unwatch-game", this.$route.params.gameId);
	}

})
</script>

<style>
#switchbtn
{
	z-index: 3;
}
#viewsidebtn
{
	z-index: 3;
}
</style>
