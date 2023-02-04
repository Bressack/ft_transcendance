<template>
	<q-page>
			<DrawGame>
			</DrawGame>
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
		}
	},
	mounted() {
		this.div2d = <HTMLElement>document.getElementById('2d')
		this.div3d = <HTMLElement>document.getElementById('3d')
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