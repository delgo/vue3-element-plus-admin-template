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
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import screenfull from "screenfull";
import { ElMessage } from "element-plus";
export default defineComponent({
  name: "Screenfull",
  setup() {
    const sf = screenfull;
    const isFullscreen = ref(false);

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
        ElMessage({
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
