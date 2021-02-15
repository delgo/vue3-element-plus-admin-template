import { login, /**logout,**/ getUserInfo } from "@/api/users";
import { getToken, setToken, removeToken } from "@/utils/cookies";
import router, { resetRouter } from "@/router";
import { RouteRecordRaw } from "vue-router";

export interface UserState {
  token: string;
  name: string;
  avatar: string;
  introduction: string;
  roleKey: string;
  email: string;
  asyncRoutes: RouteRecordRaw[];
}

const state: UserState = {
  token: getToken() || "",
  name: "",
  avatar: "",
  introduction: "",
  roleKey: "",
  email: "",
  asyncRoutes: [],
};

const mutations = {
  SET_TOKEN(state: UserState, token: string): void {
    state.token = token;
  },
  SET_NAME(state: UserState, name: string): void {
    state.name = name;
  },
  SET_AVATAR(state: UserState, avatar: string): void {
    state.avatar = avatar;
  },
  SET_INTRODUCTION(state: UserState, introduction: string): void {
    state.introduction = introduction;
  },
  SET_ROLEKEY(state: UserState, roleKey: string): void {
    state.roleKey = roleKey;
  },
  SET_ASYNCROUTES(state: UserState, asyncRoutes: RouteRecordRaw[]): void {
    state.asyncRoutes = asyncRoutes;
  },
  SET_EMAIL(state: UserState, email: string): void {
    state.email = email;
  },
};
const actions = {
  // user login
  async Login(
    // eslint-disable-next-line
    { commit }: any,
    userInfo: { username: string; password: string }
  ): Promise<void> {
    const password = userInfo.password;
    const username = userInfo.username.trim();
    const { data } = await login({ username, password });
    const token = data.tokenType + " " + data.accessToken; //拼合.net token
    setToken(token);
    commit("SET_TOKEN", token);
  },

  // get user info
  // eslint-disable-next-line
  async GetUserInfo({ commit, state }: any) {
    if (state.token === "") {
      throw Error("GetUserInfo: token未定义!");
    }
    const { data } = await getUserInfo();
    if (!data) {
      throw Error("验证失败，请重新登录!");
    }
    const { asyncRoutes, roleKey, name, avatar, introduction, email } = data;

    if (!roleKey || roleKey.length <= 0) {
      throw Error("GetUserInfo: 未获取roleKey!");
    }

    if (!asyncRoutes || asyncRoutes.length <= 0) {
      throw Error("GetUserInfo: 未获取asyncRoutes!");
    }

    commit("SET_ROLEKEY", roleKey);
    commit("SET_ASYNCROUTES", asyncRoutes);
    commit("SET_NAME", name);
    commit("SET_AVATAR", avatar);
    commit("SET_INTRODUCTION", introduction);
    commit("SET_EMAIL", email);
    return data;
  },

  // user logout
  // eslint-disable-next-line
  async LogOut({commit, state, dispatch }:any) {
    if (state.token === "") {
      throw Error("LogOut: token未定义!");
    }
    //jwt 不需要
    //await logout();
    removeToken();
    resetRouter();
    // Reset visited views and cached views
    dispatch("tagsView/delAllViews", "", { root: true });

    commit("SET_TOKEN", "");
    commit("SET_ROLEKEY", "");
  },
  // eslint-disable-next-line
  async ChangeRoles({ commit, dispatch, rootState }: any, role: string) {
    // Dynamically modify permissions
    const token = role + "-token";
    commit("SET_TOKEN", token);
    setToken(token);
    await dispatch("GetUserInfo");
    resetRouter();
    // Generate dynamic accessible routes based on roles
    dispatch("permission/GenerateRoutes");
    // Add generated routes
    router.addRoute(rootState.permission.dynamicRoutes);
    // Reset visited views and cached views
    dispatch("tagsView/delAllViews");
  },

  // remove token
  // eslint-disable-next-line
  ResetToken({ commit }: any) {
    removeToken();
    commit("SET_TOKEN", "");
    commit("SET_ROLEKEY", "");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
