<!-- Test file, could be deleted before the project is set as finished -->
<template>
<q-page>
  <q-item class="flex-center bigger">
    <q-item-label class="q-pa-xl">
      Sandbox
    </q-item-label>
  </q-item>
  <q-item class="flex-center">
    <q-btn label="Create channel" color="orange" @click="dialog = true"/>
  </q-item>
</q-page>
<q-dialog v-model="dialog">
  <CreateChannel />
</q-dialog>
</template>


<script lang="ts">
import CreateChannel from '../components/CreateChannel.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Sandbox',
  components: { CreateChannel },
  setup () {
    const dialog = ref(false)
    return {
      dialog
    }
  }
});
</script>
