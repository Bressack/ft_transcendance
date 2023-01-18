import { defineStore } from 'pinia';
import io from 'socket.io-client';
import {
  IWSMessages,
  IWSError,
  IWSInfos,
} from 'src/models/messages.ws';
import ws from 'src/services/ws.service';

export const useChatSocketStore = defineStore('chatSocket', {
  state: () => ({
    init           : false as boolean,
    socket         : {} as ws,
    messages       : [] as Array<IWSMessages>,
    currentChannel : '' as string
  }),

  getters: {
  },

  actions: {
    joinRoom(channelId: string) {
      if (this.init == false)
        throw new Error("socket not initialized");

      if (this.currentChannel !== '')
        this.leaveCurrentRoom()
      this.currentChannel = channelId;
      this.socket.emitcb('join-channel', { channelId: channelId }, (res: any) => {
        console.log('join-channel success');
        this.messages = res.data.messages
      }, (err: any) => {
        console.log('join-channel failed:', err);
      })
    },
    leaveCurrentRoom() {
      if (this.init == false)
        throw new Error("socket not initialized");

      this.socket.emit('leave room', { channelId: this.currentChannel });
      this.currentChannel = '';
    },
    sendMessage(message: string) {
      if (this.init == false)
        throw new Error("socket not initialized");

      let payload = {
        channelId: this.currentChannel,
        timestamp: new Date(),
        content: message
      }
      this.socket.emit('new message', payload);
    },
    init_socket(socket: ws) {
      this.socket = socket
      this.init = true

      this.socket.listen('message', ((payload: IWSMessages) => {
        this.messages.push(payload) // TODO wait the good type, here the type is wrong
      }));
      this.socket.listen('error', ((payload: IWSError) => {
        console.log('ws error:', payload)
      }));
      this.socket.listen('infos', ((payload: IWSInfos) => {
        console.log('ws infos:', payload)
      }));
    },
  }
});
