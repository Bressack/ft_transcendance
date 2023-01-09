<template>
<div class="main q-pa-lg">
    <q-item>
      <q-item-section avatar>
      <q-avatar class="avatar">
        <q-img :src="getAvatar()"/>
      </q-avatar>
    </q-item-section>
      <q-item-section>
        <q-item-label class="label name">{{opponentUsername}}</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: { },
  name: 'GameOptions',
  props: {
    opponentUsername : { type: String , default: 'none' },
  },
  methods: {
    getAvatar() : string {
      if (this.opponentUsername !== 'none')
        return (`/api/avatar/${this.opponentUsername}/medium`)
      return ('none')
    }
  }
})
</script>

<style lang="sass" scoped>
.main
  background-color: #696969
  text-align: center
</style>
