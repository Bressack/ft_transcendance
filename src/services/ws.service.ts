import { io } from "socket.io-client";
import { Cookies } from "quasar";
import { useChatSocketStore } from 'src/stores/chatSocket';

var that: any = null

class WsService {
  socket: any;
  storeChat: any;
  constructor() {
    this.storeChat = useChatSocketStore()
    console.log('debug constru: ', this.storeChat.connectedUsers);
    that = this
  }
  getToken() {
    return Cookies.get("WsAuth");
  }

  emit(eventType: string, payload: object) {
    this.socket.emit(eventType, {
      ...payload,
      auth: { token: this.getToken() },
    });
  }

  emitcb(
    eventType: string,
    payload: object,
    onSuccessCallback: Function,
    onErrorCallback: Function
  ) {
    this.socket.emit(
      eventType,
      { ...payload, auth: { token: this.getToken() } },
      function (response: any) {
        if (response?.status === "error") {
          if (onErrorCallback) return onErrorCallback(response);
          return new Error(response.message);
        } else {
          if (onSuccessCallback) return onSuccessCallback(response);
          return response.data;
        }
      }
    );
  }

  listen(eventType: string, callback: Function) {
    this.socket.on(eventType, callback);
  }

  removeListener(eventType: string) {
    this.socket.removeAllListeners(eventType);
  }

  // should only be called once access token has been received after initial REST request
  connect() {
    if (!this.socket)
      this.socket = io(`/?token=${this.getToken()}`, {
        auth: (cb) => {
          cb({ token: this.getToken() });
        },
        transports: ["websocket"],
        path: "/api/ws",
      }).connect();
    else this.socket.connect();
    return this.setupDefaultListeners();
  }

  setupDefaultListeners() {
    this.listen("user-connected", this.handleUserConnectedEvent);
    this.listen("user-disconnected", this.handleUserDisconnectedEvent);
    // this.socket.on('game-invite', (d: any, callback: any) => {
    // 	console.log('Game invite received', d)
    // 	setTimeout(() => {callback("ACCEPTED")}, 31000)

    // })

    // this.listen('game-invite-canceled', (d: any) => console.log('Game invite canceled', d))

    // this.listen('game-invite-declined', (d: any) => console.log('Game invite declined', d))
    // this.listen('game-start', (d: any) => console.log('Game started', d))

    // this.listen('chat-infos', (data: any) => { console.log( 'chat-info event', data)})
    // this.listen('messages', (data: any) => { console.log( 'error event', data)})
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      console.log("Socket disconnected"); // should invalidate certain routes and what not, like the chat and games
    }
  }

  handleUserConnectedEvent(username: Array<string>) {
    console.log(`${username} connected`); // should update an array of connected users
    username.forEach(user => {
      if (that.storeChat.connectedUsers.includes(user) == false)
        that.storeChat.connectedUsers.push(user);
    })
    // that.storeChat.connectedUsers = that.storeChat.connectedUsers.concat(username)
    console.log('that.storeChat.connectedUsers:', that.storeChat.connectedUsers);
  }
  handleUserDisconnectedEvent(username: string) {
    console.log(`${username} disconnected`); // should update an array of connected users
    that.storeChat.connectedUsers = that.storeChat.connectedUsers.filter((elem: any) => { return elem !== username })
    console.log('that.storeChat.connectedUsers:', that.storeChat.connectedUsers);
  }

  // sendInvite(obj: any) {
  // 	this.emit('invite-to-game', obj);
  // }
}

export default WsService;
