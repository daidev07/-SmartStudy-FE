<template>

    <body>
        <div class="container">
            <div class="form-box login">
                <form @submit.prevent="login">
                    <h1 class="fw-bold">Login</h1>
                    <div class="input-box">
                        <input type="text" v-model="username" placeholder="Username">
                        <i class='bx bxs-user'></i>
                    </div>
                    <div class="input-box">
                        <input type="password" v-model="password" placeholder="Password">
                        <i class='bx bxs-hide'></i>
                        <!-- <i class='bx bxs-show'></i> -->
                    </div>
                    <!-- <div class="forgot-link">
                        <RouterLink to="/forgot-password" class="forgot-link-router">Forgot Password?</RouterLink>
                    </div> -->
                    <button type="submit" class="btn">Login</button>
                </form>
            </div>
            <div class="toggle-box">
                <div class="toggle-panel toggle-left">
                    <h1 class="fw-bold">Hello, Welcome!</h1>
                    <p>Conquer the latest TOEIC tests and receive detailed analysis from Artificial Intelligence,
                        helping to improve your
                        English skills most effectively.
                    </p>
                </div>
            </div>
        </div>
    </body>
</template>

<script>
import axios from 'axios';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
import { mapActions } from 'vuex';
import { jwtDecode } from "jwt-decode";

export default {
    name: 'LoginComponent',
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            username: '',
            password: '',
            userInfo: null,
        };
    },
    mounted() {
    },
    methods: {
        ...mapActions(['saveUserInfo']),
        async login() {
            if (!this.username || !this.password) {
                toast.error("Please fill in both the username and password!", { autoClose: 2500 });
                return;
            }
            try {
                const response = await axios.post(this.apiUrl + '/auth/login', {
                    username: this.username,
                    password: this.password
                });
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('loginSuccess', JSON.stringify({ type: 'success', message: 'Login successful!', options: { autoClose: 2500 } }));
                this.saveUserInfo(response.data.data.user);
                const token = localStorage.getItem('token');
                if (token) {
                    const tokenInfo = jwtDecode(token);
                    const response = await axios.get(this.apiUrl + `/user/${tokenInfo.userName}`);
                    this.userInfo = response.data.data;
                    console.log("USER INFO FROM ADMIN: ", this.userInfo);
                    if (this.userInfo.role === 'STUDENT') {
                        this.$router.push('/');
                    } else {
                        this.$router.push('/admin-dashboard/class-management');
                    }
                }
            } catch (error) {
                if (error.response.status === 400) {
                    toast.error("Username or password is incorrect. Please try again!");
                } else {
                    toast.error("An error occurred while logging in. Please try again later.");
                }
            }
        }
    }
};
</script>
<style scoped>
body {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(90deg, #e2e2e2, #c9d6ff);
}

.container {
    position: relative;
    width: 850px;
    height: 550px;
    background: #ffffff;
    border-radius: 30px;
    box-shadow: 0 0 30px rgba(0, 0, 0, .2);
    overflow: hidden;
}

.form-box {
    position: absolute;
    right: 0;
    width: 50%;
    height: 100%;
    background: #ffffff;
    display: flex;
    align-items: center;
    color: #333;
    text-align: center;
    padding: 40px;
    z-index: 1;
}

form {
    width: 100%;
}

.container h1 {
    font-size: 36px;
    margin: -10px 0;
}

.input-box {
    position: relative;
    margin: 30px 0;
}

.input-box input {
    width: 100%;
    padding: 13px 50px 13px 20px;
    background: #eee;
    border: none;
    border-radius: 8px;
    outline: none;
    color: #333;
    font-size: 16px;
    font-weight: 500;
}

.intput-box intput::placeholder {
    color: #888;
    font-weight: 400;
}

.input-box i {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    color: #888;
}

.forgot-link {
    margin: -15px 0 15px;
}

.forgot-link-router {
    color: #333;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
}

.btn {
    width: 100%;
    height: 48px;
    background: #7494ec;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #ffffff;
    font-weight: 600;
}

.toggle-box {
    position: absolute;
    width: 100%;
    height: 100%;
}

.toggle-box::before {
    content: '';
    position: absolute;
    left: -250%;
    width: 300%;
    height: 100%;
    background: #7494ec;
    border-radius: 150px;
    z-index: 2;
}

.toggle-panel {
    position: absolute;
    width: 50%;
    height: 100%;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 2;
}

.toggle-panel p {
    margin: 30px;
    font-size: 20px;
    text-align: justify;
}
</style>