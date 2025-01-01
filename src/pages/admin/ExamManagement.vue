<template>
    <div class="text-center">
        <div class="fw-bold fs-3 border rounded-3 px-3 py-2 shadow">
            EXAMS MANAGEMENT
        </div>
        <hr class="fw-bold">
    </div>
    <div class="mt-2 text-end">
        <button class="btn btn-success" @click="toggleTestAdding">
            <i class="bx bxs-file-plus fs-5 me-2"></i> New exam
        </button>
    </div>
    <div v-if="showTestAdding" class="d-flex justify-content-center">
        <TestAdding @close="toggleTestAdding" @refresh="fetchExamList" />
    </div>

    <div>
        <ul class="nav nav-tabs mt-3">
            <li class="nav-item">
                <button class="nav-link text-dark"
                    :class="{ active: activeTab === 'LISTENING', 'fw-bold': activeTab === 'LISTENING' }"
                    @click="setActiveTab('LISTENING')">
                    Listening
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link text-dark"
                    :class="{ active: activeTab === 'READING', 'fw-bold': activeTab === 'READING' }"
                    @click="setActiveTab('READING')">
                    Reading
                </button>
            </li>
        </ul>

        <div class="shadow rounded-3 p-3">
            <div v-if="filteredExams.length > 0" class="mt-3">
                <table id="examTable" class="table table-striped table-bordered">
                    <thead class="thead-dark">
                        <tr>
                            <th class="text-start">Exam Name</th>
                            <th>Date Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        <tr v-for="exam in filteredExams" :key="exam.id" scope="row">
                            <td class="text-start">{{ exam.name }}</td>
                            <td>{{ formatDateAndTime(exam.createdAt) }}</td>
                            <td class="text-center">
                                <button class="btn btn-info btn-sm me-2" @click="fetchExamDetail(exam.id)">View /
                                    Update</button>
                                <button class="btn btn-danger btn-sm"><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else class="text-center mt-3">
                <p class="text-secondary">No exams available for {{ activeTab }}</p>
            </div>

            <div v-if="!isViewClick" class="text-center text-secondary">No exam available to view, let's select one.
            </div>
            <div v-else-if="examDetails" class="detail-container" ref="examDetailSection">
                <div class="text-center">
                    Details for <span class="text-primary fw-bold fs-4"> {{ examDetails.name }} </span><i
                        class="bi bi-pencil-square ms-2 text-warning" v-tooltip:top="'Edit exam'" data-bs-toggle="modal"
                        data-bs-target="#updateExamModal"></i> exam
                </div>
                <div class="d-flex">
                    <div class="show-file w-50 p-3">
                        <div v-if="examDetails.listenFile">
                            <div class="d-flex justify-content-between">
                                <h5 class="fw-bold">MP3 Listen File:</h5>
                                <i class="bi bi-pencil-square ms-2" v-tooltip:top="'Update PDF file'"></i>
                            </div>
                            <audio controls class="w-100">
                                <source :src="examDetails.listenFile.fileUrl" type="audio/mpeg" />
                            </audio>
                        </div>
                        <div v-if="examDetails.pdfFile">
                            <div class="d-flex justify-content-between">
                                <h5 class="fw-bold">PDF File:</h5>
                                <i class="bi bi-pencil-square ms-2" v-tooltip:top="'Update PDF file'"
                                    style="cursor: pointer"></i>
                            </div>
                            <iframe :src="examDetails.pdfFile.fileUrl" class="w-100"
                                :style="{ height: examDetails.listenFile ? '77vh' : '87vh' }"></iframe>
                        </div>
                    </div>

                    <div class="answer-file w-50 p-3 overflow-auto border-start border-dark">
                        <h5 class="fw-bold">Answer Details:</h5>
                        <div v-for="question in examDetails.questions" :key="question.id" class="mt-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="mt-2">
                                    <strong> {{ question.questionNumber }}. </strong> {{ question.content }}</span>
                                <i class="bi bi-pencil-square ms-2" v-tooltip:top="'Update this question'"
                                    style="cursor: pointer"></i>
                            </div>
                            <div v-for="(answer, answerIndex) in question.answers" :key="answer.id">
                                <div class="d-flex">
                                    <label
                                        :class="{ 'bg-success-subtle border border-success rounded-3 px-2': answer.isCorrect }"
                                        class="ms-3">
                                        {{ answerLetters[answerIndex] }}. {{ answer.content }}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal fade" id="updateExamModal" tabindex="-1" aria-labelledby="updateExamModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header ">
                                <h5 class="modal-title fw-bold" id="updateExamModalLabel">Update Exam</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                </button>
                            </div>
                            <div class="modal-body">
                                <form @submit.prevent="updateExamDetails">
                                    <div class="modal-body">
                                        <label for="examName">Exam Name:</label>
                                        <input type="text" v-model="examDetails.name" class="form-control"
                                            :class="{ 'is-invalid': examNameError }" />
                                        <div v-if="examNameError" class=" invalid-feedback">
                                            Exam name not be null.
                                        </div>
                                        <div v-if="examDetails.examType === 'LISTENING'">
                                            <label for="listenFile">MP3 File:</label>
                                            <input type="file" @change="handleFileChange('listenFile', $event)"
                                                class="form-control" accept=".mp3"
                                                :class="{ 'is-invalid': mp3FileError }" />
                                            <div v-if="mp3FileError" class="invalid-feedback">
                                                Please provide a valid MP3 file.
                                            </div>
                                        </div>
                                        <label for="pdfFile">PDF File:</label>
                                        <input type="file" @change="handleFileChange('pdfFile', $event)"
                                            class="form-control" accept=".pdf"
                                            :class="{ 'is-invalid': pdfFileError }" />
                                        <div v-if="pdfFileError" class="invalid-feedback">
                                            Please provide a valid PDF file.
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary"
                                            data-bs-dismiss="modal">Close</button>
                                        <button type="submit" class="btn btn-primary">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TestAdding from "../../components/TestAdding.vue";
