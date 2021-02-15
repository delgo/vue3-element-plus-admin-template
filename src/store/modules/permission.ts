import { constantRoutes } from "@/router";
import { RouteRecordRaw } from "vue-router";

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
    state.dynamicRoutes = routes;
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
