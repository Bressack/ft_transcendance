import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { useMainStore } from "src/stores/store";
import { Convert } from "src/stores/store.validation";
import {
  IGameQuery,
  ISearchQuery,
  GameQueryBuilder,
  SearchQueryBuilder,
} from "./api.models";

export default {
  axiosInstance: axios.create({
    baseURL: "/api",
    timeout: 3000,
  }),

  /**
   **   auth
   **/

  async signup(payload: object) {
    return await this.axiosInstance.post("/auth/signup", payload).then((r) => {
      const store = useMainStore();
      store.setStoreData(Convert.toStoreData2(r.data));
      return r.status;
    });
  },
  async login2fa(payload: { code: string; token: string }) {
    return await this.axiosInstance
      .post(
        "/auth/2FA/login",
        { code: payload.code },
        { params: { token: payload.token } }
      )
      .then((r) => {
        const store = useMainStore();
        store.setStoreData(Convert.toStoreData2(r.data));
        return r;
      });
  },

  async fetchMe() {
    const store = useMainStore();
    await this.axiosInstance.get("/users/me").then((r) => {
      store.setStoreData(Convert.toStoreData2(r.data));
    });
  },

  async getAllUsers(): Promise<any> {
    try {
      return await this.axiosInstance.get("/users/allusers");
    } catch (err: any) {
      console.error("[ api service ] getAllUsers:", err);
    }
  },

  async login(payload: object) {
    const store = useMainStore();
    return await this.axiosInstance.post("/auth/login", payload).then((r) => {
      console.log(r);
      store.setStoreData(Convert.toStoreData2(r.data));
      return r;
    });
  },

  async signin42(code: string) {
    const store = useMainStore();
    console.log(code);
    return await this.axiosInstance
      .get(`/auth/42/callback/${code}`)
      .then((r) => {
        console.log("signin42-----");
        console.log(r);
        // store.setStoreData(Convert.toStoreData2(r.data));
        return r;
      });
  },

  //   async logout() {
  //     const response = await this.axiosInstance.get("/auth/logout");
  //     return response.status;
  //   },

  //   async refresh() {
  //     const response = await this.axiosInstance.get("/auth/refresh");
  //     return response.data;
  //   },

  /**
   **   users
   **/

  async me() {
    const store = useMainStore();
    return await this.axiosInstance.get("/users/me").then((r) => {
      store.setStoreData(Convert.toStoreData2(r.data));
      return r.status;
    });
  },

  async user(username: String) {
    // get user object
    const response = await this.axiosInstance.get(`/users/${username}`);
    return response.data;
  },

  async userProfile(username: String) {
    const response = await this.axiosInstance.get(`/users/${username}/profile`);
    return response.data;
  },

  async meGame(query: IGameQuery) {
    const response = await this.axiosInstance.get(
      "/users/me/games" + GameQueryBuilder(query)
    );
    return response.data;
  },

  async userGame(username: String, query: IGameQuery) {
    const response = await this.axiosInstance.get(
      `/users/${username}/games` + GameQueryBuilder(query)
    );
    return response.data;
  },

  async search(query: ISearchQuery) {
    const response = await this.axiosInstance.get(
      "/users/search" + SearchQueryBuilder(query)
    );
    //console.log(response.data);
    return response.data;
  },

  async unfollow(username: String) {
    const response = await this.axiosInstance.patch(
      `/users/${username}/unfollow`
    );
    //console.log(response);
    return response;
  },

  async follow(username: String) {
    const response = await this.axiosInstance.patch(
      `/users/${username}/follow`
    );
    //console.log(response);
    return response;
  },

  async block(username: String) {
    const response = await this.axiosInstance.patch(`/users/${username}/block`);
    //console.log(response);
    return response;
  },

  async avatar(username: String) {
    const response = await this.axiosInstance.get(`/avatar/${username}/medium`);
    return response.data;
  },

  async changeUsername(username: String) {
    const store = useMainStore();
    return await this.axiosInstance
      .patch("/users/username", {
        username: username,
      })
      .then((r) => {
        store.setStoreData(Convert.toStoreData2(r.data));
        return r.status;
      });
  },

  async createChannel(payload: object) {
    const response = await this.axiosInstance.post("/chat/channel", payload);
    return response.data;
  },

  async channelSettings(channelId: string, payload: object) {
    const response = await this.axiosInstance.patch(
      `/chat/${channelId}/settings`,
      payload
    );
    return response.data;
  },

  async leaveChannel(channelId: string) {
    const response = await this.axiosInstance.delete(`/chat/${channelId}`);
    return response.data;
  },

  /**
   **   general
   **/

  async delete(target: string) {
    const response = await this.axiosInstance.delete(target);
    return response;
  },

  async patch(target: string) {
    const response = await this.axiosInstance.patch(target);
    return response;
  },

  async games() {
    const response = await this.axiosInstance.get("/games/running");
    return response;
  },

  async users() {
    const response = await this.axiosInstance.get("/users");
    return response;
  },

  async setState(channelId: string, username: string, payload: any) {
    const response = await this.axiosInstance.post(
      `/chat/${channelId}/${username}/state`,
      payload
    );
    return response;
  },

  async resetState(channelId: string, username: string) {
    const response = await this.axiosInstance.get(
      `/chat/${channelId}/${username}/state/reset`
    );
    return response;
  },

  logIt(message: string): void {
    let stack = new Error().stack as string;
    let caller = stack
      .split("\n")[2]
      .trim()
      .split("?")[0]
      .split("/")
      .slice(-1)[0] as any;
    let lines = (stack.split("\n")[2].trim().split(":").slice(-1)[0] +
      ":" +
      stack.split("\n")[2].trim().split(":").slice(-2)[0]) as any;
    console.log(
      "[ DEBUG MESSAGE ] " + caller + " at " + lines + ": " + message
    );
  },

  /**
   **   chat
   **/

  async joinChannel(channelId: string, password: string): Promise<void> {
    const store = useMainStore();
    if (!password) password = "";
    try {
      await this.axiosInstance
        .post(`/chat/${channelId}/join`, {
          password: password,
          socketId: useMainStore().socketId,
        })
        .then((response) => {
          store.updateChannelSubscription(response.data);
        });
    } catch (err: any) {
      throw err;
    }
  },

  async leavehttpChannel(): Promise<void> {
    try {
      await this.axiosInstance.patch(`/chat/leave`, {
        socketId: useMainStore().socketId,
      });
    } catch (err: any) {
      throw err;
    }
  },

  async sendMessage(
    channelId: string,
    password: string,
    text: string,
    socketId: string
  ): Promise<void> {
    if (!password) password = "";
    return await this.axiosInstance.post(`/chat/${channelId}/message`, {
      content: text,
      password,
      socketId,
    });
  },
};
