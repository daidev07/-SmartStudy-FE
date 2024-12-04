<template>
    <div class="classroom-detail-container">
        <!-- Header với tên lớp -->
        <div class="d-flex justify-content-between">
            <div class="class-header">
                <h1 class="class-name">{{ classDetail.name }}</h1>
                <h4> Level {{ classDetail.level?.name }}</h4>
            </div>
            <div>
                <button v-if="activeTab === 'classwork'" class="btn btn-success" @click="openClassworkModal">New
                    Classwork</button>
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
        <div v-if="isModalVisible" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>New Classwork</h3>
                    <button @click="closeModal">X</button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitClasswork" class="modal-form">
                        <div class="form-group">
                            <label for="classworkName">Classwork Name</label>
                            <input v-model="classwork.name" type="text" id="classworkName" required />
                        </div>
                        <div class="form-group">
                            <label for="classworkDescription">Description</label>
                            <textarea v-model="classwork.description" id="classworkDescription" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="dueDate">Due Date</label>
                            <input v-model="classwork.dueDate" type="datetime-local" id="dueDate" required />
                        </div>

                        <div class="form-group">
                            <label for="examSelect">Select Exam</label>
                            <select v-model="classwork.examId" id="examSelect" required>
                                <option v-for="exam in exams" :key="exam.id" :value="exam.id">{{ exam.name }}</option>
                            </select>
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>

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
            classId: this.$route.params.id,
            activeTab: 'classwork',
            isModalVisible: false, // Control modal visibility
            classwork: {
                name: '',
                description: '',
                dueDate: '',
                examId: null
            }
        };
    },
    mounted() {
        this.fetchClass();
        this.fetchClasswork();
        this.fetchExams();
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
        },
        openClassworkModal() {
            this.isModalVisible = true;
        },
        closeModal() {
            this.isModalVisible = false;
        },
        async submitClasswork() {
            const { name, description, dueDate, examId } = this.classwork;
            try {
                const res = await axios.post(`${this.apirUrl}/classroom-assignment/assign/${this.classId}/${examId}`, {
                    name,
                    description,
                    dueDate: dueDate,
                });
                console.log('Classwork created:', res.data);
                toast.success('Classwork created successfully!');
                this.closeModal();
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

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    /* Ensures modal is on top */
}

/* Modal content styling */
.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* Slight shadow for depth */
}

/* Header of the modal */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
}

/* Close button in modal */
.modal-header button {
    background: none;
    border: none;
    font-size: 1.5em;
    color: #999;
    cursor: pointer;
}

.modal-header button:hover {
    color: #ff0000;
    /* Red color when hover on close button */
}

/* Modal body containing the form */
.modal-body {
    margin-top: 10px;
}

/* Form styling within the modal */
.form-group {
    margin-bottom: 15px;
}

/* Input fields, textarea, and select */
.modal-form input,
.modal-form textarea,
.modal-form select {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-sizing: border-box;
}

/* Submit button for the form */
.modal-form button {
    padding: 10px 20px;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.modal-form button:hover {
    background-color: #1e88e5;
}

/* Responsive design for modal on smaller screens */
@media (max-width: 768px) {
    .modal-content {
        width: 90%;
        /* Make modal more responsive on small screens */
    }
}
</style>