
import { defineStore } from 'pinia';
import io from 'socket.io-client';
import {
  User,
  Follows,
  Blocks,
  Message,
  Channel,
  Subscription,
  eSubscriptionState,
  eRole,
  eChannelType,
} from "src/services/api.models";
import {
  IWSMessages,
  IWSError,
  IWSInfos,
  IUserInfos,
  IJoinChannelPayload,
  Message_Aknowledgement_output,
} from "src/models/messages.ws";
import ws from "src/services/ws.service";
import api from "src/services/api.service";
import { useMeStore } from "./me";
import { AxiosError, AxiosResponse } from "axios";

let scrollBack = null;

interface SavedPassword {
  channelId: string,
  password: string
}

export const useChatSocketStore = defineStore('chatSocket', {
  state: () => ({
    vue                : null as any,
    init               : false as boolean,
    socket             : {} as ws,
    currentChannel     : '' as string,
    channelType        : '' as string,
    password           : '' as string,
    savedPasswords     : [] as SavedPassword[],
    role               : '' as string,
    name               : '' as string,
    text               : '' as string,
    messages           : [] as Array<IWSMessages>,
    connectedUsers     : [] as Array<string>,
    SubscribedUsers    : new Map<string, Subscription>() as Map<string, Subscription>,
    password_protected : false as Boolean,
  }),

  getters: {
    getMessage(state: any) {
      return state.messages
    },
    getMessagesToDisplay(state: any) {
      const b = state.vue.$storeMe.getBlocking()
      return state.messages.filter((msg: IWSMessages) => { return !b.includes(msg.username) })
    }
  },

  actions: {
    joinRoom(channelId: string, onFinishCallback: Function) {
      const meStore = useMeStore();
      if (this.init == false) return;

      this.scrollBack = onFinishCallback; // oui c'est saaaale, mais ça marche

      if (this.currentChannel !== "") this.leaveCurrentRoom();
      this.currentChannel = channelId;
      const sub = meStore.channelSubscriptions.find(
        (c) => c.channel.id === channelId
      );
      console.log("channel info:", sub?.channel);
      if (sub?.channel.hash === "yes") {
        while (!this.password)
          this.password = window.prompt("Enter channel password: ");
      }
      api.axiosInstance
        .post("/chat/" + this.currentChannel + "/join", {
          password: this.password,
        })
        .then((res: AxiosResponse<IJoinChannelPayload>) => {
          this.SubscribedUsers = res.data.SubscribedUsers;
          this.channelType = res.data.channel_type;
          this.name = res.data.name;
          this.scrollBack(res.data.messages, true);
          this.role = res.data.role;
          this.password_protected = res.data.password_protected as boolean;
        })
        .catch((err: AxiosError) => {
          this.vue.$q.notify({
            type: "negative",
            message: err.message,
          });
          this.vue.$router.push("/");
        });
      //   this.socket.emitcb(
      // "join-channel",
      // { channelId: channelId, password: this.password },
      // (res: IJoinChannelPayload) => {
      //   console.log("joinroom status", res.status);
      //   this.SubscribedUsers = res.data.SubscribedUsers;
      //   this.channelType = res.data.channel_type;
      //   // if (res.data.channel_type == 'ONE_TO_ONE')
      //   //   this.name = res.data.name
      //   // else
      //   this.name = res.data.name;
      //   this.scrollBack(res.data.messages, true);
      //   this.role = res.data.role;
      //   this.password_protected = res.data.password_protected as boolean;
      // },
      // (err: IWSError) => {
      //   this.vue.$q.notify({
      //     type: "negative",
      //     message: err.message,
      //   });
      //   this.vue.$router.push("/"); // reviens sur la page precedente pour degager le user de la conv ou il est ban
      // THEO -> prcke quand ya eu une erreur et que tu fais ca joinroom n'est pas relance donc ca laisse les meme messages quavant

      //   this.vue.$router.go(-1); // reviens sur la page precedente pour degager le user de la conv ou il est ban
      // }
      //   );
    },
    leaveCurrentRoom() {
      if (this.init == false || this.currentChannel === "")
        return;

      //   this.socket.emit("leave-channel", { channelId: this.currentChannel });
      this.currentChannel = "";
      this.messages = [];
      this.password = "";
      this.SubscribedUsers.clear()
    },
    sendMessage() {
      if (
        this.init == false ||
        this.currentChannel === "" ||
        this.text.length == 0
      )
        return;

      let payload = {
        // channelId: this.currentChannel,
        // timestamp: new Date(),
        content: this.text,
        password: this.password,
      };
      this.text = "";
      api.axiosInstance
        .post("/chat/" + this.currentChannel + "/message", payload)
        .then(() => {})
        .catch((err: AxiosError) => {
          this.vue.$q.notify({
            type: "negative",
            message: err.message,
          });
        });
      //   this.socket.emitcb(
      //     "message",
      //     payload,
      //     (res: Message_Aknowledgement_output) => {},
      //     (err: IWSError) => {
      //       this.vue.$q.notify({
      //         type: "negative",
      //         message: err.message,
      //       });
      //     }
      //   );
    },
    init_socket(socket: ws, vue: any) {
      // used in MainLayout in created()

      this.socket = socket;
      this.init = true;
      this.vue = vue;

      this.socket.listen('fetch_me', ((payload: Subscription) => {
        this.vue.$storeMe.fetch()
      }));
      this.socket.listen('altered_subscription', ((payload: Subscription) => {
        this.SubscribedUsers.set(payload.username, payload)
        console.log('altered_subscription:', payload);
        if (this.vue.$storeMe.username == payload.username)
          this.vue.$storeMe.fetch()
      }));
      this.socket.listen('message', ((payload: IWSMessages) => {
        console.log('ws message:', payload)
        if (payload.channel_id == this.currentChannel)
        {
          this.messages.push(payload)
          this.messages.sort((a: IWSMessages, b: IWSMessages) => {
            return a.CreatedAt > b.CreatedAt ? 1 : -1
          })
          this.scrollBack()
        }
      }));
      this.socket.listen('error', ((payload: IWSError) => {
        console.log('ws error:', payload)
        this.$q.notify({
          type: "warning",
          message: payload.message,
        });
      });
      this.socket.listen("infos", (payload: IWSInfos) => {
        console.log("ws infos:", payload);
        this.$q.notify({
          type: "info",
          message: payload.status,
        });
      });
    },
  },
});


