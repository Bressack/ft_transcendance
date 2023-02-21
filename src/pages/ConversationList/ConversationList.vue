<template>
  <div class="absolute-top bg" />

  <QInputMenu class="inputmenu" :menuList="searchResult?.result as any" @findListWithString="search"
    @selectElement="followorunfollow" />

  <div class="q-gutter-y-md q-mt-md" style="max-width: 300px">
    <q-card>
      <q-tabs v-model="tab" dense class="text-grey-6 q-fixed qtab" style="background-color: #212121;"
        active-color="orange" indicator-color="orange" align="justify" narrow-indicator>
        <q-tab name="friends" icon="group" class="tab" />
        <q-tab name="channels" icon="chat" class="tab" />
        <q-tab name="following" icon="hourglass_bottom" class="tab">
          <div class="notif justify-center items-center circle" v-if="$storeMe.friendRequestSent?.length > 0" />
          <div class="notif justify-center items-center" v-if="$storeMe.friendRequestSent?.length > 0">
            {{ $storeMe.friendRequestSent?.length < 99 ? $storeMe.friendRequestSent?.length : '99+' }} </div>
        </q-tab>
        <q-tab name="follower" icon="notifications" class="tab">
          <div class="notif justify-center items-center circle" v-if="$storeMe.friendRequestRecevied?.length > 0" />
          <div class="notif justify-center items-center" v-if="$storeMe?.friendRequestRecevied?.length > 0">
            {{ $storeMe.friendRequestRecevied?.length < 99 ? $storeMe.friendRequestRecevied?.length : '99+' }} </div>
        </q-tab>
        <q-tab name="blocked" icon="person_off" class="tab">
          <div class="notif justify-center items-center circle" v-if="$storeMe.blocking?.length > 0" />
          <div class="notif justify-center items-center" v-if="$storeMe?.blocking?.length > 0">
            {{ $storeMe.blocking?.length < 99 ? $storeMe.blocking?.length : '99+' }} </div>
        </q-tab>

      </q-tabs>

      <q-separator />

      <div class="text-h5 text-center q-py-sm text-orange-6 text-bold bg-grey-9 q-fixed tabtitle">{{ tab }}</div>

      <q-separator />


      <q-tab-panels v-model="tab" animated class="list">

<!-- #################################################################################################################### -->
          <q-tab-panel name="friends" class="tab-panel hide-scrollbar">
            <q-list>
              <UserCard v-for="friend in $storeMe.friends" :key="friend" @goGameOptions="goGameOptions" :username="friend"

                shortcut_chat shortcut_play menu_profile menu_block menu_play menu_chat menu_unfollow />
            </q-list>
          </q-tab-panel>

<!-- #################################################################################################################### -->
          <q-tab-panel name="channels" class="tab-panel hide-scrollbar">
            <q-item class="flex-center">
              <q-btn class="createChannelButton" label="Create channel" color="orange" @click="dialog = true" />
            </q-item>
            <q-dialog persistent v-model="dialog">
              <CreateChannel :closeFn=closeDialog />
            </q-dialog>
            <q-list>
              <q-item clickable v-ripple
                v-for="sub in ($storeMe.getPublicPrivateChannels() as Array<models.Subscription>)"
                :key="sub.channelId"
                @click="chanSelected(sub.channel)"
              >
                <q-item-section>
                  <span class="text-bold text-h6 pubchan">{{
                    sub.channel.name
                  }}</span>
                </q-item-section>
                <q-item-section side v-if="sub.channel.password_protected">
                  <q-icon name="lock" color="grey-7" />
                </q-item-section>

              </q-item>
            </q-list>
          </q-tab-panel>
<!-- #################################################################################################################### -->
          <q-tab-panel name="following" class="tab-panel hide-scrollbar">
            <q-list>
              <UserCard v-for="rsent in $storeMe.friendRequestSent" :key="rsent" @goGameOptions="goGameOptions"
                :username="rsent"
                shortcut_unfollow menu_profile menu_unfollow menu_block menu_play />
            </q-list>
          </q-tab-panel>
<!-- #################################################################################################################### -->
          <q-tab-panel name="follower" class="tab-panel hide-scrollbar">
            <q-list>
              <UserCard v-for="rrecv in $storeMe.friendRequestRecevied" :key="rrecv" @goGameOptions="goGameOptions"
                :username="rrecv"
                shortcut_follow menu_profile menu_follow menu_block menu_play />
            </q-list>
          </q-tab-panel>
