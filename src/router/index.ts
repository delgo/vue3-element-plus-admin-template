import { createRouter, RouteRecordRaw, createWebHashHistory } from "vue-router";
/* Layout */
import Layout from "@/layout/index.vue";
import _import from "./_import";

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect.vue"),
    meta: { hidden: true },
  },
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "控制面板",
          icon: "dashboard",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: { hidden: true },
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401.vue"),
    meta: { hidden: true },
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
    meta: { hidden: true },
  },
];

export const asyncRoutes = [
  {
    meta: {
      icon: "lock",
      title: "权限管理",
    },
    name: "permission",
    path: "/permission",
    children: [
      {
        meta: {
          icon: "lock",
          title: "角色管理",
        },
        name: "role",
        path: "role",
        component: "/permission/role",
      },
      {
        meta: {
          icon: "lock",
          title: "帐户管理",
        },
        name: "account",
        path: "account",
        component: "/permission/account",
      },
    ],
    redirect: "/permission/account",
    component: "Layout",
  },
];
//vue 3写法
//const routerHistory = createWebHistory();

//决定路由模式
//const isPro: boolean = process.env.NODE_ENV === "prodution";
//开辟新内存空间，原asyncRoutes Component作为字符串存储在后端
const r = JSON.parse(JSON.stringify(asyncRoutes));
const setRouter = () =>
  createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes: [...constantRoutes, ...filterAsyncRouter(r)],
    // eslint-disable-next-line
    scrollBehavior: (savedPosition: any) => {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    },
  });

const router = setRouter();
//导航守卫
router.beforeEach((to) => {
  document.title = to.meta.title;
});

export function resetRouter(): void {
  const newRouter = setRouter();
  // eslint-disable-next-line
  (router as any).matcher = (newRouter as any).matcher; //reset router
}

export default router;

//格式化asynvRouter载入组件
// eslint-disable-next-line
function filterAsyncRouter(asyncRouterMap: any[]): RouteRecordRaw[] {
  const routes = asyncRouterMap;
  // eslint-disable-next-line
  const accessedRouters = routes.filter((route: any) => {
    if (route.component === "Layout") {
      route.component = Layout;
    } else {
      route.component = _import(route.component); // 导入组件
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children);
    }
    return true;
  });
  return accessedRouters;
}
