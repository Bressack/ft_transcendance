<template>
  <q-page>
    <div class="q-pa-lg">
      <ProfileSummary
        :name=profile.username
        avatar="https://avatars.githubusercontent.com/adebureaux"
        :victory=(profile.victoriesAsPOne+profile.victoriesAsPTwo)
        :defeat=(profile.defeatsAsPOne+profile.defeatsAsPTwo)
      />
    </div>
    <div class="q-pa-sm">
      <q-item v-if="games.total">
        <q-item-section>
          <q-item-label class="bigger label">Match History</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-else>
        <q-item-section class="bigger label">No current game history</q-item-section>
      </q-item>
    </div>
        <div v-for="game in games.result" :key="game" class="container">
            <MatchHistory
              :status="gameStatus(game)"
              :pOne=game.playerOneName
              :pTwo=game.playerTwoName
              :scoreOne=game.score_playerOne
              :scoreTwo=game.score_playerTwo
            />
        </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IGameQuery } from '../../services/api.models'
import MatchHistory from './components/MatchHistory.vue'
import ProfileSummary from './components/ProfileSummary.vue'
import api from '../../services/api.service'

export default defineComponent({
	name: 'Profile',
	components: { ProfileSummary, MatchHistory },
	data() {
		return {
			username: this.$route.params.username.toString() as string,
			profile: [] as any,
			games: [] as any
		}
	},
	methods: {
		fetchUserProfile() {
			let that = this
			api.userProfile(this.username)
			.then(function(result) {
				console.log('result:',result);
				that.profile = result
			})
			.catch(function(error) {
				console.log('error:',error);
			})
		},
		fetchGameHistory() {
			let that = this
			const searchQuery : IGameQuery = {
				skip: '0',
				take: '20',
				order: 'desc',
			}
			console.log(searchQuery);
			api.userGame(this.username, searchQuery)
			.then(function(result) {
				console.log('result:',result);
				that.games = result
			})
			.catch(function(error) {
				console.log('error:',error);
			})
		},
    gameStatus(game : any) : string {
      if (game.score_playerOne === game.score_playerTwo)
        return ("Tie")
      else if (game.score_playerOne > game.score_playerTwo && game.playerOneName === this.profile.username)
        return ("Victory")
      return ("Defeat")
    }
	},
	mounted () {
		this.fetchUserProfile()
		this.fetchGameHistory()
	}
})
</script>

<style lang="sass" scoped>
</style>
