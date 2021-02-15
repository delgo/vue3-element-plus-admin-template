import store from "@/store";
import {
  watch,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  computed,
} from "vue";
import { useRoute } from "vue-router";

const WIDTH = 992;
const { body } = document;

export default function (): void {
  const route = useRoute();

  const isMobile = () => {
    const rect = body.getBoundingClientRect();
    return rect.width - 1 < WIDTH;
  };

  const resizeHandler = () => {
    if (!document.hidden) {
      const isMobileRes = isMobile();
      store.dispatch("app/ToggleDevice", isMobileRes ? "mobile" : "desktop");

      if (isMobileRes) {
        store.dispatch("app/closeSideBar", { withoutAnimation: true });
      }
    }
  };

  const routePath = computed(() => {
    return route.fullPath || route.path;
  });

  watch(routePath, () => {
    if (store.getters.device === "mobile" && store.getters.sidebar.opened) {
      store.dispatch("app/closeSideBar", { withoutAnimation: false });
    }
  });

  onBeforeMount(() => {
    window.addEventListener("resize", resizeHandler);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("resize", resizeHandler);
  });
  onMounted(() => {
    const isMobileRes = isMobile();
    if (isMobileRes) {
      store.dispatch("app/toggleDevice", "mobile");
      store.dispatch("app/closeSideBar", { withoutAnimation: true });
    }
  });
}
