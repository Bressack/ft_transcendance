import { useMeStore } from './../stores/me';
import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import WsService from 'src/services/ws.service';
import API from 'src/services/api.service';
import nc from 'src/services/notifyCenter';
import { useChatStore } from 'src/stores/chat';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $ws: typeof ws;
    $api: typeof api;
    $notifyCenter: typeof notifyCenter;
    $storeChat:  ReturnType<typeof useChatStore>;
    $storeMe:  ReturnType<typeof useMeStore>;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// const api = axios.create({ baseURL: 'https://api.example.com' });
const api = API
const ws = new WsService();
const notifyCenter = nc
const storeChat :  ReturnType<typeof useChatStore> = useChatStore();
const storeMe :  ReturnType<typeof useMeStore> = useMeStore();
declare module 'vue' {
  interface ComponentCustomProperties {
    $ws: typeof ws
    $api: typeof api
    $notifyCenter: typeof notifyCenter
    $storeChat:  ReturnType<typeof useChatStore>
    $storeMe:  ReturnType<typeof useMeStore>
  }
}
export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  // app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
  app.config.globalProperties.$ws = ws;
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$notifyCenter = notifyCenter;
  app.config.globalProperties.$storeChat = storeChat
  app.config.globalProperties.$storeMe = storeMe;
});

