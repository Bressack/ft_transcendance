<template><router-view/></template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Cookies } from 'quasar'
import {
  NavigationGuardNext,
  RouteLocationNormalized,
} from "vue-router";
import ncc, { NotifyOptions, NotifyCenter, Notifications } from 'src/services/notifyCenter'

export default defineComponent({
  name: 'App',
  methods: {
    has_refresh(): boolean {
      return Cookies.get("has_refresh")
    },
    has_access(): boolean {
      return Cookies.get("has_access")
    },
    is_fully_logged(): boolean {
      return this.has_refresh() && this.has_access()
    },
    must_refresh(): boolean {
      return this.has_refresh() && !this.has_access()
    },
    must_logout(): boolean {
      return (!this.has_refresh() && this.has_access() || !this.has_refresh() && !this.has_access())
    },
    async _fRefresh() {
      return await fetch('/api/auth/refresh').catch(async () => {
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
      this.$notifyCenter.send({
        type: 'warning',
        message: 'You are already connected'
      })
    },
    async disconnect(next: NavigationGuardNext | null) {
		if (next) {
			try {
			  if (this.has_access())
				await this._fLogout().catch(() => this._fClearCookies())
			  else if (this.must_refresh())
				await this._fRefresh().then(() => this._fLogout()).catch(() => this._fClearCookies())
			} catch (e) { }
		}
      await this._fClearCookies()
      this.$ws.disconnect()
      if (next)
        return next('/login')
      this.$router.push('/login')
    },

    initSystem() {
      this.$router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        if (to.meta.requiresAuth && this.is_fully_logged())
          return next();
        else if (to.meta.requiresAuth && this.must_refresh())
          return await this._fRefresh().then(() => next()).catch(() => next('/logout'));
        else if (to.meta.requiresAuth && this.must_logout())
          return next('/logout');
        else if (from.meta.requiresAuth && to.path === "/login" && this.must_logout())
          return next();
        else if (from.path === "/" && to.path === "/login" && this.is_fully_logged()) {
          this.notifyAlreadyConnected()
          return next("/");
        }
        else if (from.path === "/" && to.path === "/login" && this.must_refresh()) {
          await this._fRefresh().catch(() => next('/logout'));
          this.notifyAlreadyConnected()
          return next("/");
        }
        else if (to.path === "/logout")
          return this.disconnect(next)
        else
          return next();
      })

      this.$api.axiosInstance.interceptors.request.use(async (req) => {
        if (this.is_fully_logged() && req.url !== "/auth/login")
          return req;
        if (this.must_refresh() && req.url !== "/auth/login") {
          await this._fRefresh().catch(() => { this.$router.push("/logout") });
          return req
        }
        if (this.must_logout() && req.url !== "/auth/login" && req.url !== "/auth/signup") {
          this.$router.push("/logout")
          throw new Error("Token expired")
        }
        else return req
      })


      this.$api.axiosInstance.interceptors.response.use((resp) => {
        // if (resp.status === 205)
        //   this.$storeMe.fetch()
        return resp
      }, undefined)
    },
  },
  created() {
    this.initSystem()
  },

});
</script>
