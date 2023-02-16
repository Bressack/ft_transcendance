import { Blocks } from './../services/api.models';
import { defineStore } from 'pinia';
import * as models from 'src/services/api.models'
import api from 'src/services/api.service'
import ld from 'lodash'

export const useMeStore = defineStore('me', {
  state: () => ({
    username                      :  ''    as String,
    email                         :  ''    as String,
    createdAt                     :  ''    as String,
    updatedAt                     :  ''    as String,
    channelSubscriptions          :  []    as Array<models.Subscription>,
    gameHistoryPOne               :  []    as Array<models.Game>,
    gameHistoryPTwo               :  []    as Array<models.Game>,
    followedBy                    :  []    as Array<models.Follows>,
    following                     :  []    as Array<models.Follows>,
    blockedBy                     :  []    as Array<models.Blocks>,
    blocking                      :  []    as Array<models.Blocks>,
    victoriesAsPOne               :  0     as Number,
    victoriesAsPTwo               :  0     as Number,
    defeatsAsPOne                 :  0     as Number,
    defeatsAsPTwo                 :  0     as Number,
    // others
    drawerStatus                  :  false as boolean,
    usersAvatars                  :  []    as Array<any>,
  }),

  getters: {
    // getBlockedBy(state: any) {
    //   return state.blockedBy.map((e: Blocks) => e.blockerId)
    // },
    // getBlocking(state: any) {
    //   return state.blocking.map((e: Blocks) => e.blockingId)
    // },
    friends(state: any) {
      if (state?.followedBy)
      {
        let followedBy = state.followedBy.map(e => e.followerId)
        let following = state.following.map(e => e.followingId)
        return ld.intersection(followedBy, following)
      }
      else
        return undefined
    },
    friendRequestSent(state: any) { // keep only request without follow back
      if (state?.followedBy)
      {
        let followedBy = state.followedBy.map(e => e.followerId)
        let following = state.following.map(e => e.followingId)
        return ld.difference(following, followedBy)
      }
      else
        return undefined
    },
    friendRequestRecevied(state: any) { // keep only request without follow back
      if (state?.followedBy)
      {
        let followedBy = state.followedBy.map(e => e.followerId)
        let following = state.following.map(e => e.followingId)
        return ld.difference(followedBy, following)
      }
      else
        return undefined
    },
  },

  actions: {
    getBlockedBy() {
      return this.blockedBy.map((e: Blocks) => e.blockerId)
    },
    getBlocking() {
      return this.blocking.map((e: Blocks) => e.blockingId)
    },
    async getUser(username: string) {
      return await api.user(username)
    },
    async fetch() {
      let that = this
      api.me()
      .then((me: models.User) => {
        that.username             = me.username
        that.email                = me.email
        that.createdAt            = me.createdAt
        that.updatedAt            = me.updatedAt
        that.channelSubscriptions = me.channelSubscriptions
        that.gameHistoryPOne      = me.gameHistoryPOne
        that.gameHistoryPTwo      = me.gameHistoryPTwo
        that.followedBy           = me.followedBy
        that.following            = me.following
        that.blockedBy            = me.blockedBy
        that.blocking             = me.blocking
        that.victoriesAsPOne      = me.victoriesAsPOne
        that.victoriesAsPTwo      = me.victoriesAsPTwo
        that.defeatsAsPOne        = me.defeatsAsPOne
        that.defeatsAsPTwo        = me.defeatsAsPTwo
      })
      .catch(() => {})
    },
    getChannelIDByUsername(username: string) {
      const needle = this.channelSubscriptions.find((e: models.Subscription) => e.channel.channel_type === "ONE_TO_ONE" && e.channel.SubscribedUsers.some((u) => u.username == username))
      return needle?.channelId
    },
    getPublicPrivateChannels() {
      return this.channelSubscriptions.filter((e: models.Subscription) => e.channel.channel_type !== "ONE_TO_ONE")
    },
    getAvatar(username: string) {
      const found = this.usersAvatars.find(u => u.username === username)
      console.log(found);
      if (found)
        return found
      return undefined
      // return { username: username, avatar: ''}
    },
    saveAvatar(username: string) {
      api.avatar(username)
      .then((res) => {
        this.usersAvatars.push({
          username: username,
          avatar: res
        })
      })
      .catch((e) => {
        console.log(username);
      })
    }
  }
});


