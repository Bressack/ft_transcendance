<template>
  <div class="darker q-pa-md">
    <q-item>
      <q-item-label class="label">
      Are you sure you want to {{ what }} ?
      </q-item-label>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn color="red" class="interpolate-btn" label="cancel" v-close-popup />
      </q-item-section>
      <q-item-section>
        <q-btn color="green" class="interpolate-btn" label="accept" @click="accept()" v-close-popup />
      </q-item-section>
    </q-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent ({
  name: 'Confirm',
  props: {
    what:   { type: String, default: 'do something' },
    accept: { type: Function, default: null },
  },
})
</script>


<style lang="sass" scoped>
.darker
  background-color: #333

</style>
