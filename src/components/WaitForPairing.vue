<template>
  <div class="main">
    <div class="q-px-xl r-py-md">
			<q-item-label class="bigger">Finding an opponent ...</q-item-label>
      <div>
        <q-inner-loading
          :showing=true
          label="Finding an opponent ..." />

      </div>
		</div>
    <q-btn label="Cancel" color="red" v-close-popup />
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
