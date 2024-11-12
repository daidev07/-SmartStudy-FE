import { createWebHistory, createRouter } from 'vue-router'

import Homepage from "@/components/Homepage.vue";
import LoginComponent from "@/components/Login.vue";
import AdminDashboard from '@/pages/admin/AdminDashboard.vue';
import ClassManagement from '@/pages/admin/ClassManagement.vue';
import FileTrainAIManagement from '@/pages/admin/FileTrainAIManagement.vue';
import TOEICTestsManagement from '@/pages/admin/TOEICTestsManagement.vue';
import EmployeesManagement from '@/pages/admin/EmployeesManagement.vue';

const routes = [
    { path: '/', component: Homepage },
    { path: '/login', component: LoginComponent },

    { path: '/admin-dashboard', component: AdminDashboard },
    { path: '/class-management', component: ClassManagement },
    { path: '/employees-management', component: EmployeesManagement },
    { path: '/file-train-ai-management', component: FileTrainAIManagement },
    { path: '/toeic-tests-management', component: TOEICTestsManagement },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;