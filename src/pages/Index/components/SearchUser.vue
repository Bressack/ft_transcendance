<template>
  <div class="q-pa-md">
    <div class="q-pa-md list" style="max-width: 350px">

      <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title>Search user</q-toolbar-title>
      </q-toolbar>

      <q-form class="q-pa-md" style="max-width: 300px" @submit="search()">

        <q-item>
          <q-item-section>
            <q-input v-model="searchInput" label="User name" @update:model-value="search()" />
          </q-item-section>
          <q-item-section style="max-width: 30px" v-if="searchInput.length" @click="clearInput">
            <q-btn dense flat color="red" icon="cancel" @click="search()" />
          </q-item-section>
          <q-item-section style="max-width: 10px">
            <q-btn dense flat color="cyan" icon="search" @click="search()" />
          </q-item-section>
        </q-item>
        <q-list class="q-py-md">
          <q-item v-ripple v-for="item in searchResult?.result" :key="item">
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from 'src/services/api.service'
import { ISearchQuery } from 'src/services/api.models'
import { useMeStore } from 'src/stores/me';

export default defineComponent({
  name: 'SearchUser',
  components: {},
  props: {},
  data() {
    return {
      storeMe: useMeStore(),
      searchInput: '',
      searchResult: [] as Array<any>,
    }
  },
  methods: {
    clearInput() {
      this.searchInput = ''
      this.searchResult = []
    },
    follow(username: string) {
      let that = this
      api.follow(username)
      .then(function () { that.storeMe.fetch() })
      .catch(function () {})
    },
    search() {
      if (this.searchInput.length == 0) {
        this.searchResult = []
        return;
      }
      let that = this
      const searchQuery: ISearchQuery = { key: this.searchInput }
      api.search(searchQuery)
        .then(function (result) {
          that.searchResult = result
        })
        .catch(function (error) { })
    }
  },
});
</script>

<style lang="sass" scoped>
.list
  border: 1px solid black
  border-radius: 5px

.avatar
  width: 30px
  height: 30px
  border-radius: 50%
</style>
