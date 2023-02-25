<template> <!-- hide-scrollbar -->
  <q-page>
    <div class="q-flex">
	
      <ChatUsersList  @lockChannel="lockChannel" />
					<q-virtual-scroll v-if="$store.messagesCount" class="list_messages" 
							component="q-list"
							separator
							:items="$store.messages"
							ref="chatScroll"
							v-slot="{ index, item }">
						<!-- <transition appear enter-active-class="animated fadeIn"> -->
							<q-chat-message
								:key="index"
								:avatar=avatarstr(item.username)
								:text="[item.content]"
								:stamp="getRelativeDate(new Date(item.CreatedAt))"
								:sent="item.username === $store.username"
								:bg-color="item.username === $store.username ? 'secondary' : 'blue-grey-11'"
								>
								<template v-slot:name>
									<span class="linkMessageProfile" @click="goProfilPage(item.username)">{{ item.username === $store.username ? 'me' : item.username }}</span>
								</template>
							</q-chat-message>

					  	<!-- </transition> -->
					</q-virtual-scroll>
					<div v-else>
						<transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
							 <div  class="loadingState">No messages</div>
						 </transition>
					</div>
	  <div v-if="$store.currentChannelSubState === 'BANNED'">
			<transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
			<div class="loadingState">Banned !</div>
			</transition>
	  </div>
      <div v-else-if="$store.current_channel_state === 'ACTIVE'" class="row q-pa-md justify-center" style="padding-top: 0px; padding-right: 0px; bottom:auto;">

      </div>
	<div v-else-if="$store.current_channel_state === 'LOADING'">
	 	  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
		  	<div class="loadingState">Loading...</div>
		  </transition>
	</div>
	<div v-else-if="$store.current_channel_state === 'ERROR'">
	 	  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
		  	<div class="loadingState">Error</div>
		  </transition>
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
		this.$store.current_channel_state = ChanState.LOADING

    if (this.$store.isSubscribedToChannel(channelId) && to.params.channelId !== from.params.channelId) {
		this.$store.setCurrentChannel(channelId);
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
	scrollBottom() {
		const scrollArea : any = this.$refs.chatScroll;
		const scrollTarget = scrollArea.getScrollTarget();
		const duration = 0; // ms - use 0 to instant scroll
		scrollArea.setScrollPosition(scrollTarget.scrollHeight, duration);
	},
    async scrollBottom2() {
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
		setTimeout(()=> {
			this.$store.current_channel_state = ChanState.ACTIVE
					setTimeout(() => {
							this.scrollBottom()
						}, 300)
		},300)
      })
      .catch(err => {
        // mot de passe incorrect
        // non connecte en socket
        // que t'es ban
        // tout le reste ERROR
      })
    },
	    getRelativeDate(cdate: Date): string {
			function floorStr(n: number) {
				return (n < 10 ? '0' : '') + n
			}

			const now = new Date()

			if (now.getDate() - cdate.getDate() == 0)
				return 'Today at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
			else if (now.getDate() - cdate.getDate() == 1)
				return 'Yesterday at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
			else if (now.getDate() - cdate.getDate() == -1)
				return 'Tomorrow at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
			else {
				const d = cdate.getDate()
				const m = (cdate.getMonth() + 1)
				return floorStr(d) + '/'
					+ floorStr(m) + '/'
					+ cdate.getFullYear() + ' '
					+ floorStr(cdate.getHours()) + ':'
					+ floorStr(cdate.getMinutes())
			}
		},
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
  },
  
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
  color: #8E8E8E
  font-family: 'Press Start 2P'
  font-weight: bold
  @include r.interpolate(font-size, 320px, 2560px, 10px, 40px)
  position: absolute
  left:50%
  top:50%
  transform: translate(-50%, -50%)

.q-message-sent
  color: #aeaeae !important
.q-message-received
  color: #aeaeae !important

.linkMessageProfile:hover
  cursor: pointer
  text-decoration: underline 
</style>
