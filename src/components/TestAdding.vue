<template>
    <div class="test-adding w-25">
        <!-- <iframe
            src="https://docs.google.com/gview?url=https://res.cloudinary.com/daidev07/raw/upload/v1731420804/kkxuqj2dxqnglg9o6n0x&embedded=true"
            width="100%" height="600px"></iframe> -->
        <h4 class="text-center fw-bold">ADDING NEW TOEIC TEST</h4>
        <form>
            <div class="mb-2">
                <label for="listeningFile" class="form-label">Listening File:</label>
                <input type="file" class="form-control" id="listeningFile" required />
            </div>
            <div class="mb-2">
                <label for="exemFile" class="form-label">Exam File: </label>
                <input type="file" class="form-control" id="exemFile" required />
            </div>
            <div class="mb-2">
                <label for="answerFile" class="form-label">Answer file (excel): </label>
                <input type="file" class="form-control" id="answerFile" required />
            </div>
            <div class="text-center">
                <button type="button" class="btn btn-primary mt-2" @click="saveTest">Save</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'TestAdding',
    methods: {
        saveTest() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped>
.test-adding {
    justify-content: center;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-top: 10px;
}

button {
    margin-top: 10px;
    padding: 5px 10px;
}
</style>
