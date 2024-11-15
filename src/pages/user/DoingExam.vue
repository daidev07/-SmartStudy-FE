<template>
    <div class="container mt-3 w-50">
        DOING EXAM
    </div>
</template>
<script>
export default {
    name: 'DoingExamComponent',
    computed: {
        assignmentId() {
            return this.$route.params.id;
        }
    },
    mounted() {
        console.log('Current Assignment ID:', this.assignmentId);
    }
};
</script>
<style scoped>
.container {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}
</style>