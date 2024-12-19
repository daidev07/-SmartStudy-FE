import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'boxicons'
import 'boxicons/css/boxicons.min.css'
import store from './store/store.js';


const app = createApp(App);
app.use(router);
app.use(store);
app.directive('tooltip', {
    mounted(el, binding) {
        el._tooltipInstance = new bootstrap.Tooltip(el, {
            title: binding.value,
            placement: binding.arg || 'top'
        });
    },
    beforeUnmount(el) {
        const instance = bootstrap.Tooltip.getInstance(el);
        if (instance) {
            instance.dispose();
        }
    }
});


app.mount('#app');