<template>
<q-item-section avatar>
	<q-avatar v-if="(!thumb)" class="avatar">
		<q-img :src="avatar"/>
	</q-avatar>
	<q-avatar v-else class="thumb-avatar">
		<q-img :src="avatar"/>
	</q-avatar>
</q-item-section>
<q-item-section>
	<q-item-label v-if="(!thumb)" class="label name">{{name}}</q-item-label>
	<q-item-label v-else class="thumb-name">{{name}}</q-item-label>
</q-item-section>
</template>


<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'ProfileCard',
	props: {
		name : { type: String , default: undefined },
		avatar : { type: String , default: undefined },
		thumb : { type: String, default: '' }
	}
})

</script>

<style lang="sass" scoped>
@use "../../css/interpolate" as r

.name
	@include r.interpolate(font-size, 320px, 2560px, 14px, 40px)
	@include r.interpolate(padding-left, 320px, 2560px, 0px, 40px)
	font-weight: bold

.avatar
	@include r.interpolate(font-size, 320px, 2560px, 40px, 140px)
	outline: 1.5px solid white
</style>
