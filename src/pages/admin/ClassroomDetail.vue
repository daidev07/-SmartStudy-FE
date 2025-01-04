<template>
    <div class="classroom-detail-container p-2">
        <div class="class-header">
            <h1 class="class-name fw-bold text-info">{{ classDetail.className }}</h1>
        </div>
        <hr>

        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'classwork' }" @click="setActiveTab('classwork')"
                    href="#">
                    Classwork
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'students' }" @click="setActiveTab('students')"
                    href="#">
                    Students
                </a>
            </li>
        </ul>

        <div class="tab-content bg-white p-3 border border-top-0 rounded-bottom-3">
            <div v-if="activeTab === 'classwork'">
                <div class="text-end mb-3">
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#classworkModal">
                        <i class="bi bi-file-plus-fill me-1"></i> New Classwork
                    </button>
                </div>
                <table class="table table-bordered table-striped table-hover table-sm ">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Assigned At</th>
                            <th>Due Date</th>
                            <th class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody v-if="classworks && classworks.length" class="table-group-divider">
                        <tr v-for="(classwork, index) in classworks" :key="classwork.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ classwork.name }}</td>
                            <td>{{ classwork.description || 'No description' }}</td>
                            <td>{{ formatDateAndTime(classwork.assignedAt) }}</td>
                            <td>{{ classwork.dueDate ? formatDateAndTime(classwork.dueDate) : 'No due date' }}</td>
                            <td class="text-center">
                                <button class="btn btn-warning btn-sm me-2" v-tooltip:top="'Update Classwork'">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-danger btn-sm" v-tooltip:top="'Delete Classwork'">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="6" class="text-center text-muted">No classworks available.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="activeTab === 'students'">
                <div class="text-end mb-2">
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addStudentModal">
                        <i class="bi bi-person-plus-fill me-1"></i>New Student</button>
                </div>
                <table class="table table-bordered table-striped table-hover table-sm ">
                    <thead class="align-middle text-center">
                        <tr>
                            <th width="3%">#</th>
                            <th width="10%">Avatar</th>
                            <th width="10%">Name</th>
                            <th width="10%">Email</th>
                            <th width="10">Phone</th>
                            <th width="37%">Assigment recently</th>
                            <th width="10%">Status</th>
                            <th width="10%" class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody v-if="students && students.length" class="table-group-divider">
                        <tr v-for="(student, index) in students" :key="student.id" class="align-middle ">
                            <td class="text-center">{{ index + 1 }}</td>
                            <td class="text-center"><img :src="student.avatarUrl || require('@/assets/nonAvatar.png')"
                                    style="width: 50%;" />
                            </td>
                            <td class="text-center fw-bold">{{ student.name }}</td>
                            <td class="text-center">{{ student.email }}</td>
                            <td class="text-center">{{ student.phone }}</td>
                            <td class="text-center ">
                                <div class="d-flex justify-content-center">
                                    <div v-if="!filterAssignments(student.id).length" class="text-center text-muted">
                                        No assignment available.
                                    </div>
                                    <div v-else class="me-2 fs-3 fw-bold"
                                        v-for="assignment in filterAssignments(student.id)" :key="assignment.id" :class="{
                                            'text-success': assignment.point > 70,
                                            'text-warning': assignment.point >= 50 && assignment.point <= 70,
                                            'text-danger': assignment.point < 50
                                        }">
                                        {{ assignment.point }}
                                        <span class=" ms-2 border-end border-primary"></span>
                                    </div>
                                </div>
                            </td>
                            <td class="text-center">
                                <span
                                    :class="{ 'bg-primary p-2 rounded-3 border-primary text-white': student.studyStatus === 'IN_PROGRESS' }">
                                    {{ student.studyStatus }}
                                </span>
                            </td>
                            <td class="text-center">
                                <button class="btn btn-primary btn-sm me-2" data-bs-toggle="tooltip" title="View Exam">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button class="btn btn-warning btn-sm" data-bs-toggle="tooltip" title="Edit Classwork">
                                    <i class="bi bi-pencil"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="8" class="text-center text-muted">No classworks available.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <!-- Classwork Modal -->
        <div class="modal fade" id="classworkModal" data-bs-backdrop="static" tabindex="-1"
            aria-labelledby="classworkModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="classworkModalLabel">New Classwork</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            id="btn-close-modal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="submitClasswork">
                            <div class="mb-3">
                                <label for="classworkName" class="form-label fw-bold">Classwork Name</label>
                                <input v-model="classwork.name" type="text" class="form-control" id="classworkName"
                                    required />
                            </div>
                            <div class="mb-3">
                                <label for="classworkDescription" class="form-label fw-bold">Description</label>
                                <textarea v-model="classwork.description" class="form-control" id="classworkDescription"
                                    required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="dueDate" class="form-label fw-bold">Due Date</label>
                                <input v-model="classwork.dueDate" type="datetime-local" class="form-control"
                                    id="dueDate" required />
                            </div>
                            <div class="mb-3">
                                <label for="examSelect" class="form-label fw-bold">Select Exam</label>
                                <select v-if="exams && exams.length" v-model="classwork.examId" class="form-select"
                                    id="examSelect" required>
                                    <option v-for="exam in exams" :key="exam.id" :value="exam.id">{{ exam.name }}
                                    </option>
                                </select>
                                <div v-else class="text-center text-body-tertiary">No exams available. Please create an
                                    exam first.</div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" @click="submitClasswork()">Create
                            Classwork</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Newsfeed Modal -->
        <!-- User Modal -->
    </div>
