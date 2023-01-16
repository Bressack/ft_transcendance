<template>
    <q-item-section>
        Joueur 1 : {{ scoreP1 }} - Joueur 2 : {{ scoreP2 }}
    </q-item-section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        scoreP1 : { type: Number , default : 0  },
        scoreP2 : { type: Number , default : 0  },
  },
})


</script>