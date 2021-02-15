<template>
  <div :class="[{ 'is-active': isActive }]" @click="toggleClick">
    <svg-icon icon-class="hamburger"></svg-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Hamburger",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const toggleClick = () => {
      emit("toggleClick");
    };
    return {
      toggleClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.svg-icon {
  vertical-align: middle !important;
  width: 1.2rem !important;
  height: 1.2rem !important;
}
.is-active {
  transform: rotate(180deg);
}
</style>
