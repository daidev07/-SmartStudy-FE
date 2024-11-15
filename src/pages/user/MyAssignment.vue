<template>
    <div class="container mt-3 w-50">
        <!-- Status legend -->
        <div class="d-flex justify-content-center align-items-center mb-3">
            <div class="d-flex align-items-center">
                <span class="status-legend bg-light-red me-2"></span><span class="me-4">Not submit</span>
                <span class="status-legend bg-light-orange me-2"></span><span class="me-4">Late submit</span>
                <span class="status-legend bg-light-green me-2"></span><span>Submitted</span>
            </div>
        </div>

        <div v-if="listAssignments.length === 0" class="alert alert-info text-center">
            You have no assignments at the moment.
        </div>

        <!-- Assignment cards -->
        <div v-for="assignment in listAssignments" :key="assignment.id" class="card mb-4 shadow-sm"
            :class="getStatusCardClass(assignment.assignmentStatus)" title="Do this exercise">
            <router-link :to="'/my-assignment/do-assignment/' + assignment.id"
                class="card-body d-flex justify-content-between text-decoration-none">
                <div>
                    <h5 class="card-title fs-3">{{ assignment.name }}</h5>
                    <p class="card-text">{{ assignment.description }}</p>
                </div>
                <div class="text-end">
                    <p class="text-muted mb-1"> Assignment date:
                        <strong>{{ new Date(assignment.createdAt).toLocaleDateString() }}</strong>
                    </p>
                    <p class="text-muted">Due date:
                        <strong> {{ new Date(assignment.dueDate).toLocaleDateString() }}</strong>
                    </p>
                </div>
            </router-link>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import { mapGetters } from "vuex";

export default {
    name: 'MyAssignment',
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            listAssignments: [],
        };
    },
    mounted() {
        this.fetchListAssignment();
    },
    watch: {
        getUserInfo(newUserInfo, oldUserInfo) {
            if (newUserInfo !== oldUserInfo) {
                this.fetchListAssignment();
            }
        }
    },
    computed: {
        ...mapGetters(['getUserInfo']),
    },
    methods: {
        async fetchListAssignment() {
            try {
                if (!this.getUserInfo) return;
                const userId = this.getUserInfo.id;
                console.log("USER ID::", userId);
                const response = await axios.get(this.apiUrl + `/api/student-assignment/${userId}`);
                this.listAssignments = response.data.data;
                console.log("LIST ASSIGNMENT BY USER ID::", this.listAssignments);

            } catch (error) {
                console.error(error);
            }
        },
        getStatusCardClass(status) {
            return {
                "bg-light-red": status === "NOT_SUBMIT",
                "bg-light-orange": status === "LATE_SUBMIT",
                "bg-light-green": status === "SUBMITTED"
            };
        }
    },
};
</script>
<style scoped>
.container {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    min-height: 87vh;
}

/* Custom card styles for different statuses */
.bg-light-red {
    border: 1px solid #ffcccc;
    background-color: #ffd0d0;
}

.bg-light-orange {
    background-color: #ffecc8;
    border: 1px solid #ffe1a9;
}

.bg-light-green {
    background-color: #d4fde0;
    border: 1px solid #b0ffd1;
}

/* Card styling */
.card {
    border-radius: 8px;
    transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
    cursor: pointer;
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

/* Status legend styling */
.status-legend {
    display: inline-block;
    width: 32px;
    height: 16px;
    border-radius: 15%;
}

.bg-light-red {
    background-color: #ffdddd;
}

.bg-light-orange {
    background-color: #fff4e0;
}

.bg-light-green {
    background-color: #e6ffed;
}
</style>