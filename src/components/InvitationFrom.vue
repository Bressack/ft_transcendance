<!--
  This vue file have to handle :
  - Invitation from an other player to you  -> You are requested to accept or decline the invitation, 30s delay before it declines automaticaly
  - Invitation from you to an other player  -> You wait at most 30s to the opponent to accept your game request, you can cancel anytime
  - Matchmaking launch                      -> You will look for other player indefintely, you can cancel anytime. If you find an opponent, you will enter in the game (Aymeric's problem)
 -->
<template>
<div class="main">
  <q-item-label class="bigger">
    {{ opponent }} has sent you a game invitation ...
  </q-item-label>
  <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    ></q-ajax-bar>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  name: 'MatchCreation',
  props: {
    opponent : { type: String , default: null },
    matchmaking : { type: Boolean, default: false }
  },
  methods: {},
})
</script>

<style lang="sass" scoped>
@use "../css/interpolate" as r
.main
  background-color: #696969
  text-align: center

.image
  border: solid 1px black
  @include r.interpolate(width, 320px, 2560px, 30px, 60px)

.close-cross
  position: relative
  cursor: pointer

.cross
  @include r.interpolate(font-size, 320px, 2560px, 10px, 35px)

</style>
