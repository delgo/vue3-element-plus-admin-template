<template>
  <div :class="classObj" class="app-wrapper">
    <div
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <navbar />
      <tags-view />
      <app-main />
    </div>
  </div>
</template>

<script lang="ts">
import { AppMain, Navbar, TagsView, Sidebar } from "./components";
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { computed } from "vue";
import ResizeMixin from "./mixin/Resize";

export default defineComponent({
  name: "Layout",
  components: {
    Navbar,
    AppMain,
    TagsView,
    Sidebar,
  },
  setup() {
    const store = useStore();
    const mixin = ResizeMixin();

    const classObj = computed(() => {
      return {
        hideSidebar: !store.getters.sidebar.opened,
        openSidebar: store.getters.sidebar.opened,
        withoutAnimation: store.getters.sidebar.withoutAnimation,
        mobile: store.getters.device === "mobile",
      };
    });
    const handleClickOutside = () => {
      store.dispatch("app/CloseSideBar", false);
    };
    return {
      classObj,
      handleClickOutside,
      mixin,
    };
  },
});
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
}
.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}
.hideSidebar {
  .main-container {
    margin-left: 54px;
  }
  .sidebar-container {
    width: 54px !important;
  }
  .fixed-header {
    width: calc(100% - 54px);
  }
}
/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }
  .sidebar-container {
    transition: transform 0.28s;
    width: $sideBarWidth !important;
  }
  &.openSidebar {
    position: fixed;
    top: 0;
  }
  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }
  .fixed-header {
    width: 100%;
  }
}
.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
