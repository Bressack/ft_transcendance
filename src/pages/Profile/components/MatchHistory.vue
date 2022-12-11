<template>
<div class="doc-container">
  <div class="row">
    <q-item v-bind:href=pOne class="col">
      <q-item-section avatar>
          <q-avatar class="avatar">
              <q-img :src="avatarOne"/>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="label username">{{pOne}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator class="mobile-hide" vertical inset color="white"/>
      <q-item class="col-2">
        <q-item-section>
          <q-item-label class="label bigger score"><span v-bind:class=status>{{status}}</span></q-item-label>
        </q-item-section>
      </q-item>
    <q-separator class="mobile-hide" vertical inset color="white"/>
    <q-item v-bind:href=pTwo class="col">
      <q-item-section>
        <q-item-label class="right label username">{{pTwo}}</q-item-label>
      </q-item-section>
      <q-item-section avatar>
        <q-avatar class="avatar">
            <q-img :src="avatarTwo"/>
          </q-avatar>
        </q-item-section>
      </q-item>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MatchHistory',
  components: { },
  props: {
    status : { type: String , default: "Defeat" },
    pOne : { type: String , default: undefined },
    pTwo : { type: String , default: undefined },
    scoreOne : { type: Number, default: 0 },
    scoreTwo : { type: Number, default: 0 }
  },
  data () {
    return {
      avatarOne: '/api/avatar/' as string,
      avatarTwo: '/api/avatar/' as string
    }
  },
  methods: { },
  created () {
    this.avatarOne += `${this.pOne}/medium`
    this.avatarTwo += `${this.pTwo}/medium`
  },
  updated () {
    this.avatarOne = `/api/avatar/${this.pOne}/medium`
    this.avatarTwo = `/api/avatar/${this.pTwo}/medium`
  }
})
</script>

<style lang="sass" scoped>
@use "../../../css/interpolate" as r

.score
  text-align: center

.Tie
  color: $orange

.Victory
  color: $green

.Defeat
  color: $red

.username
  overflow: scroll

.right
  text-align: right

.avatar
  @include r.interpolate(font-size, 320px, 2560px, 35px, 75px)

.q-item
  @include r.interpolate(padding, 320px, 2560px, 2px, 15px)

.q-item__section--side
  @include r.interpolate(padding, 320px, 2560px, 2px, 15px)

.q-item__section--avatar
  min-width: 2.5rem

.doc-container
  @include r.interpolate(width, 320px, 2560px, 300px, 1350px)
  @include r.interpolate((margin-top, margin-bottom), 320px, 2560px, 12px, 50px)
  @include r.interpolate((margin-left, margin-right), 320px, 2560px, 6px, 25px)
  height: auto
  background-color: grey
  border-radius: 25px
</style>
