<template>
    <div class="container w-75">
        <div v-if="!isSubmit" class="d-flex justify-content-between mb-2 border bg-white p-3 rounded-3">
            <h4 class="text-center fw-bold">{{ examDetail ? examDetail.name : 'Loading...' }}</h4>
            <button class="btn-submit text-white p-2 rounded-2" @click="submitExam"> <i
                    class="bi bi-check2-circle me-1"></i>
                Submit</button>
        </div>
        <div v-else class="d-flex justify-content-between mb-2 border bg-white p-3 rounded-3">
            <h4 class="text-center fw-bold">Result for {{ examDetail ? examDetail.name : 'Loading...' }}</h4>
            <div class="d-flex justify-content-between">
                <div class="me-3">
                    Result for exam
                </div>
                <div class="d-flex align-items-center">
                    <span class="status-legend bg-light-red me-1"></span><span class="me-3">Wrong answer</span>
                    <span class="status-legend bg-light-green me-1"></span><span class="me-3">Correct answer</span>
                    <span class="status-legend border-studentAnswer me-1"></span><span class="">Your answer</span>
                </div>
            </div>
            <h4 class="text-center fw-bold">
                Your point: <span class="text-danger">{{ assignmentInfo.point }}</span>
            </h4>
        </div>
        <div class="d-flex justify-content-around gap-2">
            <div class="mp3-pdf w-50 border rounded-3 p-2 bg-white">
                <div class="w-100 " v-if="examDetail?.listenFile?.fileUrl">
                    <audio controls class="w-100">
                        <source :src="examDetail.listenFile.fileUrl" type="audio/mpeg">
                    </audio>
                </div>
                <div v-else>The listen file is no longer available, please contact your teacher.</div>
                <div class="pdf-file" v-if="examDetail?.pdfFile?.fileUrl">
                    <iframe :src="examDetail.pdfFile.fileUrl" width="100%" height="98%" frameborder="0"></iframe>
                </div>
                <div v-else>The pdf file is no longer available, please contact your teacher.</div>
            </div>
            <div v-if="examDetail" class="quizz w-50 bg-white border rounded-3 p-3">
                <div class="row">
                    <div v-for="(question, index) in examDetail.questions" :key="question.id">
                        <div class="mb-3">
                            <div class="d-flex justify-content-between">
                                <p class="ques-content fw-bold mb-2">{{ index + 1 }}. {{ question.content }}</p>
                            </div>
                            <div class="">
                                <div v-for="(answer, answerIndex) in question.answers" :key="answer.id" class="mb-2">
                                    <div v-if="isSubmit" class="form-check">
                                        <input class="form-check-input" type="radio" :name="'question-' + question.id"
                                            :id="'answer-' + answer.id"
                                            :checked="isAnswerSelected(question.id, answer.id)" disabled />
                                        <label class="form-check-label" :for="'answer-' + answer.id" :class="{
                                            'correct-answer': isCorrectAnswer(question.id, answer.id),
                                            'incorrect-answer': isIncorrectUserAnswer(question.id, answer.id),
                                            'user-answer': isUserAnswerSelected(question.id, answer.id)
                                        }">
                                            <strong>{{ answerLetters[answerIndex] }}.</strong>
                                            {{ answer.content }}
                                        </label>
                                    </div>
                                    <div v-else class="form-check me-2">
                                        <input class="form-check-input" type="radio" :name="'question-' + question.id"
                                            :id="'answer-' + answer.id" />
                                        <label class="form-check-label" :for="'answer-' + answer.id">
                                            <strong>{{ answerLetters[answerIndex] }}.</strong>
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
        <div class="modal fade" id="unansweredModal" tabindex="-1" aria-labelledby="unansweredModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        There are unanswered questions. Are you sure you want to submit?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Continue
                            Exam</button>
                        <button type="button" class="btn btn-warning" @click="confirmSubmit">Submit
                            Anyway</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Loader overlay -->
        <div id="loader-overlay" class="position-fixed top-0 start-0 w-100 h-100 bg-white"
            :class="{ 'd-none': !isSpinnerLoading, 'd-flex justify-content-center align-items-center': isSpinnerLoading }">
            <div class="text-center">
                <div class="spinner-border text-info" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Submit successfully, results will be displayed after a few seconds</p>
            </div>
        </div>
    </div>
</template>

<script>
import { toast } from "vue3-toastify";
import { Modal } from 'bootstrap';
import { mapGetters } from 'vuex';
import {
    fetchAssignment,
    fetchAnswerResults,
    saveResults
} from '@/services/examService';

