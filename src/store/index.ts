import { createStore } from "vuex";
import app from "./modules/app";
import permission from "./modules/permission";
import tagsView from "./modules/tagsView";
import user from "./modules/user";
import getters from "./getters";
export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    app,
    permission,
    tagsView,
    user,
  },
  getters,
});
