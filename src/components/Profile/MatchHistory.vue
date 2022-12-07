<template>
<q-item class="main">
  <q-item class="col left">
    <q-item-section avatar>
    <q-avatar class="avatar">
      <q-img src="https://avatars.githubusercontent.com/u/54967855?v=4"/>
    </q-avatar>
  </q-item-section>
  <q-item-section>
	  <q-item-label class="label">{{pOne}}</q-item-label>
  </q-item-section>
  </q-item>
  <q-separator v-if="!isMobile()" vertical color="white" spaced="-20%"></q-separator>
  <q-item class="col middle">
    <q-item-section>
      <q-item-label class="label bigger score"><span v-bind:class="`${status}`">{{status}}</span></q-item-label>
    </q-item-section>
  </q-item>
  <q-separator v-if="!isMobile()" vertical color="white" spaced="-20%"></q-separator>
  <q-item class="col right">
    <q-item-section>
      <q-item-label class="label">{{pTwo}}</q-item-label>
    </q-item-section>
    <q-item-section avatar>
    <q-avatar class="avatar">
      <q-img src="https://avatars.githubusercontent.com/u/54767555?v=4"/>
    </q-avatar>
  </q-item-section>
  </q-item>
</q-item>
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
		scoreTwo : { type: Number, default: 0 },
		avatarOne : { type: String, default: undefined },
		avatarTwo : { type: String, default: undefined },
	},
	methods: {
    isMobile() {
      if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        return true
      return false
    }
  }
})
</script>

<style lang="sass" scoped>
@use "../../css/interpolate" as r

.score
  text-align: center

.Tie
  color: $orange

.Victory
  color: $green

.Defeat
  color: $red

.right
  text-align: right

.left
  text-align: left
.avatar
  @include r.interpolate(font-size, 320px, 2560px, 35px, 60px)
  outline: 0.5px solid black

.q-item
  @include r.interpolate(padding, 320px, 2560px, 6px, 10px)

.q-item__section--avatar
  min-width: 0px

.q-item__section--main ~ .q-item__section--side
  @include r.interpolate((padding-left), 320px, 2560px, 6px, 20px)
  padding-right: 0px !important

.q-item__section--side
  @include r.interpolate((padding-right), 320px, 2560px, 6px, 20px)

.main
  @include r.interpolate(width, 320px, 2560px, 310px, 1250px)
  @include r.interpolate((margin-top, margin-bottom), 320px, 2560px, 12px, 50px)
  @include r.interpolate((margin-left, margin-right), 320px, 2560px, 6px, 25px)
  background-color: grey
  border-radius: 25px
  color: white


</style>
