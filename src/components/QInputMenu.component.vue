<template>
  <q-input dark color="orange" v-model="stringToFind" :label="inputLabel" @focus="markAsTouched" class="iinput">
    <q-menu v-model="showMenuList" no-focus anchor="bottom left" self="top left" square>

      <q-list v-if="menuList && menuList.length" class="listuser">
        <q-item v-for="elem in menuList" clickable :key="elem?.username">

          <q-item-section @click="goProfilePage(elem?.username)" style="max-width: 50px;">
            <q-avatar class="avatar" :style="`background-color: ${$utils.usernameToColor(elem?.username)};`">
              <img size="20px" :src="`/api/avatar/${elem?.username}/thumbnail`">
            </q-avatar>
          </q-item-section>

          <q-item-section @click="goProfilePage(elem?.username)">
            <q-item-label>
              {{ elem?.username }}
            </q-item-label>
          </q-item-section>

          <!-- icon add to friend -->
          <q-item-section side v-if="statusUnknown(elem?.status)">
            <q-btn icon="add" flat round color="green" @click="selectElement(elem?.username, 'follow')" />
          </q-item-section>

          <q-item-section side v-else-if="statusFriend(elem?.status)">
            <q-btn icon="cancel" flat round color="red" @click="selectElement(elem?.username, 'unfollow')" />
          </q-item-section>

          <q-item-section side v-else-if="statusPendingto(elem?.status)">
            <q-btn icon="cancel" flat round color="red" @click="selectElement(elem?.username, 'unfollow')" />
          </q-item-section>

          <q-item-section side v-else-if="statusPendingfrom(elem?.status)">
            <q-btn icon="add" flat round color="green" @click="selectElement(elem?.username, 'follow')" />
          </q-item-section>

        </q-item>
      </q-list>

      <q-list v-else-if="menuList && !menuList.length && stringToFind.length" style="min-width: 100px" class="listuser">
        <q-item clickable>
          <q-item-section>{{ defaultLabel }}</q-item-section>
        </q-item>
      </q-list>

    </q-menu>
  </q-input>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';

enum EUserStatus {
  UNKNOWN,
  FRIEND,
  PENDINGFROM,
  PENDINGTO,
}

interface IUserName {
  username: string;
  status: EUserStatus;
}

export default defineComponent({
  name: 'QInputMenu',
  emits: ['findListWithString', 'selectElement', 'createElement'],
  watch: {
    stringToFind(newValue: string, oldValue: string) {
      // Pour ne pas lancer un findListWithString
      // si une valeur est set à l'initialisation du composant
      if (!this.touched)
        return
      this.$emit('findListWithString', newValue)
    },
    menuList(newValue: any) {
      if (!this.touched)
        return
      this.showMenuList = (newValue !== null)
    }
  },
  props: {
    menuList: {
      type: Array<IUserName>,
      default: null
    },
    inputLabel: {
      type: String,
      default: 'Search Users'
    },
    defaultLabel: {
      type: String,
      default: 'No match found'
    },
    itemType: {
      type: String,
      default: null
    },
    initialValue: {
      type: String,
      default: null
    },
    functions: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      stringToFind: '' as string,
      showMenuList: false as boolean,
      touched: false as boolean
    }
  },
  methods: {
    statusUnknown(s: EUserStatus) {
      return (s == EUserStatus.UNKNOWN)
    },
    statusFriend(s: EUserStatus) {
      return (s == EUserStatus.FRIEND)
    },
    statusPendingfrom(s: EUserStatus) {
      return (s == EUserStatus.PENDINGFROM)
    },
    statusPendingto(s: EUserStatus) {
      return (s == EUserStatus.PENDINGTO)
    },
    selectElement(elem: any, mode: string) {
      this.$emit('selectElement', elem, mode)
      setTimeout(() => { this.$emit('findListWithString', this.stringToFind) }, 100)
    },
    createElement() {
      this.$emit('createElement')
    },
    markAsTouched() {
      this.touched = true
    },
    goProfilePage(username: string) {
      this.$router.push({
        path: '/profile/' + username,
      })
    }

  },
  mounted() {
    if (this.initialValue)
      this.stringToFind = this.initialValue
  }
});
</script>

<style lang="sass" scoped>
.listuser
  background-color: $bg-secondary
  width: 300px

.iinput
  padding-left: 10px
</style>

