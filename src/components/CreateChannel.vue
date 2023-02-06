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


    <q-item class="label">
      <q-checkbox v-model="access" color="white" label="Private channel" />
    </q-item>


    <q-item v-if="access">
        Search
    </q-item>

  <q-item class="flex-center q-pb-md">
    <q-btn color="orange" label="Create" @click="create()"/>
  </q-item>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

// POST /users/channel

export default defineComponent({
	name: 'CreateChannel',
  setup () {
    return {
      access : ref(false)
    }
  },
  data() {
    return {
      name: '' as string,
      password: '' as string,
      usernames: [] as string[]
    }
  },
  methods: {
    create() {
      console.log(this.usernames)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "../css/interpolate" as r

</style>
