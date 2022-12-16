<template>
  <!-- <div class=""> -->
    <!-- TODO penser à une reel solution de scroll pour la liste -->
    <!-- <q-scroll-area :visible="true" style="height: 88vh; max-width: 15vw;"> -->
      <q-list bordered class="list">
        <q-item class="item" v-for="item in storeMe.friends" :key="item"
          @click="userSelected(item)" clickable v-ripple :item="item"
          >
          <UserCard
            :name="item"
            :avatar="`api/avatar/${item}/medium`"
            size="medium"
            nameColor="gray"
            :ratio="0.55"
          />
          <q-avatar icon="lock" v-if="isPrivate(item)" class="absolute-right vertical-middle"/>
        </q-item>
      </q-list>
    <!-- </q-scroll-area> -->
  <!-- </div> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IUserBasicInfo, IConvList, IConvItem, OnlineStatus, Scope } from '../../models/models';
import UserCard from '../../components/common/UserCard.vue'
import { fake_IConvList } from '../../models/fakedatas'
import { useMeStore } from 'src/stores/me';

export default defineComponent({
  name: 'ConversationList',
  components: { UserCard },
  props: {},
  data() {
    return {
      storeMe: useMeStore(),
      conversationList : fake_IConvList(15) as IConvList,
    }
  },
  methods: {
    isPrivate(item: IConvItem) {
      return item.scope == Scope.PRIVATE
    },
    userSelected(name: String) {
      this.$router.push({
        path: '/conversation',
        query: { user: name }
      })
    }
  },
  beforeMount () {
  },
});
</script>

<style lang="sass">
.item
  background-color: $bg-secondary
  // margin-bottom: 2px
  width: 100%
  height: 1em

.list
  background-color: $bg-primary !important
  width: 100%
</style>
