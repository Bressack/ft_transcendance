<template>
  <q-page>
    <div class="q-flex">
      <ChatUsersList/>
      <div class="row">
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
import { defineComponent, computed } from 'vue';
import CreateChannel from 'src/components/CreateChannel.vue'
import Message from './components/Message.vue'
import ChatUsersList from './components/ChatUsersList.vue'

export default defineComponent({
  name: 'Conversation',
  components: { Message, CreateChannel, ChatUsersList },
  props: {
  },
  data() {
    return {
      subs: computed(() => this.$storeChat.SubscribedUsers),
      notif1: false as boolean,
      notif2: false as boolean,
      dialog: false as boolean
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
      return `/api/avatar/${username}/thumbnail`
    },
    async scrollBottom() {
      const element: any = this.$refs.chatList // récupérer l'élément de liste de messages en utilisant ref
      while (element?.children?.length != this.$storeChat.messages.length)
        await new Promise(r => setTimeout(r, 10));
      element.scrollTop = element.scrollHeight // fait dessendre le scroll tout en bas de la page
    },
    debug () {
      console.log('ICI', this.$storeChat)
    }
  },
  computed: {
    margin_input() {
      if (this.$storeMe.drawerStatus)
        return "300px"
      return "0px"
    }
  },
  async beforeMount() {
    console.log('beforeMount');
    await this.$storeChat.join(this.$route.path.split('/').slice(-1)[0], this.scrollBottom)
    console.log('FINI ICI');

  },
  async beforeUpdate() {
    console.log('beforeUpdate');
    await this.$storeChat.join(this.$route.path.split('/').slice(-1)[0], this.scrollBottom)
  },
  async beforeUnmount() {
    await this.$storeChat.leave()
  }
});
</script>

<style lang="sass" scoped>
.image
  width: 42px
  height: 42px
  border-radius: 250px

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
  font-size: 17px
  word-break: break-word

.menuusers
  height: 500px
  display: flexbox
  justify-content: space-between

.q-bg
  background-color: $bg-primary !important

.card
  background-color: #424242
  color: orange
  border-radius: 10px
  padding: 5px 15px
  margin-right: 5px
  margin-top: 0


.userlist
  height: 100%

.slider
  width: 100px

.role
  min-width: 80px

.avatar
  max-width: 42px !important
  // margin-top: 10px
  margin-left: 10px
  margin-right: 10px

.loginstatus
  width: 15px
  height: 15px
  border-radius: 100px
  position: absolute
  margin-top: 27px
  margin-left: 27px

.ONLINE-status
  background-color: green
.OFFLINE-status
  background-color: #707070
</style>
