<template>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import api from './services/api.service'

export default defineComponent({
  name: 'App',
  data() {
    return {}
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
        // console.log('config:', error.config)
        // console.log('response:', error.response.status)
        if (error?.response?.status == 401) {
          try {
            const response = await api.refresh()
            if (response.status == 417)
              that.$router.push('/login')
            that.$router.replace('/')
          } catch(error: any) {
            console.log('error', error.response)
          }
        }
      });
    }
  },
  beforeMount() {
    this.initSystem()
  }
});
</script>

