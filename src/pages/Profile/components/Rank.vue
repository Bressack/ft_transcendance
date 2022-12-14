<template>
<div>
  <q-item>
    <q-item-section>
      <q-img class="rank-img" :src="`/src/assets/rank/${rank}.png`"/>
      <q-item-label class="label bigger rank">{{rank}}</q-item-label>
    </q-item-section>
  </q-item>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Rank',
  components: { },
  props: {
      victory : { type: Number , default: 0  },
      defeat  : { type: Number , default: 0  }
  },
  data () {
    return {
      rank: 'Unranked' as string
    }
  },
  created () {
    this.setRank(this.victory, this.defeat)
  },
  updated () {
    this.setRank(this.victory, this.defeat)
  },
  methods: {
    setRank(v: number, d: number) {
      const ratio : number = v / (v + d)

      console.log(1/3, ratio, v, d)
      if (v + d >= 10) {
        if (ratio < 1/3)
          this.rank = 'Bronze'
        else if (ratio > 1/3)
          this.rank = 'Gold'
        else
          this.rank = 'Silver'
      }
    }
  },
})
</script>

<style lang="sass" scoped>
@use "../../../css/interpolate" as r

.rank-img
  @include r.interpolate(width, 320px, 2560px, 75px, 175px)
  display: block
  margin-left: auto
  margin-right: auto

.rank
  text-align: center
</style>
