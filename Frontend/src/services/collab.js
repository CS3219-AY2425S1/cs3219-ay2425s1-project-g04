import axios from 'axios';

const getCodeOutput = async (codeData) => {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", codeData);
    return response;
}

export default { getCodeOutput }