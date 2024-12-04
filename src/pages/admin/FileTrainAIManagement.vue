<template>
    <div class="text-center">
        <div class="fw-bold fs-3 border-bottom border-end border-black title">
            FILE TRAIN AI MANAGEMENT
        </div>
        <hr class="fw-bold">
        <form @submit.prevent="handleSubmit" class="upload-form">
            <div class="form-group">
                <label for="fileInput" class="file-label">Select a file to train your AI:</label>
                <input type="file" id="fileInput" class="file-input" @change="handleFileChange" required />
            </div>
            <button type="submit" class="btn-submit">Submit</button>
        </form>
    </div>
</template>
<script>
import axios from 'axios';
import { toast } from "vue3-toastify";
export default {
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            fileTrainAIList: [],
            fileTrainAIListLoading: false,
            fileTrainAIListError: null,
        };
    },
    methods: {
        async handleSubmit() {
            try {
                await axios.get(this.apiUrl + '/load/single')
                toast.success('File uploaded successfully!');
            } catch (error) {
                console.error(error);
            }
        },
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
<style scoped>
.upload-container {
    max-width: 100px;
    margin: 0 auto;
    padding: 20px;
    background: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.header h1 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
}

.upload-form .form-group {
    margin-bottom: 20px;
}

.file-label {
    display: block;
    font-size: 1rem;
    margin-bottom: 10px;
    font-weight: 500;
}

.file-input {
    width: 30%;
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.btn-submit {
    padding: 10px 20px;
    font-size: 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-submit:hover {
    background-color: #45a049;
}
</style>
