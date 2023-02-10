<template>
  <div class="main row items-center justify-left q-pl-md">
    <div class="toggle">
      <div :class="selected(0)" @click="swap(0)">BAN</div>
      <div :class="selected(1)" @click="swap(1)">MUTE</div>
    </div>
    <div class="q-pa-md">
      <div v-if="options[lever].currentServerTime == null">
        <q-btn icon="access_time" round color="primary">
          <q-popup-proxy @before-show="updateProxy" cover transition-show="scale" transition-hide="scale">
            <q-time v-model="options[lever].proxyTime" format24h>
              <div class="row items-center justify-center q-gutter-sm">
                <span class="text-h6">Select the duration (hh:mm)</span>
                <q-btn label="Cancel" color="primary" flat v-close-popup />
                <q-btn label="OK" color="primary" flat @click="save" v-close-popup />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-btn>
        <q-btn v-if="options[lever].currentServerTime != null" class="q-mx-md" @click="sendNewState">abort</q-btn>
        <q-btn v-else-if="options[lever].time != '00:00'" class="q-mx-md" @click="sendNewState">apply</q-btn>
      </div>
      <q-card v-else class="currentServer q-pa-sm">
        {{ options[lever].currentServerTime + '' }}
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Subscription, eSubscriptionState } from 'src/services/api.models'

export default defineComponent({
  name: 'BanMute',
  components: {},
  props: {
    subscription: { type: Subscription, required: true },
  },
  data() {
    console.log('this.subscription.state: ',
        typeof(eSubscriptionState.BANNED),
        typeof(this.subscription.state),
        this.subscription.state,
        this.serverStateTime(eSubscriptionState.BANNED),
        this.serverStateTime(eSubscriptionState.MUTED),
    )
    return {
      lever: 0 as number,
      options: [
        { // BAN
          state: 'BANNED',
          currentServerTime: this.serverStateTime('BANNED') as any, // in minutes
          time: '00:00',
          proxyTime: '00:00',
        },
        { // MUTE
          state: 'MUTED',
          currentServerTime: this.serverStateTime('MUTED') as any, // in minutes
          time: '00:00',
          proxyTime: '00:00',
        }
      ]
    }
  },
  methods: {
    serverStateTime(es: eSubscriptionState) {
      var s = null
      console.log(String(es));
      if (String(this.subscription.state) == String(es))
        return 'until ' + this.getRelativeDate(this.subscription.stateActiveUntil)
      return null
    },
    timeToMin() {
      const s: Array<string> = this.options[this.lever].time.split(':')
      return (parseInt(s[0]) * 60 + parseInt(s[1]))
    },
    sendNewState() {
      this.$api.setState(this.subscription.channelId, this.subscription.username, {
        stateTo: this.options[this.lever].state,
        duration: this.timeToMin(),
      })
    },
    updateProxy () {
      this.options[this.lever].proxyTime = this.options[this.lever].time
    },
    save () {
      this.options[this.lever].time = this.options[this.lever].proxyTime
    },

    swap(n: number) {
      this.lever = n
    },
    selected(n: number) {
      if (n == this.lever)
        return "on"
      return "off"
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
  mounted() {
  }
});
</script>

<style lang="sass" scoped>
.main
  display: flexbox
  width: 300px
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
