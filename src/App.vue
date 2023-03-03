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
      this.$notifyCenter.send({
        type: 'warning',
        message: 'You are already connected'
      })
    },
  

    initSystem() {
      this.$router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
        if (to.path === "/logout") {
			await this._fLogout().catch();
			next('/login')
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
		 return req
      }, undefined)
	 

      this.$api.axiosInstance.interceptors.response.use((resp) => {
        return resp
      }, async (error) => {
			if (error.response.status === 401) {
				const res = await fetch('/api/auth/refresh')
				if (res.status !== 204) {
					useMainStore().$reset();
					this.$ws.disconnect();
					this.$router.push("/logout")
					return Promise.reject(res)
				} else {
					return Promise.resolve(this.$api.axiosInstance.request(error.config))
				}
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
