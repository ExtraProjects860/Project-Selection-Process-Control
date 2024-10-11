import React, { useState } from 'react';

function JobExclusionModal({ jobDetails, isOpen, onClose }) {
  const [isCancelled, setIsCancelled] = useState(false);

  const confirmExclusion = () => {
    const idJob = jobDetails.id;
    console.log("Job excluido: ", idJob);
    // Simula o cancelamento e exibe a mensagem de confirmação
    setIsCancelled(true);
  };

  const closeAll = () => {
    setIsCancelled(false); // Reseta o estado ao fechar
    onClose(); // Fecha o modal
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {isCancelled ? (
          <>
            <p>Vaga cancelada com sucesso!</p>
            <div className="confirmation-buttons">
              <button type="button" className="modal-save-button" onClick={closeAll}>Ok</button>
            </div>
          </>
        ) : (
          <>
            <p>Deseja realmente cancelar a vaga?</p>
            <div className="modal-buttons">
              <button type="button" className="modal-save-button" onClick={confirmExclusion}>Sim</button>
              <button type="button" className="modal-cancel-button" onClick={onClose}>Não</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default JobExclusionModal;
