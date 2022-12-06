import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: 0
  }),

  getters: {
    doubleCount (state) {
      return state.user * 2;
    }
  },

  actions: {
    increment () {
      this.user++;
    }
  }
});
