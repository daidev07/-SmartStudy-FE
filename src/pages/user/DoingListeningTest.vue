<template>
    <div class="container w-75">
        <div v-if="!isSubmit" class="d-flex justify-content-between mb-3">
            <h4 class="text-center fw-bold">{{ examDetail ? examDetail.name : 'Loading...' }}</h4>
            <button class="btn-submit p-2 rounded-2" @click="submitExam"> <i class="bi bi-check2-circle me-1"></i>
                Submit</button>
        </div>
        <div v-else class="d-flex justify-content-between mb-3">
            <h4 class="text-center fw-bold">Result for {{ examDetail ? examDetail.name : 'Loading...' }}</h4>
            <h4 class="text-center fw-bold">
                Point: <span class="text-danger">{{ assignmentInfo?.point }}</span>
            </h4>
        </div>
        <div class="d-flex justify-content-around gap-2">
            <div class="mp3-pdf w-50 border border-primary rounded-3 p-2">
                <div class="w-100" v-if="examDetail?.listenFileUrl?.fileUrl">
                    <audio controls class="w-100">
                        <source :src="examDetail.listenFileUrl.fileUrl" type="audio/mpeg">
                    </audio>
                </div>
                <div v-else>The listen file is no longer available, please contact your teacher.</div>
                <div class="pdf-file" v-if="examDetail?.pdfFileUrl?.fileUrl">
                    <iframe :src="examDetail.pdfFileUrl.fileUrl" width="100%" height="98%" frameborder="0"></iframe>
                </div>
                <div v-else>The pdf file is no longer available, please contact your teacher.</div>
            </div>
            <div class="quizz w-50 border border-primary rounded-3 p-3">
                Select your answer below
                <div v-if="examDetail" class="exam-questions">
                    <div class="row">
                        <div v-for="(question, index) in examDetail.questions" :key="question.id">
                            <div class="mb-3">
                                <div class="d-flex justify-content-between">
                                    <p class="mb-2">{{ index + 1 }}. {{ question.content }}</p>
                                </div>
                                <div class="">
                                    <div v-for="answer in question.answers" :key="answer.id" class="mb-2">
                                        <div v-if="isSubmit" class="form-check">
                                            <input class="form-check-input" type="radio"
                                                :name="'question-' + question.id" :id="'answer-' + answer.id"
                                                :checked="isAnswerSelected(question.id, answer.id)" disabled />
                                            <label class="form-check-label" :for="'answer-' + answer.id" :class="{
                                                'correct-answer': isCorrectAnswer(question.id, answer.id),
                                                'incorrect-answer': isIncorrectUserAnswer(question.id, answer.id),
                                                'user-answer': isUserAnswerSelected(question.id, answer.id)
                                            }">
                                                {{ answer.content }}
                                            </label>
                                        </div>
                                        <div v-else class="form-check me-2">
                                            <input class="form-check-input" type="radio"
                                                :name="'question-' + question.id" :id="'answer-' + answer.id" />
                                            <label class="form-check-label" :for="'answer-' + answer.id">
                                                {{ answer.content }}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { toast } from "vue3-toastify";

export default {
    name: 'DoingListeningTest',
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            stuAssignId: null,
            assignmentInfo: {},
            examDetail: null,
            isCompleted: false,
            answerResults: [],
            userAnswers: {},
            isSubmit: false,
        };
    },
    mounted() {
        this.stuAssignId = parseInt(this.$route.params.id, 10);
        console.log('STUDENT ASSIGNMENT ID:: ', this.stuAssignId);

        this.fetchAssignment();
    },
    computed: {

    },
    methods: {
        async fetchAssignment() {
            try {
                const response = await axios.get(this.apiUrl + `/student-assignment/${this.stuAssignId}`);
                this.assignmentInfo = response.data.data;
                console.log('ASSIGNMENT INFO:: ', this.assignmentInfo);
                this.examDetail = this.assignmentInfo.exam;
                console.log('EXAM DETAIL:: ', this.examDetail);
                if (this.assignmentInfo.assignmentStatus === 'SUBMITTED' || this.assignmentInfo.assignmentStatus === 'LATE_SUBMISSION') {
                    this.isSubmit = true;
                    await this.fetchAnswerResults();
                }
            } catch (error) {
                console.error(error);
            }
        },
        async fetchAnswerResults() {
            try {
                const response = await axios.get(
                    this.apiUrl + `/answer-result/user/${this.getUserId}/assignment/${this.assignmentId}`
                );
                const answerResults = response.data.data;
                this.answerResults = answerResults;
                this.userAnswers = {};
                answerResults.forEach(result => {
                    this.userAnswers[result.questionId] = result.answerId;
                });
            } catch (error) {
                console.error('Error fetching answer results:', error);
            }
        },
    }
}
</script>

<style scoped>
.container {
    background-color: #ffffff;
    border: 2px solid #6280e4;
    border-radius: 10px;
    padding: 10px 20px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
    margin-top: 91px;
    height: 88vh;
}

h4 {
    color: #6280e4;
    margin-bottom: 0;
}

.btn-submit {
    background-color: #6280e4;
    color: white;
    border: none;

}

.btn-submit:hover {
    cursor: pointer;
    background-color: #4d64b8;
    color: white;
    transform: scale(1.1);
    transition: transform 0.4s ease-in-out;
}

.mp3-pdf {
    height: 78vh;
    overflow-y: auto;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.pdf-file {
    height: 68vh;
    overflow-y: auto;
}

.quizz {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    height: 78vh;
}

.exam-questions {
    background-color: #f2f5ff;
    border: 2px solid #6280e4;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-top: 10px;
    height: 70vh;
    overflow-y: auto;
}

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


.form-check-input:checked+.form-check-label {
    background-color: #6280e4;
    color: #fff;
}

/* Custom styling for radio button labels */
.form-check-label {
    cursor: pointer;
    font-size: 1rem;
    color: #555;
    display: block;
    padding: 10px;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.correct-answer {
    background-color: #28a745;
    color: white;
    border-color: #28a745;
}

/* Red for incorrect answers */
.incorrect-answer {
    background-color: #dc3545;
    /* Red */
    color: white;
    border-color: #dc3545;
}

/* Style for checked but incorrect answers */
input[type="radio"]:checked+.form-check-label.incorrect-answer {
    background-color: #dc3545;
    color: white;
}

/* Style for selected (checked) correct answers */
input[type="radio"]:checked+.form-check-label.correct-answer {
    background-color: #28a745;
    color: white;
}


/* Disabled state for labels */
input[type="radio"]:disabled+.form-check-label {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Selected but incorrect (hover or not) */
input[type="radio"]:checked+.form-check-label.incorrect-answer:hover {
    background-color: #dc3545;
}

/* Styling the radio button input itself (hidden) */
.form-check-input {
    display: none;
}

.incorrect-answer {
    background-color: #dc3545;
    color: white;
    border-color: #dc3545;
}

.user-answer {
    background-color: #f0f0f0;
    border: 2px solid #0a38cf;
}

.status-legend {
    display: inline-block;
    width: 32px;
    height: 16px;
    border-radius: 15%;
}

.bg-light-red {
    background-color: #dc3545;
    opacity: 0.6;
}

.bg-white {
    border: 2px solid #6280e4;
    border-radius: 4px;
}

.bg-light-green {
    background-color: #28a745;
    opacity: 0.6;
}
</style>