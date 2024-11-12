<template>
    Đây là filetrainai management
</template>
<script>
export default {
    data() {
        return {
            fileTrainAIList: [],
            fileTrainAIListLoading: false,
            fileTrainAIListError: null,
        };
    },
    methods: {
        async fetchFileTrainAIList() {
            this.fileTrainAIListLoading = true;
            this.fileTrainAIListError = null;
            try {
                const response = await this.$http.get('/fileTrainAI');
                this.fileTrainAIList = response.data;
            } catch (error) {
                this.fileTrainAIListError = error;
            } finally {
                this.fileTrainAIListLoading = false;
            }
        },
    },
    created() {
        this.fetchFileTrainAIList();
    },
};
</script>