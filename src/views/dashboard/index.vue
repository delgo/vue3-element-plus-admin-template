<template>
  <div class="app-container">
    <li @click="show" v-if="show">1111</li>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();
    let show = () => {
      router.push({
        path: "/permission/account",
        query: {
          id: 1,
        },
      });
    };
    return {
      show,
    };
  },
});
</script>
