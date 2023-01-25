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
          <img v-if="avatar" class="avatar" :src=avatar>
          <q-inner-loading v-else
            :showing=true
            label="Please wait..." />
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
    <q-btn color="orange" label="Close" v-close-popup/>
  </q-item>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { QRejectedEntry } from 'quasar'
// import api from '../services/api.service'

interface UploadObject {
  files: readonly any []
}

export default defineComponent({
  name: 'Settings',
  data () {
      return {
        profile : [] as any,
        avatar : '' as string,
        twoFA : false as Boolean,
        refresh : 0 as number,
        $refs : undefined as any,
      }
  },
  created () {
    this.fetchMe()
  },
  methods: {
    fetchMe() {
      this.$api.me()
      .then((result) => {
        this.profile = result
        this.avatar = `/api/avatar/${result.username}/large?refresh?refresh=${this.refresh++}`
        this.twoFA = result.TwoFA
      })
      .catch((error) => {
          console.error('error:', error);
      })
    },
    removeAvatar () {
      this.$api.delete('avatar')
      .then((res) => {
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
          message: 'This file has already been downloaded'
        })
      }
    },
    onUpdate (value : any, evt : Event) {
      this.$api.patch(`/users/2FA?toggle=${value}`)
    }
  }
})
</script>

<style lang="sass">
.q-uploader__list
  padding: 0px
  overflow: hidden
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
  min-height: 240px
  max-height: 100%
</style>
