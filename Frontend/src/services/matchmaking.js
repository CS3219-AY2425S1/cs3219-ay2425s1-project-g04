import axios from 'axios';

const baseUrl = 'http://localhost:3003';

const enterMatchmaking = async (user) => {
    return await axios.post(`${baseUrl}/api/match/enterMatchmaking`, user);
}