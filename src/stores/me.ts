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

      const oldmaps = {
        followedBy: JSON.parse(JSON.stringify(this.followedBy)),
        following: JSON.parse(JSON.stringify(this.following)),
        blocking: JSON.parse(JSON.stringify(this.blocking)),
      }
      const isupdate = this.email?.length > 0

      try {

        const me : models.User = await api.me()

        this.username             = me.username
        this.email                = me.email
        this.channelSubscriptions = me.channelSubscriptions
        this.gameHistoryPOne      = me.gameHistoryPOne
        this.gameHistoryPTwo      = me.gameHistoryPTwo
        this.followedBy           = me.followedBy.map((e: models.Follows) => e.followerId)
        this.following            = me.following.map((e: models.Follows) => e.followingId)
        this.blocking             = me.blocking.map((e: Blocks) => e.blockingId)
        this.victoriesAsPOne      = me.victoriesAsPOne
        this.victoriesAsPTwo      = me.victoriesAsPTwo
        this.defeatsAsPOne        = me.defeatsAsPOne
        this.defeatsAsPTwo        = me.defeatsAsPTwo

        if (isupdate) {
          const diff = {
            in: {
              followedBy : ld.difference(this.followedBy, oldmaps.followedBy),
              following  : ld.difference(this.following , oldmaps.following ),
              blocking   : ld.difference(this.blocking  , oldmaps.blocking  ),
            },
            out: {
              followedBy : ld.difference(oldmaps.followedBy, this.followedBy),
              following  : ld.difference(oldmaps.following , this.following ),
              blocking   : ld.difference(oldmaps.blocking  , this.blocking  ),
            },
          }
          console.log(diff);
          this.notify_diff(diff)
        }
      } catch (error) {}
      console.log('THEEEEERE');
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


