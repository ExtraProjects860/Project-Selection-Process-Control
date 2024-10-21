const API_URL = 'http://127.0.0.1:5000/api';
import axios from 'axios';

export const getAllJobs = async (page) => {
  try {
    const token = localStorage.getItem('token'); 
    
    console.log(token)
    const response = await axios.get(`${API_URL}/pegar-todas-vagas/${page}`, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });

    return response.data; 
  } catch (error) {
    if (error.response && error.response.status === 500) {
      throw new Error('Erro interno do servidor');
    } else {
      throw new Error('Erro ao buscar vagas');
    }
  }
};

export const createJob = async (jobData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.post(`${API_URL}/criar-vaga`, jobData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error('Erro de validação dos dados enviados.');
    } else if (error.response && error.response.status === 500) {
      throw new Error('Erro interno do servidor.');
    } else {
      throw new Error('Erro ao criar a vaga.');
    }
  }
};

export const getSetoresECargos = async () => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.get(`${API_URL}/pegar-setores-cargos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response recebida:", response.data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 500) {
      throw new Error('Erro interno do servidor');
    } else {
      console.error("Erro ao buscar setores e cargos:", error);
      throw new Error('Erro ao buscar setores e cargos');
    }
  }
};

export const updateJobs = async (jobId, updateData) => {
  try {
    const token = localStorage.getItem('token');

    const response = await axios.put(`${API_URL}/atualizar-vaga/${jobId}`, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 500) {
      if (error.response.data.error.includes("Duplicate entry")) {
        throw new Error('Já existe uma vaga com esse nome.');
      }
      throw new Error('Erro interno do servidor');
    } else {
      throw new Error('Erro ao atualizar a vaga');
    }
  }
};

export const saveResumeApplication = async (userId, jobId, file, nomeUsuario) => {
    const token = localStorage.getItem('token'); 
  
    const formData = new FormData();
    formData.append('curriculo', file);
    formData.append('nome_usuario', nomeUsuario); 
  
    try {
      const response = await axios.post(API_URL + `/salvar-inscricao-curriculo/${userId}/${jobId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`  
        }
      });
  
      return response.data;
    } catch (error) {
      throw new Error('Erro ao salvar inscrição ou enviar o currículo');
    }
  };
