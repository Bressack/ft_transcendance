<template>
<q-page>
	<div class="q-pa-lg">
		<ProfileSummary
			:name=profile.username
			avatar="https://avatars.githubusercontent.com/adebureaux"
			:victory=(profile.victoriesAsPOne+profile.victoriesAsPTwo)
			:defeat=(profile.defeatsAsPOne+profile.defeatsAsPTwo)
		></ProfileSummary>
	</div>
	<div class="q-pa-md">
		<q-item v-if="games.total">
			<q-item-section>
				<q-item-label class="label">Match History</q-item-label>
			</q-item-section>
		</q-item>
		<q-item v-for="game in games.result">
			<MatchHistory
			:pOne=game.playerOneName
			:pTwo=game.playerTwoName
			:scoreOne=game.score_playerOne
			:scoreTwo=game.score_playerTwo
			avatarOne="https://avatars.githubusercontent.com/adebureaux"
			avatarTwo="https://cdn.intra.42.fr/users/d1ae701a3af5f3dd3070d5c8406e77fe/tharchen.jpg"
			></MatchHistory>
		</q-item>
	</div>
</q-page>
</template>


<script lang="ts">
import { defineComponent } from 'vue'
import { IGameQuery } from '../services/api.models'
import MatchHistory from '../components/Profile/MatchHistory.vue'
import ProfileSummary from '../components/Profile/ProfileSummary.vue'
import api from '../services/api.service'

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
	},
	mounted () {
		this.fetchUserProfile()
		this.fetchGameHistory()
	}
})
</script>

<syle lang="sass">
@use "../css/interpolate" as r

.padding
	@inculde r.interpolate((padding-left, padding-bottom), 320px, 2560px, 20px, 50px)

.label
	@inculde r.interpolate(font-size, 320px, 2560px, 12px, 30px)
	color: white
</syle>