import { formatDateAndTime } from "@/utils/FormatDateAndTime.js";
import { toast } from "vue3-toastify";
import axios from "axios";
import { fetchExam } from "@/services/examService";
import { nextTick } from "vue";

export default {
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            examList: [],
            examListLoading: false,
            examListError: null,
            showTestAdding: false,
            answerLetters: ["A", "B", "C", "D"],
            activeTab: "LISTENING",
            isViewClick: false,
            examDetails: null,
            files: {
                listenFile: null,
                pdfFile: null,
            },
            examNameError: false,
            mp3FileError: false,
            pdfFileError: false,
        };
    },
    created() {
        this.fetchExamList();
    },
    components: {
        TestAdding,
    },
    computed: {
        filteredExams() {
            return this.examList.filter((exam) => exam.examType === this.activeTab);
        },
    },
    methods: {
        formatDateAndTime,
        handleFileChange(type, event) {
            this.files[type] = event.target.files[0];
        },
        async updateExamDetails() {
            this.examNameError = this.mp3FileError = this.pdfFileError = false;
            if (!this.examDetails.name) {
                this.examNameError = true;
                return;
            }
            const formData = new FormData();
            formData.append("examName", this.examDetails.name);
            if (this.examDetails.examType === "LISTENING") {
                if (this.files.listenFile)
                    formData.append("listenMp3File", this.files.listenFile);
                if (this.files.pdfFile)
                    formData.append("listenPdfFile", this.files.pdfFile);
            }
            else if (this.examDetails.examType === "READING") {
                if (this.files.pdfFile)
                    formData.append("readingPdfFile", this.files.pdfFile);
            }
            try {
                await axios.put(`${this.apiUrl}/exam/${this.examDetails.id}`, formData);
                toast.success("Exam updated successfully.");

                this.fetchExamList();
            } catch (error) {
                console.error("Error updating exam:", error);
                toast.error("Failed to update exam.");
            }
        },
        toggleTestAdding() {
            this.showTestAdding = !this.showTestAdding;
        },
        async fetchExamDetail(examId) {
            this.isViewClick = true;
            try {
                const response = await fetchExam(examId);
                this.examDetails = response;
                console.log("EXAM DETAILS:: ", this.examDetails);
                await nextTick();
                if (this.$refs.examDetailSection) {
                    this.$refs.examDetailSection.scrollIntoView({ behavior: "smooth" });
                }
            } catch (error) {
                console.error(error);
            }
        },
        async fetchExamList() {
            this.examListLoading = true;
            this.examListError = null;
            try {
                const response = await axios.get(this.apiUrl + "/exam");
                this.examList = response.data.data.reverse();
                console.log("EXAM LIST:: ", this.examList);

            } catch (error) {
                this.examListError = "Failed to load exam list.";
                console.error(error);
            } finally {
                this.examListLoading = false;
            }
        },
        setActiveTab(tab) {
            this.activeTab = tab;
            console.log("Active tab: ", this.activeTab);
        },
    },
};
</script>
<style scoped>
.title {
    display: inline-block;
    padding: 10px 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    /* background: #7494ec; */
}

.menu-header button {
    border-radius: 7px;
    background-color: #f0f0f0;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.1s;
}

.menu-header button.active {
    background-color: #303030;
    color: white;
}

.menu-header button:hover {
    background-color: #747373;
}

.exam-management-container {
    padding: 20px;
}

.table th,
.table td {
    text-align: center;
}

.detail-container {
    height: 97vh;
}

.show-file {
    height: 90vh;
}

.answer-file {
    height: 92vh;
}
</style>
