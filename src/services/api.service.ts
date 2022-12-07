
import axios from 'axios'

import {
  IGameQuery,
  ISearchQuery,

  GameQueryBuilder,
  SearchQueryBuilder,
} from './api.models'


export default {
  axiosInstance: axios.create({
    // withCredentials: true,
    baseURL: '/api',
  }),

  /**
   **   auth
   **/

  async signup(payload: object) {
    const response = await this.axiosInstance.post('/auth/signup', payload)
    return response.status
  },

  async login(payload: object) {
    const response = await this.axiosInstance.post('/auth/login', payload)
    return response.status
  },

  async logout() {
    const response = await this.axiosInstance.get('/auth/logout')
    return response.status
  },

  async refresh() {
    const response = await this.axiosInstance.get('/auth/refresh')
    return response.data
  },

  async ping() {
    const response = await this.axiosInstance.get('/auth')
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    sleep(1000).then()
    return response.status
  },


  /**
   **   users
   **/

  async me() {
    const response = await this.axiosInstance.get('/users/me')
    return response.data
  },

  async userProfile(username: String) {
    const response = await this.axiosInstance.get(`/users/${username}/profile`)
    return response.data
  },

  async meGame(query: IGameQuery) {
    const response = await this.axiosInstance.get('/users/me/games' + GameQueryBuilder(query))
    return response.data
  },

  async userGame(username: String, query: IGameQuery) {
    const response = await this.axiosInstance.get(`/users/${username}/games` + GameQueryBuilder(query))
    return response.data
  },

  async search(query: ISearchQuery) {
    const response = await this.axiosInstance.get('/users/search' + SearchQueryBuilder(query))
    console.log(response.data);
    return response.data
  },


}
