<template>
  <q-page>
    {{ toto }}
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Profil',
  components: {},
  props: {},
  data() {
    return {

    }
  },
  computed: {
    toto() {
      return this.$router.currentRoute.value.query
    }
  },
  methods: {},
});
</script>

<style lang="sass">

</style>
