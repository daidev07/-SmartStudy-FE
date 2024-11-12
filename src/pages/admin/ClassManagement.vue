<template>
    Đây là class management
</template>
<script>
export default {
    data() {
        return {
            classList: [],
            classListLoading: false,
            classListError: null,
        };
    },
    methods: {
        async fetchClassList() {
            this.classListLoading = true;
            this.classListError = null;
            try {
                const response = await this.$http.get('/classes');
                this.classList = response.data;
            } catch (error) {
                this.classListError = error;
            } finally {
                this.classListLoading = false;
            }
        },
    },
    created() {
        this.fetchClassList();
    },
};
</script>