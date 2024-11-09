import axios from 'axios';
import { API_URL } from "../API_URL";

const handleTokenExpiredError = (error) => {
  if (error.response && error.response.status === 401) {
    return { tokenExpired: true };
  }
  if (!error.response) {
    return { tokenExpired: true };
  }
  throw error;
};


export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/requisitar-troca-senha`, {
      email, 
    }, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });

    return response.data; 

  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error('Solicitação inválida');
      } else if (error.response.status === 500) {
        throw new Error('Erro interno do servidor');
      }
    } else {
      throw new Error('Erro ao se conectar ao servidor');
    }
  }
};

export const resetPassword = async (email, nova_senha, token) => {
  try {
    const response = await axios.post(API_URL + '/redefinir-senha', {
      email,
      nova_senha,
      token,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error('Solicitação inválida');
      } else if (error.response.status === 500) {
        throw new Error('Erro interno do servidor');
      }
    } else {
      throw new Error('Erro ao se conectar ao servidor');
    }
  }
};



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
      return handleTokenExpiredError(error); 
    }
  },

  userLogout: async (token) => {
    try {
      const response = await axios.post(API_URL + '/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 500) {
        throw new Error('Erro interno do servidor');
      } else {
        return handleTokenExpiredError(error);
      }
    }
  }
};

export const updateUserData = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/atualizar-dados/${userId}`, userData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data; 
  } catch (error) {
    return handleTokenExpiredError(error); 
    
  }
};

export const saveResume = async (userId, file, userName) => {
  const formData = new FormData();
  formData.append('curriculo', file);
  formData.append('nome_usuario', userName);
  const token = localStorage.getItem('token'); 
  try {
  const response = await axios.post(API_URL + `/salvar-inscricao-curriculo/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}` 
    },
  });

  return response;
}  catch(error) {
  return handleTokenExpiredError(error);
}
};

export default UserService;
