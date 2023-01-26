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
})
</script>
