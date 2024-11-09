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

const handleTooManyRequestsError = (error) => {
  if (error.response && error.response.status === 429) {
    console.error('Muitas requisições. Tente novamente mais tarde.');
    return { tooManyRequests: true };
  }
  throw error;
};

export const getAllJobs = async (pagina) => {
  try {
    const token = localStorage.getItem('token'); 
    
    const response = await axios.get(`${API_URL}/pegar-todas-vagas/${pagina}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data; 
  } catch (error) {
    if (error.response) {
       if (error.response.status === 500) {
        throw new Error('Erro interno do servidor');
      } else if (error.response.status === 429) {
        return handleTooManyRequestsError(error);
      } else {
        return handleTokenExpiredError(error);
      }
    } else {
      return handleTokenExpiredError(error);
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


export const saveResumeApplication = async (userId, jobId, file, userName) => {
  const formData = new FormData();
  formData.append('curriculo', file);
  formData.append('nome_usuario', userName);
  const token = localStorage.getItem('token'); 
  try {
  const response = await axios.post(API_URL + `/salvar-inscricao-curriculo/${userId}/${jobId}`, formData, {
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


export const saveStatusProcessoSeletivo = async (vaga, userId) => {
  const token = localStorage.getItem('token');
  const data = {
    vaga,
    etapa: "FORMS INICIAL",
    status_processo: "EM ANDAMENTO",
    forms_respondido: false,
  };
  try {
  const response = await axios.post(API_URL + `/salvar-status-processo-seletivo/${userId}`, data,
   { headers: {
      Authorization: `Bearer ${token}`,
    },}
  );
  return response;
} catch(error) {
  return handleTokenExpiredError(error);
}
};


  export const showUserRegistrations = async (idUsuario,pagina) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(API_URL +`/mostrar-inscricoes-usuario/${idUsuario}/${pagina}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if(error.response){
        if (error.response.status === 429) {
          return handleTooManyRequestsError(error);
        } else {
          throw error;
        }
  
      } else {
        console.error('Erro ao buscar inscrições', error);
        return handleTokenExpiredError(error);
      }
    }
  };

  export const markFormAsResponded = async (idStatusProcessoSeletivo) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/forms-respondido/${idStatusProcessoSeletivo}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar formulário como respondido:', error);
      throw error;
    }
  };