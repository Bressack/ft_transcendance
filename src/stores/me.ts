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
    vue                           :  null as any
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
    init(vue: any) {
      this.vue = vue
    },
    async getUser(username: string) {
      return await api.user(username)
    },

    async fetch() {
      let that = this

      const oldmaps = {
        followedBy: JSON.parse(JSON.stringify(this.followedBy)),
        following: JSON.parse(JSON.stringify(this.following)),
        blocking: JSON.parse(JSON.stringify(this.blocking)),
      }
      const isupdate = that.email?.length > 0

      api.me()
      .then((me: models.User) => {
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

        if (isupdate) {
          const diff = {
            in: {
              followedBy : ld.difference(that.followedBy, oldmaps.followedBy),
              following  : ld.difference(that.following , oldmaps.following ),
              blocking   : ld.difference(that.blocking  , oldmaps.blocking  ),
            },
            out: {
              followedBy : ld.difference(oldmaps.followedBy, that.followedBy),
              following  : ld.difference(oldmaps.following , that.following ),
              blocking   : ld.difference(oldmaps.blocking  , that.blocking  ),
            },
          }
          console.log(diff);
          that.notify_diff(diff)
        }
      })
      .catch(() => {})
    },

    notify_diff(diff: any) {

      diff.in.followedBy.forEach((e: any) => {
        this.vue.$notifyCenter.send({ color: "cyan", avatar: `/api/avatar/${e}/thumbnail`, message: `${e} just follow you !` });
      });
      diff.in.following.forEach((e: any) => {
        this.vue.$notifyCenter.send({ color: "cyan", avatar: `/api/avatar/${e}/thumbnail`, message: `${e} followed !` });
      });
      diff.in.blocking.forEach((e: any) => {
        this.vue.$notifyCenter.send({ color: "cyan", avatar: `/api/avatar/${e}/thumbnail`, message: `${e} blocked !` });
      });

      diff.out.followedBy.forEach((e: any) => {
        this.vue.$notifyCenter.send({ color: "cyan", avatar: `/api/avatar/${e}/thumbnail`, message: `${e} just unfollow you !` });
      });
      diff.out.following.forEach((e: any) => {
        this.vue.$notifyCenter.send({ color: "cyan", avatar: `/api/avatar/${e}/thumbnail`, message: `${e} unfollowed !` });
      });
      diff.out.blocking.forEach((e: any) => {
        this.vue.$notifyCenter.send({ color: "cyan", avatar: `/api/avatar/${e}/thumbnail`, message: `${e} unblocked !` });
      });
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


