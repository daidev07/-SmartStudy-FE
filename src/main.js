import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'boxicons'
import 'boxicons/css/boxicons.min.css'
import store from './store/store.js';


const app = createApp(App);
app.use(router);
app.use(store);
app.mount('#app');