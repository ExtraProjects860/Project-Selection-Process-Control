import axios from 'axios';
import { API_URL } from "../API_URL";

export const login = async (email, senha) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, senha });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Erro de rede');
  }
};
