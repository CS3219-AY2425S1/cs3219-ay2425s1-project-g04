import axios from 'axios';

const baseUrl = 'http://localhost:3002';
const auth = "auth"
const user = "users"

const createUser = async (newUser) => {
    const response = await axios.post(`${baseUrl}/${user}`, newUser);
    return response;
};

const getUser = async (id) => {
    const response = await axios.get(`${baseUrl}/${user}/${id}`);
    return response;
};

const loginUser = async (userCredentials) => {
    const response = await axios.post(`${baseUrl}/${auth}/login`, userCredentials);
    return response;
}

export default { createUser, getUser, loginUser };
