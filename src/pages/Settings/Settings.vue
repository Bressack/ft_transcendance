<!-- https://codepen.io/profsoft/pen/ZZxeLy -->
<!-- PATH /api/users/2FA?toggle=true -->

<template>
<q-page>
  <q-item class="q-px-xl r-py-md">
    <q-item-section>
      <q-item-label class="label bigger">Profile settings</q-item-label>
      <q-item-label class="label">{{profile.username}}</q-item-label>
    </q-item-section>
  </q-item>
    <q-item class="q-px-xl r-py-md">
      <q-uploader
        auto-upload
        hide-upload-btn
        class="uploader"
        label="Change avatar"
        url="/api/avatar/"
        field-name="avatar"
        color="black"
        @added="add"
        @rejected="onRejected"
      >
      <template v-slot:list="scope">
          <img class="avatar" :src=avatar>
      </template>
    </q-uploader>
  </q-item>
  <q-item class="q-px-xl">
    <q-btn
      color="white"
      label="Remove Avatar"
      flat
      icon="delete"
      @click="removeAvatar()"
    />
  </q-item>
</q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import api from '../../services/api.service'

export default defineComponent({
  name: 'Settings',
  data () {
      return {
          profile : [] as any,
          avatar : '' as string
      }
  },
  created () {
    this.fetchMe()
  },
  methods: {
    fetchMe() {
      let that = this
      api.me()
      .then(function(result) {
        that.profile = result
        that.avatar = `/api/avatar/${result.username}/medium`
      })
      .catch(function(error) {
          console.error('error:', error);
      })
    },
    removeAvatar () {
      api.delete('avatar')
    },
    add (file : readonly any []) {
      this.avatar = file[0].__img.src
    },
    onRejected (files : any) {
      this.$q.notify('Some other message')
    }
  }
})
</script>

<style lang="sass">
.scroll
  overflow: hidden
</style>

<style lang="sass" scoped>
@use "../../css/interpolate" as r

.avatar
  object-fit: cover
  @include r.interpolate((width, height), 320px, 2560px, 200px, 300px)

.uploader
  @include r.interpolate((width, height), 320px, 2560px, 220px, 350px)


</style>
