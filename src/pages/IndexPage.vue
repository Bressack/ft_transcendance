<template>
  <q-page>
    <!-- <q-img src="src/assets/pong_wallpaper.png"/> -->
    <div class="q-pa-md">
      <q-form class="q-pa-md search" style="max-width: 300px" @submit="search()">
        <q-input v-model="searchInput" label="Standard" />
        <q-btn dense flat icon="search" @click="search()"/>
        <q-list class="q-py-md">
          <q-item v-ripple v-for="item in searchResult?.result" :key="item">
            <q-item-section avatar>
              <q-item-label>
                {{ item?.username }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-form>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import api from 'src/services/api.service'
import { ISearchQuery } from 'src/services/api.models'

export default defineComponent({
  name: 'Index',
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
      let that = this
      const searchQuery : ISearchQuery = {
        key: this.searchInput,
      }
      console.log(searchQuery);

      api.search(searchQuery)
      .then(function(result) {
        console.log('result:',result);
        that.searchResult = result
      })
      .catch(function(error) {
        console.log('error:',error);

      })
    }
  },
});
</script>

<style lang="sass" scoped>
.search
  border: 1px solid black
  border-radius: 10px
</style>
