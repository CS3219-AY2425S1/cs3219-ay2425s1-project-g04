import axios from 'axios'

const baseUrl = 'http://34.120.84.41/api/questions'

const getAll = () => {
    const request = axios.get(baseUrl);
    return request
}

const get = id => {
    const request = axios.get(`${baseUrl}/${id}`);
    return request//.then(response => response.data);
}

export const getQuestionsByCategory = async (category) => {
    const response = await axios.get(`${baseUrl}/by-category?category=${category}`);
    return response.data;
};


const createQuestion = async newQuestion => {
    const response = await axios.post(baseUrl, newQuestion);
    return response//.data;
}

const updateQuestion = (id, newQuestion) => {
    const request = axios.put(`${baseUrl}/${id}`, newQuestion);
    return request//.then(response => response.data);
}

const deleteQuestion = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`);
    return request.then(response => response.data);
}

export default { getAll, get, createQuestion, updateQuestion, deleteQuestion, getQuestionsByCategory }