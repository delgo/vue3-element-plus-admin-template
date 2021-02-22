<template>
  <div id="screenfull">
    <svg-icon
      :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="click"
    >
    </svg-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, inject } from "vue";
import screenfull from "screenfull";
export default defineComponent({
  name: "Screenfull",
  setup() {
    const sf = screenfull;
    const isFullscreen = ref(false);
    // eslint-disable-next-line
    const message = (inject("$message") as any)

    const change = () => {
      if (sf.isEnabled) {
        isFullscreen.value = sf.isFullscreen;
      }
    };

    onMounted(() => {
      if (sf.isEnabled) {
        sf.on("change", change());
      }
    });
    onBeforeUnmount(() => {
      if (sf.isEnabled) {
        sf.off("change", change());
      }
    });

    const click = () => {
      if (!sf.isEnabled) {
        message({
          message: "you browser can not work",
          type: "warning",
          duration: 5 * 1000,
        });
        return false;
      }
      sf.toggle();
    };

    return {
      click,
      isFullscreen,
    };
  },
});
</script>
