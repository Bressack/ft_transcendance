<template>
  <div class="main row items-center justify-left q-pl-md" v-if="String($storeChat.role) != 'USER' && String(subscription.role) != 'OWNER' ">
    <q-item-section side class="toto">
        <q-icon name="more_vert" color="white" class="toto">
          <q-menu class="bg-grey-9 text-white" separate-close-popup>
          <q-list style="min-width: 100px">
            <q-item clickable>
              <q-item-section>Ban</q-item-section>
              <q-popup-proxy @before-show="updateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="proxyTime" format24h>
                    <div class="row items-center justify-center q-gutter-sm">
                      <span class="text-h6">Select the duration (hh:mm)</span>
                      <q-btn label="Cancel" color="primary" flat v-close-popup="1" />
                      <q-btn label="OK" color="primary" flat @click="sendNewStateBan" v-close-popup="2" />
                    </div>
                  </q-time>
                </q-popup-proxy>
            </q-item>
            <q-item clickable>
              <q-item-section>Mute</q-item-section>
              <q-popup-proxy @before-show="updateProxy" cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="proxyTime" format24h>
                    <div class="row items-center justify-center q-gutter-sm">
                      <span class="text-h6">Select the duration (hh:mm)</span>
                      <q-btn label="Cancel" color="primary" flat v-close-popup="1" />
                      <q-btn label="OK" color="primary" flat @click="sendNewStateMute" v-close-popup="2" />
                    </div>
                  </q-time>
                </q-popup-proxy>
            </q-item>
            <div v-if="serverStateTime">
              <q-item clickable>
                  <q-item-section>reset state</q-item-section>
              </q-item>
            </div>
            
          </q-list>
        </q-menu>
        </q-icon>
      </q-item-section>
    <!-- <div class="toggle">
      <div :class="state == 'BANNED' ? 'on' : 'off' " @click="swap('BANNED')">BAN</div>
      <div :class="state == 'MUTED'  ? 'on' : 'off' " @click="swap('MUTED')">MUTE</div>
    </div> -->
    <!-- <div class="q-pa-md">

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

    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { ISubscription } from "src/services/api.models";

export default defineComponent({
  name: 'BanMute',
  components: {},
  props: {
    subscription: { type: Object as PropType<ISubscription>, required: true }, // Deso theo, type: Object pour enlever l'erreur console avec type: Subscription
    menu_profile      : { type: Boolean, default: false },
    menu_block        : { type: Boolean, default: false },
    menu_unblock      : { type: Boolean, default: false },
    menu_play         : { type: Boolean, default: false },
    menu_chat         : { type: Boolean, default: false },
    menu_follow       : { type: Boolean, default: false },
    menu_unfollow     : { type: Boolean, default: false },
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
    sendNewStateBan() {

      this.save()
      this.$api.setState(this.subscription.channelId, this.subscription.username, {
        stateTo: 'BANNED',
        duration: this.timeToMin(),
      })
    },
    sendNewStateMute() {
      this.save()
      this.$api.setState(this.subscription.channelId, this.subscription.username, {
        stateTo: 'MUTED',
        duration: this.timeToMin(),
      })
    },
    updateProxy () {
      // console.log()
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

/*

*/
</script>

<style lang="sass" scoped>
// .main
//   display: flexbox
//   width: 410px
//   height: 80px

//   background-color: #424242
//   color: orange
//   border-radius: 10px

// .mainuser
//   display: flexbox
//   width: 220px
//   height: 80px

//   background-color: #424242
//   color: orange
//   border-radius: 10px

// .toggle div
//   padding: 2px 7px
//   width: 60px
//   border-radius: 10px
//   color: white

// .on
//   background-color: $orange-7
// .off
//   background-color: $bg-primary

// .currentServer
//   background-color: $bg-primary
//   width: 180px

</style>
