<template>
  <div>
    <div class="q-pa-md">
      <q-form class="q-pa-md search" style="max-width: 300px" @submit="search()">
        <q-input v-model="searchInput" label="Standard" @update:model-value="search()"/>
        <q-btn dense flat icon="search" @click="search()"/>
        <q-list class="q-py-md">
          <q-item v-ripple v-for="item in searchResult?.result" :key="item">
            <q-item-section>
              <q-item-label>
                {{ item?.username }}
              </q-item-label>
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

export default defineComponent({
  name: 'SearchUser',
  components: {},
  props: {},
  data() {
    return {
      searchInput: ref(''),
      searchResult: [] as Array<any>,
    }
  },
  methods: {
    search() {
      if (this.searchInput.length == 0)
      {
        this.searchResult = []
        return ;
      }
      let that = this
      const searchQuery : ISearchQuery = { key: this.searchInput }
      api.search(searchQuery)
      .then(function(result) {
        that.searchResult = result
      })
      .catch(function(error) {})
    }
  },
});
</script>

<style lang="sass" scoped>
.search
  border: 1px solid black
  border-radius: 10px
</style>
