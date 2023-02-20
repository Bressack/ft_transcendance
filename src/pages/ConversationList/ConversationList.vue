<template><!-- <div class="absolute-top bg" /> -->

  <QInputMenu :menuList="searchResult?.result as Array<IUserName>" @findListWithString="search" @selectElement="followorunfollow" />

  <div class="q-gutter-y-md q-mt-md" style="max-width: 300px">
    <q-card>
      <q-tabs
          v-model="tab"
          dense
          class="text-grey-6"
          style="background-color: #212121;"
          active-color="orange"
          indicator-color="orange"
          align="justify"
          narrow-indicator
        >
        <q-tab name="friends" icon="group" class="tab" />
        <q-tab name="channels" icon="chat" class="tab" />
        <q-tab name="following" icon="hourglass_bottom" class="tab">
          <div class="notif justify-center items-center circle" v-if="$storeMe.friendRequestSent?.length > 0" />
          <div class="notif justify-center items-center" v-if="$storeMe.friendRequestSent?.length > 0">
            {{ $storeMe.friendRequestSent?.length < 99 ? $storeMe.friendRequestSent?.length : '99+' }}
          </div>
        </q-tab>
        <q-tab name="follower" icon="notifications" class="tab">
          <div class="notif justify-center items-center circle" v-if="$storeMe.friendRequestRecevied?.length > 0" />
          <div class="notif justify-center items-center" v-if="$storeMe?.friendRequestRecevied?.length > 0">
            {{ $storeMe.friendRequestRecevied?.length < 99 ? $storeMe.friendRequestRecevied?.length : '99+' }}
          </div>
        </q-tab>
        <q-tab name="blocked" icon="person_off" class="tab">
          <div class="notif justify-center items-center circle" v-if="$storeMe.blocking?.length > 0" />
          <div class="notif justify-center items-center" v-if="$storeMe?.blocking?.length > 0">
            {{ $storeMe.blocking?.length < 99 ? $storeMe.blocking?.length : '99+' }}
          </div>
        </q-tab>

      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated class="hide-scrollbar" >


<!-- #################################################################################################################### -->
        <q-tab-panel name="friends" class="tab-panel">
          <div class="text-h5 text-center q-py-sm text-orange-6 text-bold bg-grey-9">friends</div>
          <UserCard v-for="friend in $storeMe.friends" :key="friend"
            @goGameOptions="goGameOptions"
            :username="friend"
            icon_name="chat" icon_color="orange"
            shortcut_chat
            menu_profile menu_block menu_play menu_chat menu_unfollow
          />
        </q-tab-panel>

<!-- #################################################################################################################### -->
        <q-tab-panel name="channels" class="tab-panel">
          <div class="text-h5 text-center q-py-sm text-orange-6 text-bold bg-grey-9">channels</div>
          <q-item class="flex-center">
            <q-btn class="createChannelButton" label="Create channel" color="orange" @click="dialog = true" />
          </q-item>
          <q-dialog persistent v-model="dialog">
            <CreateChannel :closeFn=closeDialog />
          </q-dialog>

          <q-item clickable v-ripple v-for="channel in $storeMe.getPublicPrivateChannels()" :key="channel.channelId"
            @click="chanSelected(channel)">
            <q-item-section>
              <span class="text-bold text-h6 pubchan" @click="chanSelected(channel)">{{
                channel.channel.name
              }}</span>
            </q-item-section>
            <q-item-section side v-if="channel.channel.channel_type === 'PRIVATE'">
              <q-icon name="lock" color="grey-7" />
            </q-item-section>

            <q-dialog persistent v-model="dialogpassword">
              <div class="password_dialog">
                <div class="close-cross">
                  <q-btn class="cross absolute-right" color="orange" icon="close" flat round v-close-popup />
                </div>
                <div class="q-ma-lg">
                  <q-input v-model="password" dark label="Password" color="orange" label-color="white" />
                  <q-btn class="q-ma-lg" label="Submit" color="orange-8" @click="joinprotectedchannel()" />
                </div>
              </div>
            </q-dialog>

          </q-item>
        </q-tab-panel>
