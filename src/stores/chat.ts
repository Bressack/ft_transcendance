import { defineStore } from 'pinia';
import { Channel } from 'src/services/channel'

type notifyMode = 'negative' | 'warning' | 'info' | 'positive'

export const useChatStore = defineStore('chat', {
  state: () => ({
    vue: null as any,
    activeChannelId: '' as string,
    activeChannel: null as Channel | null,
    channels: new Map<string, Channel>() as Map<string, Channel> // keys are channelId
  }),

  getters: {
    channel(state: any) { // return whole channel object
      return state.activeChannel
    },
    channelId(state: any) { // return 'channelId' property of current channel
      return state.activeChannel?.channelId
    },
    name(state: any) { // return 'name' property of current channel
      return state.activeChannel?.name
    },
    channel_type(state: any) { // return 'channel_type' property of current channel
      return state.activeChannel?.channel_type
    },
    state(state: any) { // return 'state' property of current channel
      return state.activeChannel?.state
    },
    stateActiveUntil(state: any) { // return 'stateActiveUntil' property of current channel
      return state.activeChannel?.stateActiveUntil
    },
    messages(state: any) { // return 'messages' property of current channel
      return state.activeChannel?.messages
    },
    role(state: any) { // return 'role' property of current channel
      return state.activeChannel?.role
    },
    SubscribedUsers(state: any) { // return 'SubscribedUsers' property of current channel
      return state.activeChannel?.SubscribedUsers
    },
    username(state: any) { // return 'username' property of current channel
      return state.activeChannel?.username
    },
    password_protected(state: any) { // return 'password_protected' property of current channel
      return state.activeChannel?.password_protected
    },
  },

  actions: {
    init(vue: any) {
      this.vue = vue
    },

    notifyClient(msg: string, mode: notifyMode) : void {
      this.vue.$q.notify({
        type: mode,
        message: msg
      })
    },

    async __getChannelInstance(channelId: string) {
      var channelInstance = null
      try {
        channelInstance = await this.channels.get(channelId)
      } catch (err: any) { throw 'invalid channel id' }
      return channelInstance
    },

    async join(channelId: string, password: string) {
      // check if channel is already known by the map otherwise create a new instance
      var channelInstance = null
      try {
        channelInstance = this.__getChannelInstance(channelId)
        // channel found in map : reusing it
      } catch {
        // channel not found in map : create a new instance
        channelInstance = new Channel(this.vue, channelId, password)
        this.channels.set(channelId, channelInstance)
      }

      // leave active channel if connected
      if (this.activeChannel.isConnected())
      {
        try {
          await this.leave()
        } catch {}
      }

      // join the new channel
      try {
        await channelInstance.join()
        this.activeChannelId = channelId
        this.activeChannel = channelInstance
      } catch (err: any) {
        this.notifyClient(err, 'negative')
        return ;
      }
    },

    async leave(channelId: string = '', notifyOnThrow: boolean = true) {
      // use given channelId or use current channel id otherwise
      if (channelId === '')
        channelId = this.activeChannel;

      // get channel instance from channels map
      // throw if no channel found
      var channelInstance = null
      try {
        channelInstance = this.__getChannelInstance(channelId)
      } catch { return; } // globalement, le user se fou de savoir si le leave a failed, no need to notify them

      // try to leave the channel from the api
      try {
        await channelInstance.leave()
      } catch(err: any) { throw 'unable to leave this channel, have you joined it ?' }

      this.activeChannelId = ''
      this.activeChannel = null
    },

    async sendMessage() {

    },
  }
});
