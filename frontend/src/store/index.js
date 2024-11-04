//https://blog.logrocket.com/managing-multiple-store-modules-vuex/
import { createStore } from 'vuex'
import user_store from './user_store.js'
import connected_store from './connected_store.js';
import message_store from './message_store.js';
import notifications_store from './notifications_store.js';
import blocked_store from './blocked_store.js';
import matched_store from './matched_store.js';
import logs_store from './logs_store.js';
import tags_store from './tags_store.js';

export default createStore({
   modules: {
    user_store,
    connected_store,
    message_store,
    notifications_store,
    matched_store,
    blocked_store,
    logs_store,
    tags_store
  }
 });