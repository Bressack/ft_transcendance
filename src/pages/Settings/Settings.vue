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
    <q-item class="box q-px-xl r-py-md">
      <q-item-section>
        <q-uploader
          class="responsive-uploader"
          label="Change avatar"
          url="/api/avatar/"
          field-name="avatar"
          color="black"
          @rejected="onRejected"
        />
      </q-item-section>
      <q-item-section>
        <q-btn
          size="14px"
          color="white"
          label="Remove Avatar"
          flat
          dense
          round
          icon="delete"
          @click="removeAvatar()"
        />
    </q-item-section>
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
      })
      .catch(function(error) {
          console.error('error:', error);
      })
    },
    removeAvatar () {
      api.delete('avatar')
    },
    add (file : readonly any []) {
      console.log(file[0].__img.src)
      this.avatar = file[0].__img.src
    },
    rem (files : object) {
      console.log(files)
    },
    onRejected (files : any) {
      this.$q.notify('Some other message')
    }
  }
})
</script>

<style lang="sass" scoped>
@use "../../css/interpolate" as r

.uploader
  max-width: 250px

.box
    display: flex
    flex-wrap: wrap
.box>*
    flex: 1 1 120px

</style>
