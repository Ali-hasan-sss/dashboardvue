import Vue from "vue";
import App from "./App.vue";
import router from "./Routes";
import store from "./store/index";
import vuetify from "./plugins/vuetify";
import "vue-toastification/dist/index.css";
import axios from "./plugins/axios";
import components from "./components";
import toastnotification from "@/plugins/toastification";
//import dropZone from "@/plugins/drop-zone"
import Vue2Editor from "vue2-editor";
import * as VueGoogleMaps from "vue2-google-maps";
import { initializeApp } from "firebase/app";
//import 'firebase/messaging';
Vue.prototype.$http = axios; // توفير axios عبر Vue instance
const firebaseConfig = {
  apiKey: "AIzaSyCkOgAvwQpwZbTJwmp6_l25TAddoS9_Bok",
  authDomain: "swesshome-29b19.firebaseapp.com",
  projectId: "swesshome-29b19",
  storageBucket: "swesshome-29b19.appspot.com",
  messagingSenderId: "596503096403",
  appId: "1:596503096403:web:0ac55353976d3f8e386aa6",
  measurementId: "G-KFX1V5RN1H",
};
const app = initializeApp(firebaseConfig);
Vue.config.productionTip = false;

export default new Vue({
  vuetify,
  router,
  components,
  axios,
  store,
  toastnotification,
  //dropZone,
  render: (h) => h(App),
}).$mount("#app");

Vue.use(Vue2Editor);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyB7OXmzfQYua_1LEhRdqsoYzyJOPh9hGLg",
    libraries: "places", // Add any additional libraries you need
  },
});
