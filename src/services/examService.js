import axios from 'axios';

const apiUrl = process.env.VUE_APP_API_URL;

/**
 * Lấy thông tin bài kiểm tra.
 * @param {number} assignmentId - ID của bài kiểm tra.
 * @returns {Promise<Object>} - Dữ liệu bài kiểm tra.
 */
export async function fetchAssignment(assignmentId) {
    try {
        const response = await axios.get(`${apiUrl}/student-assignment/${assignmentId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching assignment:', error);
        throw error;
    }
}

/**
 * Lấy kết quả câu trả lời của người dùng.
 * @param {number} userId - ID người dùng.
 * @param {number} assignmentId - ID bài kiểm tra.
 * @returns {Promise<Object[]>} - Danh sách kết quả câu trả lời.
 */
export async function fetchAnswerResults(userId, assignmentId) {
    try {
        const response = await axios.get(`${apiUrl}/answer-result/user/${userId}/assignment/${assignmentId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching answer results:', error);
        throw error;
    }
}

/**
 * Lấy thông tin chi tiết bài kiểm tra.
 * @param {number} examId - ID bài kiểm tra.
 * @returns {Promise<Object>} - Thông tin chi tiết bài kiểm tra.
 */
export async function fetchExam(examId) {
    try {
        const response = await axios.get(`${apiUrl}/exam/${examId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching exam:', error);
        throw error;
    }
}

/**
 * Lưu kết quả làm bài kiểm tra của người dùng.
 * @param {number} assignmentId - ID của bài kiểm tra.
 * @param {Array} questions - Danh sách câu hỏi.
 * @param {number} userId - ID của người dùng.
 * @returns {Promise<void>}
 */
export async function saveResults(assignmentId, questions, userId) {
    try {
        let correctAnswers = 0;

        const results = questions.map(question => {
            const selectedAnswer = document.querySelector(`input[name='question-${question.id}']:checked`);
            const answerId = selectedAnswer ? parseInt(selectedAnswer.id.replace('answer-', '')) : null;

            const selectedAnswerObject = question.answers.find(answer => answer.id === answerId);
            if (selectedAnswerObject && selectedAnswerObject.isCorrect) {
                correctAnswers += 1;
            }

            return {
                studentAssignmentId: assignmentId,
                questionId: question.id,
                answerId: answerId ? answerId : null,
                userId: userId
            };
        });

        const totalQuestions = questions.length;
        const point = parseInt((correctAnswers * 100) / totalQuestions);

        await axios.post(`${apiUrl}/answer-result`, results, { params: { point: point } });
        return point;
    } catch (error) {
        console.error('Error saving results:', error);
        throw error;
    }
}
