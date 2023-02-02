<template>
	<q-page>
			<DrawGame3d :viewside="viewside">
			</DrawGame3d>
			<q-btn id="test" color="red" @click="changeViewSide" icon="fullscreen" padding="xs"></q-btn>
			<q-btn id="test_2" color="purple" @click="to2d" icon="fullscreen" padding="xs"></q-btn>
			
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
		to2d()
		{
			this.$router.push(`/spectate/${this.$route.params.gameId}`)
		},
		changeViewSide()
		{
			if (this.viewside)
				this.viewside = false;
			else
				this.viewside = true;
		}
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
#test
{
	position: absolute;
	left: 70%;
	top: 70%;
	z-index: 0;
}
#test_2
{
	position: absolute;
	left: 60%;
	top: 70%;
	z-index: 0;
}
</style>