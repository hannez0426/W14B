import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueCookies from "vue-cookies";

// Create the Vue application
const app = createApp(App);

// Enable routing between pages
app.use(router);

// Enable cookies throughout the application
app.use(VueCookies);

// Display the application
app.mount("#app");
