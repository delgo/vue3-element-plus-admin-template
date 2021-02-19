import { constantRoutes } from "@/router";
import { RouteRecordRaw } from "vue-router";

// eslint-disable-next-line
export const filterAsyncRoutes = (routes: any[]): RouteRecordRaw[] => {
  const res: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const r = { ...route };
    if (!route.meta.hidden) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children);
      }
      res.push(r);
    }
  });
  return res;
};

export interface PermissionState {
  routes: RouteRecordRaw[];
  dynamicRoutes: RouteRecordRaw[];
}

const state: PermissionState = {
  routes: [],
  dynamicRoutes: [],
};

const mutations = {
  SET_ROUTES(state: PermissionState, routes: RouteRecordRaw[]): void {
    state.routes = constantRoutes.concat(routes);
    state.dynamicRoutes = constantRoutes.concat(filterAsyncRoutes(routes));
  },
};

const actions = {
  // eslint-disable-next-line
  GenerateRoutes({ commit }: any, asyncRoutes: RouteRecordRaw[]) {
    commit("SET_ROUTES", asyncRoutes);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
