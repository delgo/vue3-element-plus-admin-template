<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variablesTheme.menuBg"
        :text-color="variablesTheme.menuText"
        :active-text-color="menuActiveTextColor"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import SidebarItem from "./SidebarItem.vue";
import variables from "@/styles/_variables.scss";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "SideBar",
  components: {
    SidebarItem,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const sidebar = computed(() => {
      return store.getters.sidebar;
    });
    const routes = computed(() => {
      return store.getters.dynamicRoutes;
    });
    const variablesTheme = computed(() => {
      return variables;
    });
    const menuActiveTextColor = computed(() => {
      return variables.menuActiveText;
    });
    const activeMenu = computed(() => {
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    });
    const isCollapse = computed(() => {
      return !sidebar.value.opened;
    });

    return {
      routes,
      menuActiveTextColor,
      activeMenu,
      isCollapse,
      variablesTheme,
    };
  },
});
</script>

<style lang="scss">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }
  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }
  .el-scrollbar__view {
    height: 100%;
  }
  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }
    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
}
.has-logo {
  .el-scrollbar {
    height: calc(100% - 50px);
  }
}
.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
</style>
