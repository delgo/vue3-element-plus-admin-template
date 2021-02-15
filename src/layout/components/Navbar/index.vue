<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <el-tooltip content="搜索" effect="dark" placement="bottom">
          <header-search class="right-menu-item" />
        </el-tooltip>
        <el-tooltip content="全屏" effect="dark" placement="bottom">
          <screenfull class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item> 主页 </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click.enter="logout">
              <span style="display: block"> 退出 </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "@/components/Breadcrumb/index.vue";
import Hamburger from "@/components/Hamburger/index.vue";
import HeaderSearch from "@/components/HeaderSearch/index.vue";
import Screenfull from "@/components/Screenfull/index.vue";

export default defineComponent({
  name: "Navbar",
  components: {
    Breadcrumb,
    Hamburger,
    HeaderSearch,
    Screenfull,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const sidebar = computed(() => {
      return store.getters.sidebar;
    });

    const device = computed(() => {
      return store.getters.device.toString();
    });
    const avatar = computed(() => {
      return store.getters.avatar;
    });
    const toggleSideBar = () => {
      store.dispatch("app/ToggleSideBar", false);
    };
    const logout = async () => {
      await store.dispatch("user/LogOut");
      router.push(`/login?redirect=${route.fullPath}`).catch((err) => {
        console.warn(err);
      });
    };
    return {
      sidebar,
      device,
      avatar,
      toggleSideBar,
      logout,
    };
  },
});
</script>

<style lang="scss">
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
