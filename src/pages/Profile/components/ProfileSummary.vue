<template>
  <div class="r-pa-lg">
    <q-item class="q-pb-lg">
      <q-item-section avatar>
        <q-avatar class="avatar" :style="`background-color: ${$utils.usernameToColor(name)};`">
          <q-img :src="avatar"/>
        </q-avatar>
      </q-item-section>
      <q-item class="q-pa-none">
        <q-item-section>
          <q-item-label class="bigger name">{{ name }}</q-item-label>
        </q-item-section>
        <q-item v-if="interact && name != $store.username && !isBlocked()">
          <q-item-section>
            <q-btn icon="mdi-gamepad-variant-outline" flat round class="interpolate-btn q-mr-xs" color="green" @click="goGameOptions()"><q-tooltip>Play</q-tooltip></q-btn>
          </q-item-section>
          <q-item-section>
            <q-btn v-if="!isFriend()" flat round class="interpolate-btn" :icon=friendIcon :color=friendColor @click="followOrUnfollow()"><q-tooltip v-if="friendIcon === 'add'">Add friend</q-tooltip><q-tooltip v-else>Cancel friend request</q-tooltip></q-btn>
            <q-btn v-else class="interpolate-btn" icon="chat" flat round color="orange" @click="userSelected()"><q-tooltip>Chat</q-tooltip></q-btn>
          </q-item-section>
        </q-item>
      </q-item>
      <q-dialog v-model="gameOptions">
        <ChooseGameOptions :opponent="name" :closeFunction="closeGameOptions" :inviteType="false"  />
      </q-dialog>
    </q-item>
  </div>
  <q-item>
    <q-item-section>
      <q-item-label class="press2p label score">Victory<div class="bigger victory">{{victory}}</div></q-item-label>
    </q-item-section>
    <q-separator vertical color="blue-grey-5" spaced/>
    <q-item-section>
      <q-item-label class="press2p label score">Defeat<div class="bigger defeat">{{defeat}}</div></q-item-label>
    </q-item-section>
    <q-separator vertical color="blue-grey-5" spaced/>
    <q-item-section>
      <q-item-label class="press2p label score">Ratio<div class="bigger">{{ratio(victory, defeat)}}%</div></q-item-label>
    </q-item-section>
  </q-item>
  <q-separator color="blue-grey-5" spaced/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ChooseGameOptions from 'src/components/ChooseGameOptions.vue'
import { UserStatus } from 'src/stores/store.types';


export default defineComponent({
  name: 'ProfileSummary',
  components: { ChooseGameOptions },
  props: {
    name    : { type: String , default: '' },
    avatar  : { type: String , required: true },
    victory : { type: Number , default: 0 },
    defeat  : { type: Number , default: 0 },
    interact : { type: Boolean, default: false }
  },
  mounted () {
    this.friendStatus()
  },
	setup() {
		const gameOptions = ref(false)
		return {
			gameOptions,
			closeGameOptions() {
				gameOptions.value = false
			},
		}
	},
  data () {
    return {
      friendIcon: 'add' as string,
      friendColor: 'green' as string,
    }
  },
  created () {
    this.friendStatus()
  },
  updated () {
    this.friendStatus()
  },
  methods: {
    ratio(v: number, d: number): string {
      if (v === 0)
        return '0'
      else if (d === 0)
        return '100'
      return (v / (v + d) * 100).toFixed(0)
    },
    isFriend () {
      return (this.$store.friends?.find(e => e === this.name))
    },
    isBlocked () {
      return (this.$store.blocked?.find(e => e === this.name))
    },
    friendStatus () {
      if (this.$store.friendRequestRecevied?.includes(this.name)) {
        this.friendIcon = 'add'
        this.friendColor = 'green'
      }
      else if (this.$store.friendRequestSent?.includes(this.name)) {
        this.friendIcon = 'cancel'
        this.friendColor = 'red'
      }
    },
    followOrUnfollow() {
      if (this.friendIcon === 'add')
        this.follow()
      else if (this.friendIcon === 'cancel')
        this.unfollow()
    },
    async follow() {
      this.$api.follow(this.name)
        .then(() => {
          this.friendIcon = 'cancel'
          this.friendColor = 'red'
        })
        .catch()
    },
    async unfollow() {
      this.$api.unfollow(this.name)
        .then(() => {
          this.friendIcon = 'add'
          this.friendColor = 'green'
        })
        .catch()
    },
    userSelected() {
			const channelID = this.$store.getChannelIDByUsername(this.name as string)
			this.$router.push({
				path: `/conversation/${channelID}`,
			})
		},
    goGameOptions() {
      const status = this.$store.getStatus(this.name)
      if (status === UserStatus.ONLINE) {
        this.$emit('goGameOptions', this.name)
        this.gameOptions = true
      }
      else if (status === UserStatus.WATCHING || status === UserStatus.INGAME)
        this.$q.notify({type: "warning", message: `${this.name} is busy.`})
      else
        this.$q.notify({type: "warning", message: `${this.name} is not connected.`})
    },
  }
})
</script>

<style lang="sass" scoped>
@use "../../../css/interpolate" as r

.wrap
  flex-wrap: wrap

.name
  @include r.interpolate(font-size, 320px, 2560px, 20px, 50px)
  @include r.interpolate(padding-left, 320px, 2560px, 0px, 40px)
  font-weight: bold
  overflow: auto
  text-align: left

.avatar
  @include r.interpolate(font-size, 320px, 2560px, 35px, 80px)

.score
  text-align: center

</style>
