<template>
    <header class="header">
        <router-link to="/" class="d-flex align-items-center nav-left">
            <img class="logo" :src="require('@/assets/logoHeader.jpg')" />
            <h3 class="ms-3 fw-bold">Smart Study</h3>
        </router-link>
        <nav class="menu">
            <ul>
                <li>
                    <router-link to="/" :class="getActiveClass('/')">New Feeds</router-link>
                </li>
                <li>
                    <router-link to="/my-excercise" :class="getActiveClass('/my-excercise')">
                        My excercise</router-link>
                </li>
                <li>
                    <router-link to="/report" :class="getActiveClass('/report')">
                        Report</router-link>
                </li>
                <li>
                    <router-link to="/about" :class="getActiveClass('/about')">About</router-link>
                </li>
            </ul>
        </nav>
        <div class="nav-right d-flex justify-content-end align-items-center">
            <div v-if="userInfo" class="user-info d-flex justify-content-end align-items-center">
                <img :src="userInfo.avatarUrl || require('@/assets/nonAvatar.png')" alt="User Avatar"
                    class="avatar me-2" />
                <span>{{ userInfo.name }}</span>
            </div>
            <router-link v-else to="/login"
                class="login-btn text-white text-center rounded-3 p-2 w-25">Login</router-link>
        </div>
    </header>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { mapActions } from "vuex";

export default {
    name: 'HeaderComponent',
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            userInfo: null,
        };
    },
    mounted() {
        this.checkUserLoggedIn();
    },
    computed: {
        getActiveClass() {
            return (path) => {
                if (path === '/') {
                    return this.$route.path === path ? 'active-menu' : '';
                }
                return this.$route.path.includes(path) ? 'active-menu' : '';
            };
        }
    },
    methods: {
        ...mapActions(['saveUserInfo']),
        async checkUserLoggedIn() {
            const token = localStorage.getItem('token');
            if (token) {
                const tokenInfo = jwtDecode(token);
                const response = await axios.get(this.apiUrl + `/user/${tokenInfo.userName}`);
                this.userInfo = response.data.data;
                this.saveUserInfo(this.userInfo);
                console.log("USER INFO HEADER: ", this.userInfo);

            }
        },

    }
};
</script>
<style>
.header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background-color: #ffffff;
    transition: box-shadow 0.3s ease-in-out;
    position: fixed;
    z-index: 1;
}

.nav-left {
    text-decoration: none;
    color: #6280e4;
    width: 20%;
    cursor: pointer;
    transition: transform 0.3s, color 0.3s ease;
}

.nav-left:hover {
    transform: scale(1.05);
    transition: transform 0.4s ease-in-out;
    color: #4661b8;
}

.logo {
    width: 15%;
    color: #333;
}

.menu ul {
    list-style: none;
    display: flex;
    gap: 25px;
    margin: 0;
    padding: 0;
}


.menu a {
    text-decoration: none;
    color: #333;
    font-size: 16px;
    font-weight: 500;
}

.menu a:hover {
    color: #7c95e6;
    transform: scale(1.1);
    transition: transform 0.4s ease-in-out;
}

.active-menu {
    color: #6280e4 !important;
    font-weight: bold;
    border-bottom: 2px solid #6280e4;
    border-radius: 4px;
    padding: 10px 0px;
}

.nav-right {
    width: 20%;
}

.login-btn {
    background-color: #6280e4;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s ease;
    text-decoration: none;
}

.login-btn:hover {
    transform: scale(1.05);
    transition: transform 0.4s ease-in-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.avatar {
    width: 50px;
    border-radius: 50%;
}
</style>
