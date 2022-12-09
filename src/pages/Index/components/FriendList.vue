<template>
  <div class="q-pa-md">
    <div class="q-pa-md" style="max-width: 350px" v-if="friends">

      <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title>Contacts</q-toolbar-title>
      </q-toolbar>

      <q-list bordered class="q-my-sm">

        <q-item-label header class="header">Friend Requests Sent</q-item-label>
        <q-item clickable v-ripple v-for="rsent in friendRequestSent" :key="rsent">
          <q-item-section>
            {{ rsent }}
          </q-item-section>
          <q-item-section side>
            <q-icon name="cancel" color="green" />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item-label header class="header">Friend Requests Recevied</q-item-label>
        <q-item clickable v-ripple v-for="rrecv in friendRequestRecevied" :key="rrecv">
          <q-item-section>
            {{ rrecv }}
          </q-item-section>
          <q-item-section side>
            <q-icon name="done" color="green" />
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item-label header class="header">Friends</q-item-label>
        <q-item clickable v-ripple v-for="friend in friends" :key="friend">
          <q-item-section>
            {{ friend }}
          </q-item-section>
          <q-item-section side>
            <q-icon name="chat_bubble" color="green" />
          </q-item-section>
        </q-item>
      </q-list>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'FriendList',
  components: {},
  props: {
    friends: { type: Array<any>, required: true },
    friendRequestSent: { type: Array<any>, required: true },
    friendRequestRecevied: { type: Array<any>, required: true },
  },
  data() {
    return {

    }
  },
  methods: {},
});
</script>

<style lang="sass" scoped>
.header
  font-size: 16px
  font-weight: bold
  color: orange
</style>
