<template>
  <div class="dialog">
    <div class="q-px-xl r-py-md">
			<q-item-label class="bigger">Finding an opponent ...</q-item-label>
      <div class="q-pt-xl">
        <q-spinner-puff
          color="orange"
          size="8em"
        />
      </div>
		</div>
    <q-item class="flex-center q-pt-xl q-pb-md">
      <q-btn label="Cancel" color="red" v-close-popup />
    </q-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'WaitForPairing'
})
</script>
