<template>
  <router-view/>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import api from './services/api.service'
// import wsService from './services/ws.service';

export default defineComponent({
  name: 'App',

  data() {
    return {
      isrefreshing: false,
    }
  },
  setup() {

  },
  methods: {
    initSystem () {
      let that = this // parce que ta gueule le callback
      api.axiosInstance.interceptors.response.use(undefined, async function (error) {

        if (error?.response?.status === 404 || error?.response?.status === 400)
        {
          that.$router.push('/')
          return ;
        }

        if (error?.config?.url === '/auth/refresh' || error?.response?.status == 417)
        {
          that.$router.push('/login')
          return ;
        }
        // 401 sur la request
        if (error?.response?.status == 401) {
          try {
            if (that.isrefreshing == false)
            {
              // on get le access token
              that.isrefreshing = true
              const response = await api.refresh()
              that.isrefreshing = false
              if (response.status == 417) {
                that.$router.push('/login')
                return;
              }
            }
            else {
              // on attend le refresh
              while (that.isrefreshing) {
                await new Promise((resolve: any, reject: any) => {
                  setTimeout(() => {
                    resolve()
                  }, 100)
                })
              }
            }
            error.config._retry = true;
            return api.axiosInstance(error.config)
          } catch(error: any) {
            console.log('error', error.response)
          }
        }
      });
    }
  },
  beforeMount() {
    this.initSystem()
  },

});
</script>
