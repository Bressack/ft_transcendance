<template>
  <q-page>
    <div class="press2p text-center text-h4 q-py-lg">
      LeaderBoard
    </div>
    <q-item class="colnames">
      <q-item-section class="base" @click="sortboard('username')">
        <q-btn :color="sortindex == 'username' ? 'orange-7' : 'grey-8'" label="Username" class="press2p labelh score">
          <q-icon :name="sorting('username')" size="30px" :color="sorttype ? 'green' : 'red'"/>
        </q-btn>
      </q-item-section>
      <q-separator vertical color="blue-grey-5" spaced/>
      <q-item-section class="base" @click="sortboard('victory')">
        <q-btn :color="sortindex == 'victory' ? 'orange-7' : 'grey-8'" label="Victory" class="press2p labelh score colnames-each">
          <q-icon :name="sorting('victory')" size="30px" :color="sorttype ? 'green' : 'red'"/>
        </q-btn>
      </q-item-section>
      <q-separator vertical color="blue-grey-5" spaced/>
      <q-item-section class="base" @click="sortboard('defeat')">
        <q-btn :color="sortindex == 'defeat' ? 'orange-7' : 'grey-8'" label="Defeat" class="press2p labelh score colnames-each">
          <q-icon :name="sorting('defeat')" size="30px" :color="sorttype ? 'green' : 'red'"/>
        </q-btn>
      </q-item-section>
      <q-separator vertical color="blue-grey-5" spaced/>
      <q-item-section class="base" @click="sortboard('ratio')">
        <q-btn :color="sortindex == 'ratio' ? 'orange-7' : 'grey-8'" label="Ratio" class="press2p labelh score colnames-each">
          <q-icon :name="sorting('ratio')" size="30px" :color="sorttype ? 'green' : 'red'"/>
        </q-btn>
      </q-item-section>
    </q-item>
    <q-list class="board">
      <LeaderCard v-for="(user, index) of users" :key="user.username"
        class=""
        :user="user"
        :rank="index"
      />
    </q-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import LeaderCard from './components/LeaderCard.vue'
import { UserBoard } from 'src/stores/store.types'


export default defineComponent({
  name: 'Leaderboard',
  components: { LeaderCard },
  props: {},
  data() {
    return {
      users: [] as UserBoard[],
      sortindex: 'ratio',
      sorttype: false,
    }
  },
  computed: {
    // computedUsers() {
    //   return this.users.sort((a: UserBoard, b: UserBoard) => { return this.getRatio(a) < this.getRatio(b) ? 1 : -1 })
    // },
  },
  methods: {
    getRatio(user: UserBoard) : number {
      return (user.victoriesAsPOne + user.victoriesAsPTwo) / (user.victoriesAsPOne + user.victoriesAsPTwo + user.defeatsAsPOne + user.defeatsAsPTwo)
    },
    getVictory(user: UserBoard) { return user.victoriesAsPOne + user.victoriesAsPTwo },
    getDefeat(user: UserBoard) { return user.defeatsAsPOne + user.defeatsAsPTwo },
    sorting(i: string) {
      if (i == this.sortindex)
        return this.sorttype ? 'mdi-arrow-up-thin' : 'mdi-arrow-down-thin'
      return ''
    },
    sortboard(i: string) {
      if (this.sortindex == i) {
        this.sorttype = !this.sorttype
      } else {
        this.sortindex = i
        this.sorttype = true
      }
      switch (this.sortindex) {
        case 'username': this.users = this.users.sort((a: UserBoard, b: UserBoard) => { return a.username < b.username ? (this.sorttype ? 1 : -1) : (this.sorttype ? -1 : 1) }); break;
        case 'victory' : this.users = this.users.sort((a: UserBoard, b: UserBoard) => { return this.getVictory(a) < this.getVictory(b) ? (this.sorttype ? 1 : -1) : (this.sorttype ? -1 : 1) }); break;
        case 'defeat'  : this.users = this.users.sort((a: UserBoard, b: UserBoard) => { return this.getDefeat(a) < this.getDefeat(b) ? (this.sorttype ? 1 : -1) : (this.sorttype ? -1 : 1) }); break;
        case 'ratio'   : this.users = this.users.sort((a: UserBoard, b: UserBoard) => { return this.getRatio(a) < this.getRatio(b) ? (this.sorttype ? 1 : -1) : (this.sorttype ? -1 : 1) }); break;
      }
    },
  },
  beforeMount() {
    this.$api.getAllUsers()
    .then((r: any) => {
      this.users = r.data as UserBoard[]
      this.sortboard('ratio')
    })
    .catch((e: any) => {
      console.log(e)
    })
  },
});
</script>

<style lang="sass" scoped>
@use "src/css/interpolate" as r

.board
  height: calc(100vh - (90px + 150px))
  overflow: auto

.score
  text-align: center

.victory
  color: $green

.defeat
  color: $red

.colnames
  width: 80%
  margin: auto

.base
  min-width: 100px

.labelh
  @include r.interpolate(font-size, 320px, 2560px, 8px, 22px)
  color: $blue-grey-3

</style>
