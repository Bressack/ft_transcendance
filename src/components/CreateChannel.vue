<template>
  <div class="dialog flex-center">
    <div class="close-cross">
      <q-btn class="cross absolute-right" color="orange" icon="close" flat round v-close-popup />
    </div>
    <div class="q-px-xl r-py-md">
      <q-item-label class="bigger">
        Create channel
      </q-item-label>
    </div>

    <q-item>
      <q-input
        hide-bottom-space
        v-model="name"
        dark
        label="Channel name"
        lazy-rules
        color="orange"
        />
    </q-item>

    <q-item>
      <q-input
      hide-bottom-space
        class="input"
        dark
        color="orange"
        filled
        v-model="password"
        label="Password"
        lazy-rules
        hint="Optional: Leave blank if you wont proctect the channel"
      />
    </q-item>

      <!-- <q-option-group inline class="label q-mx-xl" left-label v-model="access" :options="options" color="white" keep-color /> -->


    <q-item class="label">
      <q-checkbox v-model="access" color="orange" label="Private channel" />
    </q-item>


    <q-item no-wrap v-if="access">
      <q-select
          autocomplete="Google"
          filled
          label-color="orange"
          dark
          v-model="userList"
          multiple
          :options="options"
          use-chips
          stack-label
          label="Add users"
      />
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
      access : ref(false),
      userList : ref([]),
    }
  },
  data() {
    return {
      name: '' as string,
      password: 'password' as string,
      usernames: [] as string[],
      options: [
        'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle', 'agfd', 'sfdgsdfgs', 'Google', 'AAAA'
      ]
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
.dialog
  width: 560px

.docs-input
  .caption:not(:first-child)
    margin-top: 60px
  .dark-example
    background: $grey-9
    padding: 5px 15px 15px
    box-shadow: $shadow-2
    border-radius: 2px

</style>
