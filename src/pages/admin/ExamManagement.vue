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

    <!-- Table to display Exams -->
    <div v-if="examList.length > 0" class="mt-3 w-50">
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
        <h3>No exams available</h3>
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
        };
    },
    created() {
        this.fetchExamList();
    },
    components: {
        TestAdding,
    },
    methods: {
        toggleTestAdding() {
            this.showTestAdding = !this.showTestAdding;
        },
        async fetchExamList() {
            this.examListLoading = true;
            this.examListError = null;
            try {
                const response = await axios.get(this.apiUrl + '/api/exam');
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
                pageLength: 10, // Set the number of rows per page
                paging: true,
                columnDefs: [
                    { targets: '_all', className: 'text-start' } // Apply left alignment to all columns
                ]// Enable pagination
            });
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
</style>