<template>
    <div class="test-adding w-25">
        <!-- <iframe
            src="https://docs.google.com/gview?url=https://res.cloudinary.com/daidev07/raw/upload/v1731420804/kkxuqj2dxqnglg9o6n0x&embedded=true"
            width="100%" height="600px"></iframe> -->
        <h4 class="text-center fw-bold">ADDING NEW EXAM</h4>
        <form>
            <div class="mb-2 d-flex">
                <label for="examName" class="form-label w-50">Exam Name:</label>
                <input type="text" class="form-control" id="examName" required />
            </div>
            <div class="mb-2 d-flex">
                <label for="grammarFile" class="form-label w-50">Exam excel file: </label>
                <input type="file" class="form-control" accept=".xls,.xlsx" id="grammarFile" required />
            </div>
            <div class="text-center">
                <button type="button" class="btn btn-secondary mt-2 me-2" @click="$emit('close')">Cancel</button>
                <button type="button" class="btn btn-primary mt-2" @click="saveTest">Save</button>
            </div>
        </form>
    </div>
</template>

<script>
import { toast } from "vue3-toastify";
import axios from 'axios';

export default {
    name: 'TestAdding',
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
        };
    },
    methods: {
        async saveTest() {
            const examName = document.getElementById("examName").value.trim();
            const grammarFile = document.getElementById("grammarFile").files[0];

            if (!examName || !grammarFile) {
                toast.error("Please enter full information");
                return;
            }
            else {
                const formData = new FormData();
                formData.append("examName", examName);
                formData.append("grammarFile", grammarFile);
                try {
                    await axios.post(this.apiUrl + '/exam', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    this.$emit('close');
                    this.$emit('refresh');
                    toast.success("Create new test successfully!");
                } catch (error) {
                    if (error.response.status === 400) {
                        toast.error("The test already exists. Try another name!");
                    }
                    else {
                        toast.error("an exam create error occurred. Please try again later!");
                    }
                }
            }
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
