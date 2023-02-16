<template>
  <div class="main row items-center justify-left q-pl-md" v-if="String($storeChat.role) != 'USER' && String(subscription.role) != 'OWNER' ">
    <div class="toggle">
      <div :class="state == 'BANNED' ? 'on' : 'off' " @click="swap('BANNED')">BAN</div>
      <div :class="state == 'MUTED'  ? 'on' : 'off' " @click="swap('MUTED')">MUTE</div>
    </div>
    <div class="q-pa-md">

      <div v-if="!serverStateTime">
        <q-btn icon="access_time" round color="primary">
          <q-popup-proxy @before-show="updateProxy" cover transition-show="scale" transition-hide="scale">
            <q-time v-model="proxyTime" format24h>
              <div class="row items-center justify-center q-gutter-sm">
                <span class="text-h6">Select the duration (hh:mm)</span>
                <q-btn label="Cancel" color="primary" flat v-close-popup />
                <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-btn>
        <q-btn v-if="time != '00:00'" class="q-mx-md" @click="sendNewState">apply</q-btn>
      </div>

      <div v-else class="row">
        <q-card class="currentServer q-pa-sm">
          {{ String(serverStateTime) }}
        </q-card>
        <q-btn class="q-mx-md" @click="returnStateToOK">abort</q-btn>
      </div>

    </div>
  </div>
  <div class="mainuser row items-center justify-left q-pl-md" v-else>
    <div v-if="serverStateTime">
      <q-card class="currentServer q-pa-sm">
        User {{ String(subscription.state) == 'BANNED' ? 'banned' : 'muted' }} {{ String(serverStateTime) }}
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Subscription } from 'src/services/api.models'

export default defineComponent({
  name: 'BanMute',
  components: {},
  props: {
    subscription: { type: Subscription, required: true }, // Deso theo, type: Object pour enlever l'erreur console avec type: Subscription
  },
  data() {
    return {
      state: this.subscription.state == 'OK' ? 'BANNED' : this.subscription.state as string,
      time: '00:00',
      proxyTime: '00:00',
    }
  },
  computed: {
    serverStateTime() {
      if (this.subscription.state == this.state)
        return 'until ' + this.getRelativeDate(this.subscription.stateActiveUntil)
      return null
    },
  },
  methods: {
    timeToMin() {
      const s: Array<string> = this.time.split(':')
      return (parseInt(s[0]) * 60 + parseInt(s[1]))
    },
    returnStateToOK() {
      this.$api.resetState(this.subscription.channelId, this.subscription.username)
    },
    sendNewState() {
      this.$api.setState(this.subscription.channelId, this.subscription.username, {
        stateTo: this.state,
        duration: this.timeToMin(),
      })
    },
    updateProxy () {
      this.proxyTime = this.time
    },
    save () {
      this.time = this.proxyTime
    },

    swap(s: string) {
      this.state = s
    },

    getRelativeDate(date: string): string {
      function floorStr(n: number) {
        return (n < 10 ? '0' : '') + n
      }
      const now = new Date()
      const cdate = new Date(date)
      // cdate.setTime((minute * 60 * 1000) + now.getTime())

      if (now.getDate() - cdate.getDate() == 0)
        return 'Today at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
      else if (now.getDate() - cdate.getDate() == 1)
        return 'Yesterday at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
      else if (now.getDate() - cdate.getDate() == -1)
        return 'Tomorrow at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
      else
      {
        const d = cdate.getDate()
        const m = (cdate.getMonth() + 1)
        return floorStr(d) + '/'
             + floorStr(m) + '/'
             + cdate.getFullYear() + ' '
             + floorStr(cdate.getHours()) + ':'
             + floorStr(cdate.getMinutes())
      }
    },
  },
});
</script>

<style lang="sass" scoped>
.main
  display: flexbox
  width: 410px
  height: 80px

  background-color: #424242
  color: orange
  border-radius: 10px

.mainuser
  display: flexbox
  width: 220px
  height: 80px

  background-color: #424242
  color: orange
  border-radius: 10px

.toggle div
  padding: 2px 7px
  width: 60px
  border-radius: 10px
  color: white

.on
  background-color: $orange-7
.off
  background-color: $bg-primary

.currentServer
  background-color: $bg-primary
  width: 180px

</style>
