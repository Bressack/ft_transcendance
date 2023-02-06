<template>
	<router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Cookies } from 'quasar'
import { useMeStore } from 'src/stores/me';
import { useChatSocketStore } from 'src/stores/chatSocket';

// import api from './services/api.service'
// import wsService from './services/ws.service';

export default defineComponent({
	name: 'App',

	data() {
		return {
			isrefreshing: false,
			storeMe: useMeStore(),
			storeChat: useChatSocketStore(),
		}
	},
	setup() {

	},
	methods: {

		initSystem() {
			// this.$router.beforeEach()
			let that = this // parce que ta gueule le callback
			this.$api.axiosInstance.interceptors.request.use(async (req) => {

				if (req.url !== '/auth/login' && req.url !== '/auth/signup' && req.url !== '/auth/logout' && !Cookies.get('has_access') && Cookies.get('has_refresh')) {
					return fetch('/api/auth/refresh')
						.then(() => req)
						.catch((err) => {
							that.$router.push('/login')
							that.$ws.disconnect()
							that.storeMe.$reset()
							that.storeChat.$reset()
							throw new Error(err)
						});
				}
				else if (req.url !== '/auth/login' && req.url !== '/auth/signup' && req.url !== '/auth/logout' && !Cookies.get('has_access') && !Cookies.get('has_refresh')) {
					that.$router.push('/login')
					that.$ws.disconnect()
					that.storeMe.$reset()
					that.storeChat.$reset()
					throw new Error()

				}
				else if (req.url == '/auth/logout')
				{
					return fetch('/api/auth/logout')
						.then(() => {
							that.$router.push('/login')
							that.$ws.disconnect()
							that.storeMe.$reset()
							that.storeChat.$reset()
						});
				}
				else return req;

			})

      this.$api.axiosInstance.interceptors.response.use((resp) => {
        console.log('interceptor', resp)
        if (resp.status === 205)
          this.storeMe.fetch()
        return resp
      }, undefined)
			// this.$api.axiosInstance.interceptors.response.use(undefined, async function (error) {

			// 	if (error?.response?.status === 404 || error?.response?.status === 400) {
			// 		that.$router.push('/')
			// 		return;
			// 	}

			// 	if (error?.config?.url === '/auth/refresh' || error?.response?.status == 417) {
			// 		that.$router.push('/login')
			// 		return;
			// 	}
			// 	// 401 sur la request
			// 	if (error?.response?.status == 401) {
			// 		try {
			// 			if (that.isrefreshing == false) {
			// 				// on get le access token
			// 				that.isrefreshing = true
			// 				const response = await that.$api.refresh()
			// 				that.isrefreshing = false
			// 				if (response.status == 417) {
			// 					that.$router.push('/login')
			// 					return;
			// 				}
			// 			}
			// 			else {
			// 				// on attend le refresh
			// 				while (that.isrefreshing) {
			// 					await new Promise((resolve: any, reject: any) => {
			// 						setTimeout(() => {
			// 							resolve()
			// 						}, 100)
			// 					})
			// 				}
			// 			}
			// 			error.config._retry = true;
			// 			return that.$api.axiosInstance(error.config)
			// 		} catch (error: any) {
			// 			console.log('error', error.response)
			// 		}
			// 	}
			// });
		}
	},
	beforeMount() {
		this.initSystem()
	},

});
</script>
