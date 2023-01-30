<template>
  <div class="main">
    <div class="q-px-xl r-py-md">
			<q-item-label class="bigger">Finding an opponent ...</q-item-label>
      <div class="q-pt-md">
        <q-spinner-puff
          color="orange"
          size="8em"
        />

      </div>
		</div>
    <q-item class="flex-center q-py-xl">
      <q-btn label="Cancel" color="red" v-close-popup />
    </q-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	components: { },
	name: 'WaitForPairing'
})
</script>

<style lang="sass" scoped>
@use "../css/interpolate" as r
.main
  background-color: #696969
  text-align: center

</style>
