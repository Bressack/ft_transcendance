<!--
  This vue file have to handle :
  - Invitation from an other player to you  -> You are requested to accept or decline the invitation, 30s delay before it declines automaticaly
  - Invitation from you to an other player  -> You wait at most 30s to the opponent to accept your game request, you can cancel anytime
  - Matchmaking launch                      -> You will look for other player indefintely, you can cancel anytime. If you find an opponent, you will enter in the game (Aymeric's problem)
 -->
<template>
<div class="main">
  <q-item>
    <q-item-label class="bigger">
      {{ opponent }} sent you a game invitation ...
    </q-item-label>
  </q-item>
  <q-item class="q-pa-md">
    <q-btn label="Decline" color="red" v-close-popup/>
    <q-btn label="Accept" color="green" v-close-popup/>
  </q-item>
  <q-item>
    <q-ajax-bar class="relative"
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
    ></q-ajax-bar>
  </q-item>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  name: 'GameInvitation',
  data () {
    return {
      $refs : undefined as any
    }
  },
  props: {
    opponent : { type: String , default: null },
    sent : { type: Boolean, default: false }
  },
  mounted () {
    this.trigger()
  },
  methods: {
    trigger () {
      this.$refs.bar.start()
      setTimeout(() => {
        if (this.$refs.bar) {
          this.$refs.bar.stop()
        }
      }, 30000)
    }
  },
})
</script>

<style lang="sass" scoped>
@use "../css/interpolate" as r
.relative
  position: relative

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
