<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb" enter-from-class="breadcrumb-enter">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs.value"
        :key="item.path"
      >
        <span
          v-if="
            item.redirect === 'noredirect' ||
            index === breadcrumbs.value.length - 1
          "
          class="no-redirect"
          >{{ item.meta.title }}</span
        >
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, computed } from "vue";
import { compile } from "path-to-regexp";
import { RouteRecordRaw, useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "Breadcrumb",
  setup() {
    const route = useRoute();
    const router = useRouter();
    let breadcrumbs: { value: RouteRecordRaw[] } = reactive({ value: [] });

    const pathCompile = (path: string) => {
      const { params } = route;
      const toPath = compile(path);
      return toPath(params);
    };
    const isDashboard = (route: RouteRecordRaw) => {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return (
        name.toString().trim().toLocaleLowerCase() ===
        "Dashboard".toLocaleLowerCase()
      );
    };
    // eslint-disable-next-line
    const handleLink = (item: any) => {
      const { redirect, path } = item;
      if (redirect) {
        router.push(redirect).catch((err) => {
          console.warn(err);
        });
        return;
      }
      router.push(pathCompile(path)).catch((err) => {
        console.warn(err);
      });
    };

    const getBreadcrumb = () => {
      let matched = route.matched.filter(
        (item) => item.meta && item.meta.title
      );
      const first = matched[0];
      if (!isDashboard(first)) {
        matched = [
          {
            path: "/dashboard",
            meta: { title: "控制面板" },
            // eslint-disable-next-line
          } as any,
        ].concat(matched);
      }
      breadcrumbs.value = matched.filter((item) => {
        return item.meta && item.meta.title && item.meta.breadcrumb !== false;
      });
    };

    getBreadcrumb();
    // 避免资源浪费 https://github.com/vuejs/vue-next/issues/2027
    const routePath = computed(() => {
      return route.fullPath || route.path;
    });
    watch(routePath, () => {
      if (route.path.startsWith("/redirect/")) {
        return;
      }
      getBreadcrumb();
    });

    return {
      breadcrumbs,
      handleLink,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
