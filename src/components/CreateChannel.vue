<template>
  <div class="dialog">
    <div class="close-cross">
      <q-btn class="cross absolute-right" color="orange" icon="close" flat round v-close-popup />
    </div>
    <div class="q-px-xl r-py-md">
      <q-item-label class="bigger">
        <span v-if="settings">Channel settings</span>
        <span v-else>Create channel</span>
      </q-item-label>
    </div>

    <div class="q-pa-md">
      <q-input
        v-model="name"
        :disable="settings ? true : false"
        dark
        label="Channel name"
        color="orange"
        label-color="white"
      />
    </div>

      <div class="q-pa-md">
        <q-input
          class="key"
          dark
          v-model="password"
          color="orange"
          label-color="white"
          type='text'
          :disable="!protect ? true : false"
          :hint="!protect ? `Optional: click the lock if you want to set a password` : `Set or modify your channel password`"
          label="Password"
          stack-label
          lazy-rules
        >
        <template v-slot:before>
          <q-checkbox v-model="protect" unchecked-icon="lock" checked-icon="lock" color="orange" @click="clearPwd" />
        </template>
        </q-input>
      </div>

      <div class="q-px-sm q-pb-cs label checkbox" v-if="!settings">
        <q-checkbox v-model="access" color="orange" label="Private channel" />
      </div>

      <div class="q-pa-md" v-if="access">
        <q-select
          class="input"
          color="black"
          filled

          v-model="userList"
          multiple
          use-input
          use-chips
          input-debounce="0"
          stack-label
          label="Manage users"
          label-color="white"
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

      <q-item class="flex-center q-pb-md">
        <q-btn v-if="settings" color="orange" type="submit" label="Apply" @click="modify"/>
        <q-btn v-else color="orange" type="submit" label="Create" @click="create"/>
      </q-item>

    </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'CreateChannel',
  setup () {
    const stringOptions = [] as String[]
    return {
      protect: ref(false),
      userList : ref([]),
      stringOptions: [] as String[],
      filterOptions: ref<String[]>(stringOptions)
    }
  },
  data() {
    return {
      access : ref(false),
      name: this.oldname as string,
      password: '' as string,
      usernames: [] as string[],
    }
  },
  created () {
    if (this.settings && this.$storeChat.channelType === 'PRIVATE')
      this.access = true
    this.$api.users()
    .then((res) => {
      console.log(res)
      for (let i = 0; i < res.data.length; i++) {
        this.stringOptions.push(res.data[i].username)
      }
    })
  },
  props: {
    oldname : { type: String, default: '' },
    settings : { type: Boolean, default: false },
    closeFn : { type: Function, default: null },
  },
  methods: {
    modify() {
      // Call POST/PATCH api
    },
    create() {
      const usernames = []
      for (let i = 0; i < this.userList.length; i++)
        usernames.push({username: this.userList[i]})
      const payload = {
        usernames: usernames,
        name: this.name,
        channel_type: this.access ? 'PRIVATE' : 'PUBLIC',
        password: this.password
      }
      console.log(payload)
      this.$api.createChannel(payload)
      .then((res) => {
        this.$q.notify({
            type: 'positive',
            message: 'Channel successfully created'
          })
          this.closeFn()
      })
      .catch((error) => {
        for (let i = 0; i < error.response.data.message.length; i++) {
          this.$q.notify({
              type: 'negative',
              message: error.response.data.message[i]
            })
        }
      })
    },
    clearPwd () {
      if (!this.protect)
        this.password = ''
    },
    filterFn (val : String, update : Function) {
        // call abort() at any time if you can't retrieve data somehow
        // import { abort } from 'process'

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
