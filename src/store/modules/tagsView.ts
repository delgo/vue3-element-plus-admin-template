import { RouteLocationNormalized } from "vue-router";

export interface TagView extends Partial<RouteLocationNormalized> {
  title?: string;
  children?: TagView[];
}

export interface TagsViewState {
  visitedViews: TagView[];
  cachedViews: (string | undefined | symbol)[];
}

const state: TagsViewState = {
  visitedViews: [],
  cachedViews: [],
};

const mutations = {
  ADD_VISITED_VIEW(state: TagsViewState, view: TagView): void {
    if (state.visitedViews.some((v) => v.path === view.path)) return;
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta ? view.meta.title : "" || "no-name",
      })
    );
  },
  ADD_CACHED_VIEW(state: TagsViewState, view: TagView): void {
    if (view.name === null) return;
    if (state.cachedViews.includes(view.name)) return;
    if (view.meta) {
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name);
      }
    }
  },
  DEL_VISITED_VIEW(state: TagsViewState, view: TagView): void {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1);
        break;
      }
    }
  },
  DEL_CACHED_VIEW(state: TagsViewState, view: TagView): void {
    if (view.name === null) return;
    const index = state.cachedViews.indexOf(view.name);
    index > -1 && state.cachedViews.splice(index, 1);
  },
  DEL_OTHERS_VISITED_VIEWS(state: TagsViewState, view: TagView): void {
    state.visitedViews = state.visitedViews.filter((v) => {
      return (v.meta ? v.meta.affix : "") || v.path === view.path;
    });
  },
  DEL_OTHERS_CACHED_VIEWS(state: TagsViewState, view: TagView): void {
    if (view.name === null) return;
    const index = state.cachedViews.indexOf(view.name);
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1);
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = [];
    }
  },
  DEL_ALL_VISITED_VIEWS(state: TagsViewState): void {
    // keep affix tags
    const affixTags = state.visitedViews.filter((tag) =>
      tag.meta ? tag.meta.affix : ""
    );
    state.visitedViews = affixTags;
  },
  DEL_ALL_CACHED_VIEWS(state: TagsViewState): void {
    state.cachedViews = [];
  },
  UPDATE_VISITED_VIEW(state: TagsViewState, view: TagView): void {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view);
        break;
      }
    }
  },
};

const actions = {
  // eslint-disable-next-line
  addView({ commit }: any, view: TagView) {
    commit("ADD_VISITED_VIEW", view);
    commit("ADD_CACHED_VIEW", view);
  },
  // eslint-disable-next-line
  addVisitedView({ commit }: any, view: TagView) {
    commit("ADD_VISITED_VIEW", view);
  },
  // eslint-disable-next-line
  delView({ commit }: any, view: TagView) {
    commit("DEL_VISITED_VIEW", view);
    commit("DEL_CACHED_VIEW", view);
  },
  // eslint-disable-next-line
  delCachedView({ commit }: any, view: TagView) {
    commit("DEL_CACHED_VIEW", view);
  },
  // eslint-disable-next-line
  delOthersViews({ commit }:any, view: TagView) {
    commit("DEL_OTHERS_VISITED_VIEWS", view);
    commit("DEL_OTHERS_CACHED_VIEWS", view);
  },
  // eslint-disable-next-line
  delAllViews({ commit }:any) {
    commit("DEL_ALL_VISITED_VIEWS");
    commit("DEL_ALL_CACHED_VIEWS");
  },
  // eslint-disable-next-line
  delAllCachedViews({ commit }: any) {
    commit("DEL_ALL_CACHED_VIEWS");
  },
  // eslint-disable-next-line
  updateVisitedView({commit}:any, view: TagView) {
    commit("UPDATE_VISITED_VIEW", view);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
