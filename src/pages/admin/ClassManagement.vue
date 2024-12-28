<template>
    <div class="text-center">
        <div class="fw-bold fs-3 border rounded-3 px-3 py-2 shadow">
            CLASS MANAGEMENT
        </div>
        <hr class="fw-bold">
    </div>
    <div class="text-end mb-3">
        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addClassModal">
            <i class="bi bi-journal-plus me-1"></i>New Class
        </button>
    </div>
    <div class="class-card-container">
        <div v-for="classItem in classList" :key="classItem.id" class="class-card"
            @click="goToClassDetail(classItem.id)" v-tooltip:bottom="'More information...'">
            <div class="d-flex justify-content-between align-items-center">
                <h3 class="class-name fw-bold">{{ classItem.className }}</h3>
                <i class="bi bi-trash3 text-danger fw-bold fs-5" v-tooltip:right="'Delete class'"
                    @click="openCofirmDeleteModal" data-bs-toggle="modal" data-bs-target="#confirmDeleteClassModal"></i>
            </div>
            <div class="card-body mt-4">
                <span class="text-body-tertiary">Student: </span>
            </div>
        </div>
        <div v-if="isModalVisible" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Create Assignment</h3>
                    <button @click="closeModal">X</button>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="submitAssignment">
                        <div class="form-group">
                            <label for="assignmentName">Assignment Name</label>
                            <input v-model="assignment.name" type="text" id="assignmentName" required />
                        </div>
                        <div class="form-group">
                            <label for="assignmentDescription">Description</label>
                            <textarea v-model="assignment.description" id="assignmentDescription" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="dueDate">Due Date</label>
                            <input v-model="assignment.dueDate" type="datetime-local" id="dueDate" required />
                        </div>
                        <div class="form-group">
                            <label for="examSelect">Select Exam</label>
                            <select v-model="assignment.examId" id="examSelect" required>
                                <option v-for="exam in exams" :key="exam.id" :value="exam.id">{{ exam.name }}</option>
                            </select>
                        </div>
                        <button type="submit">Create Assignment</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal add new class -->
    <div class="modal fade" id="addClassModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="addClassModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="addClassModal">Add New Class</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div>
                            <label for="name" class="form-label fw-bold">Class name</label>
                            <input type="text" class="form-control" id="name" placeholder="Enter class name"
                                v-model="newClass.className" :class="{ 'is-invalid': nameError }" @keyup="checkName">
                            <div v-if="nameError" class="invalid-feedback">
                                Name is required
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="saveNewClass">Submit</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal confirm delete class -->
    <div class="modal fade" id="confirmDeleteClassModal" data-bs-backdrop="static" data-bs-keyboard="false"
        tabindex="-1" aria-labelledby="confirmDeleteClassModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5 text-danger" id="staticBackdropLabel">Confirm delete class</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-danger">
                    Deleting a class will not show the class on this page, are you sure you want to delete it?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">No</button>
                    <button type="button" class="btn btn-danger">Yes</button>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

export default {
    data() {
        return {
            apirUrl: process.env.VUE_APP_API_URL,
            classList: [],
            classListLoading: false,
            classListError: null,
            isModalVisible: false,
            assignment: {
                name: '',
                description: '',
                dueDate: '',
                examId: null
            },
            exams: [],
            currentClassId: null,
            newClass: {
                className: '',
            },
            nameError: false,
        };
    },
    created() {
        this.fetchClassList();
    },
    methods: {
        async openCofirmDeleteModal() {
            console.log('Delete class');

        },
        async saveNewClass() {
            this.nameError = false;
            let isValid = true;
            if (this.newClass.className === '') {
                this.nameError = true;
                isValid = false;
            }
            if (!isValid) {
                return;
            }
            try {
                const response = await axios.post(this.apirUrl + '/class', this.newClass);
                if (response.data.data.code == 201) {
                    toast.success('New class created successfully');
                    this.fetchClassList();
                    const addNewClassModal = new bootstrap.Modal(document.getElementById('addClassModal'));
                    addNewClassModal.hide();
                    this.newClass = {
                        className: '',
                    };
                }
            } catch (error) {
                if (error.response.data.code == 430) {
                    toast.error('Class name already exists, try another name');
                }
            }
        },
        async fetchClassList() {
            this.classListLoading = true;
            this.classListError = null;
            try {
                const response = await axios.get(this.apirUrl + '/class');
                this.classList = response.data.data;
                console.log("LIST CLASS:: ", this.classList);

            } catch (error) {
                this.classListError = error;
            } finally {
                this.classListLoading = false;
            }
        },
        goToClassDetail(classId) {
            this.$router.push({ name: 'ClassroomDetail', params: { id: classId } });
        },
        openAssignmentModal(classId) {
            this.currentClassId = classId;
            this.isModalVisible = true;
            this.fetchExams();
        },
        closeModal() {
            this.isModalVisible = false;
        },
        async fetchExams() {
            try {
                const response = await axios.get(this.apirUrl + '/exam');
                this.exams = response.data;
            } catch (error) {
                console.error('Failed to fetch exams:', error);
            }
        },
        async submitAssignment() {
            const formattedDueDate = this.assignment.dueDate ? this.assignment.dueDate + ":00" : null;
            const assignmentData = {
                ...this.assignment,
                dueDate: formattedDueDate,
                classId: this.currentClassId
            };
            try {
                await axios.post(`${this.apirUrl}/assignments`, assignmentData);
                toast.success('Assignment created successfully');
                this.closeModal();
            } catch (error) {
                console.error('Error creating assignment:', error);
                toast.error('Failed to create assignment');
            }
        }, checkName() {
            if (this.newClass.className !== '') {
                this.nameError = false;
            } else {
                this.nameError = true;
            }
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

.class-card-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}

.class-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    width: 300px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.class-card:hover {
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.icon {
    font-size: 1.2rem;
    color: #666;
}

.level-1 {
    background-color: #2196f3;
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
}

.level-2 {
    background-color: #4caf50;
    /* Màu xanh nước biển sáng */
    color: #fff;
    /* Màu chữ trắng để dễ đọc */
    padding: 4px 8px;
    border-radius: 4px;
}

.level-3 {
    background-color: #ff9800;
    /* Màu cam */
    color: #fff;
    /* Màu chữ trắng để dễ đọc */
    padding: 4px 8px;
    border-radius: 4px;
}

.status {
    font-weight: bold;
    text-transform: uppercase;
}

.status.in-progress {
    color: #2196f3;
    /* Màu cam cho trạng thái "IN PROGRESS" */
}

.status.completed {
    color: #4caf50;
    /* Màu xanh lá cho trạng thái "COMPLETED" */
}
</style>