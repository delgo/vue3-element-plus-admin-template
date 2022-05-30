<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.passive="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  onMounted,
  onUnmounted,
  unref,
} from "vue";
import { TagView } from "@/store/modules/tagsView";
const tagSpacing = 4;

export default defineComponent({
  name: "ScrollPane",
  emits: ["scroll"],
  setup(props, context) {
    const scrollContainer = ref();
    const emitScroll = () => {
      context.emit("scroll");
    };
    // eslint-disable-next-line
    let tags = ref() as any;
    onMounted(() => {
      tags = inject("ParentTag");
      const scrollWrapper = unref(scrollContainer).wrap$ as HTMLElement;
      scrollWrapper.addEventListener("scroll", emitScroll, { passive: true });
    });
    onUnmounted(() => {
      removeEventListener("scroll", emitScroll);
    });

    const handleScroll = (e: WheelEvent) => {
      // eslint-disable-next-line
      const eventDelta = (e as any).wheelDelta || -e.deltaY * 40;
      const scrollWrapper = unref(scrollContainer).wrap as HTMLElement;
      scrollWrapper.scrollLeft = scrollWrapper.scrollLeft + eventDelta / 4;
    };
    //目前只支持?hash模式
    const moveToTarget = (currentTag: TagView) => {
      const container = unref(scrollContainer).$el as HTMLElement;
      const containerWidth = container.offsetWidth;
      const scrollWrapper = scrollContainer.value;

      const tagList = tags.value.children;
      const tagArray = Array.from(tagList);
      const currentHash = "#" + currentTag.fullPath;

      let firstTag = null;
      let lastTag = null;

      // find first tag and last tag
      if (tagList.length > 0) {
        firstTag = tagList[0].hash;
        lastTag = tagList[tagList.length - 1].hash;
      }
      if (firstTag === currentHash) {
        scrollWrapper.scrollLeft = 0;
      } else if (lastTag === currentHash) {
        scrollWrapper.scrollLeft = scrollWrapper.scrollWidth - containerWidth;
      } else {
        // find preTag and nextTag
        const currentIndex = tagArray.findIndex(
          // eslint-disable-next-line
          (item: any) => item.hash === currentHash
        );
        const prevTag = tagList[currentIndex - 1];
        const nextTag = tagList[currentIndex + 1];
        // the tag's offsetLeft after of nextTag
        const afterNextTagOffsetLeft =
          nextTag.offsetLeft + nextTag.offsetWidth + tagSpacing;
        // the tag's offsetLeft before of prevTag
        const beforePrevTagOffsetLeft = prevTag.offsetLeft - tagSpacing;
        if (
          afterNextTagOffsetLeft >
          scrollWrapper.scrollLeft + containerWidth
        ) {
          scrollWrapper.scrollLeft = afterNextTagOffsetLeft - containerWidth;
        } else if (beforePrevTagOffsetLeft < scrollWrapper.scrollLeft) {
          scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
        }
      }
    };
    return {
      handleScroll,
      moveToTarget,
      scrollContainer,
    };
  },
});
</script>

<style lang="scss">
.scroll-container {
  .el-scrollbar__bar {
    bottom: 0px;
  }
  .el-scrollbar__wrap {
    height: 49px;
  }
}
</style>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
}
</style>
