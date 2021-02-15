<template>
  <div id="tags-view-container" class="tags-view-container" ref="root">
    <scroll-pane ref="scrollPane" @scroll="handleScroll">
      <div class="tags-view-wrapper" ref="tag">
        <router-link
          v-for="tag in visitedViews"
          :key="tag.path"
          :class="isActive(tag) ? 'active' : ''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          class="tags-view-item"
          @click.middle.enter="!isAffix(tag) ? closeSelectedTag(tag) : ''"
          @contextmenu.prevent.enter="openMenu(tag, $event)"
        >
          {{ tag.meta.title }}
          <span
            v-if="!isAffix(tag)"
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          />
        </router-link>
      </div>
    </scroll-pane>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag.value)">刷新</li>
      <li
        v-if="!isAffix(selectedTag.value)"
        @click="closeSelectedTag(selectedTag.value)"
      >
        关闭
      </li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags(selectedTag.value)">关闭全部</li>
    </ul>
  </div>
</template>

<script lang="ts">
import path from "path";
import ScrollPane from "./ScrollPane.vue";
import {
  ref,
  reactive,
  computed,
  watch,
  defineComponent,
  onMounted,
  nextTick,
  provide,
} from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { TagView } from "@/store/modules/tagsView";

export default defineComponent({
  name: "TagsView",
  components: {
    ScrollPane,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const visible = ref(false);
    const top = ref(0);
    const left = ref(0);
    let selectedTag: { value: TagView } = reactive({
      value: {
        meta: { title: "", noCache: false, affix: "" },
        name: "",
        affix: "",
      },
    });
    let affixTags: TagView[] = reactive([]);
    const scrollPane = ref();
    const root = ref();

    const visitedViews = computed(() => {
      return store.getters.visitedViews;
    });

    const routes = computed(() => {
      return store.getters.routes;
    });

    const addTags = () => {
      const { name } = route;
      if (name) {
        store.dispatch("tagsView/addView", route);
      }
      return false;
    };

    const moveToCurrentTag = () => {
      const tags = visitedViews.value as TagView[];
      nextTick(() => {
        for (const tag of tags) {
          if ((tag as TagView).path === route.path) {
            scrollPane.value.moveToTarget(tag);
            // When query is different then update
            if ((tag as TagView).fullPath !== route.fullPath) {
              store.dispatch("tagsView/updateVisitedView", route);
            }
            break;
          }
        }
      });
    };

    const filterAffixTags = (routes: TagView[], basePath = "/") => {
      let tags: TagView[] = [];
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path ? route.path : "/");
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          });
        }
        if (route.children) {
          const childTags = filterAffixTags(route.children, route.path);
          if (childTags.length >= 1) {
            tags = [...tags, ...childTags];
          }
        }
      });
      return tags;
    };

    const initTags = () => {
      affixTags = filterAffixTags(routes.value);
      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          store.dispatch("tagsView/addVisitedView", tag);
        }
      }
    };
    // 避免资源浪费 https://github.com/vuejs/vue-next/issues/2027
    const routePath = computed(() => {
      return route.fullPath || route.path;
    });
    watch(routePath, () => {
      addTags();
      moveToCurrentTag();
    });

    const tag = ref();
    onMounted(() => {
      initTags();
      addTags();
    });
    provide("ParentTag", tag);
    const closeMenu = () => {
      visible.value = false;
    };

    watch(visible, (value: boolean) => {
      if (value) {
        document.body.addEventListener("click", closeMenu);
      } else {
        document.body.removeEventListener("click", closeMenu);
      }
    });

    const isActive = (tag: TagView) => {
      return route.path === tag.path;
    };
    const isAffix = (tag: TagView) => {
      return tag.meta && tag.meta.affix;
    };

    const refreshSelectedTag = (view: TagView) => {
      store.dispatch("tagsView/delCachedView", view);
      const { fullPath } = view;
      nextTick(() => {
        router
          .replace({
            path: "/redirect" + fullPath,
          })
          .catch((err) => {
            console.warn(err);
          });
      });
    };
    const toLastView = (visitedViews: TagView[], view: TagView) => {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView !== undefined && latestView.fullPath !== undefined) {
        router.push(latestView.fullPath).catch((err) => {
          console.warn(err);
        });
      } else {
        // Default redirect to the home page if there is no tags-view, adjust it if you want
        if (view.name === "Dashboard") {
          // to reload home page
          router.replace({ path: "/redirect" + view.fullPath }).catch((err) => {
            console.warn(err);
          });
        } else {
          router.push("/").catch((err) => {
            console.warn(err);
          });
        }
      }
    };
    const closeSelectedTag = (view: TagView) => {
      store.dispatch("tagsView/delView", view);
      if (isActive(view)) {
        toLastView(store.getters.visitedViews, view);
      }
    };

    const closeOthersTags = () => {
      if (
        selectedTag.value.fullPath !== route.path &&
        selectedTag.value.fullPath !== undefined
      ) {
        router.push(selectedTag.value.fullPath).catch((err) => {
          console.warn(err);
        });
      }
      store.dispatch("tagsView/delOthersViews", selectedTag.value);
      moveToCurrentTag();
    };

    const closeAllTags = (view: TagView) => {
      store.dispatch("tagsView/delAllViews");
      if (affixTags.some((tag) => tag.path === route.path)) {
        return;
      }
      toLastView(store.getters.visitedViews, view);
    };

    const openMenu = (tag: TagView, e: MouseEvent) => {
      const menuMinWidth = 105;
      const offsetLeft = root.value.getBoundingClientRect().left; // container margin left
      const offsetWidth = (root.value as HTMLElement).offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const leftLength = e.clientX - offsetLeft + 15; // 15: margin right
      if (leftLength > maxLeft) {
        left.value = maxLeft;
      } else {
        left.value = leftLength;
      }
      top.value = e.clientY;
      visible.value = true;
      selectedTag.value = tag;
    };

    const handleScroll = () => {
      closeMenu();
    };

    return {
      visible,
      top,
      left,
      selectedTag,
      affixTags,
      scrollPane,
      tag,
      root,
      visitedViews,
      handleScroll,
      openMenu,
      closeAllTags,
      closeOthersTags,
      closeSelectedTag,
      refreshSelectedTag,
      isAffix,
      isActive,
    };
  },
});
</script>

<style lang="scss">
// Reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: rgb(64, 158, 255);
        color: #fff;
        border-color: rgb(64, 158, 255);
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
