<template> <!-- hide-scrollbar -->
  <q-page>
    <div class="q-flex">

      <ChatUsersList @lockChannel="lockChannel" />

      <div class="row chatListContainer">
        <div ref="chatList" class="list_messages">
          <Message v-for="message in $storeChat.messages" :key="message.id" :username=message?.username
            :avatar=avatarstr(message?.username) :content=message?.content :timestamp="new Date(message?.CreatedAt)" />
        </div>
      </div>

      <q-input @keydown.enter.prevent="sendmessage" filled v-model="$storeChat.text" placeholder="Enter text here"
        class="absolute-bottom custom-input input">
        <template v-slot:append>
          <q-icon name="send" @click="sendmessage" class="cursor-pointer" />
        </template>
      </q-input>

    </div>

  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
// import CreateChannel from 'src/components/CreateChannel.vue'
import Message from './components/Message.vue'
import ChatUsersList from './components/ChatUsersList.vue'

export default defineComponent({
  name: 'Conversation',
  components: { Message, ChatUsersList },
  props: {
  },
  beforeCreate() {
    this.$storeChat.setScrollBack(async () => {
      const element: any = this.$refs.chatList // récupérer l'élément de liste de messages en utilisant ref
      while (element?.children?.length != this.$storeChat.messages.length)
        await new Promise(r => setTimeout(r, 10));
      element.scrollTop = element.scrollHeight // fait dessendre le scroll tout en bas de la page
    })
  },
  data() {
    return {
      subs: computed(() => this.$storeChat.SubscribedUsers),
    }
  },
  methods: {
    async lockChannel() {
      this.$storeChat.channel.checked = false;
      await this.$storeChat.leave()
      this.$router.push({ path: `/` })
    },
    sendmessage() {
      this.$storeChat.sendMessage()
    },
    goProfilPage(user: string) {
      this.$router.push({
        path: `/profile/${user}`
      })
    },
    avatarstr(username: string) {
      return `/api/avatar/${username}/thumbnail`
    },
    async scrollBottom() {
      const element: any = this.$refs.chatList // récupérer l'élément de liste de messages en utilisant ref
      while (element?.children?.length != this.$storeChat.messages.length)
        await new Promise(r => setTimeout(r, 10));
      element.scrollTop = element.scrollHeight // fait dessendre le scroll tout en bas de la page
    },
  },
  computed: {
    margin_input() {
      if (this.$storeMe.drawerStatus)
        return "300px"
      return "0px"
    },
  },
  async mounted() {
    this.scrollBottom()
  },
  async beforeUpdate() {
    await this.$storeChat.join(this.$route.path.split('/').slice(-1)[0])
    this.scrollBottom()
  },
  async beforeUnmount() {
    await this.$storeChat.leave()
  }
});
</script>

<style lang="sass" scoped>

.list_messages
  overflow: auto
  height: calc(100vh - (90px + 50px + 50px))
  padding: 1vh
  word-break: break-word

.input
  height: 50px
  background-color: #555555
  position: fixed
  margin-left: v-bind(margin_input)
</style>
