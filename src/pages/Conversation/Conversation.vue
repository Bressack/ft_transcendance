<template>
  <q-page>
    <div class="q-flex">
      <div class="top-panel row items-center">
        <span class="titlename">@{{ $storeChat.name }}</span>

        <q-btn flat @click="minidrawerStatus = !minidrawerStatus" round dense icon="menu" class="justify-right">
          <q-menu persistent class="menuusers">
            <q-list v-for="user in $storeChat.SubscribedUsers" :key="user.username" class="userlist">
              <div style="display: none">{{ user.mute = true }}{{ user.ban = true }}</div>
              <q-item tag="label" class="q-bg">
                <q-item-section side class="card">
                  <q-item-label class="menuusers-username">{{ user.username }}</q-item-label>
                </q-item-section>
                <q-item-section side class="card">
                  <q-item-label>Role</q-item-label>
                  <q-item-label>{{ user.role }}</q-item-label>
                </q-item-section>
                <q-item-section side class="card">
                  <q-toggle label="MUTE" dense color="purple" v-model="user.mute" />
                  <q-toggle label="BAN" dense color="blue" v-model="user.ban" />
                </q-item-section>
              </q-item>

            </q-list>
          </q-menu>
        </q-btn>

      </div>
      <div class="row">
        <div ref="chatList" class="list_messages">
          <Message v-for="message in messages" :key="message.id" :username=message?.username
            :avatar=avatarstr(message?.username) :content=message?.content :timestamp="new Date(message?.CreatedAt)" />
        </div>
      </div>
      <q-input @keydown.enter.prevent="sendmessage" filled v-model="$storeChat.text" placeholder="Enter text here"
        class="absolute-bottom custom-input input" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import UserCard from 'src/components/common/UserCard.vue'
import Message from './components/Message.vue'
// import { useChatSocketStore } from 'src/stores/chatSocket';
import { useMeStore } from 'src/stores/me';

import {
  IWSMessages,
  IWSError,
  IWSInfos,
} from 'src/models/messages.ws';

export default defineComponent({
  name: 'Conversation',
  components: { UserCard, Message },
  props: {
  },
  data() {
    return {
      // text: '',
      // storeChat: useChatSocketStore(),
      storeMe: useMeStore(),
      messages: [] as Array<IWSMessages>,
      minidrawerStatus: false as boolean,
      notif1: false as boolean,
      notif2: false as boolean,
    }
  },
  methods: {
    sendmessage() {
      this.$storeChat.sendMessage()
    },
    goProfilPage(user: string) {
      this.$router.push({
        path: `/profile/${user}`
      })
    },
    avatarstr(username: string) {
      return `/api/avatar/${username}/medium`
    },
    async scrollBottom(messages: Array<IWSMessages>, toclean: boolean = false) {
      if (toclean)
        this.messages = []
      this.messages = this.messages.concat(messages)
      this.messages.sort((a: IWSMessages, b: IWSMessages) => {
        return a.CreatedAt > b.CreatedAt ? 1 : -1
      })
      const element: any = this.$refs.chatList // récupérer l'élément de liste de messages en utilisant ref

      // while (element.children.length != this.$storeChat.messages.length)
      while (element.children.length != this.messages.length)
        await new Promise(r => setTimeout(r, 10));
      element.scrollTop = element.scrollHeight // fait dessendre le scroll tout en bas de la page
    }
  },
  computed: {
    margin_input() {
      if (this.storeMe.drawerStatus)
        return "300px"
      return "0px"
    }
  },
  beforeMount() {
    console.log('beforeMount');

    console.log(this.$storeChat);
    this.$storeChat.joinRoom(this.$route.path.split('/').slice(-1)[0], this.scrollBottom)
  },
  beforeUpdate() {
    console.log('beforeUpdate');

    this.$storeChat.joinRoom(this.$route.path.split('/').slice(-1)[0], this.scrollBottom)
  },
  beforeUnmount() {
    this.$storeChat.leaveCurrentRoom()
  }
});
</script>

<style lang="sass" scoped>
.top-panel
  display: flexbox
  justify-content: space-between
  height: 50px
  padding: 10px 0px 10px 10px
  background-color: #303030
  width: 100%

.titlename
  font-size: 20px
  font-weight: bold
  color: white

.list_messages
  overflow: auto
  height: calc(100vh - (90px + 50px + 50px))
  padding: 1vh
  // max-width: calc(100vw - v-bind(margin_input))
  word-break: break-word

.input
  height: 50px
  background-color: #555555
  position: fixed
  margin-left: v-bind(margin_input)

.menuusers-username
  width: 200px

.menuusers
  height: 500px
  display: flexbox
  justify-content: space-between

.q-bg
  background-color: #303030 !important

.card
  background-color: #424242
  color: orange
  border-radius: 10px
  padding: 5px 15px
  margin-right: 5px
  margin-top: 0

.userlist
  height: 100%
</style>
