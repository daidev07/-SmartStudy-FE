<template>
    <div class="text-center">
        <div class="fw-bold fs-3 border-bottom border-end border-black title">
            EXAMS MANAGEMENT
        </div>
    </div>
    <div class="border-top border-black">
        <div class="btn btn-success mt-2" @click="toggleTestAdding">
            <i class='bx bxs-file-plus fs-5'></i> New exam
        </div>
    </div>
    <div v-if="showTestAdding">
        <TestAdding @close="toggleTestAdding" @refresh="fetchExamList" />
    </div>

    <div class="menu-header mt-3">
        <button :class="{ active: activeTab === 'grammar' }" @click="setActiveTab('grammar')" class="me-3">
            Grammar
        </button>
        <button :class="{ active: activeTab === 'listening' }" @click="setActiveTab('listening')" class="me-3">
            Listening
        </button>
        <button :class="{ active: activeTab === 'reading' }" @click="setActiveTab('reading')">
            Reading
        </button>
    </div>

    <!-- Table to display Exams -->
    <div v-if="examList.length > 0" class="mt-3 w-50">
        <h3 class="text-center">{{ capitalize(activeTab) }} Exams</h3>
        <table id="examTable" class="table table-striped table-bordered">
            <thead class="thead-dark">
                <tr>
                    <th class="text-center">#</th>
                    <th>Exam Name</th>
                    <th class="text-start">Date Created</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="exam in examList" :key="exam.id" scope="row">
                    <td class="text-center">{{ exam.id }}</td>
                    <td>{{ exam.name }}</td>
                    <td>{{ exam.createdAt }}</td>
                    <td class="text-center">
                        <button class="btn btn-primary btn-sm me-2">View</button>
                        <button class="btn btn-danger btn-sm">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-else class="text-center mt-3">
        <h3>No exams available for {{ capitalize(activeTab) }}</h3>
    </div>
</template>
<script>
import TestAdding from '../../components/TestAdding.vue';
// import { toast } from "vue3-toastify";
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net';

export default {
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            examList: [],
            examListLoading: false,
            examListError: null,
            showTestAdding: false,
            activeTab: 'grammar',
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
            return this.examList.filter((exam) => exam.type === this.activeTab);
        },
    },
    methods: {
        toggleTestAdding() {
            this.showTestAdding = !this.showTestAdding;
        },
        async fetchExamList() {
            this.examListLoading = true;
            this.examListError = null;
            try {
                const response = await axios.get(this.apiUrl + '/exam');
                this.examList = response.data.data;
                console.log("EXAM LIST:: ", this.examList);
                this.$nextTick(() => {
                    this.initDataTable();
                });
            } catch (error) {
                this.examListError = 'Failed to load exam list.';
                console.error(error);
            } finally {
                this.examListLoading = false;
            }
        },
        initDataTable() {
            $('#examTable').DataTable({
                pageLength: 10,
                paging: true,
                columnDefs: [
                    { targets: '_all', className: 'text-start' }
                ]
            });
        },
        setActiveTab(tab) {
            this.activeTab = tab;
        },
        capitalize(value) {
            if (!value) return '';
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
    },
}
</script>
<style>
.title {
    display: inline-block;
    padding: 10px 20px;
    margin-bottom: 20px;
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
</style>