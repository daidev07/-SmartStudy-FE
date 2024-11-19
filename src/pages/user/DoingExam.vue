<template>
    <div class="container mt-3 w-50">
        <div class="d-flex justify-content-between mb-3">
            <h2 class="text-center fw-bold">{{ examDetail ? examDetail.name : 'Loading...' }}</h2>
            <button class="btn btn-submit" @click="submitExam" v-if="!isSubmit">Submit</button>
            <h2 class="text-center  fw-bold" v-else>Point: <span class="text-danger">{{ assignmentInfo.point }}</span>
            </h2>
        </div>

        <div v-if="examDetail" class="exam-questions">
            <div v-for="(question, index) in examDetail.questions" :key="question.id" class="mb-3">
                <div class="d-flex justify-content-between">
                    <h5 class="mb-2">{{ index + 1 }}. {{ question.content }}</h5>
                    <h5 class="bi bi-patch-question-fill" v-if="isSubmit" title="Ask AI" @click="askAI(question)"></h5>
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

        <div class="modal fade" id="unansweredModal" tabindex="-1" aria-labelledby="unansweredModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-body">
                        There are unanswered questions. Are you sure you want to submit?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Continue Exam</button>
                        <button type="button" class="btn btn-warning" @click="confirmSubmit">Submit Anyway</button>
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
import { mapGetters } from 'vuex';

export default {
    name: 'DoingExamComponent',
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
        ...mapGetters(['getUserId', 'getSelectedAssignment']),

        assignmentId() {
            return parseInt(this.$route.params.id, 10);
        }
    },
    mounted() {
        this.fetchAssignment();
    },
    methods: {
        async askAI(question) {
            try {
                const questionContent = question.content;
                const answerLabels = ["a", "b", "c", "d"];
                const answers = question.answers.map((answer, index) => {
                    return `${answerLabels[index]}. ${answer.content}`;
                });

                const combinedString = `${questionContent} ${answers.join(' ')}`;
                const analysisString = "Phân tích ngữ pháp, từ vựng, và tại sao đáp án đó đúng cho câu: ";

                const finalString = `${analysisString} ${combinedString}`

                const response = await axios.post(this.apiUrl + '/api/chat/ask-ai', {
                    question: finalString
                });
                console.log('AI Response:', response.data);
            } catch (error) {
                console.error('Error asking AI:', error);
            }
        },
        async fetchAssignment() {
            try {
                const response = await axios.get(this.apiUrl + `/api/student-assignment/${this.assignmentId}`);
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
                    this.apiUrl + `/api/answer-result/user/${this.getUserId}/assignment/${this.assignmentId}`
                );
                const answerResults = response.data.data;
                this.answerResults = answerResults;
                this.userAnswers = {};  // Make sure to reset user answers
                answerResults.forEach(result => {
                    this.userAnswers[result.questionId] = result.answerId;  // Store the user's selected answers
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

        // Check if the user’s selected answer is incorrect
        isIncorrectUserAnswer(questionId, answerId) {
            return this.isUserAnswerSelected(questionId, answerId) && !this.isCorrectAnswer(questionId, answerId);
        },

        isAnswerSelected(questionId, answerId) {
            if (!this.answerResults) return false;
            return this.answerResults.some(result => result.questionId === questionId && result.answerId === answerId);
        },
        async fetchExam(examId) {
            try {
                const response = await axios.get(this.apiUrl + `/api/exam/${examId}`);
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

                await axios.post(this.apiUrl + '/api/answer-result', results, { params: { point: point } });
                console.log('ANSWER RESULTS:: ', results);
                toast.success('Submit successfully!');
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
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
    padding-top: 95px;
    height: 95vh;
}

.container:hover {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Header title styling */
h2 {
    color: #617440;
    font-size: 1.8rem;
    margin-bottom: 0;
}

/* Styling for the exam questions */
.exam-questions {
    background-color: #CFE1B9;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-top: 15px;
    max-height: 75vh;
    overflow-y: auto;
}

/* Question and answer spacing */
h5 {
    font-weight: 600;
    color: #617440;
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

.form-check-label {
    cursor: pointer;
    font-size: 1rem;
    color: #555;
    display: block;
    padding: 5px;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
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

/* Green for correct answers */
.correct-answer {
    background-color: #28a745;
    /* Green */
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
    /* Red */
    color: white;
    border-color: #dc3545;
}

.user-answer {
    background-color: #f0f0f0;
    border: 2px solid #0d6efd;
}

.bi-patch-question-fill {
    cursor: pointer;
    color: #728156;
    transition: transform 0.3s, color 0.3s ease;
}

.bi-patch-question-fill:hover {
    transform: scale(1.4);
}

.btn-submit {
    background-color: #728156;
}
</style>