<!-- #################################################################################################################### -->
        <q-tab-panel name="following" class="tab-panel">
          <div class="text-h5 text-center q-py-sm text-orange-6 text-bold bg-grey-9">following</div>
          <UserCard v-for="rsent in $storeMe.friendRequestSent" :key="rsent"
            @goGameOptions="goGameOptions"
            :username="rsent"

            icon_name="cancel" icon_color="red"
            shortcut_unfollow menu_profile menu_unfollow menu_block
          />
        </q-tab-panel>
<!-- #################################################################################################################### -->
        <q-tab-panel name="follower" class="tab-panel">
          <div class="text-h5 text-center q-py-sm text-orange-6 text-bold bg-grey-9">follower</div>
          <UserCard v-for="rrecv in $storeMe.friendRequestRecevied" :key="rrecv"
            @goGameOptions="goGameOptions"
            :username="rrecv"

            icon_name="done" icon_color="green"
            shortcut_follow menu_profile menu_follow menu_block
          />
        </q-tab-panel>
<!-- #################################################################################################################### -->
        <q-tab-panel name="blocked" class="tab-panel">
          <div class="text-h5 text-center q-py-sm text-orange-6 text-bold bg-grey-9">blocked</div>
          <UserCard v-for="tblocking in $storeMe.blocking" :key="tblocking"
            @goGameOptions="goGameOptions"
            :username="tblocking"

            icon_name="cancel" icon_color="red"
            shortcut_unblock menu_profile
          />
        </q-tab-panel>
<!-- #################################################################################################################### -->
      </q-tab-panels>
    </q-card>
  </div>

  <q-dialog v-model="gameOptions">
    <GameOptions :opponent="opponent" :closeFunction="closeGameOptions" />
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IConvList, IConvItem, Scope } from '../../models/models';
import { fake_IConvList } from '../../models/fakedatas'
import GameOptions from '../../components/GameOptions.vue'
import { ISearchQuery } from 'src/services/api.models'
import QInputMenu from 'src/components/QInputMenu.component.vue';
import CreateChannel from 'src/components/CreateChannel.vue'
import UserCard from './components/UserCard.vue'
import * as models from 'src/services/api.models'

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
  components: { GameOptions, QInputMenu, CreateChannel, UserCard },
  props: {},
  setup() {
    const gameOptions = ref(false)
    const dialog = ref(false)
    const dialogpassword = ref(false)
    return {
      tab: ref('friends'),
      gameOptions,
      openGameOptions() {
        gameOptions.value = true
      },
      closeGameOptions() {
        gameOptions.value = false
      },
      closeDialog() {
        dialog.value = false
      },
      dialog,
      dialogpassword,
      closePasswordDialog() {
        dialogpassword.value = false
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
    joinprotectedchannel() {
      this.closePasswordDialog()
      this.$router.push({
        path: `/conversation/${channel.id}`,
      })
    },
    chanSelected(channel: models.Channel) {
      console.log('channel', channel)
      console.log('hash', channel.channel.hash)
      if (channel.channel.hash == 'yes')
        this.dialogpassword = true
      else
        this.$router.push({
          path: `/conversation/${channel.channelId}`,
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
        .then(function () { })
        .catch(function () { })
    },
    unfollow(username: string) {
      let that = this
      this.$api.unfollow(username)
        .then(function () { })
        .catch(function () { })
    },
  },
});
</script>

<style lang="sass" scoped>
.list
  background-color: $bg-secondary !important
  width: 100%
  margin-top: 100px

.pubchan
  word-break: break-all

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
  margin-bottom: 20px
  margin-left: 23px
  font-size: 11px
  font-weight: bold
  color: white

.circle
  background-color: red
  border-radius: 100px
  margin-bottom: 20px

.createChannelButton
  width: 100%

.password_dialog
  background-color: $bg-primary

.tab
  width: calc(100%/5)
  background-color: $bg-secondary
  padding: 0
  margin: 0

.tab-panel
  padding: 0 !important
  background-color: $bg-secondary
</style>
