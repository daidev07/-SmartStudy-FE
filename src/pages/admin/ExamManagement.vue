<template>
    <div class="text-center">
        <div class="fw-bold fs-3 border-bottom border-end border-black title">EXAMS MANAGEMENT</div>
    </div>
    <div class="btn btn-success mt-2" @click="toggleTestAdding"><i class="bx bxs-file-plus fs-5"></i> New exam</div>
    <div v-if="showTestAdding" class="d-flex justify-content-center">
        <TestAdding @close="toggleTestAdding" @refresh="fetchExamList" />
    </div>

    <div>
        <ul class="nav nav-tabs mt-3">
            <li class="nav-item">
                <button class="nav-link"
                    :class="{ active: activeTab === 'GRAMMAR', 'fw-bold': activeTab === 'GRAMMAR' }"
                    @click="setActiveTab('GRAMMAR')">
                    Grammar
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link"
                    :class="{ active: activeTab === 'LISTENING', 'fw-bold': activeTab === 'LISTENING' }"
                    @click="setActiveTab('LISTENING')">
                    Listening
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link"
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
                            <th class="text-center">Exam Id</th>
                            <th class="text-start">Exam Name</th>
                            <th>Date Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="exam in filteredExams" :key="exam.id" scope="row">
                            <td class="text-center">{{ exam.id }}</td>
                            <td class="text-start">{{ exam.name }}</td>
                            <td>{{ new Date(exam.createdAt).toLocaleString() }}</td>
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
                <h4 class="text-center">
                    Details for <span class="text-primary fw-bold"> {{ examDetails.name }} </span> exam
                </h4>
                <div class="d-flex">
                    <div class="show-file w-50 p-3">
                        <div v-if="examDetails.listenFileUrl">
                            <div class="d-flex justify-content-between">
                                <h5 class="fw-bold">MP3 Listen File:</h5>
                                <i class="bi bi-pencil-square ms-2" v-tooltip:top="'Update PDF file'"
                                    style="cursor: pointer"></i>
                            </div>
                            <audio controls class="w-100">
                                <source :src="examDetails.listenFileUrl.fileUrl" type="audio/mpeg" />
                            </audio>
                        </div>
                        <div v-if="examDetails.pdfFileUrl">
                            <div class="d-flex justify-content-between">
                                <h5 class="fw-bold">PDF File:</h5>
                                <i class="bi bi-pencil-square ms-2" v-tooltip:top="'Update PDF file'"
                                    style="cursor: pointer"></i>
                            </div>
                            <iframe :src="examDetails.pdfFileUrl.fileUrl" class="w-100"
                                :style="{ height: examDetails.listenFileUrl ? '77vh' : '83vh' }"></iframe>
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
            </div>
        </div>
    </div>
</template>
<script>
import TestAdding from "../../components/TestAdding.vue";
// import { toast } from "vue3-toastify";
import axios from "axios";
// import $ from 'jquery';
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
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
            activeTab: "GRAMMAR",
            isViewClick: false,
            examDetails: null,
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
                this.examList = response.data.data;
                console.log("EXAM LIST:: ", this.examList);
                // this.$nextTick(() => {
                //     this.initDataTable();
                // });
            } catch (error) {
                this.examListError = "Failed to load exam list.";
                console.error(error);
            } finally {
                this.examListLoading = false;
            }
        },
        // initDataTable() {
        //     $('#examTable').DataTable({
        //         pageLength: 10,
        //         paging: true,
        //         columnDefs: [
        //             { targets: '_all', className: 'text-start' }
        //         ]
        //     });
        // },
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
