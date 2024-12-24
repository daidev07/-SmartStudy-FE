<template>
    <div class="text-center">
        <div class="fw-bold fs-3 border rounded-3 px-3 py-2 shadow">
            EMPLOYEES MANAGEMENT
        </div>
        <hr class="fw-bold">
    </div>
    <div class="container-add-employee text-end">
        <button v-if="activeTab === 'TEACHER'" class="btn btn-success" data-bs-toggle="modal"
            data-bs-target="#addEmployeeModal">
            <i class="bi bi-person-plus-fill me-2"></i>New Teacher
        </button>
        <button v-if="activeTab === 'ASSISTANT'" class="btn btn-success" data-bs-toggle="modal"
            data-bs-target="#addEmployeeModal">
            <i class="bi bi-person-plus-fill me-2"></i>New Assistant
        </button>
    </div>
    <div>
        <ul class="nav nav-tabs mt-3">
            <li class="nav-item ">
                <button class="nav-link text-dark"
                    :class="{ active: activeTab === 'TEACHER', 'fw-bold t': activeTab === 'TEACHER' }"
                    @click="setActiveTab('TEACHER')">
                    Teacher
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link text-dark"
                    :class="{ active: activeTab === 'ASSISTANT', 'fw-bold': activeTab === 'ASSISTANT' }"
                    @click="setActiveTab('ASSISTANT')">
                    Assistant
                </button>
            </li>
        </ul>
    </div>
    <div class="shadow p-3 d-flex justify-content-center rounded-3">
        <table class="table table-striped table-bordered">
            <thead>
                <tr>
                    <th class="text-center" width="10%">Avatar</th>
                    <th width="20%">Name</th>
                    <th width="20%">Email</th>
                    <th width="20%">Phone</th>
                    <th class="text-center" width="30%">Actions</th>
                </tr>
            </thead>
            <tbody class="table-group-divider">
                <tr v-for="employee in employeesList" :key="employee.id" class="align-middle ">
                    <td class="text-center">
                        <img :src="employee.avatarFile ? employee.avatarFile : require('@/assets/nonAvatar.png')"
                            alt="avatar" class="rounded-circle" width="50" height="50">
                    </td>
                    <td>{{ employee.name }}</td>
                    <td>{{ employee.email }}</td>
                    <td>{{ employee.phone }}</td>
                    <td class="text-center">
                        <button class="btn btn-info btn-sm me-2">View / Update</button>
                        <button class="btn btn-danger btn-sm"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Modal add employee -->
    <div class="modal fade" id="addEmployeeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="addEmployeeModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header ">
                    <h1 class="modal-title fs-5 fw-bold" id="addEmployeeModal" v-if="activeTab === 'TEACHER'">Add New
                        Teacher
                    </h1>
                    <h1 class="modal-title fs-5 fw-bold" id="addEmployeeModal" v-if="activeTab === 'ASSISTANT'">Add New
                        Assistant</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="mb-3">
                            <label for="name" class="form-label fw-bold">Name</label>
                            <input type="text" class="form-control" id="name" placeholder="Enter full name">
                        </div>
                        <div class="mb-3">
                            <label for="userName" class="form-label fw-bold">Username</label>
                            <input type="text" class="form-control" id="userName"
                                placeholder="Enter username for login">
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label fw-bold">Password</label>
                            <input type="password" class="form-control" id="password"
                                placeholder="Enter password for login">
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label fw-bold">Confirm password</label>
                            <input type="password" class="form-control" id="confirmPassword"
                                placeholder="Enter password again">
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label fw-bold">Email</label>
                            <input type="email" class="form-control" id="email" placeholder="Enter email for contact">
                        </div>
                        <div class="mb-3">
                            <label for="phone" class="form-label fw-bold">Phone</label>
                            <input type="text" class="form-control" id="phone"
                                placeholder="Enter phone number for contact">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            employeesList: [],
            activeTab: "TEACHER",
        };
    },
    mounted() {
        this.fetchData("TEACHER");
    },
    methods: {
        async fetchData(tab) {
            const endpoint = tab === "TEACHER" ? "/user/teachers" : "/user/assistants";
            try {
                const response = await axios.get(this.apiUrl + endpoint);
                this.employeesList = response.data.data;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        setActiveTab(tab) {
            this.activeTab = tab;
            this.fetchData(tab);
        },
    },
}
</script>
<style scoped></style>