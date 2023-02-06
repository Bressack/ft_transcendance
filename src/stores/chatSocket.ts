import { defineStore } from 'pinia';
import io from 'socket.io-client';
import {
  IWSMessages,
  IWSError,
  IWSInfos,
} from 'src/models/messages.ws';
import ws from 'src/services/ws.service';

let scrollBack = null

export const useChatSocketStore = defineStore('chatSocket', {
  state: () => ({
    init           : false as boolean,
    socket         : {} as ws,
    currentChannel : '' as string,
    password       : '' as string,
    name           : '' as string,
    text           : '' as string,
    connectedUsers : [] as Array<string> // TODO type
  }),

  getters: {
    getMessage(state: any) {
      return state.messages
    }
  },

  actions: {
    joinRoom(channelId: string, password: string, onFinishCallback: Function) {
      if (this.init == false)
        return

      this.scrollBack = onFinishCallback // oui c'est saaaale, mais ça marche

      if (this.currentChannel !== '')
        this.leaveCurrentRoom()
      this.currentChannel = channelId;
      this.socket.emitcb('join-channel', { channelId: channelId, password: this.password }, (res: any) => {
        if (res.data.channel_type == 'ONE_TO_ONE')
          this.name = res.data.name
        else
          this.name = res.data.name
        this.scrollBack(res.data.messages, true)
      }, (err: any) => {
      })
    },
    leaveCurrentRoom() {
      if (this.init == false || this.currentChannel === '')
        return

      this.socket.emit('leave-channel', { channelId: this.currentChannel })
      this.currentChannel = '';
      this.messages = []
    },
    sendMessage() {
      if (this.init == false || this.currentChannel === '' || this.text.length == 0)
        return

      let payload = {
        channelId: this.currentChannel,
        timestamp: new Date(),
        content: this.text,
        password: this.password
      }
      this.text = ''
      this.socket.emit('message', payload);
    },
    init_socket(socket: ws) { // used in MainLayout in created()

      this.socket = socket
      this.init = true

      this.socket.listen('message', ((payload: IWSMessages) => {
        if (payload.channel_id == this.currentChannel)
          this.scrollBack([payload])
          // this.messages.push(payload) // TODO wait the good type, here the type is wrong
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
