<template>
	<router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Cookies } from 'quasar'
import { useMeStore } from 'src/stores/me';
import { useChatSocketStore } from 'src/stores/chatSocket';
import {
  NavigationGuardNext,
  RouteLocationNormalized,
} from "vue-router";

// import api from './services/api.service'
// import wsService from './services/ws.service';

export default defineComponent({
name: 'App',
data() {
  return {
    storeMe: useMeStore(),
    storeChat: useChatSocketStore(),
  }
},
methods: {
  initSystem() {
    // Navigation Guard
    this.$router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      if (!Cookies.get("has_refresh") && to.path !== "/login" && from.path !== "/login")
        next('/login')
      else if (to.path === '/login' && Cookies.get("has_refresh")) {
        this.$q.notify({
          type: 'warning',
          message: 'You are already connected'
        })
        next('/')
      }
      else
        next()
    })

    // Auth interceptor
    this.$api.axiosInstance.interceptors.request.use(async (req) => {
      if (req.url !== '/auth/login' && req.url !== '/auth/signup' && req.url !== '/auth/logout' && !Cookies.get('has_access') && Cookies.get('has_refresh')) {
        return await fetch('/api/auth/refresh')
          .then(() => req)
          .catch((err) => {
            this.disconnect()
            throw new Error(err)
          })
      }
      else if (req.url !== '/auth/login' && req.url !== '/auth/signup' && req.url !== '/auth/logout' && !Cookies.get('has_access') && !Cookies.get('has_refresh')) {
        this.disconnect()
        throw new Error()
      }
      else if (req.url === '/auth/logout')
      {
        if (!Cookies.get('has_access') && Cookies.get('has_refresh')){
          return await fetch('/api/auth/refresh')
          .then(() => req)
          .catch(async (err) => {
            return await fetch('/api/auth/clear-cookies').then(() => {
              throw new Error(err)
            })
          })
        }
        else if (Cookies.get('has_access') && Cookies.get('has_refresh')) {
          return req
        }
        else if (Cookies.get('has_access') && !Cookies.get('has_refresh')) {
          throw new Error()
        }
        else {
          return await fetch('/api/auth/clear-cookies').then(() => {
            throw new Error()
          })
        }
      }
      return req;
    })

    this.$api.axiosInstance.interceptors.response.use((resp) => {
      if (resp.status === 205)
        this.storeMe.fetch()
      return resp
    }, undefined)
  },
  disconnect () {
    this.$router.push('/login')
    this.$ws.disconnect()
    this.storeMe.$reset()
    this.$storeChat.leaveCurrentRoom()
    this.storeChat.$reset()
  }
},
beforeMount() {
  this.initSystem()
},

});
</script>
