import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    options: [] as Array<Object>
  }),

  getters: {},

  actions: {
    getGame(gameId: string) {
      return this.options.find((e: any) => {e.gameId == gameId})
    },
    setOption(gameId: string, option: Object) {
      const found : any = this.options.find((e: any) => {e.gameId == gameId})
      if (found)
        found.option = option
      else {
        this.options.push({
          gameId: gameId,
          options: option
        })
      }
    }
  }
});
