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
    this.$router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        if (to.path == "/logout" && from.path !== "/login")
            return await this.disconnect(next)
        if (this.must_refresh() && to.path === '/login')
            await this._fRefresh().catch(async () => {await this._fClearCookies(); next('/logout')})
        if (this.must_logout() && to.path === '/login'){
            await this._fClearCookies()
            return next('/logout')
        }
        
        if (to.path === '/login' && from.path !== "/login" && this.is_fully_logged()) {
            this.$q.notify({
                type: 'warning',
                message: 'You are already connected'
            })
            return next(from.path)
        }
        if (to.path === '/login' && from.path !== "/login" && !this.is_fully_logged()) {
            return next(from.path)
        }
        return next()
    })

    // Auth interceptor
    this.$api.axiosInstance.interceptors.request.use(async (req) => {
        if (req.url === "/login" || req.url === "/signup") {
            await this._fClearCookies()
            return req
        }
        if (this.must_refresh()) {
            await this._fRefresh().catch(() => this.disconnect(null))
            return req
        }
        else if (this.must_logout())
            return this.disconnect(null);
        else if (this.is_fully_logged())
            return req;

    //   if (req.url !== '/auth/login' && req.url !== '/auth/signup' && req.url !== '/auth/logout' && !this.has_access() && Cookies.get('has_refresh')) {
    //     return await fetch('/api/auth/refresh')
    //       .then(() => req)
    //       .catch((err) => {
    //         this.$router.push('/logout')
    //         throw new Error(err)
    //       })
    //   }
    //   else if (req.url !== '/auth/login' && req.url !== '/auth/signup' && req.url !== '/auth/logout' && !this.has_access() && !Cookies.get('has_refresh')) {
    //       this.$router.push('/logout')
    //     throw new Error()
    //   }
    //   else if (req.url === '/auth/logout')
    //   {
    //     if (!this.has_access() && Cookies.get('has_refresh')){
    //       return await fetch('/api/auth/refresh')
    //       .then(() => req)
    //       .catch(async (err) => {
    //         return await fetch('/api/auth/clear-cookies').then(() => {
    //           throw new Error(err)
    //         })
    //       })
    //     }
    //     else if (this.has_access() && Cookies.get('has_refresh')) {
    //       return req
    //     }
    //     else if (Cookies.get('has_access') && !Cookies.get('has_refresh')) {
    //       throw new Error()
    //     }
    //     else {
    //       return await fetch('/api/auth/clear-cookies').then(() => {
    //         throw new Error()
    //       })
    //     }
    //   }
      return req;
    })

    this.$api.axiosInstance.interceptors.response.use((resp) => {
      if (resp.status === 205)
        this.storeMe.fetch()
      return resp
    }, undefined)
  },
  has_refresh() : boolean {
    return Cookies.get("has_refresh")
  },
  has_access() : boolean {
    return Cookies.get("has_access")
  },
  is_fully_logged() : boolean {
      return this.has_refresh() && this.has_access() 
  },
  must_refresh() : boolean {
      return this.has_refresh() && !this.has_access() 
  },
  must_logout() : boolean {
      return (!this.has_refresh() && this.has_access() || !this.has_refresh() && !this.has_access())
  },
  async _fRefresh() {
      return await fetch('/api/auth/refresh').catch(async ()=> {
        await this._fClearCookies()
        return this.disconnect(null)
    })
  },
  async _fLogout() {
      return await fetch('/api/auth/logout')
  },
  async _fClearCookies() {
      return await fetch('/api/auth/clear-cookies')
  },
  notifyAlreadyConnected() {
      this.$q.notify({
          type: 'warning',
          message: 'You are already connected'
      })
  },
    async disconnect(next : NavigationGuardNext | null) {
      if (this.has_access())
          await this._fLogout().catch(() => this._fClearCookies())
      else if (this.must_refresh())
          await this._fRefresh().then(() => this._fLogout()).catch(() => this._fClearCookies())
      await this._fClearCookies()
      this.$ws.disconnect()
      this.storeMe.$reset()
      this.$storeChat.leaveCurrentRoom()
      this.$storeChat.$reset()
      if (next)
        return next('/login')
      this.$router.push('/login')
  }
},
beforeMount() {
  this.initSystem()
},

});
</script>
