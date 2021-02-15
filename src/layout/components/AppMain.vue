<template>
  <section class="app-main">
    <router-view v-slot="{ Component }" :key="key">
      <transition
        name="fade-transform"
        mode="out-in"
        enter-from-class="fade-transform-enter"
      >
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "AppMain",
  setup() {
    const store = useStore();
    const route = useRoute();
    const cachedViews = computed(() => {
      return store.state.tagsView.cachedViews;
    });
    const key = ref(route.path);
    return {
      cachedViews,
      key,
    };
  },
});
</script>
