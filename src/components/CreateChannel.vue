<template>
<div class="dialog">
  <div class="close-cross">
    <q-btn class="cross absolute-right" color="orange" icon="close" flat round v-close-popup />
  </div>
  <div class="q-px-xl r-py-md">
    <q-item-label class="bigger">
      Create channel
    </q-item-label>
  </div>
  <!-- <q-option-group inline class="label q-mx-xl" left-label v-model="access" :options="options" color="white" keep-color /> -->
  <q-item>
    <q-input
    v-model="name"
    label="Channel name"
      lazy-rules
      color="orange"
      />
    </q-item>



<q-form class="q-pa-sm" style="max-width: 300px" @submit="search()">

  <q-item>
    <q-item-section>
      <q-input v-model="searchInput" color="orange" label="Search User by name" @update:model-value="search()" />
    </q-item-section>
    <q-item-section style="max-width: 30px" v-if="searchInput.length" @click="clearInput">
      <q-btn dense flat color="red" icon="cancel" @click="search()" />
    </q-item-section>
    <q-item-section style="max-width: 10px">
      <q-btn dense flat color="orange" icon="search" @click="search()" />
    </q-item-section>
  </q-item>

  <q-list class="q-py-md overall" v-if="searchResult?.result?.length">
    <q-item v-ripple v-for="item in searchResult?.result" :key="item.username">
      <q-item-section style="max-width: 50px;">
        <q-avatar class="avatar">
          <img size="20px" :src="`/api/avatar/${item?.username}/thumbnail`">
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>
          {{ item?.username }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-icon name="add" color="green" @click="add(item?.username)"/>
      </q-item-section>
    </q-item>
  </q-list>
</q-form>


    <q-item class="label">
      <!-- <q-checkbox v-model="public" label="public" /> -->
      <q-checkbox v-model="private" color="white" label="Private" />
    </q-item>
    <q-item v-if="private">
      <q-input
      class="input"
      filled
      v-model="password"
      label="Password"
      lazy-rules
      type="password"
    />
  </q-item>
  <q-item class="flex-center">
    <q-btn color="orange" label="Create" @click="create()"/>
  </q-item>
</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ISearchQuery } from 'src/services/api.models'

interface IResult {
	total: number,
	result: Array<IUserName>
}

interface IUserName {
	username: String
}

export default defineComponent({
	name: 'CreateChannel',
  // setup () {
  //   return {
  //     access: ref('public'),
  //     options: [
  //       {
  //         label: 'PUBLIC',
  //         value: 'public'
  //       },
  //       {
  //         label: 'PRIVATE',
  //         value: 'private'
  //       }
  //     ]
  //   }
  // },
  data() {
    return {
      name: '' as string,
      password: '' as string,
      private: false as boolean,
      searchInput: '',
			searchResult: {} as IResult,
      userList: [] as any
    }
  },
  methods: {
		search() {
			if (this.searchInput.length == 0) {
				this.searchResult = {} as IResult
				return;
			}
			let that = this
			const searchQuery: ISearchQuery = { key: this.searchInput }
			this.$api.search(searchQuery)
				.then(function (result) {
					that.searchResult = result
				})
				.catch(function (error) { })
		},
    add (username : string) {
      this.userList.push(username)
    },
    create () {
      console.log(this.userList)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "../css/interpolate" as r

</style>
