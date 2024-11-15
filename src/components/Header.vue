<template>
    <header class="header">
        <div class="logo">Your Logo</div>
        <nav class="menu">
            <ul>
                <li>
                    <router-link to="/" active-class="active-menu" exact-active-class="active-menu">New
                        feeds</router-link>
                </li>
                <li>
                    <router-link to="/my-assignment" active-class="active-menu">My Assignment</router-link>
                </li>
                <li>
                    <router-link to="/about" active-class="active-menu">About</router-link>
                </li>
            </ul>
        </nav>
        <div v-if="userInfo" class="user-info">
            <img :src="userInfo.avatarUrl || require('@/assets/nonAvatar.png')" alt="User Avatar" class="avatar me-2" />
            <span>{{ userInfo.name }}</span>
        </div>

        <!-- Nếu không có token, hiển thị nút login -->
        <router-link v-else to="/login" class="login-btn">Login</router-link>
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
    methods: {
        ...mapActions(['saveUserInfo']),
        async checkUserLoggedIn() {
            const token = localStorage.getItem('token');
            if (token) {
                const tokenInfo = jwtDecode(token);
                console.log("Token Info::", tokenInfo);
                const response = await axios.get(this.apiUrl + `/api/user/${tokenInfo.userName}`);
                this.userInfo = response.data.data;
                this.saveUserInfo(this.userInfo);
                console.log("USER INFO FORM HEADER::", this.userInfo);
            }
        },
    }
};
</script>
<style scoped>
.header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 30px;
    background-color: #ffffff;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    /* Bóng đổ sâu hơn */
    border-bottom: 2px solid #f1f1f1;
    /* Thêm đường viền dưới */
    transition: box-shadow 0.3s ease-in-out;
    /* Hiệu ứng khi hover */
}

.header:hover {
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    /* Bóng đổ khi hover */
}

/* Tạo hiệu ứng cho logo */
.logo {
    font-size: 26px;
    font-weight: bold;
    color: #333;
    cursor: pointer;
    transition: transform 0.3s, color 0.3s ease;
}

.logo:hover {
    transform: scale(1.1);
    /* Phóng to logo khi hover */
    color: #007bff;
    /* Đổi màu logo khi hover */
}

/* Menu */
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
    padding: 8px 15px;
    border-radius: 4px;
    /* Bo góc các mục menu */
    transition: background-color 0.3s, color 0.3s, transform 0.3s ease;
}

.menu a:hover {
    color: #fff;
    background-color: #007bff;
    /* Màu nền khi hover */
    transform: translateY(-3px);
    /* Hiệu ứng nâng khi hover */
}

.active-menu {
    color: #fff;
    background-color: #7494ec;
    font-weight: bold;
    border-radius: 4px;
    padding: 8px 15px;
}

/* Nút login */
.login-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, box-shadow 0.3s ease;
    text-decoration: none;
}

.login-btn:hover {
    background-color: #0056b3;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    /* Tạo hiệu ứng bóng đổ cho nút login */
}

/* Thêm hiệu ứng bóng đổ nhẹ khi menu đang hover */
.menu li:hover {
    background-color: rgba(0, 123, 255, 0.1);
    /* Hiệu ứng nền mờ khi hover lên các menu item */
    border-radius: 4px;
}

.avatar {
    width: 50px;
    border-radius: 50%;
}
</style>
