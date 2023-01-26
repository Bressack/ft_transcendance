<template>
	<q-page>
			<DrawGame>
			</DrawGame>
	</q-page>
</template>


<script lang="ts">
import {defineComponent} from 'vue'
import DrawGame from './components/DrawGame.vue'


export default defineComponent({
	name: 'Spectate',
	components: {DrawGame},
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
