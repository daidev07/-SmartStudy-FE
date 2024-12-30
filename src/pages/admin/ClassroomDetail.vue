<template>
    <div class="classroom-detail-container p-2">
        <div class="class-header">
            <h1 class="class-name fw-bold text-info">{{ classDetail.className }}</h1>
        </div>
        <hr>

        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link" :class="{ active: activeTab === 'newsfeed' }" @click="setActiveTab('newsfeed')"
                    href="#">
                    Newsfeed
                </a>
            </li>
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
            <div v-if="activeTab === 'newsfeed'">
                <div class="text-end mb-2">
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#newsfeedModal">
                        <i class="bi bi-clipboard2-plus-fill me-1"></i>New Post</button>
                </div>
                <div v-if="newsfeeds && newsfeeds.length">
                    <div v-for="(newsfeed) in newsfeeds" :key="newsfeed.id" class="card mb-2 border border-primary">
                        <div class="card-header">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <img :src="newsfeed.user.avatarUrl || require('@/assets/nonAvatar.png')"
                                        class="avatar me-2" />
                                    <span class="fw-bold">{{ newsfeed.user.name }}</span>
                                </div>
                                <div>
                                    <span class="text-body-tertiary">{{ formatDate(newsfeed.createdAt) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <p>{{ newsfeed.content }}</p>
                        </div>
                        <div class="card-footer">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <button class="btn btn-primary btn-sm" data-bs-toggle="tooltip" title="View Post">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm" data-bs-toggle="tooltip" title="Edit Post">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                </div>
                                <div>
                                    <button class="btn btn-danger btn-sm" data-bs-toggle="tooltip" title="Delete Post">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div v-else class="text-body-tertiary text-center">No post yet</div>
            </div>

            <div v-if="activeTab === 'classwork'">
                <div class="text-end mb-3">
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#classworkModal">
                        <i class="bi bi-file-plus-fill me-1"></i> New Classwork
                    </button>
                </div>
                <table class="table table-bordered table-striped table-hover table-sm ">
                    <thead class="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Assigned At</th>
                            <th>Due Date</th>
                            <th class="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody v-if="classworks && classworks.length">
                        <tr v-for="(classwork, index) in classworks" :key="classwork.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ classwork.name }}</td>
                            <td>{{ classwork.description || 'No description' }}</td>
                            <td>{{ formatDate(classwork.assignedAt) }}</td>
                            <td>{{ classwork.dueDate ? formatDate(classwork.dueDate) : 'No due date' }}</td>
                            <td class="text-center">
                                <button class="btn btn-primary btn-sm" data-bs-toggle="tooltip" title="View Exam">
                                    <i class="bi bi-eye"></i>
                                </button>
                                <button class="btn btn-danger btn-sm" data-bs-toggle="tooltip" title="Edit Classwork">
                                    <i class="bi bi-pencil"></i>
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
                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#studentsModal">
                        <i class="bi bi-person-plus-fill me-1"></i>New Student</button>
                </div>
                <ul v-if="classDetail.students && classDetail.students.length">
                    <li v-for="(student, index) in classDetail.students" :key="index">
                        {{ student.name }} - {{ student.email }}
                    </li>
                </ul>
                <div v-else class="text-center text-body-tertiary">No students enrolled yet.</div>
            </div>
        </div>
        <!-- Classwork Modal -->
        <div class="modal fade" id="classworkModal" data-bs-backdrop="static" tabindex="-1"
            aria-labelledby="classworkModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="classworkModalLabel">New Classwork</h4>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
import { formatDate } from '@/services/DateService';
import { toast } from 'vue3-toastify';

export default {
    data() {
        return {
            apirUrl: process.env.VUE_APP_API_URL,
            classDetail: [],
            classworks: [],
            students: [],
            newsfeeds: [],
            exams: [],
            classId: this.$route.params.id,
            activeTab: 'newsfeed',
            classwork: {
                name: '',
                description: '',
                dueDate: '',
                examId: null
            }
        };
    },
    mounted() {
        this.fetchClassDetail();
        this.fetchClasswork();
        this.fetchExams();
        this.fetchNewsfeed();
    },
    methods: {
        formatDate,
        async fetchNewsfeed() {
            try {
                const response = await axios.get(this.apirUrl + '/newsfeed/class/' + this.classId);
                this.newsfeeds = response.data.data.reverse();
                console.log('newsfeeds:', this.newsfeeds);
            } catch (error) {
                console.error('Failed to fetch newsfeeds:', error);
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
            console.log('activeTab:', this.activeTab);

        },
        async submitClasswork() {
            const { name, description, dueDate, examId } = this.classwork;
            try {
                const res = await axios.post(`${this.apirUrl}/classroom-assignment/class/${this.classId}/exam/${examId}`, {
                    name,
                    description,
                    dueDate: dueDate,
                });
                console.log('Classwork created:', res);
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
