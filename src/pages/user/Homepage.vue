<template>
  <div class="home-page">
    <Header />
    <router-view />
    <ToastNotify />
  </div>
</template>

<script>
import ToastNotify from '../../components/ToastNotify.vue';
import Header from '../../components/Header.vue';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
export default {
  name: 'HomePage',
  components: {
    Header,
    ToastNotify
  },
  mounted() {
    const loginSuccess = localStorage.getItem('loginSuccess');
    if (loginSuccess) {
      const { type, message, options } = JSON.parse(loginSuccess);
      toast[type](message, options);
      localStorage.removeItem('loginSuccess');
    }
  }
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(90deg, #e2e2e2, #c9d6ff);
  min-height: 100vh;
}
</style>
