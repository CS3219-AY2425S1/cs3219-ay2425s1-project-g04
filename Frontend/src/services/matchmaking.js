import axios from 'axios';

const baseUrl = 'http://localhost:3003/api/matchmaking'; // Your backend endpoint

const matchUser = async (userId, difficulty, language) => {
    const response = await axios.post(baseUrl, { userId, difficulty, language });
    return response.data;
};

export default { matchUser };
