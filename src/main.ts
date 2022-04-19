import { createApp } from "vue";
import { createPinia } from "pinia";
import { Quasar } from "quasar";
import VueApexCharts from "vue3-apexcharts";

import App from "./App.vue";
import router from "./router";

import "quasar/src/css/index.sass";
import "./assets/css/style.css";
import "@quasar/extras/material-icons/material-icons.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Quasar);
app.use(VueApexCharts);

app.mount("#app");
