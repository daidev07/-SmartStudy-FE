<template>
    <div class="container">
        <div class="border p-3 rounded-3 bg-white mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="container-title fw-bold">Questions Statistics</div>
                <i class="bi bi-info-circle"
                    v-tooltip:top="'Statistics of the total number of questions you have done'"></i>
            </div>
            <div class="d-flex align-items-center">
                <div class="container-ratio total-number border-end d-flex justify-content-center align-items-center">
                    <img class="ratio-img me-3" :src="require('@/assets/ReportPage/totalNumber.png')" />
                    <div>
                        <div>Did</div>
                        <div>
                            <span class="me-1 fw-bold fs-5">{{ this.didQuestion ? this.didQuestion : 0
                                }}</span>questions
                        </div>
                    </div>
                </div>
                <div class="right-number border-end d-flex justify-content-center align-items-center">
                    <img class="ratio-img me-3" :src="require('@/assets/ReportPage/correctAnswer.png')" />
                    <div>
                        <div>Correct</div>
                        <div><span class="me-1 text-success fw-bold fs-5">{{ this.correctQuestion ? this.correctQuestion
                            : 0
                                }}</span>questions</div>
                    </div>
                </div>
                <div class="wrong-number d-flex justify-content-center align-items-center border-end ">
                    <img class="ratio-img me-3" :src="require('@/assets/ReportPage/wrongAnswer.png')" />
                    <div>
                        <div>Wrong</div>
                        <div><span class="me-1 text-danger fw-bold fs-5">{{ this.wrongQuestion ? this.wrongQuestion :
                            0
                                }}</span>questions</div>
                    </div>
                </div>
                <div class="right-number d-flex justify-content-center align-items-center border-end ">
                    <img class="ratio-img me-3" :src="require('@/assets/ReportPage/notAnswered.png')" />
                    <div>
                        <div>Not answered</div>
                        <div><span class="me-1 text-primary fw-bold fs-5">{{ this.notAnswered ? this.notAnswered
                            : 0
                                }}</span>questions</div>
                    </div>
                </div>
                <div class="right-number d-flex justify-content-center align-items-center">
                    <img class="ratio-img me-3" :src="require('@/assets/ReportPage/correctRatio.png')" />
                    <div>
                        <div>Correct ratio</div>
                        <div><span class="me-1 text-info fw-bold fs-5">{{ this.correctRatio ?
                            this.correctRatio
                            : 0
                                }}</span>%</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="border bg-white pb-5 px-3 pt-3 rounded-3 mb-2" style="position: relative; height:40vh">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="container-title fw-bold">Recent homework score statistics</div>
                <i class="bi bi-info-circle"
                    v-tooltip:top="'Statistics scores of exercises you have done recently'"></i>
            </div>
            <Line id="scoreLineChart" :data="chartData" :options="chartOptions" />
        </div>
        <div class="container-excercise-history border bg-white rounded-3 p-3 mh-50m mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="container-title fw-bold">Recent excercises</div>
                <i class="bi bi-info-circle" v-tooltip:top="'List of exercises you have done recently'"></i>
            </div>
            <div v-if="listDoneAssigns.length === 0" class="text-center text-body-tertiary">No exercises have been
                done yet.
            </div>
            <div v-else class="p-3">
                <div v-for="doneAssign in listDoneAssigns"
                    class="row justify-content-center align-items-center w-100 border-bottom p-2" :key="doneAssign.id">
                    <div class="col-2 text-center">
                        <div class="fw-bold">
                            {{ formatDate(doneAssign.submittedAt) }}
                        </div>
                        <div>
                            {{ formatTime(doneAssign.submittedAt) }}
                        </div>
                    </div>
                    <div class="col-8 d-flex justify-content-between border-start border-end ">
                        <div class="fs-5 fw-bold">
                            {{ doneAssign.name }}
                        </div>
                        <div class="text-danger fs-4 fw-bold" v-tooltip:top="'Your score'">
                            {{ doneAssign.point }}
                        </div>
                    </div>

                    <div class="col-2 text-center">
                        <button class="btn btn-info text-white"
                            @click="viewAssignAgain(doneAssign.id, doneAssign.exam.examType)">View
                            again</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { formatDate, formatTime } from '@/utils/FormatDateAndTime.js';
import axios from 'axios';
import { mapGetters } from 'vuex';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default {
    name: 'ReportComponent',
    components: {
        Line
    },
    computed: {
        ...mapGetters(['getUserInfo']),
        chartData() {
            return {
                labels: this.listDoneAssigns.map(assignment => assignment.name),
                datasets: [
                    {
                        label: 'Your point',
                        data: this.listDoneAssigns.map(assignment => assignment.score),
                        borderColor: '#6280e4',
                    }
                ]
            };
        },
        chartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'EXERCISES'
                        }

                    },
                    y: {
                        title: {
                            display: true,
                            text: 'POINTS'
                        },
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                }
            };
        }
    },
    watch: {
        getUserInfo(user) {
            if (user) {
                this.fetchStudentReport();
            }
        }
    },
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            reports: [],
            answerResults: [],
            listDoneAssigns: [],
            didQuestion: 0,
            correctQuestion: 0,
            wrongQuestion: 0,
            notAnswered: 0,
            correctRatio: 0,
            studentAssignments: [],
        };
    },
    mounted() {
        if (this.getUserInfo) {
            this.fetchStudentReport();
        }
    },
    methods: {
        formatDate,
        formatTime,
        async fetchStudentReport() {
            try {
                const response = await axios.get(this.apiUrl + `/student-report/user/${this.getUserInfo.id}`);
                this.reports = response.data.data;

                this.answerResults = this.reports.answerResults;
                this.didQuestion = this.answerResults.length;
                this.correctQuestion = Array.isArray(this.answerResults)
                    ? this.answerResults.filter(item => item.answer && item.answer.isCorrect).length
                    : 0;
                this.wrongQuestion = Array.isArray(this.answerResults)
                    ? this.answerResults.filter(item => item.answer && !item.answer.isCorrect).length
                    : 0;
                this.notAnswered = this.didQuestion - this.correctQuestion - this.wrongQuestion;
                this.correctRatio = this.didQuestion > 0 ? Math.round(this.correctQuestion / this.didQuestion * 100) : 0;

                this.studentAssignments = this.reports.studentAssignments.reverse();
                this.listDoneAssigns = this.studentAssignments
                    .filter(assign => assign.assignmentStatus !== "NOT_SUBMIT")

                this.chartData.labels = this.listDoneAssigns.map(assign => assign.name);
                this.chartData.datasets[0].data = this.listDoneAssigns.map(assign => assign.point).reverse();
            } catch (error) {
                console.error(error);
            }
        },
        viewAssignAgain(assignId, examType) {
            let routeName = '';
            switch (examType) {
                case 'READING':
                    routeName = 'DoingReadingTest';
                    break;
                case 'LISTENING':
                    routeName = 'DoingListeningTest';
                    break;
                case 'GRAMMAR':
                    routeName = 'DoingGrammarTest';
                    break;
                case 'WRITING':
                    routeName = 'DoingWritingTest';
                    break;
                default:
                    console.error('Exam type not recognized:', examType);
                    return;
            }
            this.$router.push({ name: routeName, params: { id: assignId } });
        },

    }
}
</script>
<style scoped>
.container {
    margin-top: 95px;
}

.container-title {
    color: #6280e4;
}

.ratio-img {
    width: 15%;
}
</style>