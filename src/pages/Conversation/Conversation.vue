<template>
  <q-page>
    <div>
      <!-- <q-infinite-scroll reverse class="list_messages"> -->
      <div ref="chatList" class="list_messages">
        <UserCard
          v-for="message in messagesListC" :key="message.id"
          :name=message?.username
          :avatar=avatarstr(message?.username)
          :content=message?.content
          :timestamp="new Date(message?.CreatedAt)"
          size="small"
          class="messagecomp"
        />
      </div>
      <!-- </q-infinite-scroll> -->
      <q-input filled v-model="text" placeholder="Enter text here" class="absolute-bottom input"/>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { fake_IMessageList } from 'src/models/fakedatas';
import {
  IWSMessages,
  IWSError,
  IWSInfos,
} from 'src/models/messages.ws';
// import Message from '../components/Conversation/Message.vue';
import UserCard from 'src/components/common/UserCard.vue'
// import ws from 'src/services/ws.service';

export default defineComponent({
  name: 'Conversation',
  components: { UserCard },
  props: {
  },
  data() {
    const items = ref([ {}, {}, {}, {}, {}, {}, {} ])
    return {
      items,
      onLoad (index: any, done: any) {
        setTimeout(() => {
          done()
        }, 20)
      },
      messagesList: [] as Array<IWSMessages>,
      text: '',
      $refs : undefined as any,
      id: ''
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
    getMessages() {
      const channelID = this.$route.path.split('/').slice(-1)[0]
      this.leaveChannel(this.id)
      this.id = channelID
      this.$ws.emitcb('join-channel', { channelId: channelID }, (res: any) => {
        console.log('join-channel success');
        this.messagesList = res.data.messages
        this.scrollBottom()
      }, (err: any) => {
        console.log('join-channel failed:', err);
      })

      this.$ws.listen('message', ((payload: IWSMessages) => {
        this.messagesList.push()
        this.scrollBottom()
      }));
      this.$ws.listen('error', ((payload: IWSError) => {
        console.log('ws error:', payload)
      }));
      this.$ws.listen('infos', ((payload: IWSInfos) => {
        console.log('ws infos:', payload)
      }));
    },
    leaveChannel(id: string) {
      if (id !== '') {
        this.$ws.emit('leave-channel', { channelId: id });
      }
    },
    sleep(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    async scrollBottom() {
      const element = this.$refs.chatList // récupérer l'élément de liste de messages en utilisant ref
      while (element.children.length != this.messagesList.length)
        await new Promise(r => setTimeout(r, 10));
      element.scrollTop = element.scrollHeight // est censé faire dessendre le scroll tout en bas de la page
    }
  },
  // ici tu get le channel id from le path de l'url dans un
  computed: {
    messagesListC() : Array<IWSMessages> {
      return this.messagesList.sort((a: IWSMessages, b: IWSMessages) => {
        return a.CreatedAt > b.CreatedAt ? 1 : -1
      })
    },
  },
  beforeMount() {
    this.getMessages()
  },
  mounted() {
  },
  beforeUpdate() {
    this.getMessages()
  },
  updated() {
  },
  beforeUnmount() {
    this.leaveChannel(this.id)
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
  margin-left: 300px

.scrollmessage
  height: calc(100% - 50px)
  margin-bottom: 50px
  // background-color: $bg-secondary
</style>
