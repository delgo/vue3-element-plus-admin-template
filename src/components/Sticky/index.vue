<template>
  <div :style="{ height: height + 'px', zIndex: zIndex }" ref="root">
    <div
      :class="className"
      :style="{
        top: isSticky ? stickyTop + 'px' : '',
        zIndex: zIndex,
        position: position,
        width: width,
        height: height + 'px',
      }"
    >
      <slot>
        <div>sticky</div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onActivated, onUnmounted } from "vue";

export default defineComponent({
  name: "Sticky",
  props: {
    stickyTop: {
      type: Number,
      default: 0,
    },
    zIndex: {
      type: Number,
      default: 1,
    },
    className: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const active = ref(false);
    const position = ref("");
    const width = ref(undefined || "");
    const height = ref(undefined || "");
    const isSticky = ref(false);
    const root = ref();
    //组件挂载完成后执行的函数
    onMounted(() => {
      height.value = root.value.getBoundingClientRect().height;
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
    });
    //被包含在<keep-alive>中的组件，会多出两个生命周期钩子函数。被激活时执行。
    onActivated(() => {
      handleScroll();
    });
    //组件卸载完成后执行的函数
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    });
    const sticky = () => {
      if (active.value) {
        return;
      }
      position.value = "fixed";
      active.value = true;
      width.value = width.value + "px";
      isSticky.value = true;
    };
    const handleReset = () => {
      if (!active.value) {
        return;
      }
      reset();
    };
    const reset = () => {
      position.value = "";
      width.value = "auto";
      active.value = false;
      isSticky.value = false;
    };
    const handleScroll = () => {
      const w = root.value.getBoundingClientRect().width;
      width.value = w.toString() || "auto";
      const offsetTop = root.value.getBoundingClientRect().top;
      if (offsetTop < props.stickyTop) {
        sticky();
        return;
      }
      handleReset();
    };
    const handleResize = () => {
      if (isSticky.value) {
        width.value = root.value.getBoundingClientRect().width + "px";
      }
    };
    return {
      root,
      active,
      position,
      width,
      height,
      isSticky,
      sticky,
      handleReset,
      reset,
      handleScroll,
    };
  },
});
</script>
