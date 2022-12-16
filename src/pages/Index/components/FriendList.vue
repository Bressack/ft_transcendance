<template>
  <div class="q-pa-md">
    <div class="q-pa-md list" style="max-width: 350px" v-if="storeMe.me.followedBy">

      <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title>Contacts</q-toolbar-title>
      </q-toolbar>

      <q-list bordered class="q-my-sm">

        <q-item-label header class="header">Friend Requests Sent</q-item-label>
        <q-item clickable v-ripple v-for="rsent in storeMe.friendRequestSent" :key="rsent">
          <q-item-section style="max-width: 50px;">
            <q-avatar class="avatar">
              <img size="20px" :src="`api/avatar/${rsent}/thumbnail`" >
            </q-avatar>
          </q-item-section>
          <q-item-section>
            {{ rsent }}
          </q-item-section>
          <q-item-section side>
            <q-icon name="cancel" color="red" @click="unfollow(rsent)"/>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item-label header class="header">Friend Requests Recevied</q-item-label>
        <q-item clickable v-ripple v-for="rrecv in storeMe.friendRequestRecevied" :key="rrecv">
          <q-item-section style="max-width: 50px;">
            <q-avatar class="avatar">
              <img size="20px" :src="`api/avatar/${rrecv}/thumbnail`" >
            </q-avatar>
          </q-item-section>
          <q-item-section>
            {{ rrecv }}
          </q-item-section>
          <q-item-section side>
            <q-icon name="done" color="green" @click="follow(rrecv)"/>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item-label header class="header">Friends</q-item-label>
        <q-item clickable v-ripple v-for="friend in storeMe.friends" :key="friend">
          <q-item-section style="max-width: 50px;">
            <q-avatar class="avatar">
              <img size="20px" :src="`api/avatar/${friend}/thumbnail`" >
            </q-avatar>
          </q-item-section>
          <q-item-section>
            {{ friend }}
          </q-item-section>
          <q-item-section side>
            <q-icon name="chat_bubble" color="green" />
          </q-item-section>
          <q-item-section side>
            <q-icon name="cancel" color="red" @click="unfollow(friend)"/>
          </q-item-section>
        </q-item>
      </q-list>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import api from 'src/services/api.service'
// import ld from 'lodash'
// import * as models from 'src/services/api.models'
import { useMeStore } from 'src/stores/me';

export default defineComponent({
  name: 'FriendList',
  components: {},
  props: {
  },
  data() {
    return {
      storeMe: useMeStore()
    }
  },
  created () {
    this.storeMe.fetch();
  },
  beforeUpdate () {
    // this.storeMe.fetch();
  },
  methods: {
    follow(username: string) {
      let that = this
      api.follow(username)
      .then(function () { that.storeMe.fetch() })
      .catch(function () {})
    },
    unfollow(username: string) {
      let that = this
      api.unfollow(username)
      .then(function () { that.storeMe.fetch() })
      .catch(function () {})
    },
  },
});
</script>

<style lang="sass" scoped>
.header
  font-size: 16px
  font-weight: bold
  color: orange

.list
  border: 1px solid black
  border-radius: 5px

.avatar
  width: 30px
  height: 30px
  border-radius: 50%
</style>
