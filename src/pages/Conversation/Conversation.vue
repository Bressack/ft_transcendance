<template>
  <q-page>
    <q-scroll-area ref="ScrollDown" style="height: 88vh; max-width: 100vw;">
      <q-list bordered class="messagelist">
        <!-- <Message v-for="item in messagesList" :key="item.id" :message="item" class="messagecomp" /> -->
        <!-- @click=goProfilPage(message?.identity.name) -->
        <UserCard
          v-for="message in messagesListC" :key="message.id"
          :name=message?.identity.name
          :avatar=message?.identity.avatar
          :content=message?.body
          :timestamp=message?.timestamp
          size="small"
          class="messagecomp"
        />
      </q-list>
    </q-scroll-area>
    <q-input filled v-model="text" placeholder="Enter text here" class="absolute-bottom input"/>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IMessageList, IUserBasicInfo, IMessage } from '../../models/models';
import { fake_IMessageList } from '../../models/fakedatas';
import {
  IWSMessages,
  IWSError,
  IWSInfos,
} from '../../models/messages.ws';
// import Message from '../components/Conversation/Message.vue';
import UserCard from '../../components/common/UserCard.vue'
// import ws from 'src/services/ws.service';


export default defineComponent({
  name: 'Conversation',
  components: { UserCard },
  props: {
  },
  data() {
    return {
      messagesList: [],
      text: '',
      $refs : undefined as any
    }
  },
  updated() {
    // this.messagesList = fake_IMessageList(20);
  },
  mounted () {
    this.$refs.ScrollDown.setScrollPosition('vertical', this.$refs.ScrollDown.getScroll().verticalSize)
  },
  methods: {
    goProfilPage(user: string) {
      this.$router.push({
        path: `/profile/${user}`
      })
    }
  },
  beforeMount() {

  },
  // ici tu get le channel id from le path de l'url dans un
  computed: {
    messagesListC() : IMessageList {
      return this.messagesList.sort((a: IMessage, b: IMessage) => {
        return a.timestamp > b.timestamp ? -1 : 1
      })
    }
  },
  beforeCreate() {
    const channelID = this.$route.path.split('/').slice(-1)[0]

    const res = this.$ws.emit('join-channel', { channelId: channelID }) as any;

    this.messagesList = res.data.messages

    this.$ws.listen('message', ((payload: IWSMessages) => {
      this.messagesList.push()
    }));
    this.$ws.listen('error', ((payload: IWSError) => {
      console.log('ws error:', payload)
    }));
    this.$ws.listen('infos', ((payload: IWSInfos) => {
      console.log('ws infos:', payload)
    }));
  }
});
</script>

<style lang="sass">
.messagelist
  width: 100% !important

.messagecomp
  margin-bottom: 1vh

.input
  // padding-left: 15% !important
  // margin: 15px
  // border-radius: 20px
  > div
    background-color: #555555
</style>
