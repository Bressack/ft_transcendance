<template>
	<q-page>
			<DrawGame3d>
			</DrawGame3d>
	</q-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import DrawGame3d from './components/DrawGame3d.vue'


export default defineComponent({
	name: 'Spectate',
	components: {DrawGame3d},
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