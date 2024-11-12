<template>
    <div class="text-center">
        <div class="fw-bold fs-3 border-bottom border-end border-black title">
            TOEIC TESTS MANAGEMENT
        </div>
    </div>
    <div class="border-top border-black">
        <div class="btn btn-success mt-2" @click="toggleTestAdding">
            <i class='bx bxs-file-plus fs-5'></i> New TOEIC test
        </div>
    </div>



    <div v-if="showTestAdding">
        <TestAdding @close="toggleTestAdding" />
    </div>
</template>
<script>
import TestAdding from '../../components/TestAdding.vue';
export default {
    data() {
        return {
            TOEICTestsList: [],
            TOEICTestsListLoading: false,
            TOEICTestsListError: null,
            showTestAdding: false,
        };
    },
    components: {
        TestAdding,
    },
    methods: {
        toggleTestAdding() {
            this.showTestAdding = !this.showTestAdding; // Chuyển đổi trạng thái hiển thị
        },
        async fetchTOEICTestsList() {
            this.TOEICTestsListLoading = true;
            this.TOEICTestsListError = null;
            try {
                const response = await this.$http.get('/TOEICTests');
                this.TOEICTestsList = response.data;
            } catch (error) {
                this.TOEICTestsListError = error;
            } finally {
                this.TOEICTestsListLoading = false;
            }
        },
    },
    created() {
        this.fetchTOEICTestsList();
    },
}
</script>
<style>
.title {
    display: inline-block;
    padding: 10px 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    /* background: #7494ec; */
}
</style>