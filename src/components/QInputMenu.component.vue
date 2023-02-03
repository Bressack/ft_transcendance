<template>
  <q-input v-model="stringToFind" :label="inputLabel" @focus="markAsTouched" class="iinput">
    <q-menu v-model="showMenuList" no-focus anchor="top right" self="top left" square>

      <q-list v-if="menuList && menuList.length" class="listuser">
        <q-item v-for="elem in menuList" clickable :key="elem?.username">

          <q-item-section style="max-width: 50px;">
            <q-avatar class="avatar">
              <img size="20px" :src="`/api/avatar/${elem?.username}/thumbnail`">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              {{ elem?.username }}
            </q-item-label>
          </q-item-section>

          <!-- icon add to friend -->
          <q-item-section side>
            <q-icon name="add" color="green" @click="selectElement(elem?.username)" />
          </q-item-section>

        </q-item>
      </q-list>

      <q-list v-else-if="menuList && !menuList.length && stringToFind.length" style="min-width: 100px" class="listuser">
        <q-item clickable @click="createElement">
          <q-item-section>{{ defaultLabel }}</q-item-section>
        </q-item>
      </q-list>

    </q-menu>
  </q-input>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'QInputMenu',
  emits: ['findListWithString', 'selectElement', 'createElement'],
  watch: {
    stringToFind(newValue: string, oldValue: string) {
      // Pour ne pas lancer un findListWithString
      // si une valeur est set à l'initatlisation du composant
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
      type: Array,
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
    selectElement(elem: any) {
      this.$emit('selectElement', elem)
    },
    createElement() {
      this.$emit('createElement')
    },
    markAsTouched() {
      this.touched = true
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

