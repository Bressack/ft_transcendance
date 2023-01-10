<template>
<div class="main">
  <q-item class="q-px-xl r-py-md">
    <q-item-section>
      <q-item-label class="bigger">Settings</q-item-label>
    </q-item-section>
  </q-item>
    <q-item class="justify-center centers q-px-xl r-pt-md">
      <q-uploader
        auto-upload
        hide-upload-btn
        max-files=1
        class="uploader"
        ref="uploader"
        label="Change avatar"
        url="/api/avatar/"
        field-name="avatar"
        color="black"
        :filter="imgOnly"
        @uploaded="onUploaded"
        @rejected="onRejected"
      >
      <template v-slot:list="scope">
          <img class="avatar" :src=avatar>
      </template>
    </q-uploader>
  </q-item>
  <q-item class="justify-center centers q-px-xl">
    <q-btn
      color="white"
      label="Remove Avatar"
      flat
      icon="delete"
      @click="removeAvatar()"
    />
  </q-item>
  <q-item class="justify-center centers q-pa-xl">
    <q-toggle @update:model-value="onUpdate" v-model="twoFA">
      <q-item-label class="label">Two factor authentification</q-item-label>
    </q-toggle>
  </q-item>
  <q-item class="justify-center centers bigger q-mb-lg">
    <q-btn class="label" color="orange" label="Close" v-close-popup/>
  </q-item>
</div>
</template>

<script lang="ts">
import { QRejectedEntry } from 'quasar'
import { defineComponent } from 'vue'
import api from '../services/api.service'

interface UploadObject {
  files: readonly any []
}

export default defineComponent({
  name: 'Settings',
  data () {
      return {
        profile : [] as any,
        avatar : '' as string,
        twoFA : false as boolean,
        refresh : 0 as number,
        $refs : undefined as any
      }
  },
  created () {
    this.fetchMe()
  },
  methods: {
    fetchMe() {
      let that = this
      api.me()
      .then((result) => {
        that.profile = result
        that.avatar = `/api/avatar/${result.username}/large?refresh?refresh=${that.refresh++}`
        that.twoFA = result.TwoFA
      })
      .catch((error) => {
          console.error('error:', error);
      })
    },
    removeAvatar () {
      api.delete('avatar')
      .then((res) => {
        console.log(res)
        if (res.data === true) {
            this.$q.notify({
            type: 'warning',
            message: 'Avatar is already set as default'
          })
        }
        else {
          this.$q.notify({
            type: 'positive',
            message: 'Avatar successfully removed'
          })
          this.avatar = `/api/avatar/${this.profile.username}/large?refresh=${this.refresh++}`
        }
        this.$refs.uploader.reset()
      })
    },
    imgOnly (files : readonly any [] | FileList) : readonly any [] {
      if (files[0].type === 'image/png' || files[0].type === 'image/jpg' || files[0].type === 'image/jpeg')
        return (files as readonly any [])
      return ([])
    },
    onUploaded (info : UploadObject) {
      this.$q.notify({
        type: 'positive',
        message: 'Avatar successfully uploaded'
      })
      this.$refs.uploader.removeUploadedFiles()
      this.avatar = `/api/avatar/${this.profile.username}/large?refresh=${this.refresh++}`
    },
    onRejected (rejectedEntries : QRejectedEntry[]) {
      if (rejectedEntries[0].failedPropValidation === 'filter') {
        this.$q.notify({
          type: 'negative',
          message: 'The file should be an image (.jpg, .jpeg or .png)'
        })
      }
      else {
        console.log(rejectedEntries[0])
        this.$q.notify({
          type: 'warning',
          message: 'This file has already been downloaded once'
        })
      }
    },
    onUpdate (value : any, evt : Event) {
      api.patch(`/users/2FA?toggle=${value}`)
    }
  }
})
</script>

<style lang="sass">
.scroll
  overflow: hidden

.q-uploader__list
  padding: 0px
</style>

<style lang="sass" scoped>
.main
  background-color: #696969
  text-align: center
.avatar
  object-fit: cover
  width: 100%
  height: 100%

.uploader
  width: 224px
  miheight: 240px
  max-height: 100%
</style>
