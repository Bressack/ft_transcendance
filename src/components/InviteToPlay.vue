<template>
<div class="main q-pa-lg">
  <q-item v-if="opponent === null">
    <q-item-section avatar>
    <q-avatar class="avatar">
      <q-img :src="getAvatar()"/>
    </q-avatar>
  </q-item-section>
    <q-item-section>
      <q-item-label class="label name">{{opponent}}</q-item-label>
    </q-item-section>
  </q-item>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: { },
  name: 'InviteToPlay',
  props: {
    opponent : { type: String , default: null }, // Could be : random, null or a username depending on which component should be displayed
  },
  methods: {
    getAvatar() : string {
      return (`/api/avatar/${this.opponent}/medium`)
    }
  }
})
</script>

<style lang="sass" scoped>
.main
  background-color: #696969
  text-align: center
</style>
