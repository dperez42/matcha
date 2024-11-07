import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { socket } from './services/socket'
import router from './router'
import store from './store/index.js'
//import Vue3Toastify, { type ToastOptions } from 'vue3-toastify';

// Data Pocker
// https://vue3datepicker.com/installation/
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

loadFonts()
const app = createApp(App)

axios.defaults.baseURL = import.meta.env.VITE_APP_SERVER_API===undefined ? 'http://localhost:3000':import.meta.env.VITE_APP_SERVER_API;
//const server_baseURL = import.meta.env.VITE_APP_SERVER_API===undefined ? 'http://localhost:3000':import.meta.env.VITE_APP_SERVER_API;
console.log(import.meta.env.VITE_APP_SERVER_API)
//define global variables, use everywhere as this.$APP_SERVER_API
app.config.globalProperties.$APP_SERVER_API = import.meta.env.VITE_APP_SERVER_API===undefined ? 'http://localhost:3000':import.meta.env.VITE_APP_SERVER_API;
app.config.globalProperties.$REGISTER_NO_VERIFICATION = import.meta.env.VITE_REGISTER_NO_VERIFICATION===undefined ? 'true' :import.meta.env.VITE_REGISTER_NO_VERIFICATION;
app.config.globalProperties.$REGISTER_CODE_VERIFICATION = import.meta.env.VITE_REGISTER_CODE_VERIFICATION===undefined ? 'true' :import.meta.env.VITE_REGISTER_CODE_VERIFICATION;
app.config.globalProperties.$REGISTER_EMAIL_VERIFICATION = import.meta.env.VITE_REGISTER_EMAIL_VERIFICATION===undefined ? 'true' :import.meta.env.VITE_REGISTER_EMAIL_VERIFICATION;
app.config.globalProperties.$DEBUG = import.meta.env.VITE_DEBUG===undefined ? false : import.meta.env.VITE_DEBUG;
app.config.globalProperties.$RATING = import.meta.env.VITE_RATING===undefined ? 1 : import.meta.env.VITE_RATING;
app.config.globalProperties.$AUTH = import.meta.env.VITE_AUTH===undefined ? false : import.meta.env.VITE_AUTH;
/*
const defaultToastOptions: ToastOptions = {
    autoClose: 2000,
    position: "bottom-right",
  };
*/
app.provide('globalVar', 'some globalVar')
app.provide('$matchaSocket', socket);
app.use(vuetify)
app.use(router)
app.use(store)
//app.use(Vue3Toastify, defaultToastOptions);
app.component('VueDatePicker', VueDatePicker); 
app.mount('#app')