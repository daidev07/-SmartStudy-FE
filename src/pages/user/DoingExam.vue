<template>
    <div class="container mt-3 w-50">
        <div class="d-flex justify-content-between mb-3">
            <h2 class="text-center fw-bold">{{ assignmentDetail ? assignmentDetail.name : 'Loading...' }}</h2>
            <button class="btn btn-primary" @click="submitExam">Submit</button>
        </div>

        <div v-if="assignmentDetail" class="exam-questions">
            <div v-for="(question, index) in assignmentDetail.questions" :key="question.id" class="mb-3">
                <h5 class="mb-2">{{ index + 1 }}. {{ question.content }}</h5>
                <!-- Centered Answers -->
                <div class="d-flex flex-wrap justify-content-center">
                    <div v-for="answer in question.answers" :key="answer.id" class="col-5 mb-2">
                        <div class="form-check text-center me-2">
                            <!-- Hidden radio button -->
                            <input class="form-check-input" type="radio" :name="'question-' + question.id"
                                :id="'answer-' + answer.id" />
                            <!-- Label acting as a radio button -->
                            <label class="btn form-check-label" :for="'answer-' + answer.id">
                                {{ answer.content }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';
export default {
    name: 'DoingExamComponent',
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            assignmentDetail: null,
        };
    },
    computed: {
        assignmentId() {
            return this.$route.params.id;
        }
    },
    mounted() {
        console.log('Current Assignment ID:', this.assignmentId);
        this.fetchAssignmentDetail();
    },
    methods: {
        async fetchAssignmentDetail() {
            try {
                const response = await axios.get(this.apiUrl + `/api/exam/${this.assignmentId}`);
                this.assignmentDetail = response.data.data;
                console.log("ASSIGNMENT DETAIL::", response.data.data);
            } catch (error) {
                console.error(error);
            }
        },
        submitExam() {
            alert('Exam submitted!');
        }
    }
};
</script>
<style scoped>
.container {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
}

.container:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Header title styling */
h2 {
    color: #0d6efd;
    font-size: 1.8rem;
    margin-bottom: 0;
}

/* Styling for the exam questions */
.exam-questions {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-top: 15px;
}

/* Question and answer spacing */
h5 {
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
}

/* Radio buttons hidden but styled as buttons */
.form-check {
    background-color: #ffffff;
    border-radius: 5px;
    padding: 5px;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
}

.form-check:hover {
    transform: translateY(-3px);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
}

.form-check-input {
    display: none;
}

/* Button styling for the label acting as a radio button */
.form-check-label {
    cursor: pointer;
    font-size: 1rem;
    color: #555;
    display: block;
    /* Make label fill the area for easy selection */
    padding: 5px;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
}

.form-check-input:checked+.form-check-label {
    background-color: #0d6efd;
    color: #fff;
}
</style>
