<template>
  <div
    v-if="!item.meta || !item.meta.hidden"
    :class="[
      isCollapse ? 'simple-mode' : 'full-mode',
      { 'first-level': isFirstLevel },
    ]"
  >
    <template
      v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children"
    >
      <sidebar-item-link
        v-if="theOnlyOneChild.meta"
        :to="resolvePath(theOnlyOneChild.path)"
      >
        <el-menu-item
          :index="resolvePath(theOnlyOneChild.path)"
          :class="{ 'sub-menu-title-noDropdown': isFirstLevel }"
        >
          <svg-icon
            v-if="theOnlyOneChild.meta.icon"
            :icon-class="theOnlyOneChild.meta.icon"
          />
          <template #title>
            <span v-if="theOnlyOneChild.meta.title">
              {{ theOnlyOneChild.meta.title }}
            </span>
          </template>
        </el-menu-item>
      </sidebar-item-link>
    </template>
    <el-sub-menu v-else :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <svg-icon
          v-if="item.meta && item.meta.icon"
          :icon-class="item.meta.icon"
        />
        <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import path from "path";
import { PropType } from "vue";
import { isExternal } from "@/utils/validate";
import SidebarItemLink from "./SidebarItemLink.vue";
import { RouteRecordRaw } from "vue-router";

export default defineComponent({
  name: "SidebarItem",
  components: {
    SidebarItemLink,
  },
  props: {
    item: {
      type: Object as PropType<RouteRecordRaw>,
      required: true,
    },
    isCollapse: {
      type: Boolean,
      default: false,
    },
    isFirstLevel: {
      type: Boolean,
      default: true,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const alwaysShowRootMenu = computed(() => {
      if (props.item.meta && props.item.meta.alwaysShow) {
        return true;
      }
      return false;
    });
    const showingChildNumber = computed((): number => {
      if (props.item.children) {
        const showingChildren = props.item.children.filter((item) => {
          if (item.meta && item.meta.hidden) {
            return false;
          } else {
            return true;
          }
        });
        return showingChildren.length;
      }
      return 0;
    });

    const theOnlyOneChild = computed(() => {
      if (showingChildNumber.value > 1) {
        return null;
      }
      if (props.item.children) {
        for (const child of props.item.children) {
          if (!child.meta || !child.meta.hidden) {
            return child;
          }
        }
      }
      // If there is no children, return itself with path removed,
      // because this.basePath already conatins item's path information
      return { ...props.item, path: "" };
    });
    const resolvePath = (routePath: string) => {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(props.basePath)) {
        return props.basePath;
      }
      return path.resolve(props.basePath, routePath);
    };

    return {
      alwaysShowRootMenu,
      showingChildNumber,
      theOnlyOneChild,
      resolvePath,
    };
  },
});
</script>
<style lang="scss">
.simple-mode.first-level .sub-menu-title-noDropdown div {
  padding: 0 !important; //奇怪的问题
}
.el-sub-menu.is-active > .el-sub-menu__title {
  color: $subMenuActiveText !important;
}
.full-mode {
  .nest-menu .el-sub-menu > .el-sub-menu__title,
  .el-sub-menu .el-menu-item {
    min-width: $sideBarWidth !important;
    background-color: $subMenuBg !important;
    &:hover {
      background-color: $subMenuHover !important;
    }
  }
}
.simple-mode {
  &.first-level {
    .sub-menu-title-noDropdown {
      padding: 0 !important;
      position: relative;
      .el-tooltip {
        padding: 0 !important;
      }
    }
    .el-sub-menu {
      overflow: hidden;
      & > .el-sub-menu__title {
        padding: 0px !important;
        .el-sub-menu__icon-arrow {
          display: none;
        }
        & > span {
          visibility: hidden;
        }
      }
    }
  }
}
.el-sub-menu > .el-sub-menu__title {
  //2.2.2 element-plus 默认为flex
  display: inherit;
}
</style>

<style lang="scss" scoped>
.svg-icon {
  margin-right: 16px;
}
.simple-mode {
  .svg-icon {
    margin-left: 20px;
  }
}
</style>
