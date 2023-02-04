<template>
	<q-page>
		<q-btn id="viewsidebtn" color="red" @click="changeViewSide" :label="viewside ? 'p1' : 'p2'" padding="xs"></q-btn>
		<DrawGame3d :viewside="viewside"></DrawGame3d>		
	</q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import DrawGame3d from './components/DrawGame3d.vue'

export default defineComponent({
	name: 'Spectate',
	components: {DrawGame3d},
	data() {
		return {
			viewside:true,
		}
	},
	methods:
	{
		changeViewSide()
		{
			console.log(this.viewside);
			if (this.viewside)
				this.viewside = false;
			else
				this.viewside = true;
		},
	},
	mounted() {
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
#viewsidebtn
{
	z-index: 3;
}
</style>