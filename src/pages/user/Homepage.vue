<template>
  TRANG CHỦ
  <ToastNotify />
</template>

<script>
import ToastNotify from '../../components/ToastNotify.vue';
import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';
export default {
  name: 'HomePage',
  components: {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
