import { Blocks } from './../services/api.models';
import { defineStore } from 'pinia';
import * as models from 'src/services/api.models'
import api from 'src/services/api.service'
import ld from 'lodash'

export const useMeStore = defineStore('me', {
  state: () => ({
    username                      :  ''    as String,
    email                         :  ''    as String,
    channelSubscriptions          :  []    as Array<models.Subscription>,
    gameHistoryPOne               :  []    as Array<models.Game>,
    gameHistoryPTwo               :  []    as Array<models.Game>,
    followedBy                    :  []    as Array<models.Follows>,
    following                     :  []    as Array<models.Follows>,
    blocking                      :  []    as Array<models.Blocks>,
    victoriesAsPOne               :  0     as Number,
    victoriesAsPTwo               :  0     as Number,
    defeatsAsPOne                 :  0     as Number,
    defeatsAsPTwo                 :  0     as Number,
    // others
    drawerStatus                  :  false as boolean,
  }),

  getters: {
    friends(state: any) {
      if (state?.followedBy)
        return ld.intersection(this.followedBy, this.following)
      else
        return undefined
    },
    friendRequestSent(state: any) { // keep only request without follow back
      if (state?.followedBy)
        return ld.difference(this.following, this.followedBy)
      else
        return undefined
    },
    friendRequestRecevied(state: any) { // keep only request without follow back
      if (state?.followedBy)
        return ld.difference(this.followedBy, this.following)
      else
        return undefined
    },
  },

  actions: {
    async getUser(username: string) {
      return await api.user(username)
    },
    getMapsDiffs(me: models.User) {
      const ret = {
        followedBy: me.followedBy .filter((e) => { !this.followedBy.values().include(e) }),
        following : me.following  .filter((e) => { !this.following.values().include(e) }),
        blocking  : me.blocking   .filter((e) => { !this.blocking.values().include(e) }),
      }
      console.log('*getMapsDiffs*:', ret);
    },
    async fetch() {
      let that = this
      api.me()
      .then((me: models.User) => {
        const diff = this.getMapsDiffs(me)
        that.username             = me.username
        that.email                = me.email
        that.channelSubscriptions = me.channelSubscriptions
        that.gameHistoryPOne      = me.gameHistoryPOne
        that.gameHistoryPTwo      = me.gameHistoryPTwo
        that.followedBy           = me.followedBy.map((e: models.Follows) => e.followerId)
        that.following            = me.following.map((e: models.Follows) => e.followingId)
        that.blocking             = me.blocking.map((e: Blocks) => e.blockingId)
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
  }
});


