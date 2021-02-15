<template>
  <div />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {
  useRoute,
  useRouter,
  RouteLocationNormalizedLoaded,
  Router,
} from "vue-router";
export default defineComponent({
  name: "Redirect",
  setup() {
    const route: RouteLocationNormalizedLoaded = useRoute(); //路由信息
    const router: Router = useRouter(); //使用路由
    const { params, query } = route;
    const { path } = params;
    router.replace({ path: "/" + path, query }).catch((err) => {
      console.warn(err);
    });
  },
});
</script>
