<template>
  <q-page>
    <div>
      <div ref="chatList" class="list_messages">
        <UserCard
          v-for="message in storeChat.messages" :key="message.id"
          :name=message?.username
          :avatar=avatarstr(message?.username)
          :content=message?.content
          :timestamp="new Date(message?.CreatedAt)"
          size="small"
          class="messagecomp"
        />
      </div>
      <q-input filled v-model="text" placeholder="Enter text here" class="absolute-bottom input"/>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import UserCard from 'src/components/common/UserCard.vue'
import { useChatSocketStore } from 'src/stores/chatSocket';
import { useMeStore } from 'src/stores/me';

export default defineComponent({
  name: 'Conversation',
  components: { UserCard },
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
    this.storeChat.joinRoom(this.$route.path.split('/').slice(-1)[0], this.scrollBottom)
  },
  beforeUpdate() {
    this.storeChat.joinRoom(this.$route.path.split('/').slice(-1)[0], this.scrollBottom)
  },
  beforeUnmount() {
    this.storeChat.leaveCurrentRoom()
  }
});
</script>

<style lang="sass" scoped>

.list_messages
  overflow: scroll
  height: calc(100vh - (90px + 50px))
  padding: 1vh

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
