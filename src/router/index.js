import { createWebHistory, createRouter } from 'vue-router'

import Homepage from "@/components/Homepage.vue";
import LoginComponent from "@/components/Login.vue";
import AdminDashboard from '@/pages/admin/AdminDashboard.vue';
import ClassManagement from '@/pages/admin/ClassManagement.vue';
import FileTrainAIManagement from '@/pages/admin/FileTrainAIManagement.vue';
import TOEICTestsManagement from '@/pages/admin/TOEICTestsManagement.vue';
import EmployeesManagement from '@/pages/admin/EmployeesManagement.vue';
import AnalysisChart from '@/pages/admin/AnalysisChart.vue';

const routes = [
    { path: '/', component: Homepage },
    { path: '/login', component: LoginComponent },

    {
        path: '/admin-dashboard',
        component: AdminDashboard,
        children: [
            { path: 'class-management', component: ClassManagement, name: 'ClassManagement' },
            { path: 'employees-management', component: EmployeesManagement, name: 'EmployeesManagement' },
            { path: 'file-train-ai-management', component: FileTrainAIManagement, name: 'FileTrainAIManagement' },
            { path: 'toeic-tests-management', component: TOEICTestsManagement, name: 'ToeicTestsManagement' },
            { path: '', component: AnalysisChart, name: 'AnalysisChart' }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;