<template>
  <div id="header-search" :class="{ show: show }" class="header-search">
    <svg-icon class="search-icon" icon-class="search" @click.stop="click" />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="item in options.value"
        :key="item.path"
        :value="item"
        :label="item.meta.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import {
  watch,
  defineComponent,
  onMounted,
  reactive,
  ref,
  nextTick,
} from "vue";
import path from "path";
import Fuse from "fuse.js"; // A lightweight fuzzy-search module
import { useRouter, RouteRecordRaw } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  name: "HeaderSearch",
  setup() {
    const store = useStore();
    const router = useRouter();
    const search = ref("");
    const headerSearchSelect = ref();
    const show = ref(false);
    const options: { value: RouteRecordRaw[] } = reactive({ value: [] });
    const searchPool: { value: RouteRecordRaw[] } = reactive({ value: [] });
    // eslint-disable-next-line
    let fuse: any = undefined;
    const routes = store.getters.routes;

    // Filter out the routes that can be displayed in the sidebar
    // And generate the internationalized title
    const generateRoutes = (
      routes: RouteRecordRaw[],
      basePath = "/",
      prefixTitle: string[] = []
    ) => {
      let res: RouteRecordRaw[] = [];
      for (const router of routes) {
        // skip hidden router
        if (router.meta && router.meta.hidden) {
          continue;
        }
        // eslint-disable-next-line
        const data: any = {
          path: path.resolve(basePath, router.path),
          meta: {
            title: [...prefixTitle],
          },
        };
        if (router.meta && router.meta.title) {
          // generate internationalized title
          data.meta.title = [...data.meta.title, router.meta.title];
          if (router.redirect !== "noRedirect") {
            // only push the routes with title
            // special case: need to exclude parent router without redirect
            res.push(data);
          }
        }
        // recursive child routes
        if (router.children) {
          const tempRoutes = generateRoutes(
            router.children,
            data.path,
            data.meta.title
          );
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes];
          }
        }
      }
      return res;
    };

    watch(routes, () => {
      searchPool.value = generateRoutes(routes);
    });

    const initFuse = (list: RouteRecordRaw[]) => {
      fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [
          {
            name: "meta.title",
            weight: 0.7,
          },
          {
            name: "path",
            weight: 0.3,
          },
        ],
      });
    };

    watch(
      () => searchPool.value,
      (value: RouteRecordRaw[]) => {
        initFuse(value);
      }
    );

    watch(show, (value: boolean) => {
      if (value) {
        document.body.addEventListener("click", close);
      } else {
        document.body.removeEventListener("click", close);
      }
    });

    onMounted(() => {
      searchPool.value = generateRoutes(routes);
    });

    const click = () => {
      show.value = !show.value;
      if (show.value) {
        headerSearchSelect.value &&
          (headerSearchSelect.value as HTMLElement).focus();
      }
    };

    const close = () => {
      headerSearchSelect.value &&
        (headerSearchSelect.value as HTMLElement).blur();
      options.value = [];
      show.value = false;
    };

    const change = (route: RouteRecordRaw) => {
      router.push(route.path).catch((err) => {
        console.warn(err);
      });
      search.value = "";
      options.value = [];
      nextTick(() => {
        show.value = false;
      });
    };

    const querySearch = (query: string) => {
      if (query !== "") {
        if (fuse) {
          // eslint-disable-next-line
          options.value = fuse.search(query).map((result: any) => result.item);
        }
      } else {
        options.value = [];
      }
    };

    return {
      headerSearchSelect,
      options,
      search,
      querySearch,
      change,
      click,
      show,
    };
  },
});
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;
  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }
  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;
    .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }
  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
