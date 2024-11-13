import axios from 'axios';

const baseCategoryUrl = 'http://34.120.84.41/api/categories';

export const getAllCategories = async () => {
    console.log("getAllCategories func called")
    const response = await axios.get(baseCategoryUrl);
    console.log(`${JSON.stringify(response.data)}`)
    return response.data;
    
};

const createCategories = async (newCategories) => {
    const response = await axios.post(baseCategoryUrl, newCategories);
    return response.data;
};


const deleteCategory = async (categoryName) => {
    const response = await axios.delete(`${baseCategoryUrl}/${categoryName}`);
    return response.data;
};


export default { getAllCategories, createCategories, deleteCategory };