</template>
<script>
import axios from 'axios';
import { formatDate, formatDateAndTime } from '@/utils/FormatDateAndTime.js';
import { toast } from 'vue3-toastify';

export default {
    data() {
        return {
            apirUrl: process.env.VUE_APP_API_URL,
            classDetail: [],
            classworks: [],
            students: [],
            exams: [],
            classId: this.$route.params.id,
            activeTab: 'classwork',
            classwork: {
                name: '',
                description: '',
                dueDate: '',
                examId: null
            },
            assignmentDetails: []
        };
    },
    mounted() {
        this.fetchClassDetail();
        this.fetchExams();
    },
    methods: {
        formatDate,
        formatDateAndTime,
        filterAssignments(studentId) {
            return this.assignmentDetails.filter(assignment => assignment.user.id === studentId);
        },

        async fetchAssignmentDetails() {
            const response = await axios.get(this.apirUrl + `/student-assignment`)
            this.assignmentDetails = response.data.data;
            console.log('Assignment Details::', this.assignmentDetails);
        },
        async fetchStudents() {
            try {
                const response = await axios.get(this.apirUrl + '/user/get-all-by-classId/' + this.classId);
                this.students = response.data.data;
                console.log('students:', this.students);
            } catch (error) {
                console.error('Failed to fetch students:', error);
            }
        },
        async fetchClassDetail() {
            try {
                const response = await axios.get(this.apirUrl + '/class/' + this.classId);
                this.classDetail = response.data.data;
            } catch (error) {
                this.classDetailError = error;
            } finally {
                this.classDetailLoading = false;
            }
        },
        async fetchClasswork() {
            try {
                const response = await axios.get(this.apirUrl + '/classroom-assignment/class/' + this.classId);
                this.classworks = response.data.data.reverse();
                console.log('classworks:', this.classworks);
            } catch (error) {
                console.error('Failed to fetch classworks:', error);
            }
        },
        async fetchExams() {
            try {
                const response = await axios.get(this.apirUrl + '/exam');
                this.exams = response.data.data;
            } catch (error) {
                console.error('Failed to fetch exams:', error);
            }
        },
        setActiveTab(tab) {
            this.activeTab = tab;
            if (tab === 'classwork') {
                this.fetchClasswork();
            }
            if (tab === 'students') {
                this.fetchStudents();
                this.fetchAssignmentDetails();
            }
            if (tab === 'newsfeed') {
                this.fetchNewsfeed();
            }
        },
        async submitClasswork() {
            const { name, description, dueDate, examId } = this.classwork;
            try {
                await axios.post(`${this.apirUrl}/classroom-assignment/class/${this.classId}/exam/${examId}`, {
                    name,
                    description,
                    dueDate: dueDate,
                });
                document.querySelector('#btn-close-modal').click();
                toast.success('Classwork created successfully!');
                this.fetchClasswork();
            } catch (error) {
                console.log('error::', error);
                if (error.response.data.code == 410) {
                    toast.error('Due date must be in the future.');
                }
                if (error.response.data.code == 411) {
                    toast.error('Assignment exists! Please choose another exam.');
                }
            }
        }
    },
};
</script>
<style scoped>
.nav-link {
    color: black;
}

.nav-link.active {
    font-weight: bold;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
</style>
