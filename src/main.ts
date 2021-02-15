import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";

import "element-plus/lib/theme-chalk/index.css";

import locale from "element-plus/lib/locale/lang/zh-cn";

import "default-passive-events"; //Chrome 事件捕获机制－Passive Event Listeners

import "@/permission"; //permission control

import "@/styles/element-variables.scss";

import "@/styles/index.scss";
import SvgIcon from "@/components/SvgIcon/index.vue";
import "@/icons"; //icons

const app = createApp(App);

app.component("svg-icon", SvgIcon);
app.use(store);
app.use(router);
app.use(ElementPlus, { locale });
app.mount("#app");
