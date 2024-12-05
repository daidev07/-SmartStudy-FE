<template>
    <div class="container w-50">
        <div class="d-flex justify-content-center align-items-center mb-3">
            <div class="d-flex align-items-center">
                <span class="status-legend bg-light-red me-2"></span><span class="me-4">Not submit</span>
                <span class="status-legend bg-light-orange me-2"></span><span class="me-4">Late submitted</span>
                <span class="status-legend bg-light-green me-2"></span><span>Submitted</span>
            </div>
        </div>

        <div v-if="listAssignments.length === 0" class="alert alert-info text-center">
            You have no assignments at the moment.
        </div>

        <!-- Assignment cards -->
        <div class="p-2 assign-card">
            <div v-for="assignment in listAssignments" :key="assignment.id" class="card shadow-sm"
                :class="getStatusCardClass(assignment.assignmentStatus)" title="Do this exercise">
                <router-link :to="'/my-assignment/do-assignment/' + assignment.id"
                    class="card-body justify-content-between text-decoration-none">
                    <h5 class="card-title">{{ assignment.name }}</h5>
                    <p class="card-text">{{ assignment.description }}</p>
                    <div class="d-flex justify-content-between">
                        <div class="align-items-center">
                            <p class="text-muted mb-1"> Assignment date:
                                <strong>{{ new Date(assignment.assignedAt).toLocaleDateString() }}</strong>
                            </p>
                            <p class="text-muted">Due date:
                                <strong class="text-danger"> {{ new Date(assignment.dueDate).toLocaleString()
                                    }}</strong>
                            </p>
                        </div>
                        <div class="col-2 d-flex justify-content-center align-items-center total-point"
                            title="Exercise point ">
                            {{ assignment.point }}
                        </div>
                    </div>


                </router-link>
            </div>
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
                const response = await axios.get(this.apiUrl + `/student-assignment/user/${userId}`);
                this.listAssignments = response.data.data.reverse();
                console.log("LIST ASSIGNMENTS:: ", this.listAssignments);

            } catch (error) {
                console.error(error);
            }
        },
        getStatusCardClass(status) {
            return {
                "bg-light-red": status === "NOT_SUBMIT",
                "bg-light-orange": status === "LATE_SUBMISSION",
                "bg-light-green": status === "SUBMITTED"
            };
        }
    },
};
</script>
<style scoped>
.container {
    background-color: #ffffff;
    border: 2px solid #6280e4;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    min-height: 88vh;
    margin-top: 95px;
}

.bg-light-red {
    border: 1px solid #a51d1d;
    background-color: #ffd0d0;
}

.bg-light-orange {
    background-color: #ffecc8;
    border: 1px solid #fcba40;
}

.bg-light-green {
    background-color: #3dff77;
    border: 1px solid #00f767;
}

.card {
    border-radius: 8px;
    transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
    cursor: pointer;
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

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

.total-point {
    color: #5a010a;
    font-weight: bold;
    font-size: 40px;
    border-radius: 0.5rem;
    min-width: 50px;
}

.assign-card {
    display: grid;
    grid-template-columns: repeat(2, minmax(300px, 1fr));
    gap: 10px;
    max-height: 77vh;
    overflow-y: auto;
}
</style>