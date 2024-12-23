import { createWebHistory, createRouter } from 'vue-router'

import Homepage from "@/pages/user/Homepage.vue";
import LoginComponent from "@/components/Login.vue";
import AdminDashboard from '@/pages/admin/AdminDashboard.vue';
import ClassManagement from '@/pages/admin/ClassManagement.vue';
import FileTrainAIManagement from '@/pages/admin/FileTrainAIManagement.vue';
import ExamManagement from '@/pages/admin/ExamManagement.vue';
import EmployeesManagement from '@/pages/admin/EmployeesManagement.vue';
import ClassroomDetail from '@/pages/admin/ClassroomDetail.vue';
import AnalysisChart from '@/pages/admin/AnalysisChart.vue';
import NewFeeds from '@/pages/user/NewFeeds.vue';
import About from '@/pages/user/About.vue';
import DoingGrammarTest from '@/pages/user/DoingGrammarTest.vue';
import MyExercise from '@/pages/user/MyExercise.vue';
import DoingListeningTest from '@/pages/user/DoingListeningTest.vue';
import DoingReadingTest from '@/pages/user/DoingReadingTest.vue';
import DoingWritingTest from '@/pages/user/DoingWritingTest.vue';
import ReportComponent from '@/pages/user/Report.vue';

const routes = [
    { path: '/', component: Homepage,
        children: [
            { path: '', component: NewFeeds },
            { path: 'my-excercise', component: MyExercise },
            { path: 'my-excercise/do-grammar-test/:id', component: DoingGrammarTest, name: 'DoingGrammarTest' },
            { path: 'my-excercise/do-listening-test/:id', component: DoingListeningTest, name: 'DoingListeningTest' },
            { path: 'my-excercise/do-reading-test/:id', component: DoingReadingTest, name: 'DoingReadingTest' },
            { path: 'my-excercise/do-writing-test/:id', component: DoingWritingTest, name: 'DoingWritingTest' },
            { path: 'report', component: ReportComponent},
            { path: 'about', component: About },
        ]
    },
    { path: '/login', component: LoginComponent },
    
    {
        path: '/admin-dashboard',
        component: AdminDashboard,
        children: [
            { path: '', component: AnalysisChart, name: 'AnalysisChart' },
            { path: 'class-management', component: ClassManagement, name: 'ClassManagement'},
            { path: 'class-management/class/:id', component: ClassroomDetail, name: 'ClassroomDetail' },
            { path: 'employees-management', component: EmployeesManagement, name: 'EmployeesManagement' },
            { path: 'file-train-ai-management', component: FileTrainAIManagement, name: 'FileTrainAIManagement' },
            { path: 'exam-management', component: ExamManagement, name: 'ExamManagement' },
        ]
    } 
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;