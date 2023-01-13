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
      <q-btn color="orange" class="q-mx-lg" label="Game Options" @click="goGameOptions()"/>
      <!-- <q-btn class="q-mx-lg" label="Play" @click="goInviteNotif()"/> -->
    </q-item>
    <q-item class="q-pb-xl">
      <q-btn color="orange" class="q-mx-lg" label="Invite Notification" @click="goInviteNotif()"/>
    </q-item>
  </q-list>
  <q-dialog v-model="GameOptions">
    <!-- Either matchmaking or play against a friend (add :opponent="username"), leave opponent as null for a random match -->
    <GameOptions/>
  </q-dialog>
  <q-dialog v-model="InviteNotif">
    <MatchCreation opponent="faltese"/>
  </q-dialog>
</q-page>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';
import GameOptions from '../components/GameOptions.vue'
import MatchCreation from '../components/MatchCreation.vue'

export default defineComponent({
  name: 'ConversationList',
  components: { GameOptions, MatchCreation },
  props: {},
  setup () {
    const GameOptions = ref(false)
    const InviteNotif = ref(false)
    return {
      GameOptions,
      openGameOptions() {
        GameOptions.value = true
      },
      InviteNotif,
      openInviteNotif() {
        InviteNotif.value = true
      }
    }
  },
  methods: {
    goGameOptions() {
      this.openGameOptions()
    },
    goInviteNotif() {
      this.openInviteNotif()
    }
  },
});
</script>
