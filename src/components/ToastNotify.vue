<template>
    <ToastContainer />
</template>

<script>
import { onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    name: 'ToastNotify',
    setup() {
        const route = useRoute();
        const router = useRouter();

        onMounted(() => {
            // Kiểm tra nếu có thông báo trong query
            if (route.query && route.query.notify) {
                const notify = JSON.parse(route.query.notify); // Chuyển đổi lại chuỗi JSON thành đối tượng

                // Hiển thị thông báo toast
                toast[notify.type](notify.message, notify.options);

                // Xóa notify khỏi query và cập nhật lại URL sau khi toast hiển thị
                const newQuery = { ...route.query };
                delete newQuery.notify; // Xóa notify khỏi query

                // Sử dụng nextTick để đảm bảo việc xóa URL sau khi toast đã hiển thị
                nextTick(() => {
                    router.replace({ path: route.path, query: newQuery }); // Cập nhật URL mà không reload trang
                });
            }
        });
    }
};
</script>
