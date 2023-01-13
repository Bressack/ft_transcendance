<!--
  This vue file have to handle :
  - Invitation from an other player to you  -> You are requested to accept or decline the invitation, 30s delay before it declines automaticaly
  - Invitation from you to an other player  -> You wait at most 30s to the opponent to accept your game request, you can cancel anytime
  - Matchmaking launch                      -> You will look for other player indefintely, you can cancel anytime. If you find an opponent, you will enter in the game (Aymeric's problem)
 -->
 <template>
  <div class="main">
    <div class="close-cross">
      <q-btn class="cross absolute-right" color="orange" icon="close" flat round v-close-popup/>
    </div>
    <div class="q-px-xl r-py-md">
      <q-item-label v-if="matchmaking" class="bigger">
          Waiting for an opponent ...
      </q-item-label>
      <q-item-label v-else class="bigger">
          Waiting for {{ opponent }} to accept your invitation ...
      </q-item-label>
  </div>
  <q-item-section class="q-pa-md">
    <q-separator color="white"/>
    <q-separator color="white"/>
    <div class="q-pa-md rounded-borders">

    </div>
  </q-item-section>
  <q-item class="justify-center centers bigger q-mb-lg">
    <q-btn class="label" v-if="opponent" :label="`Play against ${opponent}`" color="orange"/>
    <q-btn class="label" v-else label="Play" color="orange"/>
  </q-item>
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
  methods: {}
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
