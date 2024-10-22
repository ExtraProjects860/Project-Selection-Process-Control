import React, { useState } from 'react';
import { updateJobs } from '../../services/jobs-service/JobsService';

function JobExclusionModal({ jobDetails, isOpen, onClose }) {
  const [isCancelled, setIsCancelled] = useState(false);

  const confirmExclusion = () => {
    const idJob = jobDetails.id_vaga;
    console.log("Job excluido: ", idJob);

    const updateJobData = {
      nome_vaga: jobDetails.nome_vaga,
      status: "FECHADA",
      descricao_vaga: jobDetails.descricao_vaga,
      cargo: jobDetails.nome_cargo,
      setor: jobDetails.nome_setor,
      salario: jobDetails.salario,
      quantidade_vagas: jobDetails.quantidade_vagas,
      data_encerramento: jobDetails.data_encerramento,
    };

    updateJobs(idJob, updateJobData).then(() => {
      // Simula o cancelamento e exibe a mensagem de confirmação
      setIsCancelled(true);
      window.location.reload();
    }).catch((error) => {
      console.log("Erro ao cancelar a vaga: ", error);
    })
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
