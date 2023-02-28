<template><!-- hide-scrollbar -->
  <q-page class="q-flex">
    <div class="row">
      <div class="conv">

        <ChatUsersList @lockChannel="lockChannel" />

        <div v-show="
          $store.current_channel_state === 'ACTIVE' &&
          $store.currentChannelSub.state !== 'BANNED'
        " class="row q-pa-md justify-center" style="padding-top: 0px; padding-right: 0px; bottom: auto">
          <q-scroll-area id="virtScroll" class="list_messages">
            <q-virtual-scroll component="q-list" :items="$store.messages" ref="chatVirtualScroll"
              scroll-target="#virtScroll > .scroll" virtual-scroll-item-size="80" virtual-scroll-slice-size="12"
              virtual-scroll-slice="15">
              <template #default="{ item, index }">
                <q-chat-message class="chat-message" :key="index" :avatar="avatarstr(item.username)" :text="[item.content]"
                  :stamp="getRelativeDate(new Date(item.CreatedAt))" :sent="item.username === $store.username" :bg-color="
                    item.username === $store.username
                    ? 'warning'
                    : 'info'
                  ">
                  <template v-slot:name>
                    <span class="linkMessageProfile" @click="goProfilPage(item.username)">{{
                      item.username === $store.username ? "me" : item.username
                    }}</span>
                  </template>
                </q-chat-message>
              </template>
              <template #after>
                <div :key="$store.messagesCount">
                  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <div v-show="!$store.messagesCount" class="loadingState">
                      No messages
                    </div>
                  </transition>
                </div>
              </template>
            </q-virtual-scroll>
          </q-scroll-area>
        </div>
        <div v-if="
          $store.current_channel_state === 'LOADING' &&
          $store.currentChannelSub.state !== 'BANNED'
        ">
          <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="loadingState">Loading...</div>
          </transition>
        </div>
        <div v-else-if="
          $store.current_channel_state === 'ERROR' &&
          $store.currentChannelSub.state !== 'BANNED'
        ">
          <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="loadingState">Error</div>
          </transition>
        </div>
        <div v-else-if="$store.currentChannelSub.state === 'BANNED'">
          <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="loadingState" style="text-align: center">
              Banned
              <div style="font-size: small">
                until
                {{
                  getRelativeDate(
                    new Date(
                      $store.currentChannelSub.stateActiveUntil || Date.now()
                    )
                  )
                }}
              </div>
            </div>
          </transition>
        </div>

        <q-input @keydown.enter.prevent="sendmessage" filled v-model="text" placeholder="Enter text here"
          class="absolute-bottom custom-input input" maxlength="128" :loading="$store.current_channel_state === 'LOADING'"
          :disable="
            !($store.current_channel_state === 'ACTIVE') ||
            $store.currentChannelSub.state !== 'OK'
          ">
          <template v-slot:append>
            <q-icon name="send" @click="sendmessage" class="cursor-pointer" />
          </template>
        </q-input>
      </div>
      <div class="userlist hide-scrollbar">
        <q-list>
          <q-item style="font-family: 'Press Start 2P'; font-size: 0.8em;" class="items-center" v-if="userlist_owner?.length">Owner</q-item>
          <UserCard v-for="user of userlist_owner" :key="user.username" :username="user.username" class="text-red text-bold"
              menu_profile menu_block menu_play menu_follow />
          <q-item style="font-family: 'Press Start 2P'; font-size: 0.8em;" class="items-center" v-if="userlist_admins?.length">Admins - {{ userlist_admins?.length }}</q-item>
          <UserCard v-for="user of userlist_admins" :key="user.username" :username="user.username" class="text-warning text-bold"
              menu_profile menu_block menu_play menu_follow />
          <q-item style="font-family: 'Press Start 2P'; font-size: 0.8em;" class="items-center" v-if="userlist_users?.length">Users - {{ userlist_users?.length }}</q-item>
          <UserCard v-for="user of userlist_users" :key="user.username" :username="user.username" class="text-info text-bold"
              menu_profile menu_block menu_play menu_follow />
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
// import CreateChannel from 'src/components/CreateChannel.vue'
import Message from "./components/Message.vue";
import ChatUsersList from "./components/ChatUsersList.vue";
import { ChanState, SubscribedUser, Message as TMessage, Role } from "src/stores/store.types";
import { Convert } from "src/stores/store.validation";
import UserCard from 'src/pages/ConversationList/components/UserCard.vue'

