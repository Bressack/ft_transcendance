<template>
  <q-page>
    <div class="q-pa-md">
      <q-uploader
        label="Auto Uploader"
        url="/api/avatar/"
        field-name="avatar"
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UploadTest',
  components: {},
  props: {},
  data() {
    return {

    }
  },
  methods: {},
});
</script>

<style lang="sass">

</style>
