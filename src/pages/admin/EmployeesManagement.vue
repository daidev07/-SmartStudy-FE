<template>
    Đây là trang quản lý nhân viên
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