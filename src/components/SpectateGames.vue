<template>
<div class="doc-container">
  <div class="row">
    <q-item class="col">
      <q-item-section>
        <q-item-label class="label centered">{{pOne}}</q-item-label>
      </q-item-section>
      </q-item>
      <q-item class="col">
        <q-item-section>
          <q-item-label class="bigger centered">VS</q-item-label>
        </q-item-section>
      </q-item>
    <q-item class="col">
      <q-item-section>
        <q-item-label class="label centered">{{pTwo}}</q-item-label>
      </q-item-section>
     </q-item>
     <q-item class="col">
      <q-item-section>
        <q-btn color="orange" @click="spectate(gameId, map)">Spectate</q-btn>
      </q-item-section>
     </q-item>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
  name: 'SpectateGames.vue',
  props: {
    pOne    : { type: String , required: true},
    pTwo    : { type: String , required: true },
	  gameId : { type: String, required: true },
	  map : { type : String , required : true }
  },
  methods: {
    spectate (gameId: string, map : string) {
		console.log(map)
    this.$router.push(`/spectate${map == '3D' ? '3d' : ''}/${gameId}?playerOneName=${this.pOne}&playerTwoName=${this.pTwo}`)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "../css/interpolate" as r

.centered
  text-align: center
  overflow: auto

.doc-container
  @include r.interpolate(width, 320px, 2560px, 300px, 1350px)
  @include r.interpolate((margin-top, margin-bottom), 320px, 2560px, 5px, 15px)
  @include r.interpolate((margin-left, margin-right), 320px, 2560px, 6px, 25px)
  height: auto
  background-color: grey
  border-radius: 25px
</style>
