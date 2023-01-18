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
    async joinRoom(channelId: string) {
      if (this.init == false)
        return

      if (this.currentChannel !== '')
        await this.leaveCurrentRoom()
      this.currentChannel = channelId;
      this.socket.emitcb('join-channel', { channelId: channelId }, (res: any) => {
        console.log('join-channel success');
        this.messages = res.data.messages
      }, (err: any) => {
        console.log('join-channel failed:', err);
      })
    },
    async leaveCurrentRoom() {
      if (this.init == false || this.currentChannel === '')
        return

      this.socket.emitcb('leave-channel', { channelId: this.currentChannel }, (res: any) => {

      }, (err: any) => {})
      this.currentChannel = '';
    },
    sendMessage(message: string) {
      if (this.init == false || this.currentChannel === '')
        return

      let payload = {
        channelId: this.currentChannel,
        timestamp: new Date(),
        content: message
      }
      this.socket.emit('new message', payload);
    },
    init_socket(socket: ws) { // used in MainLayout in created()
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
