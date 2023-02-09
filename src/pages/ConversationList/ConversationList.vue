<template>
  <div class="absolute-top bg" />
  <div class="socialheader absolute-top">
    <QInputMenu :menuList="searchResult?.result" @findListWithString="search" @selectElement="followorunfollow" />

    <q-btn-toggle class="socialmenu" v-model="socialtoggle" push flat toggle-color="orange-7" :options="[
      { value: '1', slot: 'one' },
      { value: '2', slot: 'two' },
      { value: '3', slot: 'three' },
      { value: '4', slot: 'four' },
    ]">
      <template v-slot:one>
        <div class="row items-center no-wrap" style="width: 42px;">
          <q-icon right name="group" />
        </div>
      </template>

      <template v-slot:two>
        <div class="row items-center no-wrap" style="width: 42px;">
          <q-icon right name="chat" />
        </div>
      </template>

      <template v-slot:three>
        <div class="row items-center no-wrap" style="width: 42px;" v-if="$storeMe.friendRequestRecevied !== undefined">
          <q-icon right name="hourglass_bottom"/>
          <div class="notif justify-center items-center circle" v-if="$storeMe.friendRequestRecevied?.length > 0"/>
          <div class="notif justify-center items-center" v-if="$storeMe.friendRequestRecevied?.length > 0">{{ $storeMe.friendRequestRecevied?.length < 99 ? $storeMe.friendRequestRecevied?.length : '99+' }}</div>
        </div>
      </template>

      <template v-slot:four>
        <div class="row items-center no-wrap" style="width: 42px;" v-if="$storeMe.friendRequestRecevied !== undefined">
          <q-icon right name="notifications"/>
          <div class="notif justify-center items-center circle" v-if="$storeMe.friendRequestSent?.length > 0"/>
          <div class="notif justify-center items-center" v-if="$storeMe.friendRequestSent?.length > 0">{{ $storeMe.friendRequestSent?.length < 99 ? $storeMe.friendRequestSent?.length : '99+' }}</div>
        </div>
      </template>
    </q-btn-toggle>
  </div>

  <q-list bordered class="list">

    <div v-if="socialtoggle == '1'">
      <q-item clickable v-ripple v-for="friend in $storeMe.friends" :key="friend" class="usermenu">
        <q-item-section style="max-width: 50px;" @click="userSelected(friend)">
          <q-avatar class="avatar">
            <img size="20px" :src="`/api/avatar/${friend}/thumbnail`">
            <div :class="getLoginStatus(friend)" class="loginstatus" />
          </q-avatar>
        </q-item-section>
        <q-item-section @click="userSelected(friend)">
          {{ friend }}
        </q-item-section>
        <q-item-section side class="toto">
          <q-icon name="more_vert" color="white" class="toto">
            <q-menu class="bg-grey-9 text-white" auto-close>

              <q-list style="min-width: 100px">
                <q-item clickable @click="goGameOptions(friend)">
                  <q-item-section>Invite to play</q-item-section>
                </q-item>
                <q-item clickable @click="goProfilPage(friend)">
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-separator dark />
                <q-item clickable class="text-red-7" @click="unfollow(friend)">
                  <q-item-section>Remove friend</q-item-section>
                </q-item>
              </q-list>

            </q-menu>
          </q-icon>
        </q-item-section>
      </q-item>
    </div>

    <div v-if="socialtoggle == '2'">
      <q-item clickable v-ripple v-for="channel in $storeMe.getPublicPrivateChannels()" :key="channel.channelId"
        @click="chanSelected(String(channel.channelId))">
        <q-item-section>
          <span class="text-bold text-h6 pubchan" @click="chanSelected(channel.channelId)">{{
            channel.channel.name
          }}</span>
        </q-item-section>
        <q-item-section side v-if="channel.channel.channel_type === 'PRIVATE'">
          <q-icon name="lock" color="grey-7" />
        </q-item-section>
      </q-item>
    </div>

    <div v-if="socialtoggle == '3'">
      <q-item clickable v-ripple v-for="rrecv in $storeMe.friendRequestRecevied" :key="rrecv">
        <q-item-section style="max-width: 50px;">
          <q-avatar class="avatar">
            <img size="20px" :src="`/api/avatar/${rrecv}/thumbnail`">
            <div :class="getLoginStatus(rrecv)" class="loginstatus" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          {{ rrecv }}
        </q-item-section>
        <q-item-section side>
          <q-icon name="done" color="green" @click="follow(rrecv)" />
        </q-item-section>
      </q-item>
    </div>

    <div v-if="socialtoggle == '4'">
      <q-item clickable v-ripple v-for="rsent in $storeMe.friendRequestSent" :key="rsent">
        <q-item-section style="max-width: 50px;">
          <q-avatar class="avatar">
            <img size="20px" :src="`/api/avatar/${rsent}/thumbnail`">
            <div :class="getLoginStatus(rsent)" class="loginstatus" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          {{ rsent }}
        </q-item-section>
        <q-item-section side>
          <q-icon name="cancel" color="red" @click="unfollow(rsent)" />
        </q-item-section>
      </q-item>
    </div>

  </q-list>
  <q-dialog v-model="gameOptions">
    <GameOptions :opponent="opponent" :closeFunction="closeGameOptions" />
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IConvList, IConvItem, Scope } from '../../models/models';
import UserCard from '../../components/common/UserCard.vue'
import { fake_IConvList } from '../../models/fakedatas'
import GameOptions from '../../components/GameOptions.vue'
import { ISearchQuery } from 'src/services/api.models'
import QInputMenu from 'src/components/QInputMenu.component.vue';

