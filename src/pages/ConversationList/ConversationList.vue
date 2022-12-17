<template>
  <!-- <div class=""> -->
    <!-- TODO penser à une reel solution de scroll pour la liste -->
    <!-- <q-scroll-area :visible="true" style="height: 88vh; max-width: 15vw;"> -->
      <q-list bordered class="list">

        <q-form class="q-pa-sm" style="max-width: 300px" @submit="search()">

          <q-item>
            <q-item-section>
              <q-input v-model="searchInput" label="Search User by name" @update:model-value="search()" />
            </q-item-section>
            <q-item-section style="max-width: 30px" v-if="searchInput.length" @click="clearInput">
              <q-btn dense flat color="red" icon="cancel" @click="search()" />
            </q-item-section>
            <q-item-section style="max-width: 10px">
              <q-btn dense flat color="cyan" icon="search" @click="search()" />
            </q-item-section>
          </q-item>

          <q-list class="q-py-md overall" v-if="searchResult?.result?.length">
            <q-item v-ripple v-for="item in searchResult?.result" :key="item.username">
              <q-item-section style="max-width: 50px;">
                <q-avatar class="avatar">
                  <img size="20px" :src="`api/avatar/${item?.username}/thumbnail`" >
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ item?.username }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="add" color="green" @click="follow(item?.username)" />
              </q-item-section>
            </q-item>
          </q-list>

        </q-form>

        <q-expansion-item
          icon="perm_identity"
          label="Friend Requests Recevied"
          header-class="text-orange"
        >
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
        </q-expansion-item>
        <q-separator />

        <q-expansion-item
          icon="perm_identity"
          label="Friend Requests Sent"
          header-class="text-orange"
        >
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
        </q-expansion-item>

        <q-separator />

        <q-item-label header class="header">Friends</q-item-label>
        <q-item clickable v-ripple v-for="friend in storeMe.friends" :key="friend" class="unfollow" >
          <q-item-section style="max-width: 50px;" @click="userSelected(friend)">
            <q-avatar class="avatar">
              <img size="20px" :src="`api/avatar/${friend}/thumbnail`" >
            </q-avatar>
          </q-item-section>
          <q-item-section @click="userSelected(friend)">
            {{ friend }}
          </q-item-section>
          <q-item-section side class="toto">
            <q-icon name="cancel" color="red" @click="unfollow(friend)"/>
          </q-item-section>
        </q-item>
      </q-list>
    <!-- </q-scroll-area> -->
  <!-- </div> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IConvList, IConvItem, Scope } from '../../models/models';
import UserCard from '../../components/common/UserCard.vue'
import { fake_IConvList } from '../../models/fakedatas'
import api from 'src/services/api.service'
import { ISearchQuery } from 'src/services/api.models'
import { useMeStore } from 'src/stores/me';

interface IResult {
  total: number,
  result: Array<IUserName>
}

interface IUserName {
  username: String
}

interface IUserSelected {
  user: String
}

export default defineComponent({
  name: 'ConversationList',
  components: { UserCard },
  props: {},
  data() {
    return {
      storeMe: useMeStore(),
      conversationList : fake_IConvList(15) as IConvList,
      searchInput: '',
      searchResult: {} as IResult,
    }
  },
  methods: {
    clearInput() {
      this.searchInput = ''
      this.searchResult = {} as IResult
    },
    search() {
      if (this.searchInput.length == 0) {
        this.searchResult = {} as IResult
        return;
      }
      let that = this
      const searchQuery: ISearchQuery = { key: this.searchInput }
      api.search(searchQuery)
        .then(function (result) {
          that.searchResult = result
        })
        .catch(function (error) { })
    },
    isPrivate(item: IConvItem) {
      return item.scope == Scope.PRIVATE
    },
    userSelected(name: String) {
      let query = { user: name } as IUserSelected
      this.$router.push({
        path: '/conversation',
        query: query
      })
    },
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
.item
  background-color: $bg-secondary
  // margin-bottom: 2px
  width: 100%
  height: 1em

.list
  background-color: $bg-secondary !important
  width: 100%

.header
  font-size: 16px
  font-weight: bold
  color: orange

// .list
//   border: 1px solid black
//   border-radius: 5px

.avatar
  width: 30px
  height: 30px
  border-radius: 50%

.unfollow .toto
  visibility: hidden

.unfollow:hover .toto
  visibility: visible

.overall
  z-index: 2
</style>
