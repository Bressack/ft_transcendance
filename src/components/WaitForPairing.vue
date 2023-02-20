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
  methods: 
  {
    stopMatchmaking()
    {
      this.$ws.emit('stop-matchmaking', {})
      document.dispatchEvent(new CustomEvent('stop-for-matchmaking'));
    }
  },
  beforeMount () {
    this.$ws.emit('matchmaking', {difficulty: "EASY", map: "3D"})
    document.dispatchEvent(new CustomEvent('ready-for-matchmaking'));
    // this.$ws.listen('matchmaking-accepted', this.startgame);
  }
})
</script>
