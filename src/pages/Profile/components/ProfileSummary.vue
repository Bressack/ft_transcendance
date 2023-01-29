<template>
  <div class="q-pa-lg">
    <q-item class="wrap">
      <q-item-section avatar>
      <q-avatar class="avatar">
        <q-img :src="avatar"/>
      </q-avatar>
    </q-item-section>
      <q-item-section>
        <q-item-label class="label name">{{name}}</q-item-label>
      </q-item-section>
      <q-item v-if="interact && name != storeMe.username">
        <q-item-section>
          <q-btn label="play" class="q-mr-lg" size="1.5vw" color="orange"/>
        </q-item-section>
        <q-item-section>
          <q-btn label="add friend" size="1.5vw" color="green"/>
          <!-- <q-btn label="open conversation" size="1.5vw" color="green"/> -->
        </q-item-section>
      </q-item>
    </q-item>
  </div>
  <q-item>
    <q-item-section>
      <q-item-label class="label score">Victory<div class="bigger victory">{{victory}}</div></q-item-label>
    </q-item-section>
    <q-separator vertical color="white" spaced/>
    <q-item-section>
      <q-item-label class="label score">Defeat<div class="bigger defeat">{{defeat}}</div></q-item-label>
    </q-item-section>
    <q-separator vertical color="white" spaced/>
    <q-item-section>
      <q-item-label class="label score">Ratio<div class="bigger">{{ratio(victory, defeat)}}%</div></q-item-label>
    </q-item-section>
  </q-item>
  <q-separator color="white" spaced/>
</template>

<script lang="ts">
import { useMeStore } from 'src/stores/me'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileSummary',
  props: {
    name    : { type: String , default: undefined },
    avatar  : { type: String , required: true },
    victory : { type: Number , default: 0 },
    defeat  : { type: Number , default: 0 },
    interact : { type: Boolean, default: false }
  },
  data () {
    return {
      storeMe: useMeStore()
    }
  },
  methods: {
    ratio(v: number, d: number): string {
      if (v + d === 0)
        return '0.00'
      return (v / (v + d) * 100).toPrecision(4)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "../../../css/interpolate" as r

.wrap
  flex-wrap: wrap

.name
  @include r.interpolate(font-size, 320px, 2560px, 14px, 40px)
  @include r.interpolate(padding-left, 320px, 2560px, 0px, 40px)
  font-weight: bold
  overflow: auto
  text-align: left

.avatar
  @include r.interpolate(font-size, 320px, 2560px, 40px, 140px)

.score
  text-align: center

.victory
  color: $green

.defeat
  color: $red
</style>
