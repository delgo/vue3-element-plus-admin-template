import Cookies from "js-cookie";

// App
const sidebarStatusKey = "sidebar_status";
export const getSidebarStatus = (): string => Cookies.get(sidebarStatusKey);
export const setSidebarStatus = (sidebarStatus: string): void =>
  Cookies.set(sidebarStatusKey, sidebarStatus);

// User
const tokenKey = "token";
export const getToken = (): string => Cookies.get(tokenKey);
export const setToken = (token: string): void => Cookies.set(tokenKey, token);
export const removeToken = (): void => Cookies.remove(tokenKey);
