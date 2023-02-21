import { io } from "socket.io-client";
import { Cookies } from "quasar";
import { useChatStore } from "src/stores/chat";

var that: any = null;

class WsService {
  public socket: any;
  storeChat: any;
  constructor() {
    this.storeChat = useChatStore();
  }
  get connected(): boolean {
    return this.socket && this.socket.connected;
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
    this.socket?.on(eventType, callback);
  }

  removeListener(eventType: string) {
    this.socket?.removeAllListeners(eventType);
  }
  private async __init() {
    const socket = io(`/`, {
      auth: (cb) => {
        cb({ token: this.getToken() });
      },
      transports: ["websocket"],
      path: "/api/ws",
    });
    const connection = new Promise((resolve, reject) => {
      const connectionTimeOut = setTimeout(() => {
        reject(new Error("WsService Connection timeout"));
      }, 3000);
      socket.once("connect", () => {
        console.log("WsService CONNECTED");
        clearTimeout(connectionTimeOut);
        resolve(socket);
      });
      socket.connect();
    });
    return connection;
  }
  // should only be called once access token has been received after initial REST request
  async connect() {
    // if (!this.socket)
    //   this.socket = io(`/?token=${this.getToken()}`, {
    //     auth: (cb) => {
    //       cb({ token: this.getToken() });
    //     },
    //     transports: ["websocket"],
    //     path: "/api/ws",
    //   }).connect();
    // else this.socket.connect();
    this.socket = await this.__init(); //.catch((err) => {});
    this.socket?.on("disconnect", (e: any) => {
      console.warn("WsService DISCONNECTED", e);
    });
  }

  setupDefaultListeners() {}

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      console.log("Socket disconnected"); // should invalidate certain routes and what not, like the chat and games
    }
  }
}

export default WsService;
