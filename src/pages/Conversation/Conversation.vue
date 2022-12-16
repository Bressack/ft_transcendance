<template>
  <q-page>
    <q-scroll-area :visible="true" style="height: 88vh; max-width: 100vw;">
      <q-list bordered class="messagelist">
        <!-- <Message v-for="item in messagesList" :key="item.id" :message="item" class="messagecomp" /> -->
        <UserCard
          v-for="message in messagesListC" :key="message.id"
          @click=goProfilPage(message?.identity.name)
          :name=message?.identity.name
          :avatar=message?.identity.avatar
          :content=message?.body
          :timestamp=message?.timestamp
          size="small"
          class="messagecomp"
        />
      </q-list>
    </q-scroll-area>
    <q-input filled v-model="text" placeholder="Enter text here" class="absolute-bottom input"/>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IMessageList, IUserBasicInfo, IMessage } from '../../models/models';
import { fake_IMessageList } from '../../models/fakedatas';
// import Message from '../components/Conversation/Message.vue';
import UserCard from '../../components/common/UserCard.vue'


export default defineComponent({
  name: 'Conversation',
  components: { UserCard },
  props: {
  },
  data() {
    return {
      messagesList: fake_IMessageList(20) as IMessageList,
      text: '',
    }
  },
  updated() {
    this.messagesList = fake_IMessageList(20);
  },
  methods: {
    goProfilPage(user: string) {
      this.$router.push({
        path: `/profile/${user}`
      })
    }
  },
  computed: {
    messagesListC() : IMessageList {
      return this.messagesList.sort((a: IMessage, b: IMessage) => {
        return a.timestamp > b.timestamp ? -1 : 1
      })
    }
  }
});
</script>

<style lang="sass">
.messagelist
  width: 100% !important

.messagecomp
  margin-bottom: 1vh

.input
  // padding-left: 15% !important
  // margin: 15px
  // border-radius: 20px
  > div
    background-color: #555555
</style>
