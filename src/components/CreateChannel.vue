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
        label-color="#F7F7FF"
      />
    </div>

      <div class="q-pa-md">
        <q-input
          class="key"
          dark
          v-model="password"
          color="orange"
          label-color="#F7F7FF"
          type='text'
          :disable="!protect ? true : false"
          :hint="!protect ? accessLabelOne : accessLabelTwo"
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
          label-color="#F7F7FF"
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
import {
  Subscription,
} from "src/services/api.models";

export default defineComponent({
	name: 'CreateChannel',
  setup () {
    const stringOptions = [] as String[]
    return {
      protect: ref(false),
      stringOptions: [] as String[],
      filterOptions: ref<String[]>(stringOptions)
    }
  },
  data() {
    return {
      userList : ref<string[]>([]),
      accessLabelOne: 'Click the lock if you want to define your channel password',
      accessLabelTwo: 'Define your password',
      access: ref(false),
      name: '' as string,
      password: '' as string,
      usernames: [] as string[],
    }
  },
  created () {
    if (this.settings) {
      this.name = this.$store.currentChannelSub?.channel.name
      if (this.$store.currentChannelType === 'PRIVATE') {
        this.access = true
        this.fillUserList()
      }
      if (this.$store.channelPassword) {
        this.password = this.$store.channelPassword
        this.protect = true
        this.accessLabelOne = 'Your password will be removed'
        this.accessLabelTwo = `Leave this field blank if you don't want to modify your password or click the lock if you want to remove it`
      }
    }
    this.$api.users()
    .then((res) => {
      console.log(res)
      for (let i = 0; i < res.data.length; i++) {
        this.stringOptions.push(res.data[i].username)
      }
    })
  },
  props: {
    settings : { type: Boolean, default: false },
    closeFn : { type: Function, default: null },
  },
  methods: {
    modify() {
      console.log(this.password)
      const payload = {
        usernames: this.userList,
        password: this.password,
        change_password: this.passwordState(),
      }
      console.log(payload)
      // Si j'ai un mdp, je veux l'enlever -> true et j'envoie password = ''
      // Si j'ai un mdp, je veux le modifier -> true et j'envoie password = '********'
      // Si j'ai un mdp, je veux rien changer -> false et j'envoie password = ''
      // Si j'ai pas de mdp, je veux en set un -> true et j'envoie password = '********'
      // Si j'ai pas de mdp, et que je veux rien changer -> false et j'envoie password = ''
      this.$api.channelSettings(this.$store.active_channel, payload)
      .then(() => {
        this.$store.notifCenter.send({
            type: 'positive',
            message: 'Channel successfully modified'
          })
          this.closeFn()
      })
      .catch((error) => {
        for (let i = 0; i < error.response.data.message.length; i++) {
          this.$store.notifCenter.send({
              type: 'negative',
              message: error.response.data.message[i]
            })
        }
      })
    },
    create() {
      const usernames = []
      for (let i = 0; i < this.userList.length; i++)
        usernames.push({username: this.userList[i]})
      const payload = {
        usernames: usernames,
        name: this.name,
        channelType: this.access ? 'PRIVATE' : 'PUBLIC',
        password: this.password
      }
      console.log(payload)
      this.$api.createChannel(payload)
      .then(() => {
        this.$store.notifCenter.send({
          type: 'positive',
          message: 'Channel successfully created'
        })
        this.closeFn()
      })
      .catch((error) => {
        for (let i = 0; i < error.response.data.message.length; i++) {
          this.$store.notifCenter.send({
            type: 'negative',
            message: error.response.data.message[i]
          })
        }
      })
    },
    passwordState () : boolean {
      if (this.$store.channelPassword && this.protect && this.password === '')
        return false
      else if (!this.$store.channelPassword && !this.protect)
        return false
      this.password = this.$store.channelPassword
      return true
    },
    clearPwd () {
      if (!this.protect)
        this.password = ''
    },
    fillUserList () {
      const users = this.$store.currentChannelUsers
      console.log(users)
      for (let i = 0; i < users.length; i++) {
        if (users[i].role !== 'OWNER')
          this.userList.push(users[i].username)
      }
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
