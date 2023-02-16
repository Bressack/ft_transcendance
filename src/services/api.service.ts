import axios from "axios";

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
    const response = await this.axiosInstance.post("/auth/signup", payload);
    return response.status;
  },

  async login(payload: object) {
    const response = await this.axiosInstance.post("/auth/login", payload);
    return response.status;
  },

  async logout() {
    const response = await this.axiosInstance.get("/auth/logout");
    return response.status;
  },

  async refresh() {
    const response = await this.axiosInstance.get("/auth/refresh");
    return response.data;
  },

  // async ping() {
  //   const response = await this.axiosInstance.get('/auth')
  //   const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  //   sleep(1000).then()
  //   return response.status
  // },

  /**
   **   users
   **/

  async me() {
    const response = await this.axiosInstance.get("/users/me");
    return response.data;
  },

  async user(username: String) { // get user object
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
    console.log(response.data);
    return response.data;
  },

  async unfollow(username: String) {
    const response = await this.axiosInstance.patch(
      `/users/${username}/unfollow`
    );
    console.log(response);
    return response;
  },

  async follow(username: String) {
    const response = await this.axiosInstance.patch(
      `/users/${username}/follow`
    );
    console.log(response);
    return response;
  },

  async block(username: String) {
    const response = await this.axiosInstance.patch(
      `/users/${username}/block`
    );
    console.log(response);
    return response;
  },

  async auth() {
    const response = await this.axiosInstance.get("auth");
    return response;
  },

  async avatar(username: String) {
    const response = await this.axiosInstance.get(`/avatar/${username}/medium`);
    return response.data;
  },

  async changeUsername(username: String) {
    const response = await this.axiosInstance.patch('/users/username', { username: username });
    return response.data;
  },

  async createChannel(payload: object) {
    const response = await this.axiosInstance.post('/chat/channel', payload)
    return response.data
  },

  async channelSettings(channelId: string, payload: object) {
    const response = await this.axiosInstance.patch(`/chat/${channelId}/settings`, payload)
    return response.data
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

  async post(target: string) {
    const response = await this.axiosInstance.post(target);
    return response;
  },

  async games() {
    const response = await this.axiosInstance.get('/games/running')
    return response;
  },

  async users() {
    const response = await this.axiosInstance.get('/users')
    return (response)
  },

  async setState(channelId: string, username: string, payload: any) {
    const response = await this.axiosInstance.post(`/chat/${channelId}/${username}/state`, payload)
    return response;
  },

  async resetState(channelId: string, username: string) {
    const response = await this.axiosInstance.get(`/chat/${channelId}/${username}/state/reset`)
    return response;
  },

  logIt(message: string) {
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

  async joinChannel(channelId: string, password: string) {
    try {
      const response = await this.axiosInstance.patch(`/chat/${channelId}/join`, {
        password: password
      })
      return response;
    } catch(err: any) {
      throw err
    }
  },

  async leaveChannel(channelId: string) {
    try
    {
      const response = await this.axiosInstance.patch(`/chat/${channelId}/leave`)
      return response;
    } catch(err: any) {
      throw err
    }
  },

  async sendMessage(channelId: string, password: string, text: string) {
    try {
      const response = await this.axiosInstance.post(`/chat/${channelId}/sendmessage`, {
        channelId: channelId,
        timestamp: new Date(),
        content: text,
        password: password,
      })
      return response;
    } catch(err: any) {
      throw err
    }
  },

};

