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

    <q-form class="q-pa-lg">
      <q-input
        v-model="name"
        dark
        label="Channel name"
        color="orange"
        @submit="create"
      />
      <div class="q-py-md label checkbox">
        <q-checkbox v-model="access" color="orange" label="Private channel" />
      </div>


    <div class="q-pb-md" v-if="access">
      <q-select
        class="input"
        color="orange"
        filled
        dark
        v-model="userList"
        multiple
        use-input
        use-chips
        input-debounce="0"
        stack-label
        label="Add users"
        hint=""
        @filter="filterFn"
        :options="filterOptions"
      >
      <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <div class="q-pb-md" v-else>
      <q-input
        class="input"
        dark
        v-model="password"
        color="orange"
        filled
        :type="isPwd ? 'password' : 'text'"
        hint="Optional: Leave blank if you wont proctect the channel"
        label="Password"
        stack-label
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
    </div>

    <q-item class="flex-center q-pb-md">
      <q-btn color="orange" type="submit" label="Create" @click="create()"/>
    </q-item>
  </q-form>
</div>


</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

// POST /users/channel


export default defineComponent({
	name: 'CreateChannel',
  setup () {
    const stringOptions = [] as String[]
    return {
      stringOptions: [] as String[],
      access : ref(false),
      userList : ref([]),
      isPwd: ref(true),
      filterOptions: ref<String[]>(stringOptions)
    }
  },
  data() {
    return {
      name: '' as string,
      password: '' as string,
      usernames: [] as string[],
    }
  },
  created () {
    this.$api.users()
    .then((res) => {
      console.log(res)
      for (let i = 0; i < res.data.length; i++) {
        this.stringOptions.push(res.data[i].username)
      }
    })
  },
  methods: {
    create() {
      console.log(this.usernames)
    },
    filterFn (val : String, update : Function) {
        // call abort() at any time if you can't retrieve data somehow

        update(() => {
          if (val === '') {
            this.filterOptions = this.stringOptions
          }
          else {
            const needle = val.toLowerCase()
            this.filterOptions = this.stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
          }
        })
    },
  }
})
</script>


<style lang="sass" scoped>
@use "../css/interpolate" as r

.checkbox
  text-align: left !important

.dialog
  width: 560px


</style>