<!-- #################################################################################################################### -->
          <q-tab-panel name="blocked" class="tab-panel hide-scrollbar">
            <q-list>
              <UserCard v-for="tblocking in $storeMe.blocking" :key="tblocking" @goGameOptions="goGameOptions"
                :username="tblocking"
                shortcut_unblock menu_profile menu_unblock />
            </q-list>
          </q-tab-panel>
<!-- #################################################################################################################### -->

      </q-tab-panels>
    </q-card>
  </div>

  <q-dialog v-model="gameOptions">
    <ChooseGameOptions :opponent="opponent" :closeFunction="closeGameOptions" :inviteType="false"  />
  </q-dialog>

  <q-dialog persistent v-model="dialogpassword" @keydown.esc="dialogpassword = false">
    <div class="password_dialog">
      <div class="q-ma-lg q-pt-lg">
        <q-item class="text-h6">Enter Password</q-item>
        <q-separator/>
        <q-input v-model="password" dark  color="orange" label-color="white"/>
        <q-separator/>
        <q-btn class="q-ma-lg" label="Submit" color="green-8" @click="joinprotectedchannel"/>
        <q-btn class="q-ma-lg" label="Cancel" color="red-8" v-close-popup />
      </div>
    </div>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IConvList, IConvItem, Scope } from '../../models/models';
import { fake_IConvList } from '../../models/fakedatas'
import ChooseGameOptions from '../../components/ChooseGameOptions.vue'
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
  components: { ChooseGameOptions, QInputMenu, CreateChannel, UserCard },
  props: {},
  setup() {
    const gameOptions = ref(false)
    const dialog = ref(false)
    // const dialogpassword = ref(false)
    return {
      channelSelector: '',
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
      // dialogpassword,
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
    tabPanelTitle(tab: string) {
    },
  },
  data() {
    return {
      password: '',
      dialogpassword: false,
      conversationList: fake_IConvList(15) as IConvList,
      searchInput: '',
      searchResult: {} as IResult,
      opponent: '' as string,
      socialtoggle: '1' as string
    }
  },
  methods: {
    closePasswordDialog() {
      this.dialogpassword = false
    },
    goGameOptions(username: string) {
      this.opponent = username
      this.openGameOptions()
    },
    clearInput() {
      this.searchInput = ''
      this.searchResult = {} as IResult

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
          that.searchResult = ret
        })
        .catch(function (error) {
          that.searchResult = {} as IResult
        })
    },

    isPrivate(item: IConvItem) {
      return item.scope == Scope.PRIVATE
    },


    async joinprotectedchannel() : Promise<void> {
      this.closePasswordDialog()
      await this.$storeChat.initNewChannel(this.channelSelector, this.password)
      this.password = ''
      this.$router.push({
        path: `/conversation/${this.channelSelector}`,
      })
      this.channelSelector = ''
    },
    chanSelected(channel: models.Channel) {
      let instance
      try {
        instance = this.$storeChat.__getChannelInstance(channel.id)
      } catch(err: any) {}

      if (!instance?.checked && channel.password_protected) {
        this.channelSelector = channel.id
        this.dialogpassword = true
      } else {
        this.password = ''
        this.$router.push({
          path: `/conversation/${channel.id}`,
        })
      }
    },


    async followorunfollow(username: string, mode: string) {
      if (mode == "unfollow")
        await this.unfollow(username)
      else if (mode == "follow")
        await this.follow(username)
    },
    async follow(username: string) {
      await this.$api.follow(username)
    },
    async unfollow(username: string) {
      await this.$api.unfollow(username)
    },
  },
});
</script>

<style lang="sass" scoped>

body
  background-color: $bg-secondary !important

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
  height: 170px
  z-index: 1
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
  overflow: auto
  z-index: 0
  // position: absolute
  padding: 0 !important
  background-color: $bg-secondary
  margin-top: 50px
  height: calc(100vh - 260px)
  width: 300px

.inputmenu
  width: 300px
  position: fixed
  z-index: 1

.q-fixed
  width: 300px
  position: fixed
  z-index: 2
  margin-top: 50px

.qtab
  margin-top: 50px

.tabtitle
  margin-top: 100px

</style>
