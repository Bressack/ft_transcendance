<template><router-view/></template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Cookies } from 'quasar'
import {
  NavigationGuardNext,
  RouteLocationNormalized,
} from "vue-router";
import ncc, { NotifyOptions, NotifyCenter, Notifications } from 'src/services/notifyCenter'
import { useMainStore } from './stores/store';

export default defineComponent({
  name: 'App',
  methods: {
    has_refresh(): boolean {
      return Cookies.get("has_refresh")
    },
    has_access(): boolean {
      return Cookies.get("has_access")
    },

    async _fLogout() {
      return await fetch('/api/auth/logout')
    },

    notifyAlreadyConnected() {
      this.$store.notifCenter.send({
        type: 'warning',
        message: 'You are already connected'
      })
    },


    initSystem() {
      this.$router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        if (to.path === "/logout") {
			console.log("loging out...")
			if (this.has_refresh())
				await this._fLogout().catch();
			console.log("logging out done")
			next('/login')
		}
		else if (to.path === "/force-logout") {
			await fetch('/api/auth/clear-cookies').then(() => {next('/login')})
        }
		else if (to.meta.requiresAuth && this.has_refresh())
		  return next();
		else if (this.has_refresh() && to.path === "/login")
		  return next("/");
		else if (to.meta.requiresAuth && !this.has_refresh())
		  return next("/logout");
        else
          return next();
      })

      this.$api.axiosInstance.interceptors.request.use(async (req) => {
		if (req.url === ("/auth/login") && this.has_refresh()) {
			const res = await fetch('/api/auth/refresh')
			if (res.status === 204) {
				this.$q.notify({
					type: 'warning',
					message: 'You are already connected'
				})
				this.$router.push('/');
				throw new Error('You are already connected');
			}
			return req;
		}
		return req
      }, undefined)


      this.$api.axiosInstance.interceptors.response.use((resp) => {
        return resp
      }, async (error) => {
			if (error.response.status === 401) {
				if (this.has_refresh()) {
					let res = await fetch('/api/auth/refresh')
					if (res.status === 204) return Promise.resolve(this.$api.axiosInstance.request(error.config))
				}

				this.$router.push("/force-logout")
				return Promise.reject(error)
			}
			return Promise.reject(error)
		})
    },
  },
  created() {
    this.initSystem()
  },

});
</script>
