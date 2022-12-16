import { defineStore } from 'pinia';
import * as models from 'src/services/api.models'
import api from 'src/services/api.service'
import ld from 'lodash'

export const useMeStore = defineStore('me', {
  state: () => ({
    me: {} as models.User,
  }),

  getters: {
    friends: (state) => {
      if (state?.me?.followedBy)
      {
        let followedBy = [] ; for (let f of state.me.followedBy) { followedBy.push(f.followerId) }
        let following = [] ; for (let f of state.me.following) { following.push(f.followingId) }
        return ld.intersection(followedBy, following)
      }
      else
        return undefined
    },
    friendRequestSent: (state) => {
      if (state?.me?.followedBy)
      {
        let followedBy = [] ; for (let f of state.me.followedBy) { followedBy.push(f.followerId) }
        let following = [] ; for (let f of state.me.following) { following.push(f.followingId) }
        return ld.difference(following, followedBy)
      }
      else
        return undefined
    },
    friendRequestRecevied: (state) => {
      if (state?.me?.followedBy)
      {
        let followedBy = [] ; for (let f of state.me.followedBy) { followedBy.push(f.followerId) }
        let following = [] ; for (let f of state.me.following) { following.push(f.followingId) }
        return ld.difference(followedBy, following)
      }
      else
        return undefined
    },
  },

  actions: {
    fetch() {
      let that = this
      api.me()
      .then(function (me: models.User) {
        that.me = me;
      })
      .catch(function () {})
    }
  }
});
