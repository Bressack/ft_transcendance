<template>
<div class="dialog">
  <div class="close-cross">
    <q-btn class="cross absolute-right" color="orange" icon="close" flat round v-close-popup />
  </div>
  <div class="q-px-xl r-py-md">
    <q-item-label class="bigger">
      Create channel
    </q-item-label>
  </div>
  <!-- <q-option-group inline class="label q-mx-xl" left-label v-model="access" :options="options" color="white" keep-color /> -->
  <q-item class="label flex-center">
    <!-- <q-checkbox v-model="public" label="public" /> -->
    <q-checkbox v-model="private" color="orange" label="Private" />
  </q-item>
  <q-item>
    <q-input
      v-model="name"
      label="Channel name"
      lazy-rules
      color="orange"
    />
  </q-item>
  <q-item>
    <q-input
      class="input"
      filled
      v-model="password"
      label="Password"
      lazy-rules
      type="password"
    />
  </q-item>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'CreateChannel',
  // setup () {
  //   return {
  //     access: ref('public'),
  //     options: [
  //       {
  //         label: 'PUBLIC',
  //         value: 'public'
  //       },
  //       {
  //         label: 'PRIVATE',
  //         value: 'private'
  //       }
  //     ]
  //   }
  // },
  data() {
    return {
      name: '' as string,
      password: '' as string,
      private: false as boolean
    }
  },
})
</script>

<style lang="sass" scoped>
@use "../css/interpolate" as r

</style>
