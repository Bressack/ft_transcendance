import { defineStore } from 'pinia';
import io from 'socket.io-client';

const ws_endpoint = 'ws://localhost:3000'

export const useChatSocketStore = defineStore('chatSocket', {
  state: () => ({
    socket: io(ws_endpoint) as any,
    rooms: [] as string[],
    messages: {} as { [key: string]: string[] },
    currentRoom: '' as string,
    currentMessage: '' as string,
  }),

  getters: {
  },

  actions: {
    joinRoom(room: string) {
      this.currentRoom = room;
      this.socket.emit('join room', room);
    },
    leaveRoom(room: string) {
      this.socket.emit('leave room', room);
      this.currentRoom = '';
    },
    sendMessage() {
      this.socket.emit('new message', this.currentRoom, this.currentMessage);
      this.currentMessage = '';
    },
    init_socket() {
      this.socket.on('rooms', (rooms: string[]) => {
        this.rooms = rooms;
      });

      this.socket.on('new message', (room: string, message: string) => {
        if (room === this.currentRoom) {
          if (this.messages[room] == undefined)
            this.messages[room] = [];
          this.messages[room].push(message);
        }
      });
    }
  }
});
