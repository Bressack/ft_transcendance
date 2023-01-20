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
    currentChannel : '' as string,
    password       : '' as string,
    name           : '' as string,
  }),

  getters: {
  },

  actions: {
    joinRoom(channelId: string, password: string, onFinishCallback: Function) {
      if (this.init == false)
        return

      if (this.currentChannel !== '')
        this.leaveCurrentRoom()
      this.currentChannel = channelId;
      this.socket.emitcb('join-channel', { channelId: channelId, password: this.password }, (res: any) => {
        console.log('join-channel success');
        if (res.data.channel_type == 'ONE_TO_ONE')
          this.name = res.data.name
        else
          this.name = res.data.name
        this.messages = res.data.messages
        this.messages.sort((a: IWSMessages, b: IWSMessages) => {
          return a.CreatedAt > b.CreatedAt ? 1 : -1
        })
        onFinishCallback()
      }, (err: any) => {
        console.log('join-channel failed:', err);
      })
    },
    leaveCurrentRoom() {
      if (this.init == false || this.currentChannel === '')
        return

      this.socket.emit('leave-channel', { channelId: this.currentChannel })
      this.currentChannel = '';
      this.messages = []
    },
    sendMessage(message: string) {
      console.log('[ send message ] start');

      if (this.init == false || this.currentChannel === '')
        return

      console.log('[ send message ] checks passed');
      let payload = {
        channelId: this.currentChannel,
        timestamp: new Date(),
        content: message,
        password: this.password
      }
      this.socket.emit('new message', payload);
      console.log('[ send message ] emit done');
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
