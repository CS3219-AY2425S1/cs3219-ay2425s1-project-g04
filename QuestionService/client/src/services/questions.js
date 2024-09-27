import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/questions'

const getAll = () => {
    const request = axios.get(baseUrl);
    return request
}

const get = id => {
    const request = axios.get(`${baseUrl}/${id}`);
    return request//.then(response => response.data);
}

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

export default { getAll, get, createQuestion, updateQuestion, deleteQuestion }