<template>
  <div class="q-pa-lg">
    <q-item class="wrap">
      <q-item-section avatar>
      <q-avatar class="avatar">
        <q-img :src="avatar"/>
      </q-avatar>
    </q-item-section>
      <q-item-section>
        <q-item-label class="label name">{{ name }}</q-item-label>
      </q-item-section>
      <q-item v-if="interact && name != $storeMe.username">
        <q-item-section>
          <q-btn label="play" class="interpolate-btn q-mr-xs" color="orange" @click="goGameOptions" />
        </q-item-section>
        <q-item-section side>
          <q-btn v-if="!isFriend()" class="interpolate-btn" :label=friendLabel :color=friendColor @click="followOrUnfollow()"/>
          <q-btn v-else class="interpolate-btn" label="chat" color="green" @click="userSelected()" />
        </q-item-section>
      </q-item>
      <q-dialog v-model="gameOptions">
        <GameOptions :opponent="name" :closeFunction="closeGameOptions" />
      </q-dialog>
    </q-item>
  </div>
  <q-item>
    <q-item-section>
      <q-item-label class="label score">Victory<div class="bigger victory">{{victory}}</div></q-item-label>
    </q-item-section>
    <q-separator vertical color="white" spaced/>
    <q-item-section>
      <q-item-label class="label score">Defeat<div class="bigger defeat">{{defeat}}</div></q-item-label>
    </q-item-section>
    <q-separator vertical color="white" spaced/>
    <q-item-section>
      <q-item-label class="label score">Ratio<div class="bigger">{{ratio(victory, defeat)}}%</div></q-item-label>
    </q-item-section>
  </q-item>
  <q-separator color="white" spaced/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import GameOptions from '../../../components/GameOptions.vue'

export default defineComponent({
  name: 'ProfileSummary',
  components: { GameOptions },
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
			openGameOptions() {
				gameOptions.value = true
			},
			closeGameOptions() {
				gameOptions.value = false
			},
		}
	},
  data () {
    return {
      friendLabel: 'add friend' as string,
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
      return (this.$storeMe.friends?.find((element: any) => element === this.name))
    },
    friendStatus () {
      if (this.$storeMe.friendRequestRecevied?.includes(this.name)) {
        this.friendLabel = 'add friend'
        this.friendColor = 'green'
      }
      else if (this.$storeMe.friendRequestSent?.includes(this.name)) {
        this.friendLabel = 'cancel friend'
        this.friendColor = 'red'
      }
    },
    followOrUnfollow() {
      if (this.friendLabel === 'add friend')
        this.follow()
      else if (this.friendLabel === 'cancel friend')
        this.unfollow()
    },
    async follow() {
      this.$api.follow(this.name)
        .then(() => {
          this.$storeMe.fetch()
          this.friendLabel = 'cancel friend'
          this.friendColor = 'red'
        })
        .catch()
    },
    async unfollow() {
      this.$api.unfollow(this.name)
        .then(() => {
          this.friendLabel = 'add friend'
          this.friendColor = 'green'
        })
        .catch()
    },
    userSelected() {
			const channelID = this.$storeMe.getChannelIDByUsername(this.name as string)
			this.$router.push({
				path: `/conversation/${channelID}`,
			})
		},
    goGameOptions() {
      this.openGameOptions()
		},
  }
})
</script>

<style lang="sass" scoped>
@use "../../../css/interpolate" as r

.wrap
  flex-wrap: wrap

.name
  @include r.interpolate(font-size, 320px, 2560px, 14px, 40px)
  @include r.interpolate(padding-left, 320px, 2560px, 0px, 40px)
  font-weight: bold
  overflow: auto
  text-align: left

.avatar
  @include r.interpolate(font-size, 320px, 2560px, 40px, 140px)

.score
  text-align: center

.victory
  color: $green

.defeat
  color: $red
</style>
