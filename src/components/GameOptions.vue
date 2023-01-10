<template>
<div class="main">
  <q-item class="q-px-xl r-py-md">
    <q-item-section>
      <q-item-label class="bigger">Game Options</q-item-label>
    </q-item-section>
  </q-item>
  <q-separator color="white"/>
    <q-item-section class="q-pa-md">
      <q-option-group inline
        v-model="map"
        :options="maps"
        color="white"
        keep-color
      >
      <template v-slot:label="opt">
        <div class="row items-center">
          <q-item-label class="label">{{opt.label}}</q-item-label>
          <q-img class="image q-ma-md" :src="`/src/assets/maps/${opt.value}.png`"/>
        </div>
     </template>
  </q-option-group>
  <q-separator color="white"/>
  <div class="q-pa-md rounded-borders">
    <q-option-group inline
      v-model="opt"
      :options="opts"
      type="checkbox"
      color="white"
      keep-color
    >
      <template v-slot:label="opt">
        <div class="row items-center">
          <q-item-label class="q-pa-auto label">{{opt.label}}</q-item-label>
        </div>
      </template>
    </q-option-group>
  </div>
  </q-item-section>
  <q-item class="justify-center centers bigger q-mb-lg">
    <q-btn class="label" v-if="opponent" :label="`Play against ${opponent}`" color="orange"/>
    <q-btn class="label" v-else label="Play" color="orange"/>
  </q-item>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: {},
  name: 'GameOptions',
  setup () {
    return {
      map: ref('map1'),
      maps: [
        { label: 'Map 1', value: 'map1'},
        { label: 'Map 2', value: 'map2'},
        { label: 'Map 3', value: 'map3'},
        { label: 'Map 4', value: 'map4'}
      ],
      opt: ref([]),
      opts : [
        { label: 'Powerup 1', value: 'powerup1'},
        { label: 'Powerup 2', value: 'powerup2'},
        { label: 'Powerup 3', value: 'powerup3'},
      ]
    }
  },
  props: {
    opponent : { type: String , default: null },
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

</style>
