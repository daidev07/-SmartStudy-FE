
import axios from 'axios';
const apiUrl = process.env.VUE_APP_API_URL;

export const fetchDataService = {
  fetchUserInfo,
  fetchStudentAssignmentInfo,
};

async function fetchUserInfo(userId) {
  try {
    const response = await axios.get(`${apiUrl}/user/${userId}`); 
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch user info:", error);
    throw error;  
  }
}
async function fetchStudentAssignmentInfo(stuAssignId) {
  try {
    const response = await axios.get(`${apiUrl}/student-assignment/${stuAssignId}`); 
    return response.data; 
  } catch (error) {
    console.error("Failed to fetch exam info:", error);
    throw error;  
  }
}
