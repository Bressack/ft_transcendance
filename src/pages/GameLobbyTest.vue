<!--
- Users should be able to play a live Pong game versus another player directly on the website
- There must be a matchmaking system: the user can join a queue until they get automatically matched with someone else
- You must offer some customization options (for example, power-ups or different maps). However, the user should be able to select a default version of the game without any extra features if they want to
- The user should be able to watch a live play between other users without interfering with it
-->
<template>
<q-page>
  <q-list class="flex-center">
    <q-item class="q-py-xl">
      <q-btn color="orange" class="q-mx-lg" label="Game Options" @click="GameOptions = true"/>
      <!-- <q-btn class="q-mx-lg" label="Play" @click="goInviteNotif()"/> -->
    </q-item>
    <q-item class="q-pb-xl">
      <q-btn color="orange" class="q-mx-lg" label="Invitation From" @click="sendInvite"/>
    </q-item>
    <q-item class="q-pb-xl">
      <SpectateGames pOne="user1" pTwo="user2"/>
    </q-item>
  </q-list>
  <q-dialog v-model="GameOptions">
    <GameOptions/>
  </q-dialog>
  <q-dialog persistent v-model="InvitationFrom">
    <GameInvitation opponent="usernametest"/>
  </q-dialog>
</q-page>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';
import GameOptions from '../components/GameOptions.vue'
import GameInvitation from '../components/GameInvitation.vue'
import SpectateGames from '../components/SpectateGames.vue'

export default defineComponent({
  name: 'ConversationList',
  components: { GameOptions, GameInvitation, SpectateGames },
  props: {},
  setup () {
    const GameOptions = ref(false)
    let InvitationFrom = ref(false)

    return {
      GameOptions,
      InvitationFrom
    }
  },
  methods: {
    sendInvite() {
        this.InvitationFrom = true
        setTimeout(() => {
          this.InvitationFrom = false
        }, 30000)
      }
  }
});
</script>