enum EUserStatus {
  UNKNOWN,
  FRIEND,
  PENDINGFROM,
  PENDINGTO,
}

interface IResult {
  total: number,
  result: Array<IUserName>
}

interface IUserName {
  username: String
  status: EUserStatus
}

interface IUserSelected {
  user: String
}

export default defineComponent({
  name: 'ConversationList',
  components: { UserCard, GameOptions, QInputMenu },
  props: {},
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
  computed: {
    friendRequestRecevied(): number {
      if (this.$storeMe.friendRequestRecevied)
        return this.$storeMe.friendRequestRecevied.length
      return 0
    },
    friendRequestSent(): number {
      if (this.$storeMe.friendRequestSent)
        return this.$storeMe.friendRequestSent.length
      return 0
    },
  },
  data() {
    return {
      conversationList: fake_IConvList(15) as IConvList,
      searchInput: '',
      searchResult: {} as IResult,
      opponent: '' as string,
      socialtoggle: '1' as string
    }
  },
  methods: {
    getLoginStatus(username: string) {
      if (this.$storeChat.connectedUsers.includes(username))
        return 'ONLINE-status'
      return 'OFFLINE-status'
    },
    goProfilPage(username: string) {
      this.$router.push({
        path: '/profile/' + username,
      })
    },
    goGameOptions(username: string) {
      this.opponent = username
      this.openGameOptions()
    },
    clearInput() {
      this.searchInput = ''
      this.searchResult = {} as IResult
      console.log('toto', this.searchResult);

    },
    search(text: string) {
      if (text.length == 0) {
        this.searchResult = {} as IResult
        return;
      }
      let that = this
      const searchQuery: ISearchQuery = { key: text }
      this.$api.search(searchQuery)
        .then(function (result) {
          let ret: IResult = {
            total: 0,
            result: []
          }

          for (let elem of result.result) {
            let stat: EUserStatus = EUserStatus.UNKNOWN
            if (that.$storeMe.friends?.includes(elem.username))
              stat = EUserStatus.FRIEND
            else if (that.$storeMe.friendRequestRecevied?.includes(elem.username))
              stat = EUserStatus.PENDINGFROM
            else if (that.$storeMe.friendRequestSent?.includes(elem.username))
              stat = EUserStatus.PENDINGTO
            ret.result.push({
              username: elem.username,
              status: stat
            })
          }
          ret.total = ret.result?.length
          console.log(ret);
          console.log(result);

          that.searchResult = ret
        })
        .catch(function (error) {
          that.searchResult = {} as IResult
        })
    },
    isPrivate(item: IConvItem) {
      return item.scope == Scope.PRIVATE
    },
    userSelected(username: string) {
      const channelID = this.$storeMe.getChannelIDByUsername(username)
      console.log('toto:', channelID);
      this.$router.push({
        path: `/conversation/${channelID}`,
      })
    },
    chanSelected(id: string) {
      this.$router.push({
        path: `/conversation/${id}`,
      })
    },
    followorunfollow(username: string, mode: string) {
      if (mode == "unfollow")
        this.unfollow(username)
      else if (mode == "follow")
        this.follow(username)
    },
    follow(username: string) {
      let that = this
      this.$api.follow(username)
        .then(function () { that.$storeMe.fetch(), that.search() })
        .catch(function () { })
    },
    unfollow(username: string) {
      let that = this
      this.$api.unfollow(username)
        .then(function () { that.$storeMe.fetch(), that.search() })
        .catch(function () { })
    },
  },
});
</script>

<style lang="sass" scoped>
.item
  background-color: $bg-secondary
  // margin-bottom: 2px
  width: 100%
  height: 1em

.list
  background-color: $bg-secondary !important
  width: 100%
  margin-top: 100px

.header
  font-size: 16px
  font-weight: bold
  color: orange

.avatar
  width: 30px
  height: 30px
  border-radius: 50%

.usermenu .toto
  visibility: hidden

.usermenu:hover .toto
  visibility: visible

.pubchan
  word-break: break-all

.overall
  z-index: 2

.loginstatus
  width: 12px
  height: 12px
  border-radius: 100px
  position: absolute
  margin-top: 20px
  margin-left: 20px

.ONLINE-status
  background-color: $onlineStatus-online
  box-shadow: 0px 0px 5px $onlineStatus-online
.OFFLINE-status
  background-color: $onlineStatus-offline
  box-shadow: 0px 0px 5px $onlineStatus-offline
.INGAME-status
  background-color: $onlineStatus-ingame
  box-shadow: 0px 0px 5px $onlineStatus-ingame

.socialheader
  position: fixed
  z-index: 3

.socialmenu
  width: 300px
  margin: 5px 0
  z-index: 1

.bg
  height: 100px
  z-index: 2
  background-color: $bg-secondary
  position: fixed

.notif
  width: 16px
  height: 16px
  position: absolute
  margin-bottom: 27px
  margin-left: 23px
  font-size: 11px
  color: white

.circle
  background-color: red
  border-radius: 100px
  margin-bottom: 20px

</style>