export default {
    name: 'DoingListeningTest',
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            stuAssignId: null,
            userId: null,
            assignmentInfo: {},
            examDetail: null,
            isCompleted: false,
            answerResults: [],
            userAnswers: {},
            isSubmit: false,
            isSpinnerLoading: false,
            answerLetters: ['A', 'B', 'C', 'D'],
        };
    },
    mounted() {
        this.stuAssignId = parseInt(this.$route.params.id, 10);
        console.log('STUDENT ASSIGNMENT ID:: ', this.stuAssignId);

        this.loadAssignmentData();
    },
    computed: {
        ...mapGetters(['getUserId']),
    },
    methods: {
        async submitResults() {
            try {
                toast.success('Submited successfully');
                this.isSpinnerLoading = true;
                const point = await saveResults(this.stuAssignId, this.examDetail.questions, this.getUserId);
                this.assignmentInfo.point = point;
                this.isSubmit = true;
                this.loadAnswerResults();
            } catch (error) {
                console.error('Error submitting results:', error);
            } finally {
                setTimeout(() => {
                    this.isSpinnerLoading = false;
                }, 3000);
            }
        },
        isUserAnswerSelected(questionId, answerId) {
            return this.userAnswers[questionId] === answerId;
        },
        isCorrectAnswer(questionId, answerId) {
            const question = this.examDetail.questions.find(q => q.id === questionId);
            if (!question) return false;
            const answer = question.answers.find(a => a.id === answerId);
            return answer && answer.isCorrect;
        },

        isIncorrectUserAnswer(questionId, answerId) {
            return this.isUserAnswerSelected(questionId, answerId) && !this.isCorrectAnswer(questionId, answerId);
        },

        isAnswerSelected(questionId, answerId) {
            if (!this.answerResults) return false;
            return this.answerResults.some(result => result.questionId === questionId && result.answerId === answerId);
        },
        async loadAssignmentData() {
            try {
                this.assignmentInfo = await fetchAssignment(this.stuAssignId);
                console.log('ASSIGNMENT INFO:: ', this.assignmentInfo);
                this.examDetail = this.assignmentInfo.exam;
                if (this.assignmentInfo.assignmentStatus === 'SUBMITTED' || this.assignmentInfo.assignmentStatus === 'LATE_SUBMISSION') {
                    this.isSubmit = true;
                    await this.loadAnswerResults();
                }
            } catch (error) {
                console.error('Error loading assignment data:', error);
            }
        },
        async loadAnswerResults() {
            try {
                const answerResults = await fetchAnswerResults(this.getUserId, this.stuAssignId);
                this.answerResults = answerResults;
                this.userAnswers = {};
                answerResults.forEach(result => {
                    this.userAnswers[result.questionId] = result.answerId;
                });
            } catch (error) {
                console.error('Error loading answer results:', error);
            }
        },
        async submitExam() {
            const unansweredQuestions = this.examDetail.questions.filter(question => {
                const selectedAnswer = document.querySelector(`input[name='question-${question.id}']:checked`);
                return !selectedAnswer;
            });

            if (unansweredQuestions.length > 0) {
                const modal = new Modal(document.getElementById('unansweredModal'));
                modal.show();
            } else {
                this.submitResults();
            }
        },
        confirmSubmit() {
            const modal = Modal.getInstance(document.getElementById('unansweredModal'));
            modal.hide();
            this.submitResults();
        },
    }
}
</script>

<style scoped>
.container {
    margin-top: 91px;
}

h4 {
    color: #6280e4;
    margin-bottom: 0;
}

.btn-submit {
    background-color: #6280e4;
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
    height: 80vh;
    overflow-y: auto;
}

.pdf-file {
    height: 71vh;
    overflow-y: auto;
}

.quizz {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    height: 80vh;
    overflow-y: auto;
}

.exam-questions {
    height: 73vh;
}

.ques-content {
    color: #6280e4;
}

.form-check {
    background-color: #ffffff;
    border-radius: 5px;
    padding: 2px;
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

.form-check-label {
    cursor: pointer;
    color: #555;
    display: block;
    padding: 7px;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.correct-answer {
    background-color: #28a745;
    color: white;
    border-color: #28a745;
}

.incorrect-answer {
    background-color: #dc3545;
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

.border-studentAnswer {
    border: 2px solid #6280e4;
    border-radius: 4px;
}

.bg-light-green {
    background-color: #28a745;
    opacity: 0.6;
}

#loader-overlay {
    background-color: white !important;
    z-index: 9999;
}
</style>