<template>
    Đây là TOEIC tests management
</template>
<script>
export default {
    data() {
        return {
            TOEICTestsList: [],
            TOEICTestsListLoading: false,
            TOEICTestsListError: null,
        };
    },
    methods: {
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