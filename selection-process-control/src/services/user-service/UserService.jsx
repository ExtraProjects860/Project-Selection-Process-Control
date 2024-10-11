import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

const UserService = {
  registerUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/criar-usuario`, userData);
      return response.data;  
    } catch (error) {
      throw error.response?.data || 'Erro ao registrar usuário';
    }
  },

  pegarDadosUsuario: async (token) => {
    try {
      const response = await axios.get(API_URL + '/pegar-dados-usuario', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return response.data;
    } catch (error) {
      throw error; 
    }
  },
};

export default UserService;
