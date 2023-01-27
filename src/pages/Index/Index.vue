<template>
<q-page>
  <q-item class="flex-center">
    <q-item-label class="bigger q-ma-lg">
      Welcome {{ storeMe.username }} !
    </q-item-label>
  </q-item>
  <q-item class="flex-center">
    <q-btn color="orange" label="play matchmaking" @click=""/>
  </q-item>
  <div class="r-py-md q-px-md">
    <q-item>
      <q-item-label class="bigger">Spectate games</q-item-label>
    </q-item>
    <q-separator class="q-ma-md" color="white" />
    <q-item v-if="!games.length">
      <q-item-label class="label">No game is currently running</q-item-label>
    </q-item>
    <div v-for="game in games" :key="game.gameId">
      <SpectateGames :pOne=game.playerOneName :pTwo=game.playerTwoName :gameId=game.gameId />
    </div>
  </div>
</q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useMeStore } from 'src/stores/me';
import SpectateGames from '../../components/SpectateGames.vue';
import WaitForPairing from '../../components/WaitForPairing.vue'

export default defineComponent({
	name: 'Index',
	components: { SpectateGames, WaitForPairing },
	props: {},
	data() {
		return {
			storeMe: useMeStore(),
      games: [] as any,
		}
	},
  mounted () {
    this.$ws.listen('game-announcement', this.onGameAnnouncement)
  },
  created () {
    this.fetchGames()
  },
  updated() {
    this.fetchGames()
  },
	methods: {
    onGameAnnouncement(running_games : any[]) {
			  this.games = running_games
		  },
      fetchGames() {
        this.$api.games()
        .then((result) => {
          console.log(result)
          this.games = result.data
        })
        .catch((error) => { console.error('error:', error); })
    },
	},
});
</script>

<style lang="sass" scoped>


</style>

