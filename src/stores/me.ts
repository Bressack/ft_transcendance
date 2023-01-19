import { defineStore } from 'pinia';
import * as models from 'src/services/api.models'
import api from 'src/services/api.service'
import ld from 'lodash'

export const useMeStore = defineStore('me', {
  state: () => ({
    // me: {} as models.User,

    username                      :  ''    as String,
    email                         :  ''    as String,
    createdAt                     :  ''    as String,
    updatedAt                     :  ''    as String,
    TwoFA                         :  false as Boolean,
    password                      :  ''    as String,
    salt                          :  ''    as String,
    identification_token          :  ''    as String,
    refresh_token                 :  ''    as String,
    channelSubscriptions          :  []    as Array<models.Subscription>,
    messages                      :  []    as Array<models.Message>,
    gameHistoryPOne               :  []    as Array<models.Game>,
    gameHistoryPTwo               :  []    as Array<models.Game>,
    followedBy                    :  []    as Array<models.Follows>,
    following                     :  []    as Array<models.Follows>,
    blockedBy                     :  []    as Array<models.Blocks>,
    blocking                      :  []    as Array<models.Blocks>,
    avatars                       :  {}    as models.Avatar,
    victoriesAsPOne               :  0     as Number,
    victoriesAsPTwo               :  0     as Number,
    defeatsAsPOne                 :  0     as Number,
    defeatsAsPTwo                 :  0     as Number,
    drawerStatus                  :  false as boolean
  }),

  getters: {
    friends: (state) => {
      if (state?.followedBy)
      {
        let followedBy = [] ; for (let f of state.followedBy) { followedBy.push(f.followerId) }
        let following = [] ; for (let f of state.following) { following.push(f.followingId) }
        return ld.intersection(followedBy, following)
      }
      else
        return undefined
    },
    friendRequestSent: (state) => {
      if (state?.followedBy)
      {
        let followedBy = [] ; for (let f of state.followedBy) { followedBy.push(f.followerId) }
        let following = [] ; for (let f of state.following) { following.push(f.followingId) }
        return ld.difference(following, followedBy)
      }
      else
        return undefined
    },
    friendRequestRecevied: (state) => {
      if (state?.followedBy)
      {
        let followedBy = [] ; for (let f of state.followedBy) { followedBy.push(f.followerId) }
        let following = [] ; for (let f of state.following) { following.push(f.followingId) }
        return ld.difference(followedBy, following)
      }
      else
        return undefined
    },
  },

  actions: {
    async fetch() {
      let that = this
      api.me()
      .then(function (me: models.User) {
        that.username             = me.username
        that.email                = me.email
        that.createdAt            = me.createdAt
        that.updatedAt            = me.updatedAt
        that.TwoFA                = me.TwoFA
        that.password             = me.password
        that.salt                 = me.salt
        that.identification_token = me.identification_token
        that.refresh_token        = me.refresh_token
        that.channelSubscriptions = me.channelSubscriptions
        that.messages             = me.messages
        that.gameHistoryPOne      = me.gameHistoryPOne
        that.gameHistoryPTwo      = me.gameHistoryPTwo
        that.followedBy           = me.followedBy
        that.following            = me.following
        that.blockedBy            = me.blockedBy
        that.blocking             = me.blocking
        that.avatars              = me.avatars
        that.victoriesAsPOne      = me.victoriesAsPOne
        that.victoriesAsPTwo      = me.victoriesAsPTwo
        that.defeatsAsPOne        = me.defeatsAsPOne
        that.defeatsAsPTwo        = me.defeatsAsPTwo
      })
      .catch(function () {})
    },
    getChannelIDByUsername(username: string) {
      const needle = this.channelSubscriptions.find((e: models.Subscription) => e.channel.channel_type === "ONE_TO_ONE" && e.channel.SubscribedUsers.some((u) => u.username == username))
      return needle?.channelId
    },
    getPublicPrivateChannels() {
      return this.channelSubscriptions.filter((e: models.Subscription) => e.channel.channel_type !== "ONE_TO_ONE")
    }
  }
});


