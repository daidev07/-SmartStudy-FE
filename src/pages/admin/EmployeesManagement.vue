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