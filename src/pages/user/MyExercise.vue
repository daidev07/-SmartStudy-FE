<template>
    <div class="container">
        <div class="d-flex justify-content-center align-items-center mb-2 border p-3 rounded-3 bg-white">
            Status of excercise card:
            <div class="d-flex align-items-center ms-3">
                <span class="status-legend bg-light-red me-2"></span><span class="me-4">Not submit</span>
                <span class="status-legend bg-light-orange me-2"></span><span class="me-4">Late submitted</span>
                <span class="status-legend bg-light-green me-2"></span><span>Submitted</span>
            </div>
        </div>

        <div class="border rounded-3 p-2 bg-white">
            <div v-if="listAssignments.length === 0" class="text-body-tertiary text-center">
                You have no assignments at the moment.
            </div>
            <div v-else class="p-2 assign-card">
                <div v-for="assignment in listAssignments" :key="assignment.id" class="card shadow-sm"
                    :class="getStatusCardClass(assignment.assignmentStatus)"
                    v-tooltip:bottom="`${assignment.description}`">
                    <router-link :to="toRouterLink(assignment.exam.examType, assignment.id)"
                        class="card-body justify-content-between text-decoration-none">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h5 class="card-title">{{ assignment.name }}</h5>
                            <span :class="getExamType(assignment.exam.examType)"
                                class="tagType p-1 rounded-2 border border-secondary"> {{
                                    assignment.exam.examType }} </span>
                        </div>
                        <p class="card-text mb-2">{{
                            assignment.description.length > 55
                                ?
                                assignment.description.slice(0, 55) +
                                '...' : assignment.description }}</p>
                        <div class="d-flex justify-content-between">
                            <table>
                                <tbody>
                                    <tr>
                                        <td class="pe-2">Assignment time:</td>
                                        <td class="text-muted">{{ new Date(assignment.assignedAt).toLocaleString() }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="pe-2">Due date:</td>
                                        <td class="text-danger fw-bold">{{ new Date(assignment.dueDate).toLocaleString()
                                            }}
                                        </td>
                                    </tr>
                                    <tr
                                        v-if="assignment.assignmentStatus === 'SUBMITTED' || assignment.assignmentStatus === 'LATE_SUBMISSION'">
                                        <td class="pe-2">Submitted on:</td>
                                        <td class="text-muted">{{ new Date(assignment.submittedAt).toLocaleString() }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="col-2 d-flex justify-content-center align-items-center total-point"
                                :class="getPointColor(assignment.point)" title="Exercise point ">
                                {{ assignment.point }}
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
import { mapGetters } from "vuex";

export default {
    name: 'MyExcercise',
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
        toRouterLink(examType, assignmentId) {
            switch (examType) {
                case "GRAMMAR":
                    return `my-excercise/do-grammar-test/${assignmentId}`;
                case "READING":
                    return `my-excercise/do-reading-test/${assignmentId}`;
                case "LISTENING":
                    return `my-excercise/do-listening-test/${assignmentId}`;
                case "WRITING":
                    return `my-excercise/do-writing-test/${assignmentId}`;
            }
        },
        getStatusCardClass(status) {
            return {
                "bg-light-red": status === "NOT_SUBMIT",
                "bg-light-orange": status === "LATE_SUBMISSION",
                "bg-light-green": status === "SUBMITTED"
            };
        },
        getExamType(examType) {
            return {
                "bg-body-tertiary": examType === "LISTENING",
                "bg-body-secondary": examType === "WRITING",
                "bg-primary-subtle": examType === "GRAMMAR",
                "bg-success-subtle": examType === "READING"
            };
        },
        getPointColor(point) {
            if (point < 30) {
                return 'text-danger';
            } else if (point >= 30 && point < 70) {
                return 'text-warning';
            } else {
                return 'point-blue';
            }
        }
    },
};
</script>
<style scoped>
.container {
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

td {
    font-size: 13px;
}

.total-point {
    font-weight: bold;
    font-size: 40px;
    border-radius: 50%;
}

.point-blue {
    color: #6280e4;
}

.assign-card {
    display: grid;
    grid-template-columns: repeat(3, minmax(300px, 1fr));
    gap: 10px;
    max-height: 77vh;
    overflow-y: auto;
}

.tagType {
    font-size: x-small;
}
</style>