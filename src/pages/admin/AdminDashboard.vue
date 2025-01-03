<template>
    <div class="d-flex" id="wrapper">
        <!-- Sidebar -->
        <div class="bg-dark text-white" id="sidebar-wrapper">
            <div class="sidebar-heading text-center py-4">
                <img :src="logo" alt="Logo" class="img-fluid" style="max-height: 50px;" />
            </div>
            <ul class="nav flex-column">
                <li class="nav-item" v-for="item in sidebarItems" :key="item.name">
                    <router-link :to="{ name: item.name }" class="nav-link text-white" @mouseover="onHover($event)"
                        @mouseout="onLeave($event)" :class="{ 'bg-blue': item.isActive }">
                        <i class="me-3" :class="item.icon"></i> {{ item.displayName }}
                    </router-link>
                </li>
            </ul>
            <div class="logout-button mt-auto mb-4">
                <a href="#" class="nav-link text-white" @mouseover="onHover($event)" @mouseout="onLeave($event)"
                    @click="setActiveComponent('Logout')">
                    <i class="bi bi-box-arrow-right"></i> Logout
                </a>
            </div>
        </div>

        <!-- Page Content -->
        <div id="page-content-wrapper" class="flex-grow-1 p-4">
            <component :is="activeComponent" />
        </div>
    </div>
</template>

<script>
import ClassManagement from './ClassManagement.vue';
import EmployeesManagement from './EmployeesManagement.vue';
import FileTrainAIManagement from './FileTrainAIManagement.vue';
import ExamManagement from './ExamManagement.vue';
import ClassroomDetail from './ClassroomDetail.vue';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "vue3-toastify";

export default {
    name: "AdminComponent",
    components: {
        ClassManagement,
        EmployeesManagement,
        FileTrainAIManagement,
        ExamManagement,
        ClassroomDetail
    },
    data() {
        return {
            logo: require('@/assets/logo.png'),
            sidebarItems: [
                // { name: "AnalysisChart", path: '', displayName: "Analysis", icon: "bx bx-line-chart", isActive: false },
                { name: "ClassManagement", path: 'class-management', displayName: "Class", icon: "bi bi-house", isActive: true },
                { name: "EmployeesManagement", path: 'employees-management', displayName: "Employees", icon: "bi bi-people", isActive: false },
                { name: "ExamManagement", path: 'exam-management', displayName: "Exams", icon: "bi bi-journal-text", isActive: false }
            ],
            userInfo: null,
            apiUrl: process.env.VUE_APP_API_URL,
        };
    },
    mounted() {
        this.updateActiveState();
        this.checkUserPermit();
        const loginSuccess = localStorage.getItem('loginSuccess');
        if (loginSuccess) {
            const { type, message, options } = JSON.parse(loginSuccess);
            toast[type](message, options);
            localStorage.removeItem('loginSuccess');
        }
    },
    computed: {
        activeComponent() {
            return this.$route.name || 'AnalysisChart';
        }
    },
    watch: {
        $route() {
            this.updateActiveState();
        }
    },
    methods: {
        async checkUserPermit() {
            const token = localStorage.getItem('token');
            if (token) {
                const tokenInfo = jwtDecode(token);
                const response = await axios.get(this.apiUrl + `/user/${tokenInfo.userName}`);
                this.userInfo = response.data.data;
                console.log("USER INFO FROM ADMIN: ", this.userInfo);
                if (this.userInfo.role === 'STUDENT') {
                    this.$router.push('/not-found');
                }
            } else {
                this.$router.push('/login');
            }
        },
        updateActiveState() {
            const currentPath = this.$route.path;
            this.sidebarItems.forEach(item => {
                item.isActive = (item.path === '' && currentPath === '/admin-dashboard') || (item.path !== '' && currentPath.startsWith(`/admin-dashboard/${item.path}`));
            });
        },
        onHover(event) {
            event.target.classList.add("bg-primary");
        },
        onLeave(event) {
            event.target.classList.remove("bg-primary");
        }
    }
};
</script>


<style scoped>
/* Main color theme */
:root {
    --main-color: #7494ec;
    --hover-bg: rgba(116, 148, 236, 0.1);
}

#wrapper {
    display: flex;
    height: 100vh;
}

#sidebar-wrapper {
    width: 250px;
    height: 100vh;
    background-color: #343a40;
    color: white;
    position: fixed;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-heading {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--main-color);
}

.logo {
    max-height: 50px;
}

.nav-link {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    font-size: 1rem;
    color: white;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
}

.nav-link i {
    font-size: 1.2rem;
    margin-right: 10px;
    color: var(--main-color);
    transition: transform 0.3s;
}

.nav-link span {
    transition: color 0.3s;
}


.hover-effect {
    background-color: var(--hover-bg);
    color: var(--main-color);
}

.hover-effect i {
    transform: scale(1.1);
    color: var(--main-color);
}

.bg-blue {
    background-color: #7494ec;
}

#page-content-wrapper {
    margin-left: 250px;
    padding: 20px;
    width: 100%;
    overflow-x: hidden;
}
</style>
