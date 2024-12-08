<template>
    <div class="container w-75">
        <div v-if="!isSubmit" class="d-flex justify-content-between mb-3">
            <h4 class="text-center fw-bold">{{ examDetail ? examDetail.name : 'Loading...' }}</h4>
            <button class="btn-submit p-2 rounded-2" @click="submitExam"> <i class="bi bi-check2-circle me-1"></i>
                Submit</button>
        </div>
        <div v-else class="d-flex justify-content-between mb-3">
            <h4 class="text-center fw-bold">Result for {{ examDetail ? examDetail.name : 'Loading...' }}</h4>
            <h4 class="text-center  fw-bold">
                Your point: <span class="text-danger">{{ assignmentInfo?.point }}</span>
            </h4>
        </div>
        <div v-if="isSubmit" class=" d-flex align-items-center  justify-content-center">
            <span class="status-legend bg-light-red me-2"></span><span class="me-4">Wrong answer</span>
            <span class="status-legend bg-light-green me-2"></span><span class="me-4">Correct answer</span>
            <span class="status-legend bg-white me-2"></span><span class="me-4">Your answer</span>
        </div>
        <div v-if="examDetail" class="exam-questions">
            <div class="row">
                <div v-for="(question, index) in examDetail.questions" :key="question.id" class="col-6">
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="ques-content fw-bold">{{ index + 1 }}. {{ question.content }}</p>
                            <h5 class="btn-askAI me-4" v-if="isSubmit" title="Ask AI" @click="askAI(question)"><i
                                    class="bi bi-patch-question"></i></h5>
                        </div>
                        <div class="d-flex flex-wrap justify-content-center">
                            <div v-for="answer in question.answers" :key="answer.id" class="col-5 mb-2">
                                <div v-if="isSubmit" class="form-check text-center me-2">
                                    <input class="form-check-input" type="radio" :name="'question-' + question.id"
                                        :id="'answer-' + answer.id" :checked="isAnswerSelected(question.id, answer.id)"
                                        disabled />
                                    <label class="form-check-label" :for="'answer-' + answer.id" :class="{
                                        'correct-answer': isCorrectAnswer(question.id, answer.id),
                                        'incorrect-answer': isIncorrectUserAnswer(question.id, answer.id),
                                        'user-answer': isUserAnswerSelected(question.id, answer.id)
                                    }">
                                        {{ answer.content }}
                                    </label>
                                </div>
                                <div v-else class="form-check text-center me-2">
                                    <input class="form-check-input" type="radio" :name="'question-' + question.id"
                                        :id="'answer-' + answer.id" />
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
    </div>
</template>

