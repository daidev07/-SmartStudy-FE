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
                        @mouseout="onLeave($event)" :class="{ 'bg-blue': item.isActive }"
                        @click="setActiveComponent(item.name)">
                        <i class="me-3" :class="item.icon"></i> {{ item.displayName }}
                    </router-link>
                </li>
            </ul>
            <div class="logout-button mt-auto">
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
import ToeicTestsManagement from './TOEICTestsManagement.vue';
import AnalysisChart from './AnalysisChart.vue';

export default {
    name: "AdminComponent",
    components: {
        AnalysisChart,
        ClassManagement,
        EmployeesManagement,
        FileTrainAIManagement,
        ToeicTestsManagement,
    },
    data() {
        return {
            logo: require('@/assets/logo.png'),
            sidebarItems: [
                { name: "AnalysisChart", displayName: "Analysis", icon: "bx bx-line-chart", isActive: true },
                { name: "ClassManagement", displayName: "Class", icon: "bi bi-house", isActive: false },
                { name: "EmployeesManagement", displayName: "Employees", icon: "bi bi-people", isActive: false },
                { name: "FileTrainAIManagement", displayName: "File Train AI", icon: "bi bi-cloud-upload", isActive: false },
                { name: "ToeicTestsManagement", displayName: "TOEIC Tests", icon: "bi bi-journal-text", isActive: false }
            ],
            activeComponent: 'AnalysisChart'
        };
    },
    mounted() {
        const matchingItem = this.sidebarItems.find(item => item.name === this.$route.name);
        if (matchingItem) {
            this.setActiveComponent(matchingItem.name);
        }
    },
    watch: {
        $route(to) {
            const matchingItem = this.sidebarItems.find(item => item.name === to.name);
            if (matchingItem) {
                this.setActiveComponent(matchingItem.name);
            }
        }
    },
    methods: {
        setActiveComponent(componentName) {
            this.activeComponent = componentName;
            this.sidebarItems.forEach(item => {
                item.isActive = (item.name === componentName);
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

.logout-button {
    margin-top: auto;
    padding: 10px 20px;
}

#page-content-wrapper {
    margin-left: 250px;
    padding: 20px;
    width: 100%;
    overflow-x: hidden;
}
</style>
