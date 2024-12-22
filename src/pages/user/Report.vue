<template>
    <div class="container">
        <div class="border p-3 rounded-3 bg-white mb-3">
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
                        <div><span class="me-1 text-primary fw-bold fs-5">1000</span> questions</div>
                    </div>
                </div>
                <div class="right-number border-end d-flex justify-content-center align-items-center">
                    <img class="ratio-img me-3" :src="require('@/assets/ReportPage/correctAnswer.png')" />
                    <div>
                        <div>Correct</div>
                        <div><span class="me-1 text-success fw-bold fs-5">1000</span> questions</div>
                    </div>
                </div>
                <div class="wrong-number d-flex justify-content-center align-items-center">
                    <img class="ratio-img me-3" :src="require('@/assets/ReportPage/wrongAnswer.png')" />
                    <div>
                        <div>Wrong</div>
                        <div><span class="me-1 text-danger fw-bold fs-5">1000</span> questions</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="border bg-white p-3 rounded-3 mb-3" style="position: relative; height:40vh">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div class="container-title fw-bold">Recent homework score statistics</div>
                <i class="bi bi-info-circle"
                    v-tooltip:top="'Statistics scores of exercises you have done recently'"></i>
            </div>
            <Line id="scoreLineChart" :data="chartData" :options="chartOptions" />
        </div>
    </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default {
    name: 'ReportComponent',
    components: {
        Line
    },
    data() {
        return {
            chartData: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'Scores',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        borderColor: '#6280e4',
                    }
                ]
            },
            chartOptions: {
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
                            text: 'Excercise'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Scores'
                        }
                    }
                }
            }
        };
    },
    mounted() {
    },
    methods: {
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
    width: 10%;
}
</style>