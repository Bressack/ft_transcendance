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
  methods: {
    // factoryFn (files: any) {
    //   return new Promise((resolve) => {
    //     resolve({
    //         headers: [
    //           { name: 'Content-Disposition', value: `form-data; name="avatar"; filename="${files[0]?.name}"` },
    //           // { name: 'Content-Type', value: 'image/png'}
    //         ]
    //       })
    //   })
    // }
  },
});
</script>

<style lang="sass">

</style>
