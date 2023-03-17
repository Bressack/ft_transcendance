<template>
  <!-- hide-scrollbar -->
  <q-page style="overflow-y: hidden; overflow-x: hidden;">
    <div class="q-flex row">
      <div class="nleft-side">
        <ChatUsersList @lockChannel="lockChannel" style="z-index:100;" />

        <div v-show="
          $store.current_channel_state === 'ACTIVE' &&
          $store.currentChannelSub.state !== 'BANNED'
        " class="row q-pa-md justify-center" style="padding-top: 0px; padding-right: 0px; bottom: auto">
          <q-scroll-area id="virtScroll" class="list_messages">
            <q-virtual-scroll component="q-list" :items="$store.messages" ref="chatVirtualScroll"
              scroll-target="#virtScroll > .scroll" virtual-scroll-item-size="80" virtual-scroll-slice-size="12"
              virtual-scroll-slice="15">
              <template #default="{ item, index }">
                <q-chat-message style=" margin-top: 0px; margin-bottom: 0px; padding-bottom: 8px; min-height: 80px; "
                  :key="index" :text="[item.content]"
                  :stamp="$utils.getRelativeDate(new Date(item.CreatedAt))" :sent="item.username === $store.username"
                  :bg-color="
                    item.username === $store.username
                      ? 'secondary'
                      : 'grey-7'
                  ">
                  <template v-slot:name>
                    <span class="linkMessageProfile" @click="goProfilPage(item.username)">{{
                      item.username === $store.username ? "me" : item.username
                    }}</span>
                  </template>
					<template v-slot:avatar >
						<img :src="avatarstr(item.username)" :alt="item.username"
							:class="item.username === $store.username ? 'q-message-avatar q-message-avatar--sent' : 'q-message-avatar q-message-avatar--received'"
							:style="`background-color: ${$utils.usernameToColor(item.username)};`">
						</template>
                </q-chat-message>
              </template>
              <template #after>
                <div :key="$store.messagesCount">
                  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <div v-show="!$store.messagesCount" class="loadingState" style="text-align: center;">
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
            <div class="loadingState loadingStateCorrec">Loading...</div>
          </transition>
        </div>
        <div v-else-if="
          $store.current_channel_state === 'ERROR' &&
          $store.currentChannelSub.state !== 'BANNED'
        ">
          <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="loadingState loadingStateCorrec" style="text-align: center;">
              <span v-if="submit">Error
                <div style="font-size: small">
                  {{ error_message }}
                </div>
              </span>
				<div v-if="error_message === 'wrong password'">
					<q-input dark dense v-model="channel_password" label-color="orange" color="orange"
						hint="Enter Channel Password">
						<template v-slot:after>
							<q-icon name="check" class="cursor-pointer"
								@click="pwdSubmitAndJoin" />
						</template>
					</q-input>
				</div>
			</div>
          </transition>
        </div>
        <div v-else-if="$store.currentChannelSub.state === 'BANNED'">
          <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="loadingState loadingStateCorrec" style="text-align: center">
              Banned
              <div style="font-size: small">
                until
                {{
                  $utils.getRelativeDate(
                    new Date(
                      $store.currentChannelSub.stateActiveUntil || Date.now()
                    )
                  )
                }}
              </div>
            </div>
          </transition>
        </div>
        <q-input @keydown.enter.prevent="sendmessage" filled v-model="text" :placeholder="$store.currentChannelSub.state !== 'OK' ? 'You are Muted !' : 'Enter text here'"
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
      <div class="nright-side">

        <div class="userlist hide-scrollbar">
          <q-list>

            <q-item style="font-family: 'Press Start 2P'; font-size: 0.8em;" class="items-center"
              v-if="userlist_owner?.length">
			  <q-icon color="grey-6" size="25px" style="margin-right:10px;" name="mdi-shield-crown-outline"/>
			  Owner</q-item>
            <UserCard v-for="user of userlist_owner" :key="user.username" :username="user.username"
              class="text-red text-bold" :duration="(user.stateActiveUntil?.toString())" menu_profile menu_block menu_follow
              :banned="user.state == 'BANNED'" :muted="user.state == 'MUTED'" >
            </UserCard>
            <q-item style="font-family: 'Press Start 2P'; font-size: 0.8em;" class="items-center"
			v-if="userlist_admins?.length">
			<q-icon color="grey-6" size="25px" style="margin-right:10px;" name="mdi-shield-sword-outline"/>
			Admins - {{ userlist_admins?.length }}
			</q-item>
            <UserCard v-for="user of userlist_admins" :key="user.username" :username="user.username"
              class="text-warning text-bold" :duration="(user.stateActiveUntil?.toString())" menu_profile menu_block menu_follow
              :banned="user.state == 'BANNED'" :muted="user.state == 'MUTED'" >
            </UserCard>

            <q-item style="font-family: 'Press Start 2P'; font-size: 0.8em;" class="items-center"
              v-if="userlist_users?.length">
			<q-icon color="grey-6" size="25px" style="margin-right:10px;" name="mdi-shield-bug-outline"/>
			Users - {{ userlist_users?.length }}</q-item>
            <UserCard v-for="user of userlist_users" :key="user.username" :username="user.username"
              class="text-info text-bold" :duration="(user.stateActiveUntil?.toString())" menu_profile menu_block menu_follow
              :banned="user.state == 'BANNED'" :muted="user.state == 'MUTED'" >
            </UserCard>

          </q-list>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
