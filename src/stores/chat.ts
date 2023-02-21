import { defineStore } from "pinia";
import { Channel } from "src/services/channel";
import WsService from "src/services/ws.service";
import notifyCenter, { NotifyOptions } from "src/services/notifyCenter";

import { Subscription } from "src/services/api.models";
import { IWSMessages, IWSError, IWSInfos } from "src/models/messages.ws";

type notifyMode = "negative" | "warning" | "info" | "positive";
let scrollBack: Function | null = null;

export const useChatStore = defineStore("chat", {
  state: () => ({
    // scrollBack: null as Function | null,
    vue: null as any,
    socket: null as WsService | null,
    connectedUsers: [] as Array<string>,
    activeChannel: null as Channel | null,
    channels: new Map<string, Channel>() as Map<string, Channel>, // keys are channelId
    text: "" as string,
  }),

  getters: {
    channel(state: any) {
      return state.activeChannel;
    },
    channelId(state: any) {
      return state.activeChannel?.channelId;
    },
    name(state: any) {
      return state.activeChannel?.name;
    },
    channel_type(state: any) {
      return state.activeChannel?.channel_type;
    },
    state(state: any) {
      return state.activeChannel?.state;
    },
    stateActiveUntil(state: any) {
      return state.activeChannel?.stateActiveUntil;
    },
    messages(state: any) {
      return state.activeChannel?.messages;
    },
    role(state: any) {
      return state.activeChannel?.role;
    },
    SubscribedUsers(state: any) {
      return state.activeChannel?.SubscribedUsers;
    },
    username(state: any) {
      return state.activeChannel?.username;
    },
    password_protected(state: any) {
      return state.activeChannel?.password_protected;
    },
  },

  actions: {

    __notifyClient(msg: string, mode: notifyMode): void {
      notifyCenter.send({ type: mode, message: msg } as NotifyOptions);
    },

    __getChannelInstance(channelId: string) {
      var channelInstance = null;
      try {
        channelInstance = this.channels.get(channelId);
        if (!channelInstance) throw "invalid channel id";
      } catch (err: any) {
        throw "invalid channel id";
      }
      return channelInstance;
    },

    async join(channelId: string) {
      console.log(this.scrollBack)

      //   if (this.socket === null) { throw new Error('You are not connected to WS') }

      // check if channel is already known by the map otherwise create a new instance
      var channelInstance = null;
      try {
        channelInstance = this.__getChannelInstance(channelId);
        // channel found in map : reusing it
      } catch {
        // channel not found in map : create a new instance
        channelInstance = new Channel(channelId);
        this.channels.set(channelId, channelInstance);
      }

      // join the new channel
      try {
        await channelInstance.join();

        // close active channel if connected
        if (this.activeChannel?.isConnected()) this.activeChannel?.close();

        // set active channel
        this.activeChannel = channelInstance;
        this.text = "";

        const b = this.vue.$storeMe.blocking;
        this.messages.filter((msg: IWSMessages) => {
          return !b.includes(msg.username);
        });
        this.messages.sort((a: IWSMessages, b: IWSMessages) => {
          return a.CreatedAt > b.CreatedAt ? 1 : -1;
        });
        // this?.scrollBack();
      }
      catch (err: any) {
        this.__notifyClient(String(err), "negative");
        throw err
      }
    },

    async leave() {
      //   if (this.socket === null) {
      //     throw new Error("You are not connected to WS");
      //   }

      try {
        // try to leave the channel from the api
        try {
          await this.activeChannel?.leave();
        } catch (err: any) {
          throw err;
        }
      } catch {
        // globalement, le user se fou de savoir que le leave a failed
        // no need to notify them
      }
      this.activeChannel = null;
      this.text = "";
    },

    async sendMessage() {
      if (this.text?.length == 0)
        return
      try {
        if (this.socket === null) {
          throw new Error("You are not connected to WS");
        }

        await this.activeChannel?.sendMessage(this.text);
      } catch (err: any) {
        this.__notifyClient(String(err), "negative");
        return;
      }
      this.text = "";
    },

    ///////////////////////////////////////////////

    async initNewChannel(channelId: string, password: string) {
      var channelInstance = null;
      try {
        channelInstance = this.__getChannelInstance(channelId);
        // channel found in map : reusing it
      } catch {
        // channel not found in map : create a new instance
        channelInstance = new Channel(channelId);
        channelInstance.password = password;
        this.channels.set(channelId, channelInstance);
      }
      channelInstance.password = password;
      this.channels.set(channelId, channelInstance);
    },

    setScrollBack(scrollBack: Function) {
      this.scrollBack = scrollBack;
    },

    init(socket: WsService, vue: any) {
      this.vue = vue;
      this.socket = socket;

      this.socket.listen("fetch_me", () => {
        this.vue.$storeMe.fetch();
      });

      this.socket.listen("altered_subscription", (payload: Subscription) => {
        this.SubscribedUsers.set(payload.username, payload);
        if (this.vue.$storeMe.username == payload.username)
          this.vue.$storeMe.fetch();
      });

      this.socket.listen("message", (payload: IWSMessages) => {
        if (payload.channel_id == this.currentChannel) {
          this.messages.push(payload);
          this.messages.sort((a: IWSMessages, b: IWSMessages) => {
            return a.CreatedAt > b.CreatedAt ? 1 : -1;
          });
          this.scrollBack();
        }
      });

      this.socket.listen("error", (payload: IWSError) => {
        console.log("ws error:", payload);
        this.vue.$notifyCenter.send({
          type: "warning",
          message: payload.message,
        });
      });

      this.socket.listen("infos", (payload: IWSInfos) => {
        console.log("ws infos:", payload);
        this.vue.$notifyCenter.send({
          type: "info",
          message: payload.status,
        });
      });
    },
  },
});
