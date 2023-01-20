<template>
  <q-page>
    <div>
      <div class="titlename">
        @{{ storeChat.name }}
      </div>
      <div ref="chatList" class="list_messages">
        <Message
          v-for="message in storeChat.messages" :key="message.id"
          :username=message?.username
          :avatar=avatarstr(message?.username)
          :content=message?.content
          :timestamp="new Date(message?.CreatedAt)"
          />
          <!-- :avatar=storeMe.getAvatar(message?.username).avatar -->
      </div>
      <q-input @keydown.enter.prevent="sendmessage" filled v-model="text" placeholder="Enter text here" class="absolute-bottom input"/>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import UserCard from 'src/components/common/UserCard.vue'
import Message from './components/Message.vue'
import { useChatSocketStore } from 'src/stores/chatSocket';
import { useMeStore } from 'src/stores/me';

export default defineComponent({
  name: 'Conversation',
  components: { UserCard, Message },
  props: {
  },
  data() {
    return {
      text: '',
      storeChat: useChatSocketStore(),
      storeMe: useMeStore(),
    }
  },
  methods: {
    sendmessage() {
      this.storeChat.sendMessage(this.text)
    },
    goProfilPage(user: string) {
      this.$router.push({
        path: `/profile/${user}`
      })
    },
    avatarstr(username: string) {
      return `/api/avatar/${username}/medium`
    },
    async scrollBottom() {
      const element: any = this.$refs.chatList // récupérer l'élément de liste de messages en utilisant ref
      console.log(this.storeChat.messages.length);

      while (element.children.length != this.storeChat.messages.length)
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
    this.storeChat.joinRoom(this.$route.path.split('/').slice(-1)[0], this.password, this.scrollBottom)
  },
  beforeUpdate() {
    this.storeChat.joinRoom(this.$route.path.split('/').slice(-1)[0], this.password, this.scrollBottom)
  },
  beforeUnmount() {
    this.storeChat.leaveCurrentRoom()
  }
});
</script>

<style lang="sass" scoped>
.titlename
  height: 50px
  padding: 10px 0px 10px 10px
  font-size: 20px
  font-weight: bold
  color: white
  background-color: #303030
  width: 100%

.list_messages
  overflow: scroll
  height: calc(100vh - (90px + 50px + 50px))
  padding: 1vh
  // max-width: calc(100vw - v-bind(margin_input))
  word-break: break-word

.messagecomp
  margin-bottom: 1vh

.input
  height: 50px
  background-color: #555555
  position: fixed
  margin-left: v-bind(margin_input)

.scrollmessage
  height: calc(100% - 50px)
  margin-bottom: 50px
  // background-color: $bg-secondary
</style>
