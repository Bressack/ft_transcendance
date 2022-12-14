<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="toolbar">

        <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
        <q-toolbar-title>
          <!-- <span class="q-pr-lg">PONG ARENA</span> -->
          <q-btn class="q-mr-sm" @click="logout()" color="red">LOGOUT</q-btn>
          <q-btn class="q-mr-sm" to="/login"       color="blue">Login</q-btn>
          <q-btn class="q-mr-sm" to="/"            color="orange">Home</q-btn>
          <q-btn class="q-mr-sm" to="/usercard"    color="green">UserCardTest</q-btn>
          <q-btn class="q-mr-sm" to="/feeddb"      color="green">Auto Feed Database</q-btn>
          <q-btn class="q-mr-sm" to="/profile/me"  color="green">Profile</q-btn>
          <q-btn class="q-mr-sm" to="/settings"    color="green">Settings</q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="drawer"
        show-if-above
        :breakpoint="500"
        :width="300"
      >
        <q-scroll-area class="scroll">
          <ConversationList/>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 90px">
          <UserCard
            v-if="(me?.username)"
            @click="goProfilPage()"
            class="absolute-top"
            :name="me?.username"
            avatar="api/avatar/me/medium"
            icon="settings"
            size="large"
            nameColor="orange"
            :ratio="0.42"
            :onlineStatus="me?.onlineStatus"
          />
        </q-img>
      </q-drawer>
    <q-page-container class="q-mt-md">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ConversationList from '../pages/ConversationList/ConversationList.vue'
import UserCard from '../components/common/UserCard.vue'
import { IUserBasicInfo, OnlineStatus } from '../models/models'
// import { randomDate } from '../models/fakedatas'
import api from 'src/services/api.service'

let _me = {
  name: 'tharchen',
  avatar: 'https://cdn.intra.42.fr/users/d1ae701a3af5f3dd3070d5c8406e77fe/tharchen.jpg',
  onlineStatus: OnlineStatus.ONLINE,
} as IUserBasicInfo

export default defineComponent({
  name: 'MainLayout',
  components: {
    ConversationList,
    UserCard
  },
  props: {},

  data() {
    return {
      drawer: ref(false),
      me: ref(undefined),
    }
  },

  methods: {
    goProfilPage() {
      this.$router.push({
        path: '/profile/me',
      })
    },
    logout() {
      let that = this
      api.logout()
      .then(function (status) {
        that.$router.push('/login')
      })
    },
  },

  beforeCreate () {
    api.ping()
  },

  created () {
    let that = this
    api.me()
    .then(function (me) {
      that.me = me
    })
    .catch(function () {})
  },

});
</script>

<style lang="sass">
body
  background-color: $bg-primary !important
  color: grey
</style>

<style lang="sass" scoped>
.toolbar
  height: 90px
  background-color: $bg-secondary !important
  color: grey

.scroll
  height: calc(100% - 90px)
  margin-top: 90px
  background-color: $bg-secondary
</style>
