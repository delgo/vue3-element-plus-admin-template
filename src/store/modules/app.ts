import { getSidebarStatus, setSidebarStatus } from "@/utils/cookies";

export enum DeviceType {
  Mobile,
  Desktop,
}

export interface AppState {
  device: DeviceType;
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
  };
}

const state: AppState = {
  device: DeviceType.Desktop,
  sidebar: {
    opened: getSidebarStatus() !== "closed",
    withoutAnimation: false,
  },
};

const mutations = {
  OGGLE_SIDEBAR(state: AppState, withoutAnimation: boolean): void {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = withoutAnimation;
    if (state.sidebar.opened) {
      setSidebarStatus("opened");
    } else {
      setSidebarStatus("closed");
    }
  },
  CLOSE_SIDEBAR(state: AppState, withoutAnimation: boolean): void {
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
    setSidebarStatus("closed");
  },
  TOGGLE_DEVICE(state: AppState, device: DeviceType): void {
    state.device = device;
  },
  TOGGLE_SIDEBAR(state: AppState, withoutAnimation: boolean): void {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = withoutAnimation;
    if (state.sidebar.opened) {
      setSidebarStatus("opened");
    } else {
      setSidebarStatus("closed");
    }
  },
};

const actions = {
  // eslint-disable-next-line
  ToggleSideBar({ commit }: any, withoutAnimation: boolean) {
    commit("TOGGLE_SIDEBAR", withoutAnimation);
  },
  // eslint-disable-next-line
  CloseSideBar({ commit }: any, withoutAnimation: boolean) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  // eslint-disable-next-line
  ToggleDevice({ commit }: any, device: DeviceType) {
    commit("TOGGLE_DEVICE", device);
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
