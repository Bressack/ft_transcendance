<template>
  <div class="dialog">
    <div class="q-px-xl r-pt-md">
            <q-item-label class="bigger">Looking for an opponent ...</q-item-label>
      <div class="q-pt-xl">
        <q-spinner-puff
          color="orange"
          size="7em"
        />
      </div>
        </div>
    <q-item class="flex-center q-pt-xl q-pb-md">
      <q-btn label="Cancel" @click="stopMatchmaking" color="red" v-close-popup />
    </q-item>
  </div>
</template>

<script lang="ts">
import { WS } from 'engine.io-client/build/esm/transports/websocket';
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'WaitForPairing',
  props: {
    difficulty: { type: String, default: "EASY" },
    map: { type: String, default: "2D" },
  },
  methods: 
  {
    stopMatchmaking()
    {
      console.log("stopMatchmaking")
      this.$ws.emit('matchmaking-canceled', {})
      document.dispatchEvent(new CustomEvent('stop-for-matchmaking'));
    },
    startMatchmaking()
    {
      console.log("startMatchmaking")
      document.dispatchEvent(new CustomEvent('ready-for-matchmaking'));
      this.$ws.emit('matchmaking', {difficulty: this.difficulty, map: this.map})
    }
  },
  beforeMount () {
    this.startMatchmaking()
    // this.$ws.listen('matchmaking-accepted', this.startgame);
  },
  unmounted () {
    this.stopMatchmaking()
  }
})
</script>
