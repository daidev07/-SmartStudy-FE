import axios from 'axios';

const apiUrl = process.env.VUE_APP_API_URL;

export async function fetchAssignment(assignmentId) {
    try {
        const response = await axios.get(`${apiUrl}/student-assignment/${assignmentId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching assignment:', error);
        throw error;
    }
}

export async function fetchAnswerResults(userId, assignmentId) {
    try {
        const response = await axios.get(`${apiUrl}/answer-result/user/${userId}/assignment/${assignmentId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching answer results:', error);
        throw error;
    }
}

export async function fetchExam(examId) {
    try {
        const response = await axios.get(`${apiUrl}/exam/${examId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching exam:', error);
        throw error;
    }
}

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
