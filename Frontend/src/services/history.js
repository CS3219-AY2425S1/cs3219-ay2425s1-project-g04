import axios from 'axios';

const baseUrl = 'http://34.120.84.41/api/histories';

// Fetch all attempt history for a user by their object ID
const getHistoryByUserId = (userId) => {
    return axios.get(`${baseUrl}/user/${userId}`);
};

// Sample function to add a new history attempt (optional)
const createHistoryAttempt = async (newAttempt) => {
    const response = await axios.post(baseUrl, newAttempt, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}` },
    });
    return response.data;
};

export default { getHistoryByUserId, createHistoryAttempt };
