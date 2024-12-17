<template>
    <div class="text-center">
        <div class="fw-bold fs-3 border-bottom border-end border-black title">
            EMPLOYEES MANAGEMENT
        </div>
        <hr class="fw-bold">
    </div>
</template>
<script>
export default {
    data() {
        return {
            employeesList: [],
            employeesListLoading: false,
            employeesListError: null,
        };
    },
    methods: {
        async fetchEmployeesList() {
            this.employeesListLoading = true;
            this.employeesListError = null;
            try {
                const response = await this.$http.get('/employees');
                this.employeesList = response.data;
            } catch (error) {
                this.employeesListError = error;
            } finally {
                this.employeesListLoading = false;
            }
        },
    },
    created() {
        this.fetchEmployeesList();
    },
}
</script>
<style scoped>
.title {
    display: inline-block;
    padding: 10px 20px;
    margin-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    /* background: #7494ec; */
}
</style>