<template>
    <div v-if="visible" class="loader-spinner">
        <div class="spinner-overlay">
            <div class="spinner-border color-spinner mb-3" role="status"></div>
            <div class="text-body-tertiary">Loading data, please wait a seconds...</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SpinnerComponent",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
    },
};
</script>

<style scoped>
.spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white !important;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
    flex-direction: column;
}

.color-spinner {
    color: #6280e4;
}
</style>
