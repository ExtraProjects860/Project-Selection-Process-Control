import { useState } from 'react';
import './JobApplicationModal.css'; 
import { FaPaperclip } from 'react-icons/fa'; 
import { saveResumeApplication } from '../../services/jobs-service/JobsService';

function JobApplicationModal({ jobDetails, isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para a modal secundária
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

    setLoading(true); // Inicia o carregamento

    try {
      const response = await saveResumeApplication(userId, jobDetails.id_vaga, file, userName);
      setUploadStatus('Inscrição salva com sucesso e currículo enviado');
      setShowSuccessModal(true); // Exibe a modal de sucesso
      console.log('Upload bem-sucedido:', response);
    } catch (error) {
      setUploadStatus('Erro ao salvar inscrição ou enviar o currículo');
      console.error('Erro ao enviar o arquivo:', error);
    } finally {
      setLoading(false); // Termina o carregamento
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false); // Fecha a modal secundária
    onClose(); // Fecha a modal principal
  };

  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Inscrição vaga {jobDetails.nome_vaga}</h2>
        <p className='txt-description'>{jobDetails.descricao_vaga}</p>
        <p className='txt-description'>Status: {jobDetails.status}</p>
        <p className='txt-description'>Salário: {jobDetails.salario}</p>
        
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
              {loading ? 'Enviando...' : 'Salvar'} {/* Botão exibe "Enviando..." durante o loading */}
            </button>
            <button type="button" className="modal-cancel-button" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
          </div>
        </form>

        {uploadStatus && <p>{uploadStatus}</p>} {/* Exibe o status do upload */}

        {/* Modal de sucesso */}
        {showSuccessModal && (
          <div className="success-modal-overlay">
            <div className="success-modal-content">
              <h3>Sucesso!</h3>
              <p>{uploadStatus}</p>
              <button onClick={handleCloseModal} className="modal-close-button">Fechar</button>
            </div>
          </div>
        )}

        {/* Spinner de carregamento */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div> {/* Aqui é onde o spinner aparece */}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobApplicationModal;
