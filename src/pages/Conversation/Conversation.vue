<template> <!-- hide-scrollbar -->
  <q-page>
    <div class="q-flex">

      <ChatUsersList v-if="$store.current_channel_state === 'ACTIVE'" @lockChannel="lockChannel" />

      <div class="row chatListContainer">
		<div v-if="$store.current_channel_state === 'LOADING'" class="loadingState">Loading...</div>
		<div v-if="$store.current_channel_state === 'ERROR'">Error</div>
        <div v-if="$store.current_channel_state === 'ACTIVE'" ref="chatList" class="list_messages">
          <Message v-for="message in $store.messages" :key="message.id" :username=message.username
            :avatar=avatarstr(message.username) :content=message.content :timestamp="new Date(message.CreatedAt) as Date" />
        </div>
      </div>

      <q-input @keydown.enter.prevent="sendmessage" filled v-model="text" placeholder="Enter text here"
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
import { ChanState } from 'src/stores/store.types';

export default defineComponent({
  name: 'Conversation',
  components: { ChatUsersList, Message },
//   beforeRouteEnter (to, from) {
// 	console.log('Conversation beforeRouteEnter', to, from);
	
// 		const channelId: string = to.params.channelId as string;
// 		if (this.$store.isSubscribedToChannel(channelId) && to.params.channelId !== from.params.channelId) {
// 			this.$store.setCurrentChannel(channelId);
// 			this.getDatas();
// 			return true
// 		}
// 		return false
//   },
  beforeRouteUpdate(to, from) {
	console.log('beforeRouteUpdate', to, from);
	const channelId : string = to.params.channelId as string;
    if (this.$store.isSubscribedToChannel(channelId) && to.params.channelId !== from.params.channelId) {
		this.$store.setCurrentChannel(channelId);
		this.$store.current_channel_state = ChanState.LOADING
		this.getDatas();
		return true
	}
	return false
	// this.$store.setScrollBack(async () => {
    //   const element: any = this.$refs.chatList // récupérer l'élément de liste de messages en utilisant ref
    //   while (element?.children?.length != this.$store.messagesCount)
    //     await new Promise(r => setTimeout(r, 10));
    //   element.scrollTop = element.scrollHeight // fait dessendre le scroll tout en bas de la page
    // })
  },
  data() {
    return {
      text: ref(''),
    }
  },
  methods: {

    async lockChannel() {
      await this.$api.leavehttpChannel()
      this.$router.push({ path: `/` })
    },

    sendmessage() {
      if (this.text == '')
        return
      this.$api.sendMessage(this.$store.active_channel, this.$store.channelPassword, this.text)
      this.text = ''
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
      while (element?.children?.length != this.$store.messagesCount)
        await new Promise(r => setTimeout(r, 10));
      element.scrollTop = element.scrollHeight // fait dessendre le scroll tout en bas de la page
    },

    getDatas() {
    //   const channelId = this.$route.path.split('/').slice(-1)[0]
    //   if (this.$store.isSubscribedToChannel(channelId))
    //       this.$store.setCurrentChannel(channelId);
      this.$api
      .joinChannel(this.$store.active_channel, this.$store.channelPassword)
      .then(() => {
		this.$store.current_channel_state = ChanState.ACTIVE
        this.scrollBottom()
      })
      .catch(err => {
        // mot de passe incorrect
        // non connecte en socket
        // que t'es ban
        // tout le reste ERROR
      })
    }
  },
  computed: {
    margin_input() {
      if (this.$store.drawerStatus)
        return "300px"
      return "0px"
    },
  },
  mounted() {
    this.$ws.listen("message", () => {
      this.scrollBottom()
      this.$store.message_received = false;
    });
    this.getDatas()

  },
  beforeUpdate() {
    this.getDatas()
  },
  async beforeUnmount() {
    await this.$api.leavehttpChannel()
	this.$store.setCurrentChannel("")
  }
});
</script>

<style lang="sass" scoped>
@use "../../css/interpolate" as r
.list_messages
  overflow: auto
  height: calc(100vh - (90px + 50px + 70px))
  padding: 1vh
  word-break: break-word
  width: 100%

.input
  height: 50px
  background-color: #555555
  position: fixed
  margin-left: v-bind(margin_input)

.loadingState
  color: black
  opacity: 0.2
  font-family: 'Press Start 2P'
  font-weight: bold
  @include r.interpolate(font-size, 320px, 2560px, 10px, 40px)
  position: absolute
  left:50%
  top:50%
  transform: translate(-50%, -50%)

</style>
