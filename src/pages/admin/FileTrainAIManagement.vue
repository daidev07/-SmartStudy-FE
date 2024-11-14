<template>
    <div class="text-center">
        <div class="fw-bold fs-3 border-bottom border-end border-black title">
            FILE TRAIN AI MANAGEMENT
        </div>
        <hr class="fw-bold">
    </div>
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