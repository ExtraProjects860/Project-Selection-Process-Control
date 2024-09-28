import React, { useState } from 'react';
import './JobEditionModal.css'

function JobEditionModal({ jobDetails, isOpen, onClose }) {
  const [title, setTitle] = useState(jobDetails.title);
  const [description, setDescription] = useState(jobDetails.description);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  

  const handleSave = () => {
    setShowConfirmation(true); // Mostra a caixinha de confirmação
  };

  const confirmSave = () => {
    const jobId = jobDetails.id;
    console.log("Job modificado: ", jobId);
    setIsConfirmed(true);
  };

  const closeAll = () => {
    setShowConfirmation(false); // Oculta a caixinha de confirmação
    onClose(); // Fecha o modal
    setIsConfirmed(false);
  };


  if (!isOpen) return null; 

  return (
    <div className="modal-overlay">
  <div className="modal-content">
    <input
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder={title}
    />
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder={description}
    />
    
    <div className="modal-buttons">
      <button onClick={handleSave} type="submit" className="modal-save-button" >Salvar</button>
      <button type="button" className="modal-cancel-button" onClick={onClose}>Cancelar</button>
    </div>
  </div>

  {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-box">
            {!isConfirmed ? (
              <>
                <p>Você realmente deseja salvar?</p>
                <div className="confirmation-buttons">
                  <button type="button" className="modal-save-button" onClick={confirmSave}>Confirmar</button>
                  <button type="button" className="modal-cancel-button" onClick={() => setShowConfirmation(false)}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <p>Informações salvas com sucesso!</p>
                <div className="confirmation-buttons">
                  <button type="button" className="modal-save-button" onClick={closeAll}>Ok</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


export default JobEditionModal;
