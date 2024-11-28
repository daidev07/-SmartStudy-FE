<template>
    <div class="classroom-detail-container">
        <!-- Header với tên lớp -->
        <div class="d-flex justify-content-between">
            <div class="class-header">
                <h1 class="class-name">{{ classDetail.name }}</h1>
                <h4> Level {{ classDetail.level?.name }}</h4>
            </div>
            <div>
                <button v-if="activeTab === 'classwork'" class="btn btn-success">New Classwork</button>
                <button v-else class="btn btn-success">New Student</button>
            </div>
        </div>
        <hr>

        <!-- Menu cho Classwork và Students -->
        <div class="menu-header">
            <button :class="{ active: activeTab === 'classwork' }" @click="setActiveTab('classwork')">
                Classwork
            </button>
            <button :class="{ active: activeTab === 'students' }" @click="setActiveTab('students')">
                Students
            </button>
        </div>

        <!-- Nội dung hiển thị dựa trên tab đang chọn -->
        <div class="content">
            <div v-if="activeTab === 'classwork'" class="classwork-tab">
                <h2>Classwork</h2>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Assigned At</th>
                            <th>Due Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody v-if="classworks && classworks.length">
                        <tr v-for="(classwork, index) in classworks" :key="classwork.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ classwork.name }}</td>
                            <td>{{ classwork.description || 'No description' }}</td>
                            <td>{{ formatDate(classwork.assignedAt) }}</td>
                            <td>{{ classwork.dueDate ? formatDate(classwork.dueDate) : 'No due date' }}</td>
                            <td>
                                <button class="btn btn-primary btn-sm me-3">View exam</button>
                                <button class="btn btn-danger btn-sm">Edit</button>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="5" class="text-center">No classworks available.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-else-if="activeTab === 'students'" class="students-tab">
                <h2>Students</h2>
                <ul v-if="classDetail.students && classDetail.students.length">
                    <li v-for="(student, index) in classDetail.students" :key="index">
                        {{ student.name }} - {{ student.email }}
                    </li>
                </ul>
                <p v-else>No students enrolled yet.</p>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { formatDate } from '@/services/DateService';

export default {
    data() {
        return {
            apirUrl: process.env.VUE_APP_API_URL,
            classDetail: [],
            classworks: [],
            classId: this.$route.params.id,
            activeTab: 'classwork',
        };
    },
    mounted() {
        this.fetchClass();
        this.fetchClasswork();
    },
    methods: {
        formatDate,
        async fetchClass() {
            this.classDetailLoading = true;
            this.classDetailError = null;
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
                this.classworks = response.data.data;
            } catch (error) {
                this.classworkError = error;
            } finally {
                this.classworkLoading = false;
            }
        },
        setActiveTab(tab) {
            this.activeTab = tab;
        },
    },
};
</script>
<style scoped>
.classroom-detail-container {
    padding: 20px;
}

.class-header {
    margin-bottom: 20px;
}

.class-name {
    font-size: 2em;
    font-weight: bold;
}

.menu-header {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
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

.content {
    padding: 10px;
}

.classwork-tab ul,
.students-tab ul {
    list-style-type: none;
    padding: 0;
}

.classwork-tab li,
.students-tab li {
    margin-bottom: 10px;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.table {
    margin-top: 20px;
}

.text-center {
    text-align: center;
    color: gray;
}
</style>