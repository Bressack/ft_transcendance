<template>
    <q-item class="message" v-ripple>

      <q-item-section class="avatar absolute-top">
        <img :src="avatar" class="image"/>
      </q-item-section>

      <q-item-section class="datas">

        <q-item-section class="layer_1">
          <span class="name" @click="goProfilPage">{{ username }}</span>
          <span class="date">{{ getRelativeDate(timestamp) }}</span>
        </q-item-section>

        <q-item-section class="layer_2">
          <span class="body">{{ content }}</span>
        </q-item-section>

      </q-item-section>
    </q-item>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'Message',
  components: { },
  props: {
    username:  { type: String, required: true },
    avatar:    { type: String, required: true },
    content:   { type: String, required: true },
    timestamp: { type: Date  , required: true },
  },
  data() {
    return {

    }
  },
  mounted() {
  },
  methods: {
    goProfilPage() {
      this.$router.push({
        path: `/profile/${this.username}`
      })
    },
    getRelativeDate(cdate: Date): string {
      function floorStr(n: number) {
        return (n < 10 ? '0' : '') + n
      }

      const now = new Date()

      if (now.getDate() - cdate.getDate() == 0)
        return 'Today at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
      else if (now.getDate() - cdate.getDate() == 1)
        return 'Yesterday at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
      else if (now.getDate() - cdate.getDate() == -1)
        return 'Tomorrow at ' + floorStr(cdate.getHours()) + ':' + floorStr(cdate.getMinutes())
      else
      {
        const d = cdate.getDate()
        const m = (cdate.getMonth() + 1)
        return floorStr(d) + '/'
             + floorStr(m) + '/'
             + cdate.getFullYear() + ' '
             + floorStr(cdate.getHours()) + ':'
             + floorStr(cdate.getMinutes())
      }
    },
  },
});
</script>

<style lang="sass" scoped>
.image
  width: 42px
  height: 42px
  border-radius: 250px

.avatar
  max-width: 42px !important
  margin-top: 10px
  margin-left: 10px

.layer_1
  display: table-cell

// .layer_2
.name
  font-weight: bold
  font-size: 16px
  color: white
  margin: 3px
  margin-right: 10px
  margin-left: 13px
  padding: 5px

.name:hover
  background-color: #505050
  border-radius: 200px

.datas
  padding-left: 2vw

.body
  color: white
  margin-left: 10px
</style>
