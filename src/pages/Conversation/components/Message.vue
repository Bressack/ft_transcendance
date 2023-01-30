<template>
    <q-item class="message" v-ripple>

      <q-item-section class="avatar absolute-top">
        <img :src="avatar" class="image"/>
      </q-item-section>

      <q-item-section class="datas">

        <q-item-section class="layer_1">
          <span class="name">{{ username }}</span>
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
import UserCard from '../../../components/common/UserCard.vue'

export default defineComponent({
  name: 'Message',
  components: { UserCard },
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
    floorStr(n: number) {
      return (n < 10 ? '0' : '') + n
    },
    getRelativeDate(cdate: Date): string {
      const now = new Date()
      // let diff : number = (Date.now() - cdate.getTime()) / 3600
      console.log('debug: ', now.getDate() - cdate.getDate());

      if (now.getDate() - cdate.getDate() == 0)
        return 'Today at ' + this.floorStr(cdate.getHours()) + ':' + this.floorStr(cdate.getMinutes())
      else if (now.getDate() - cdate.getDate() == 1)
        return 'Yesterday at ' + this.floorStr(cdate.getHours()) + ':' + this.floorStr(cdate.getMinutes())
      else
      {
        const d = cdate.getDate()
        const m = (cdate.getMonth() + 1)
        return this.floorStr(d) + '/'
             + this.floorStr(m) + '/'
             + cdate.getFullYear() + ' '
             + this.floorStr(cdate.getHours()) + ':'
             + this.floorStr(cdate.getMinutes())
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
  margin-left: 19px

.datas
  padding-left: 2vw

// .date

.body
  color: white
  margin-left: 10px
</style>