<script>
import axios from 'axios';
import { toast } from "vue3-toastify";
import { Modal } from 'bootstrap';
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
    name: 'DoingGrammarTest',
    data() {
        return {
            apiUrl: process.env.VUE_APP_API_URL,
            assignmentInfo: null,
            userId: null,
            examDetail: null,
            isCompleted: false,
            answerResults: [],
            userAnswers: {},
            isSubmit: false
        };
    },
    computed: {
        ...mapGetters(['getUserId']),
        ...mapState(['isChatbotOpen', 'isLoading']),
        assignmentId() {
            return parseInt(this.$route.params.id, 10);
        }
    },
    mounted() {
        this.fetchAssignment();
    },
    methods: {
        ...mapActions(['stopLoading', 'openChatbotWithLoader', 'setAskAIKey']),
        async askAI(question) {
            try {
                this.openChatbotWithLoader();
                const questionContent = question.content;
                const answerLabels = ["a", "b", "c", "d"];
                const answers = question.answers.map((answer, index) => {
                    return `${answerLabels[index]}. ${answer.content}`;
                });

                const combinedString = `${questionContent} ${answers.join(' ')}`;
                const analysisString = "Phân tích câu sau: ";
                const finalString = `${analysisString} ${combinedString}`

                const response = await axios.post(this.apiUrl + '/chat/ask-ai', {
                    userId: this.getUserId,
                    question: finalString
                });
                console.log('AI Response:', response.data);
                this.setAskAIKey()
                this.stopLoading();

            } catch (error) {
                console.error('Error asking AI:', error);
            }
        },
        async fetchAssignment() {
            try {
                const response = await axios.get(this.apiUrl + `/student-assignment/${this.assignmentId}`);
                this.assignmentInfo = response.data.data;
                console.log('ASSIGNMENT INFO:: ', this.assignmentInfo);

                if (this.assignmentInfo.assignmentStatus === 'SUBMITTED' || this.assignmentInfo.assignmentStatus === 'LATE_SUBMISSION') {
                    this.isSubmit = true;
                    await this.fetchAnswerResults();
                }
                this.fetchExam(this.assignmentInfo.exam.id);
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
        async fetchExam(examId) {
            try {
                const response = await axios.get(this.apiUrl + `/exam/${examId}`);
                this.examDetail = response.data.data;
            } catch (error) {
                console.error(error);
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
                this.saveResults();
            }
        },
        confirmSubmit() {
            const modal = Modal.getInstance(document.getElementById('unansweredModal'));
            modal.hide();
            this.saveResults();
        },
        async saveResults() {
            try {
                let correctAnswers = 0;

                const results = this.examDetail.questions.map(question => {
                    const selectedAnswer = document.querySelector(`input[name='question-${question.id}']:checked`);
                    const answerId = selectedAnswer ? parseInt(selectedAnswer.id.replace('answer-', '')) : null;

                    const selectedAnswerObject = question.answers.find(answer => answer.id === answerId);
                    if (selectedAnswerObject && selectedAnswerObject.isCorrect) {
                        correctAnswers += 1;
                    }

                    return {
                        studentAssignmentId: this.assignmentId,
                        questionId: question.id,
                        answerId: answerId ? answerId : null,
                        userId: this.getUserId
                    };
                });

                const totalQuestions = this.examDetail.questions.length;
                const point = parseInt((correctAnswers * 100 / totalQuestions));

                await axios.post(this.apiUrl + '/answer-result', results, { params: { point: point } });
                console.log(results);

                this.isSubmit = true;
                toast.success('Submit successfully!');
                this.fetchAnswerResults();
            } catch (error) {
                console.error('Error saving results:', error);
            }
        },
    },
};
</script>

<style scoped>
.container {
    background-color: #ffffff;
    border: 2px solid #6280e4;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
    margin-top: 95px;
    height: 88vh;
}

.container:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Header title styling */
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

.exam-questions {
    background-color: #f2f5ff;
    border: 2px solid #6280e4;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-top: 15px;
    height: 74vh;
    overflow-y: auto;
}

.ques-content {
    color: #6280e4;
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
    background-color: #0d6efd;
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

.btn-askAI:hover {
    transform: scale(1.1);
}

.btn-askAI {
    padding: 0.5em;
    outline: none;
    color: rgb(255, 255, 255);
    background: #6280e4;
    cursor: pointer;
    position: relative;
    z-index: 0;
    border-radius: 10px;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    transition: transform 0.3s, color 0.3s ease;
}

.btn-askAI:before {
    content: "";
    background: linear-gradient(90deg,
            #526fd6,
            #6280e4,
            #8298f4,
            #9fb8ff,
            #6280e4,
            #526fd6);
    position: absolute;
    top: -2px;
    left: -2px;
    background-size: 400%;
    z-index: -1;
    filter: blur(5px);
    -webkit-filter: blur(5px);
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    animation: glowing-btn-askAI 20s linear infinite;
    transition: opacity 0.3s ease-in-out;
}

@keyframes glowing-btn-askAI {
    0% {
        background-position: 0 0;
    }

    50% {
        background-position: 400% 0;
    }

    100% {
        background-position: 0 0;
    }
}

.btn-askAI:after {
    z-index: -1;
    content: "";
    position: absolute;
    width: 100%;
    /* height: 100%; */
    background: #6280e4;
    left: 0;
    top: 0;
    border-radius: 10px;
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