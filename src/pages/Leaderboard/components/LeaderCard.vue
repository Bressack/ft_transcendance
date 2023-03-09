<template>
  <div class="q-px-md">
    <div class="q-pa-sm row" :class="$store.username == user.username ? 'isme' : ''">
      <q-item class="press2p labelh items-center text-h5">#{{rank}}</q-item>
      <q-item class="main items-center" :class="rankborder" clickable @click="goProfilPage">
        <q-item-section style="max-width: 52px;" class="" >
          <q-avatar size="52px" class="avatar" :style="`background-color: ${$utils.usernameToColor(user.username)};`">
            <img :src="`/api/avatar/${user.username}/thumbnail`">
            <div :class="getLoginStatus()" class="loginstatush"/>
          </q-avatar>
        </q-item-section>
        <q-separator vertical color="blue-grey-5" spaced/>
        <q-item-section class="">
          <q-card-label class="text-h6 q-ml-lg">
            {{ user.username }}
          </q-card-label>
        </q-item-section>
        <q-separator vertical color="blue-grey-5" spaced/>
        <q-card-section class="base">
          <q-card-label class="biggerh victory">
            {{ user.victoriesAsPOne + user.victoriesAsPTwo }}
          </q-card-label>
        </q-card-section>
        <q-separator vertical color="blue-grey-5" spaced/>
        <q-card-section class="base">
          <q-card-label class="biggerh defeat">
            {{ user.defeatsAsPOne + user.defeatsAsPTwo }}
          </q-card-label>
        </q-card-section>
        <q-separator vertical color="blue-grey-5" spaced/>
        <q-card-section class="base">
          <q-card-label class="biggerh">
            {{ (getRatio(user) * 100).toFixed(2) }} %
          </q-card-label>
        </q-card-section>
      </q-item>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { UserBoard } from 'src/stores/store.types'
import { UserStatus } from 'src/stores/store.types';

export default defineComponent({
  name: 'LeaderCard',
  // components: {},
  props: {
    user: { type: Object as PropType<UserBoard>, required: true },
    rank: { type: Number, required: true },
  },
  data() {
    return {}
  },
  computed: {
    rankborder() {
      switch (this.rank) {
        case 0  : return 'rankborder-gold'
        case 1  : return 'rankborder-silver'
        case 2  : return 'rankborder-bronze'
        default : return 'rankborder-others'
      }
    },
  },
  methods: {
    getRatio(user: UserBoard) : number {
      return (user.victoriesAsPOne + user.victoriesAsPTwo) / (user.victoriesAsPOne + user.victoriesAsPTwo + user.defeatsAsPOne + user.defeatsAsPTwo)
    },
    getLoginStatus() {
      const status = this.$store.getStatus(this.user.username)
      if (status === UserStatus.ONLINE)
        return 'ONLINE-status'
      else if (status === UserStatus.WATCHING)
        return 'WATCHING-status'
      else if (status === UserStatus.INGAME)
        return 'INGAME-status'
      return 'OFFLINE-status'
    },
    goProfilPage() {
      this.$router.push({
        path: '/profile/' + this.user.username,
      })
    },
  },
});
</script>

<style lang="sass" scoped>
@use "src/css/interpolate" as r

.main
  width: 80%
  margin: auto
  border-radius: 15px

.rankborder-gold
  border-top:    10px solid gold
  border-bottom: 10px solid gold

.rankborder-silver
  border-top:    10px solid silver
  border-bottom: 10px solid silver

.rankborder-bronze
  border-top:    10px solid $brown-6
  border-bottom: 10px solid $brown-6

.rankborder-others
  border-top:    10px solid $grey-8
  border-bottom: 10px solid $grey-8

.base
  min-width: 100px

.biggerh
  @include r.interpolate(font-size, 320px, 2560px, 8px, 35px)
  @include r.interpolate((padding-top, padding-bottom), 20rem, 70rem, 0rem, .2rem)
  color: $blue-grey-2
  font-weight: bold

.loginstatush
  width: 20px
  height: 20px
  border-radius: 100px
  position: absolute
  margin-top: 35px
  margin-left: 35px

.isme
  border: 4px solid green
  border-radius: 10px
</style>
