<template>
  <div class="main row items-center justify-left q-pl-md">
    <div class="toggle">
      <div :class="selected(0)" @click="swap(0)">BAN</div>
      <div :class="selected(1)" @click="swap(1)">MUTE</div>
    </div>
    <div class="q-pa-md">
      <div v-if="options[lever].currentServerTime == 0">
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
        <q-btn v-if="options[lever].time != '00:00'" class="q-mx-md" @click="sendNewState">apply</q-btn>
      </div>
      <q-card v-else class="currentServer q-pa-sm">
        {{ getRelativeDate2(options[lever].currentServerTime) }}
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BanMute',
  components: {},
  props: {
    channelId: { type: String, required: true },
    username: { type: String, required: true },
  },
  data() {
    return {
      lever: 0 as number,
      options: [
        { // BAN
          state: 'BANNED',
          currentServerTime: 0 as number, // in minutes
          time: '00:00',
          proxyTime: '00:00',
        },
        { // MUTE
          state: 'MUTED',
          currentServerTime: 0 as number, // in minutes
          time: '00:00',
          proxyTime: '00:00',
        }
      ]
    }
  },
  methods: {
    timeToMin() {
      const s: Array<string> = this.options[this.lever].time.split(':')
      return (parseInt(s[0]) * 60 + parseInt(s[1]))
    },
    sendNewState() {
      this.$api.setState(this.channelId, this.username, {
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

    getRelativeDate2(minute: number): string {
      function floorStr(n: number) {
        return (n < 10 ? '0' : '') + n
      }
      const now = new Date()
      const cdate = new Date()
      cdate.setTime((minute * 60 * 1000) + now.getTime())

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
  width: 270px
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
  width: 130px

</style>
