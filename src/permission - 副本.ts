import router from "./router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { ElMessage } from "element-plus";
import store from "./store";
import settings from "./settings";
import { toRaw } from "vue";
import { RouteRecordRaw } from "vue-router";
// import Layout from "@/layout/index.vue";
// import _import from "./router/_import";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login", "/auth-redirect"];

const getPageTitle = (key: string) => {
  return key || `${settings.title}`;
};
// eslint-disable-next-line
const state = toRaw(store.state) as any;

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
      // 如果获取到动态路由
      const dynamicRoutes = state.permission.dynamicRoutes;
      if (!(dynamicRoutes.length > 0)) {
        try {
          const { asyncRoutes } = await store.dispatch("user/GetUserInfo");
          console.log("get", asyncRoutes);
          //设置权限路由
          store.dispatch("permission/GenerateRoutes", asyncRoutes);
          console.log("to", to.path);
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
        console.log("t", to.path);
        const routes = state.permission.routes;
        if (
          !filterDynamicRoutesHasAuth(to.path, routes) &&
          to.path !== "/401"
        ) {
          console.log(1);
          router.push("/401");
        }
      }
    }
  } else {
    // 没有token
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
  let res = false;
  routes.filter((route: any) => {
    console.log(route.path, to);
    if (to.includes(route.path)) {
      res = true;
      return;
    }
    if (route.children && route.children.length) {
      route.children = filterDynamicRoutesHasAuth(to, route.children);
    }
  });
  console.log("res", res);
  return res;
}
// 遍历后台传来的路由字符串，转换为组件对象
// function filterAsyncRouter(asyncRouterMap: RouteRecordRaw[]): RouteRecordRaw[] {
//   const routes = asyncRouterMap;
//   // eslint-disable-next-line
//   const accessedRouters = routes.filter((route: any) => {
//     if (route.component === "Layout") {
//       route.component = Layout;
//     } else {
//       route.component = _import(route.component); // 导入组件
//     }
//     if (route.children && route.children.length) {
//       route.children = filterAsyncRouter(route.children);
//     }
//     return true;
//   });
//   return accessedRouters;
// }
