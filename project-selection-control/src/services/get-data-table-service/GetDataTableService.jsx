import axios from "axios";


const API_URL = 'http://127.0.0.1:5000/api/';



// Função para buscar usuários
export const getUsers = async (page = 1, token) => {
  // Obtenha o token de alguma fonte, como localStorage, contexto global, etc.
  try {
    const response = await axios.get(`${API_URL}pegar-todos-usuarios/${page}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Insira o token aqui
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw error;
  }
};

export const updateAdminStatus = async (id, admin, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/atualizar-para-usuario-ou-admin/${id}/${admin}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Erro ao atualizar status de admin:', error);
    throw error; 
  }
};


export const getProcessStatusCandidates = async (page = 1, token) => {
  try {
    const response = await axios.get(`${API_URL}pegar-todos-status-processo-seletivo/${page}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Insira o token aqui
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar candidatos:", error);
    throw error;
  }
};


export const getSteps = async (token) => {
  try {
    const response = await axios.get(`${API_URL}pegar-etapas`, {
      headers: {
        Authorization: `Bearer ${token}`, // Insira o token aqui
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar candidatos:", error);
    throw error;
  }
};

export const updateStatusProcessCandidate = async (id, updatedData, token) => {
  try {
    await axios.put(`${API_URL}atualizar-status-processo-seletivo/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`, // Insira o token aqui
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Erro ao atualizar o status do candidato:", error);
    throw error;
  }
};

export const downloadResume = async (id_usuario, token) => {
  try {
    const response = await axios.get(`${API_URL}pegar-curriculo/${id_usuario}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob', // Necessário para baixar arquivos
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `curriculo_${id_usuario}.pdf`); // Define o nome do arquivo
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Erro ao baixar o currículo:', error);
    throw error;
  }
};

// Função para excluir o currículo
export const deleteResume = async (id_usuario, token) => {
  try {
    const response = await axios.delete(`${API_URL}excluir-curriculo/${id_usuario}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retorna a resposta da API se necessário
  } catch (error) {
    console.error('Erro ao excluir o currículo:', error);
    throw error;
  }
};