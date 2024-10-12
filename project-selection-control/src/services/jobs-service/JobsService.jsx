const API_URL = 'http://127.0.0.1:5000/api';
import axios from 'axios';

export const getAllJobs = async () => {
  try {
    const token = localStorage.getItem('token'); 
    

    const response = await axios.get(API_URL + '/pegar-todas-vagas', {
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
