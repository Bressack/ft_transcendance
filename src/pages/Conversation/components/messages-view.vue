<template>
	<q-virtual-scroll v-if="$store.messagesCount" id="virtScroll" ref="chatVirtualScroll" component="q-list"
		:items="$store.messages" scroll-target="#virtScroll .scroll" virtual-scroll-item-size="93.19">
		<template #default="{ item, index }">
			<q-chat-message :key="index" :avatar=avatarstr(item.username) :text="[item.content]"
				:stamp="getRelativeDate(new Date(item.CreatedAt))" :sent="item.username === $store.username"
				:bg-color="item.username === $store.username ? 'secondary' : 'blue-grey-11'">
				<template v-slot:name>
					<span class="linkMessageProfile" @click="goProfilPage(item.username)">{{ item.username ===
						$store.username ? 'me' : item.username }} {{ index }}</span>
				</template>
			</q-chat-message>
		</template>
	</q-virtual-scroll>
</template>
<script setup lang="ts">
import { useMainStore } from 'src/stores/store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const store = useMainStore();
const router = useRouter();
const chatVirtualScroll = ref();
const goProfilPage = (user: string) => {
	router.push({
		path: `/profile/${user}`
	})
}
const avatarstr = (username: string) => {
	return `/api/avatar/${username}/thumbnail`
}
const scrollBottom = () => {
	chatVirtualScroll.scrollTo(store.messagesCount - 1)
}
const getRelativeDate = (cdate: Date): string => {
	function floorStr(n: number) {
		return (n < 10 ? '0' : '') + n
	}
	const now = new Date()
	if (now.getDate() - cdate.getDate() == 0)
		return 'Today at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
	else if (now.getDate() - cdate.getDate() == 1)
		return 'Yesterday at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
	else if (now.getDate() - cdate.getDate() == -1)
		return 'Tomorrow at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
	else {
		const d = cdate.getDate()
		const m = (cdate.getMonth() + 1)
		return floorStr(d) + '/'
			+ floorStr(m) + '/'
			+ cdate.getFullYear() + ' '
			+ floorStr(cdate.getHours()) + ':'
			+ floorStr(cdate.getMinutes())
	}
}
</script>
<style scoped lang="sass">
</style>