// import CreateChannel from 'src/components/CreateChannel.vue'
import ChatUsersList from "./components/ChatUsersList.vue";
import { ChanState, SubscribedUser, Message as TMessage, Role } from "src/stores/store.types";
import UserCard from 'src/pages/ConversationList/components/UserCard.vue'
import { Convert } from "src/stores/store.validation";

export default defineComponent({
  name: "Conversation",
  /// <reference path="" />

  components: { ChatUsersList, UserCard },
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
      error_message: "",
      channel_password: ref(''),
      isPwd: ref(true),
      submit: false as boolean
    };
  },
  computed: {
    margin_input() {
      if (this.$store.drawerStatus) return "300px";
      return "0px";
    },
    userlist_owner() {
      return this.$store.currentChannelSub.channel.subscribedUsers.filter(user => user.role === Role.OWNER);
    },
    userlist_admins() {
      return this.$store.currentChannelSub.channel.subscribedUsers.filter(user => user.role === Role.ADMIN);
    },
    userlist_users() {
      return this.$store.currentChannelSub.channel.subscribedUsers.filter(user => user.role === Role.USER);
    },
  },

  mounted() {

    this.$ws.listen("command_result", (payload: any) => {
      this.$q.notify(payload)
    })
    this.$ws.listen("kick", (payload: any) => {
		if (payload === this.$store.active_channel) {
			console.log("kicked", payload)
			this.$store.channels_passwords.set(this.$store.active_channel, "")
			this.$q.notify({type: "warning", message: "You have been kicked from this channel."});
			this.$router.push("/");
		}
    })

    this.$ws.listen("message", (payload: any) => {
      console.log("new message: ", payload);
      const msg: TMessage = Convert.toMessage2(payload as object);
      this.$store.addMessage(msg);
      this.scrollBottom(true);
    });
    this.getDatas();
  },
  beforeUpdate() {
    this.submit = false
    // this.getDatas()
  },
  async beforeUnmount() {
    if (this.$store.ws_connected)
      await this.$api.leavehttpChannel().catch();
    this.$store.setCurrentChannel("");
    console.log("end message vue")
    this.$ws.removeListener("message");
    this.$ws.removeListener("command_result");
    this.$ws.removeListener("kick");
  },
  methods: {
		pwdSubmitAndJoin() {
			this.$store.current_channel_state = ChanState.LOADING;
      this.submit = true
			return this.$api
				.joinChannel(this.$store.active_channel, this.channel_password)
				.then(() => {
					this.$store.channels_passwords.set(this.$store.active_channel, this.channel_password)
					this.$store.current_channel_state = ChanState.ACTIVE;
					(this.$refs["chatVirtualScroll"] as any)?.refresh(
						this.$store.messagesCount
					);
				}).catch((error) => {
					this.$store.current_channel_state = ChanState.ERROR;
					this.error_message = error.response.data.message[0];
				}).finally(() => {
					this.channel_password = "";
				});
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
        this.text,
        this.$store.socketId || ""
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
		}).catch((error) => {
			this.$store.current_channel_state = ChanState.ERROR;
			this.error_message = error.response.data.message[0];
		});
    },

  },
});
</script>

<style lang="sass" scoped>
@use "../../css/interpolate" as r

#virtScroll
  height: calc(100vh - (90px + 70px + 50px))
  width: 100%
  padding: 0px 35px 0px 35px

@media screen and (max-width: 800px)
  #virtScroll
    padding: 0px 15px 0px 15px

@media screen and (min-width: 1200px)
  #virtScroll
    padding: 0px 60px 0px 60px
//   word-break: break-word


.nleft-side
  width: calc(100% - 250px)
  // @include r.ret_interpolate(width, 320px, 2560px, 200px, 300px)

.nright-side
  width: 250px
  // @include r.interpolate(width, 320px, 2560px, 200px, 300px)

.message_element
  width: 100%

.input
  bottom:0px
  width: calc(100% - 250px)
  height: 50px
  background-color: #555555
  bottom: 0px
  margin:0 0 0 0
  padding:0 0 0 0
//   margin-left: v-bind(margin_input)

.loadingState
  color: #8E8E8E
  font-family: 'Press Start 2P'
  font-weight: bold
  position: absolute
  left: calc(50%)
  top:50%
  transform: translate(-50%, -50%)
  @include r.interpolate(font-size, 320px, 2560px, 10px, 40px)
.loadingStateCorrec
  left: calc(50% - (125px))

.q-message-sent
  color: #aeaeae !important
.q-message-received
  color: #aeaeae !important

.linkMessageProfile:hover
  cursor: pointer
  text-decoration: underline

// .conv
//   width: calc(100% - 20vw)

.userlist
  height: calc(100vh - (90px))
  overflow: auto
  background-color: $bg-secondary
//   width: 20vw
.chat-message
  margin-top: 0px
  margin-bottom: 0px
  padding-bottom: 8px
  min-height: 80px
</style>
