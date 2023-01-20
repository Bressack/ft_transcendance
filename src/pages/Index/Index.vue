<template>
  <q-page>
    <div v-if="storeMe.getAvatar('toto')">
      <!-- <svg width="100" height="100">
        <image :xlink:href="avat" width="100" height="100"/>
      </svg> -->
      <!-- <img src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="/> -->

      <img src="https://thispersondoesnotexist.com/image" alt="NO IMAGE"/>
      <!-- <q-img src="src/assets/pong_wallpaper.png"/> -->
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import * as models from 'src/services/api.models'
import { useMeStore } from 'src/stores/me';

export default defineComponent({
  name: 'Index',
  components: { },
  props: {},
  data() {
    return {
      storeMe: useMeStore(),
    }
  },
  methods: {
  },
  computed: {
    avat() {
      // let toto = "data:image/webp;base64," + btoa(encodeURIComponent(this.storeMe.getAvatar('toto').avatar))
      let toto = "data:image/webp;binary," + this.storeMe.getAvatar('toto').avatar
      return toto
    }
  },
  beforeMount() {
    this.storeMe.saveAvatar('toto')
  }
});
</script>

<style lang="sass" scoped>
.toto_rows

.toto_cols

</style>

