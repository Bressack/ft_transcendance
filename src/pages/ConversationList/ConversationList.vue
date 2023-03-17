<template>
  <div class="absolute-top bg" />

  <QInputMenu class="inputmenu" :menuList="searchResult?.result as any" @findListWithString="search"
    @selectElement="followorunfollow" />

  <div class="q-gutter-y-md q-mt-md" style="max-width: 300px">
    <q-card >
      <q-tabs v-model="tab" dense class="text-grey-6 q-fixed qtab "
        active-color="orange" indicator-color="orange" align="justify" narrow-indicator>
        <q-tab name="friends" icon="group" class="tab unautretruc"><q-tooltip>Friends</q-tooltip></q-tab>
        <q-tab name="channels" icon="chat" class="tab"><q-tooltip>Channels</q-tooltip></q-tab>
        <q-tab name="pending requests" icon="mdi-account-clock-outline" class="tab"><q-tooltip>Pending requests</q-tooltip>
          <div class="notif justify-center items-center circle" v-if="$store.pendingRequests?.length > 0" />
          <div class="notif justify-center items-center" v-if="$store.pendingRequests?.length">
            {{ $store.pendingRequests?.length < 99 ? $store.pendingRequests?.length : '99+' }} </div>
        </q-tab>
        <q-tab name="blocked" icon="mdi-account-cancel" class="tab">
          <q-tooltip>Blocked users</q-tooltip>
          <div class="notif justify-center items-center circle" v-if="$store.blocked?.length > 0" />
          <div class="notif justify-center items-center" v-if="$store.blocked?.length > 0">
            {{ $store.blocked?.length < 99 ? $store.blocked?.length : '99+' }} </div>
        </q-tab>

      </q-tabs>

      <q-separator />

      <div class="text-h5 text-center q-py-sm text-blue-grey-3 text-bold bg-grey-9 q-fixed tabtitle">{{ tab }}</div>

      <q-separator />


      <q-tab-panels v-model="tab" animated class="list">

<!-- #################################################################################################################### -->
        <q-tab-panel name="friends" class="tab-panel hide-scrollbar">
          <div v-if="!$store.friends?.length" class="emptylist text-center">
            you have no friend
          </div>
          <q-list v-else>
            <Friends v-for="friend in $store.friends" :key="friend" :username="friend"/>
          </q-list>

        </q-tab-panel>
<!-- #################################################################################################################### -->
          <q-tab-panel name="channels" class="tab-panel hide-scrollbar">
            <q-item class="flex-center">
              <q-btn class="full-width" outline label="Create channel" icon-right="mdi-playlist-plus" color="secondary" @click="dialog = true" />
            </q-item>
            <q-dialog persistent v-model="dialog">
              <CreateChannel :closeFn=closeDialog />
            </q-dialog>
            <div v-if="!$store.getPublicPrivateChannels?.length" class="emptylist text-center">
              you have no subscribed channel
            </div>
            <q-list v-else>
              <q-item clickable v-ripple
                v-for="sub in ($store.getPublicPrivateChannels)"
                :key="sub.channelId"
                manual-focus
                :focused="$store.active_channel === sub.channelId"
                @click="chanSelected(sub.channel.id)"
              >
                <q-item-section>
                  <span class="text-bold text-h6 pubchan">{{ sub.channel.name }}</span>
                </q-item-section>
                <q-item-section side v-if="sub.channel.passwordProtected">
                  <q-icon name="lock" color="grey-7" />
                </q-item-section>

              </q-item>
            </q-list>
          </q-tab-panel>
<!-- #################################################################################################################### -->
          <q-tab-panel name="pending requests" class="tab-panel hide-scrollbar">
            <div v-if="!$store.pendingRequests?.length" class="emptylist text-center">
              you have no pending requests
            </div>
            <q-list v-else>
              <PendingRequest v-for="req in $store.pendingRequests" :key="req.username"
                :username="req.username"
                :category="req.category"
                 menu_profile menu_block />
            </q-list>
          </q-tab-panel>
<!-- #################################################################################################################### -->
          <q-tab-panel name="blocked" class="tab-panel hide-scrollbar">
            <q-list>
              <!-- <UserCard v-for="username in $store.blocked" :key="username" @goGameOptions="goGameOptions"
                :username="username"
                shortcut_unblock menu_profile menu_unblock /> -->
              <div v-if="!$store.blocked?.length" class="emptylist text-center">
                you have no blocked users
              </div>
              <q-list v-else>
                <Blocked v-for="username in $store.blocked" :key="username" :username=username />
            </q-list>
          </q-list>
          </q-tab-panel>
<!-- #################################################################################################################### -->

      </q-tab-panels>
    </q-card>
  </div>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { IConvItem, Scope } from '../../models/models';
import ChooseGameOptions from '../../components/ChooseGameOptions.vue'
import { ISearchQuery } from 'src/services/api.models'
import QInputMenu from 'src/components/QInputMenu.component.vue';
import CreateChannel from 'src/components/CreateChannel.vue'
import UserCard from './components/UserCard.vue'
import Friends from './components/Friends.vue'
import PendingRequest from './components/PendingRequest.vue'
import Blocked from './components/Blocked.vue'

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
  components: { ChooseGameOptions, QInputMenu, CreateChannel, UserCard, Friends, PendingRequest, Blocked },
  setup() {
    const gameOptions = ref(false)
    const dialog = ref(false)
    // const dialogpassword = ref(false)
    return {
      channelSelector: '',
      tab: ref('friends'),
      closeDialog() {
        dialog.value = false
      },
      dialog,
      // dialogpassword,
    }
  },
  computed: {
  },
  data() {
    return {
      //   password: '',
      //   dialogpassword: false,
      //   conversationList: fake_IConvList(15) as IConvList,
      searchInput: '',
      searchResult: {} as IResult,
      opponent: '' as string,
      socialtoggle: '1' as string,
    }
    // console.log(this.$route.params.channel_id)
  },
  // watch: {
  //   toto(n_value, o_value) {

  //   }
  // },
  methods: {
    clearInput() {
      this.searchInput = ''
      this.searchResult = {} as IResult

    },
    search(text: string) {
      if (text.length == 0) {
        this.searchResult = {} as IResult
        return;
      }
      const searchQuery: ISearchQuery = { key: text }
      this.$api.search(searchQuery)
        .then((result) => {
          let ret: IResult = {
            total: 0,
            result: []
          }

          for (let elem of result.result) {
            let stat: EUserStatus = EUserStatus.UNKNOWN
            if (this.$store.friends?.includes(elem.username))
              stat = EUserStatus.FRIEND
            else if (this.$store.friendRequestRecevied?.includes(elem.username))
              stat = EUserStatus.PENDINGFROM
            else if (this.$store.friendRequestSent?.includes(elem.username))
              stat = EUserStatus.PENDINGTO
            ret.result.push({
              username: elem.username,
              status: stat
            })
          }
          ret.total = ret.result?.length
          this.searchResult = ret
        })
        .catch((error) => {
          this.searchResult = {} as IResult
        })
    },

    isPrivate(item: IConvItem) {
      return item.scope == Scope.PRIVATE
    },

    chanSelected(channelId: string) {
      this.$router.replace({
        path: `/conversation/${channelId}`,
      })
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

.text-h5
  font-size: 1em
  color: $ternary
  font-family: 'Press Start 2P'

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

.emptylist
  width: 300px
  height: 100%
  font-family: 'Press Start 2P'
  padding-top: calc(50vh - 260px)
</style>
