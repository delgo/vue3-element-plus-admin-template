import router, { asyncRoutes, constantRoutes } from "./router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ElMessage } from "element-plus";
import store from "./store";
import settings from "./settings";
import { RouteRecordRaw } from "vue-router";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login", "/auth-redirect"];

const getPageTitle = (key: string) => {
  return key || `${settings.title}`;
};
// eslint-disable-next-line
const state = store.state as any;

router.beforeEach(async (to) => {
  // Start progress bar
  NProgress.start();
  const hasToken = store.getters.token;
  // 判断用户是否登录
  if (hasToken) {
    if (to.path === "/login") {
      // 如果登录返回主页
      router.push("/");
      NProgress.done();
    } else {
      // 动态路由
      const hasAsyncRoutes = state.permission.dynamicRoutes.length > 0;
      if (!hasAsyncRoutes) {
        try {
          const { asyncRoutes } = await store.dispatch("user/GetUserInfo");
          store.dispatch("permission/GenerateRoutes", asyncRoutes);
          router.push({ path: to.path, replace: true });
        } catch (err) {
          console.log("cleartoken", err);
          // 清除token返回登陆页面
          store.dispatch("user/ResetToken");
          ElMessage.error(err || "Has Error");
          router.push(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      } else {
        //权限判断
        if (to.path !== "/401" && to.path !== "/404") {
          const dynamicoutes = store.getters.routes;
          const isHasAuth = filterDynamicRoutesHasAuth(to.path, dynamicoutes);
          const allRoutes = [...constantRoutes, ...asyncRoutes];
          const isHasPage = filterDynamicRoutesHasPage(to.path, allRoutes);
          if (!isHasAuth && isHasPage) {
            router.push("/401");
          } else if (!isHasPage) {
            router.push("/404");
          }
        }
      }
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) === -1) {
      router.push(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach((to) => {
  // Finish progress bar
  NProgress.done();
  // set page title
  document.title = getPageTitle(to.meta.title);
});

function filterDynamicRoutesHasAuth(
  to: string,
  routes: RouteRecordRaw[]
): boolean {
  if (to.includes("dashboard") || to === "/") {
    return true;
  }
  // 假设不在，在则返回true
  let res = false;
  // eslint-disable-next-line
  routes.filter((r: any) => {
    const rArray = to.split("/");
    if (r.children && r.children.length) {
      res = filterDynamicRoutesHasAuth(to, r.children);
      if (res) {
        return res;
      }
    }
    if (r.path.includes(rArray[rArray.length - 1])) {
      res = true;
      return;
    }
  });
  return res;
}
// eslint-disable-next-line
function filterDynamicRoutesHasPage(to: string, routes: any[]): boolean {
  if (to.includes("dashboard") || to === "/") {
    return true;
  }
  let res = false;
  // eslint-disable-next-line
  routes.filter((r: any) => {
    const rArray = to.split("/");
    if (r.children && r.children.length) {
      res = filterDynamicRoutesHasPage(to, r.children);
      if (res) {
        return res;
      }
    }
    if (r.path.includes(rArray[rArray.length - 1])) {
      res = true;
      return;
    }
  });
  return res;
}
