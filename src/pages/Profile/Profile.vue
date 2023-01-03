<template>
<q-page>
  <div class="q-px-xl">
    <ProfileSummary
    :name=profile.username
    :avatar=avatar
    :victory=(profile.victoriesAsPOne+profile.victoriesAsPTwo)
    :defeat=(profile.defeatsAsPOne+profile.defeatsAsPTwo)
    />
  </div>
  <q-item class="q-px-xl">
    <q-item-section>
      <div>
        <LevelProgress
          :victory="(profile.victoriesAsPOne+profile.victoriesAsPTwo)"
          :defeat="(profile.defeatsAsPOne+profile.defeatsAsPTwo)"
        />
      </div>
    </q-item-section>
    <q-item-section class="q-pr-xl col-3">
      <Rank
        :victory="(profile.victoriesAsPOne+profile.victoriesAsPTwo)"
        :defeat="(profile.defeatsAsPOne+profile.defeatsAsPTwo)"
      />
    </q-item-section>
  </q-item>
  <div class="r-py-md q-px-md">
      <q-item>
        <q-item-section>
          <q-item-label v-if="games.total" class="bigger label">Match History</q-item-label>
          <q-item-label v-else class="bigger label">No game history</q-item-label>
        </q-item-section>
      </q-item>
    <div v-for="game in games.result" :key="game">
      <MatchHistory
      :status="gameStatus(game)"
      :pOne=game.playerOneName
      :pTwo=game.playerTwoName
      :scoreOne=game.score_playerOne
      :scoreTwo=game.score_playerTwo
      />
    </div>
  </div>
</q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IGameQuery } from '../../services/api.models'
import api from '../../services/api.service'
import ProfileSummary from './components/ProfileSummary.vue'
import MatchHistory from './components/MatchHistory.vue'
import LevelProgress from './components/LevelProgress.vue'
import Rank from './components/Rank.vue'

export default defineComponent({
  name: 'Profile',
  components: { ProfileSummary, MatchHistory, LevelProgress, Rank },
  data() {
    return {
      username: this.$route.params.username.toString() as string,
      avatar: '/api/avatar/' as string,
      profile: [] as any,
      games: [] as any
    }
  },
  created () {
    this.avatar += `${this.username}/large`
    this.fetchUserProfile()
    this.fetchGameHistory()
  },
  updated () {
    this.username = this.$route.params.username.toString()
    this.avatar = `/api/avatar/${this.username}/large`
    this.fetchUserProfile()
    this.fetchGameHistory()
  },
  methods: {
    fetchUserProfile() {
      let that = this
      api.userProfile(this.username)
      .then(function(result) {
        that.profile = result
      })
      .catch(function(error) {
        console.error('error:', error);
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
        return ('Tie')
      else if (game.score_playerOne > game.score_playerTwo && game.playerOneName === this.profile.username)
        return ('Victory')
      return ('Defeat')
    }
  }
})
</script>
