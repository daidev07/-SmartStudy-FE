import { createWebHistory, createRouter } from 'vue-router'

import Homepage from "@/components/Homepage.vue";
import LoginComponent from "@/components/Login.vue";

const routes = [
    { path: '/', component: Homepage },
    { path: '/login', component: LoginComponent }

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;