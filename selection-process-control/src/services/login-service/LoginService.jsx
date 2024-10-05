import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api'; // URL da sua API

export const login = async (email, senha) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, senha });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro de rede');
  }
};
