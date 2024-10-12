import './JobApplicationModal.css'; 
import { FaPaperclip } from 'react-icons/fa'; 

function JobApplicationModal({ jobDetails, isOpen, onClose }) {
  const [file, setFile] = useState(null);

  
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Função para simular o envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      console.log('Arquivo selecionado:', file);
    } else {
      console.log('Nenhum arquivo selecionado');
    }
    
  };

  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Inscrição vaga {jobDetails.title}</h2>
        <p>{jobDetails.description}</p>
        
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
            <button type="submit" className="modal-save-button">Salvar</button>
            <button type="button" className="modal-cancel-button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobApplicationModal;
