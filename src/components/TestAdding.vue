<template>
    <div class="test-adding shadow rounded-3 w-50">
        <h4 class="text-center fw-bold">ADDING NEW EXAM</h4>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <button class="nav-link"
                    :class="{ active: activeTab === 'LISTENING', 'fw-bold': activeTab === 'LISTENING' }"
                    @click="activeTab = 'LISTENING'">
                    Listening
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link"
                    :class="{ active: activeTab === 'READING', 'fw-bold': activeTab === 'READING' }"
                    @click="activeTab = 'READING'">
                    Reading
                </button>
            </li>
        </ul>

        <div v-if="activeTab === 'LISTENING'" class="mt-3">
            <form>
                <div class="mb-2 d-flex">
                    <label for="examName" class="form-label w-50">Exam Name:</label>
                    <input type="text" class="form-control" v-model="listening.examName" required />
                </div>
                <div class="mb-2 d-flex">
                    <label for="listenMp3File" class="form-label w-50">Listening MP3 File:</label>
                    <input type="file" class="form-control" @change="onFileChange($event, 'listenMp3File')"
                        accept=".mp3" required />
                </div>
                <div class="mb-2 d-flex">
                    <label for="listenPdfFile" class="form-label w-50">Listening PDF File:</label>
                    <input type="file" class="form-control" @change="onFileChange($event, 'listenPdfFile')"
                        accept=".pdf" required />
                </div>
                <div class="mb-2 d-flex">
                    <label for="listenAnswerFile" class="form-label w-50">Listening Answer File
                        <i class="bi bi-exclamation-diamond me-1"></i>:</label>
                    <input type="file" class="form-control" @change="onFileChange($event, 'listenAnswerFile')"
                        accept=".xls,.xlsx" required />
                </div>
            </form>
        </div>

        <div v-if="activeTab === 'READING'" class="mt-3">
            <form>
                <div class="mb-2 d-flex">
                    <label for="examName" class="form-label w-50">Exam Name:</label>
                    <input type="text" class="form-control" v-model="reading.examName" required />
                </div>
                <div class="mb-2 d-flex">
                    <label for="readingPdfFile" class="form-label w-50">Reading PDF File:</label>
                    <input type="file" class="form-control" @change="onFileChange($event, 'readingPdfFile')"
                        accept=".pdf" required />
                </div>
                <div class="mb-2 d-flex">
                    <label for="readingAnswerFile" class="form-label w-50">Reading Answer File
                        <i class="bi bi-exclamation-diamond me-1"></i>:</label>
                    <input type="file" class="form-control" @change="onFileChange($event, 'readingAnswerFile')"
                        accept=".xls,.xlsx" required />
                </div>
            </form>
        </div>

        <div class="text-center mt-4">
            <button type="button" class="btn btn-secondary me-2" @click="$emit('close')">Close</button>
            <button type="button" class="btn btn-primary" @click="saveExcercise">Save</button>
        </div>
    </div>
</template>

<script>
import { toast } from "vue3-toastify";
import axios from "axios";

export default {
    name: "TestAdding",
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            activeTab: "LISTENING",
            grammar: {
                examName: "",
                grammarFile: null,
            },
            listening: {
                examName: "",
                listenMp3File: null,
                listenPdfFile: null,
                listenAnswerFile: null,
            },
            reading: {
                examName: "",
                readingPdfFile: null,
                readingAnswerFile: null,
            },
        };
    },
    methods: {
        onFileChange(event, fileKey) {
            const file = event.target.files[0];
            let activeData;
            if (this.activeTab === 'GRAMMAR') {
                activeData = this.grammar;
            } else if (this.activeTab === 'LISTENING') {
                activeData = this.listening;
            } else if (this.activeTab === 'READING') {
                activeData = this.reading;
            }

            if (activeData && fileKey in activeData) {
                activeData[fileKey] = file;
            } else {
                console.error(`File key "${fileKey}" không tồn tại trong dữ liệu của tab ${this.activeTab}`);
            }

        },
        async saveExcercise() {
            let activeData;
            if (this.activeTab === 'GRAMMAR') {
                activeData = this.grammar;
            } else if (this.activeTab === 'LISTENING') {
                activeData = this.listening;
            } else if (this.activeTab === 'READING') {
                activeData = this.reading;
            }

            if (!activeData) {
                toast.error("Invalid tab selected");
                return;
            }
            if (!activeData.examName || Object.values(activeData).some((value) => !value)) {
                toast.error("Please enter full information");
                return;
            }
            const formData = new FormData();
            Object.keys(activeData).forEach((key) => {
                if (activeData[key] !== null && activeData[key] !== undefined) {
                    formData.append(key, activeData[key]);
                }
            });

            let endpoint;
            switch (this.activeTab) {
                case 'GRAMMAR':
                    endpoint = '/exam/grammar';
                    break;
                case 'LISTENING':
                    endpoint = '/exam/listening';
                    break;
                case 'READING':
                    endpoint = '/exam/reading';
                    break;
                default:
                    toast.error("Invalid tab selected");
                    return;
            }
            try {
                await axios.post(`${this.apiUrl}${endpoint}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                Object.keys(activeData).forEach((key) => {
                    activeData[key] = key === 'examName' ? '' : null;
                });

                this.$emit("close");
                this.$emit("refresh");
                toast.success("Create new test successfully!");
            } catch (error) {
                if (error.response) {
                    toast.error("The test already exists. Try another name!");
                } else {
                    toast.error("An error occurred. Please try again later!");
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

.nav-link {
    color: black;
}
</style>
