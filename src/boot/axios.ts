import { useMeStore } from './../stores/me';
import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import WsService from 'src/services/ws.service';
import API from 'src/services/api.service';
import { useChatSocketStore } from 'src/stores/chatSocket';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $ws: typeof ws;
    $api: typeof api;
    $storeChat: any;
    $storeMe: any;
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
declare module 'vue' {
  interface ComponentCustomProperties {
    $ws: typeof ws
    $api: typeof api
    $storeChat: any
    $storeMe: any
  }
}
export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  // app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
  app.config.globalProperties.$ws = ws;
  app.config.globalProperties.$api = api;
  app.config.globalProperties.$storeChat = useChatSocketStore();
  app.config.globalProperties.$storeMe = useMeStore();
});

// export { api };
