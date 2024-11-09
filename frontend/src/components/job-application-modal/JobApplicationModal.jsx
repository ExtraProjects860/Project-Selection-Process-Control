/* eslint-disable react/prop-types */
import { useState } from 'react';
import './JobApplicationModal.css'; 
import { FaPaperclip } from 'react-icons/fa'; 
import { saveResumeApplication, saveStatusProcessoSeletivo } from '../../services/jobs-service/JobsService';
import ModalTokenExpired from '../modal-token-expired/ModalTokenExpired';

function JobApplicationModal({ jobDetails, isOpen, onClose }) { 
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isTokenExpired, setIsTokenExpired] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const data = localStorage.getItem("userData");
  const userData = JSON.parse(data);
  const userId = userData.dados.id;
  const userName = userData.dados.nome;

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setUploadStatus('Nenhum arquivo selecionado');
      return;
    }

    setLoading(true); 

    try {
      const response = await saveResumeApplication(userId, jobDetails.id_vaga, file, userName);
      if (response.tokenExpired) {
        setIsTokenExpired(true);
        onClose();
      } 
      await saveStatusProcessoSeletivo(jobDetails.nome_vaga, userId);
      setUploadStatus('Inscrição salva com sucesso e currículo enviado');
      setShowSuccessModal(true); 

    } catch (error) {
      setUploadStatus('Erro você já está inscrito na vaga ou não foi posível salvar a inscrição');
      console.error('Erro ao enviar o arquivo:', error);
    } finally {
      setLoading(false); 
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false); 
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      {isTokenExpired && (
       <ModalTokenExpired
          title="Sessão Expirada"
          message="Seu token de autenticação expirou. Faça login novamente."
          onConfirm={() => {
            localStorage.clear();
            setIsTokenExpired(false); 
            window.location.href = '/'; 
          }}
        />
      )}
      <div className="modal-content">
        <h2>Inscrição vaga {jobDetails.nome_vaga}</h2>
        <p 
          className='txt-description'
          style={{
            fontWeight: 'bold',
          }}
        >
          Descrição:
        </p>
        <p className='txt-description textDescription'>{jobDetails.descricao_vaga}</p>
        <p 
          className='txt-description'
          style={{
            fontWeight: 'bold',
          }}
        >Salário: R${jobDetails.salario}</p>
        <p 
          className='txt-description'
          style={{
            color: jobDetails.status === 'ABERTA' ? 'green' : 'red',
          }}
        >
          Status: {jobDetails.status}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="file-input-container">
            <input
              type="file"
              id="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="file" className="file-label">
              {file ? file.name : 'Currículo'}
            </label>
            <span className="file-icon">
              <FaPaperclip />
            </span>
          </div>
          <small className="modal-note">*Só serão aceitos arquivos no formato PDF</small>
          <div className="modal-buttons">
            <button type="submit" className="modal-save-button" disabled={loading}>
              {loading ? 'Enviando...' : 'Salvar'}
            </button>
            <button type="button" className="modal-cancel-button" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>

        {uploadStatus && <p>{uploadStatus}</p>}

        {showSuccessModal && (
          <div className="success-modal-overlay">
            <div className="success-modal-content">
              <h3>Sucesso!</h3>
              <p>{uploadStatus}</p>
              <button onClick={handleCloseModal} className="modal-close-button">Fechar</button>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobApplicationModal;
