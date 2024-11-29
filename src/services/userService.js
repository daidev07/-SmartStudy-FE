
import axios from 'axios';

const apiUrl = process.env.VUE_APP_API_URL;

export const userService = {
  fetchUserInfo
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
