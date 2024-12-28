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
        aria-labelledby="addEmployeeModal" aria-hidden="true" ref="addEmployeeModal">
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
                            <input type="text" class="form-control" id="name" placeholder="Enter full name"
                                v-model="newEmployee.name" :class="{ 'is-invalid': nameError }" @keyup="checkName">
                            <div v-if="nameError" class="invalid-feedback">
                                Name is required
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="username" class="form-label fw-bold">Username</label>
                            <input type="text" class="form-control" id="username" placeholder="Enter username for login"
                                v-model="newEmployee.username" :class="{ 'is-invalid': usernameError }"
                                @keyup="checkUsername">
                            <div v-if="usernameError" class="invalid-feedback">
                                Username is required
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label fw-bold">Password</label>
                            <input type="password" class="form-control" id="password"
                                placeholder="Enter password for login" v-model="newEmployee.password"
                                :class="{ 'is-invalid': passwordError }" @keyup="checkPassword">
                            <div v-if="passwordError" class="invalid-feedback">
                                Password is required
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label fw-bold">Confirm password</label>
                            <input type="password" class="form-control" id="confirmPassword"
                                placeholder="Enter password again" v-model="newEmployee.confirmPassword"
                                :class="{ 'is-invalid': confirmPasswordError || matchPasswordError }"
                                @keyup="checkConfirmPassword">
                            <div v-if="confirmPasswordError" class="invalid-feedback">
                                Confirm password is required
                            </div>
                            <div v-if="matchPasswordError" class="invalid-feedback">
                                Password don't match, please check again!
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label fw-bold">Email</label>
                            <input type="email" class="form-control" id="email" placeholder="Enter email for contact"
                                v-model="newEmployee.email" :class="{ 'is-invalid': emailError }" @keyup="checkEmail">
                            <div v-if="emailError" class="invalid-feedback">
                                Email is required
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="phone" class="form-label fw-bold">Phone</label>
                            <input type="text" class="form-control" id="phone"
                                placeholder="Enter phone number for contact" v-model="newEmployee.phone"
                                :class="{ 'is-invalid': phoneError }" @keyup="checkPhone">
                            <div v-if="phoneError" class="invalid-feedback">
                                Phone is required
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="saveEmployee">Submit</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { toast } from "vue3-toastify";
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

export default {
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            employeesList: [],
            activeTab: "TEACHER",
            newEmployee: {
                name: "",
                username: "",
                password: "",
                confirmPassword: "",
                email: "",
                phone: "",
            },
            nameError: false,
            usernameError: false,
            passwordError: false,
            confirmPasswordError: false,
            matchPasswordError: false,
            emailError: false,
            phoneError: false,
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
        async saveEmployee() {
            this.nameError = this.usernameError = this.passwordError = this.confirmPasswordError = this.emailError = this.phoneError = false;
            let isValid = true;
            if (this.newEmployee.name === '') {
                this.nameError = true;
                isValid = false;
            }
            if (this.newEmployee.username === '') {
                this.usernameError = true;
                isValid = false;
            }
            if (this.newEmployee.password === '') {
                this.passwordError = true;
                isValid = false;
            }
            if (this.newEmployee.confirmPassword === '') {
                this.confirmPasswordError = true;
                isValid = false;
            }
            if (this.newEmployee.email === '') {
                this.emailError = true;
                isValid = false;
            }
            if (this.newEmployee.phone === '') {
                this.phoneError = true;
                isValid = false;
            }
            if (this.newEmployee.password !== this.newEmployee.confirmPassword) {
                this.matchPasswordError = true;
                isValid = false;
            }

            if (!isValid) {
                return;
            }
            if (this.activeTab === "TEACHER") {
                this.newEmployee.role = "TEACHER";
            } else if (this.activeTab === "ASSISTANT") {
                this.newEmployee.role = "ASSISTANT";
            }
            try {
                const response = await axios.post(this.apiUrl + "/user", this.newEmployee);
                if (response.data.data.code == 201) {
                    this.newEmployee = {
                        name: "",
                        username: "",
                        password: "",
                        confirmPassword: "",
                        email: "",
                        phone: "",
                    };
                    this.fetchData(this.activeTab);
                    const addEmployeeModal = new bootstrap.Modal(this.$refs.addEmployeeModal);
                    addEmployeeModal.hide();
                    toast.success("Create successfully!");
                }
            } catch (error) {
                if (error.response.data.code == 413) {
                    toast.error("Username already exists. Try another one!");
                }
            }
        },
        checkName() {
            if (this.newEmployee.name !== '') {
                this.nameError = false;
            } else {
                this.nameError = true;
            }
        },
        checkUsername() {
            if (this.newEmployee.username !== '') {
                this.usernameError = false;
            } else {
                this.usernameError = true;
            }
        },
        checkPassword() {
            if (this.newEmployee.password !== '') {
                this.passwordError = false;
            } else {
                this.passwordError = true;
            }
            this.checkConfirmPassword();
        },
        checkConfirmPassword() {
            if (this.newEmployee.confirmPassword === '') {
                this.confirmPasswordError = true;
                this.matchPasswordError = false;
            } else {
                this.confirmPasswordError = false;
                if (this.newEmployee.password !== this.newEmployee.confirmPassword) {
                    this.matchPasswordError = true;
                } else {
                    this.matchPasswordError = false;
                }
            }
        },
        checkEmail() {
            if (this.newEmployee.email !== '') {
                this.emailError = false;
            } else {
                this.emailError = true;
            }
        },
        checkPhone() {
            if (this.newEmployee.phone !== '') {
                this.phoneError = false;
            } else {
                this.phoneError = true;
            }
        },
    },
}
</script>
<style scoped></style>