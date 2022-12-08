<template>
<!-- <q-item class="rank" aling="center">
  <q-img class="rank" v-bind:class="../../../assets/rank/unranked.png"/>
</q-item>
unranked -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Rank',
  components: { },
  props: {
      victory     : { type: Number , default: 0  },
      defeat      : { type: Number , default: 0  }
  },
  data () {
    return {
      rank: "Unranked" as string,
      src: "Unranked" as string
  }
  },
  methods: {
    pushData() {
    }
  },
  created () {
    this.pushData()
  },
  updated () {
   this.pushData()
  }
})
</script>

<style lang="sass" scoped>
.rank
  text-align: center
  width: 250px
</style>