export default defineComponent({
  name: "Conversation",
  components: { ChatUsersList, Message, UserCard },
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
  setup() {
    return {
      // chatVirtualScroll: ref(),
    };
  },
  beforeRouteUpdate(to, from) {
    const channelId: string = to.params.channelId as string;
    this.$store.current_channel_state = ChanState.LOADING;
    (this.$refs["chatVirtualScroll"] as any).reset(0);

    if (
      this.$store.isSubscribedToChannel(channelId) &&
      to.params.channelId !== from.params.channelId
    ) {
      this.$store.setCurrentChannel(channelId);
      this.getDatas();
      return true;
    }
    return false;
  },
  data() {
    return {
      text: ref(""),
    };
  },
  computed: {
    margin_input() {
      if (this.$store.drawerStatus) return "300px";
      return "0px";
    },
    userlist_owner() {
      return this.$store.currentChannelSub.channel.subscribedUsers.filter(user => user.role == Role.OWNER);
    },
    userlist_admins() {
      return this.$store.currentChannelSub.channel.subscribedUsers.filter(user => user.role == Role.ADMIN);
    },
    userlist_users() {
      return this.$store.currentChannelSub.channel.subscribedUsers.filter(user => user.role == Role.USER);
    },
  },

  mounted() {
    this.$ws.listen("message", (payload: any) => {
      // console.log("new message: ", payload);
      const msg: TMessage = Convert.toMessage2(payload as any);
      this.$store.addMessage(msg);
      this.scrollBottom(true);
    });
    this.getDatas();
  },
  beforeUpdate() {
    // this.getDatas()
  },
  async beforeUnmount() {
    await this.$api.leavehttpChannel();
    this.$store.setCurrentChannel("");
  },
  methods: {
    username_color(user: SubscribedUser) {
      switch (user.role) {
        case Role.OWNER: return 'text-red-8'
        case Role.ADMIN: return 'text-orange-3'
        case Role.USER : return 'text-gray-9'
      }
    },
    async lockChannel() {
      await this.$api.leavehttpChannel();
      this.$router.push({ path: `/` });
    },
    sendmessage() {
      if (this.text == "") return;
      this.$api.sendMessage(
        this.$store.active_channel,
        this.$store.channelPassword,
        this.text
      );
      this.text = "";
    },
    goProfilPage(user: string) {
      this.$router.push({
        path: `/profile/${user}`,
      });
    },
    avatarstr(username: string) {
      return `/api/avatar/${username}/thumbnail`;
    },
    scrollBottom(refresh: boolean = false) {
      if (refresh) {
        (this.$refs["chatVirtualScroll"] as any)?.refresh(
          this.$store.messagesCount
        );
      } else {
        (this.$refs["chatVirtualScroll"] as any)?.scrollTo(
          this.$store.messagesCount
        );
      }
    },
    getDatas() {
      // console.log("requests: ", this.$store.pendingRequests);
      return this.$api
        .joinChannel(this.$store.active_channel, this.$store.channelPassword)
        .then(() => {
          this.$store.current_channel_state = ChanState.ACTIVE;
          (this.$refs["chatVirtualScroll"] as any)?.refresh(
            this.$store.messagesCount
          );
        });
    },
    getRelativeDate(cdate: Date): string {
      function floorStr(n: number) {
        return (n < 10 ? "0" : "") + n;
      }
      const now = new Date();
      if (now.getDate() - cdate.getDate() == 0)
        return (
          "Today at " +
          floorStr(cdate.getHours()) +
          ":" +
          floorStr(cdate.getMinutes())
        );
      else if (now.getDate() - cdate.getDate() == 1)
        return (
          "Yesterday at " +
          floorStr(cdate.getHours()) +
          ":" +
          floorStr(cdate.getMinutes())
        );
      else if (now.getDate() - cdate.getDate() == -1)
        return (
          "Tomorrow at " +
          floorStr(cdate.getHours()) +
          ":" +
          floorStr(cdate.getMinutes())
        );
      else {
        const d = cdate.getDate();
        const m = cdate.getMonth() + 1;
        return (
          floorStr(d) +
          "/" +
          floorStr(m) +
          "/" +
          cdate.getFullYear() +
          " " +
          floorStr(cdate.getHours()) +
          ":" +
          floorStr(cdate.getMinutes())
        );
      }
    },
  },
});
</script>

<style lang="sass" scoped>
@use "../../css/interpolate" as r

#virtScroll
  height: calc(100vh - (90px + 50px + 70px))
  width: 100%
  padding: 0px 50px 0px 50px

@media screen and (max-width: 800px)
  #virtScroll
    padding: 0px 15px 0px 15px
@media screen and (min-width: 1200px)
  #virtScroll
    padding: 0px 100px 0px 100px
//   word-break: break-word


.message_element
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

.chat-message
  margin-top: 0px
  margin-bottom: 0px
  padding-bottom: 8px
  min-height: 80px

.userlist
  height: calc(100vh - (92px + 50px))
  overflow: auto
  width: 15vw
  background-color: $bg-secondary

.conv
  width: calc(100% - 15vw)
</style>
