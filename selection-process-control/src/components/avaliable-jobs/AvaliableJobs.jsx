import React, { useState } from 'react';
import './AvaliableJobs.css';
import Pagination from '../pagination/Pagination';
import JobApplicationModal from '../job-application-modal/JobApplicationModal';

function AvaliableJobs() {
  const [selectedJob, setSelectedJob] = useState(null); // Estado para rastrear a vaga selecionada
  const [isModalOpen, setIsModalOpen] = useState(false);

  const availableJobs = [
    { id: 1, title: 'Vaga de Desenvolvedor Frontend', description: 'Desenvolva incríveis interfaces.' },
    { id: 2, title: 'Vaga de Designer UX/UI', description: 'Melhore a experiência do usuário.' },
    { id: 3, title: 'Vaga de Analista de Dados', description: 'Analise e transforme dados em insights.' },
  ];

  const openApplicationModal = (job) => {
    setSelectedJob(job); // Define a vaga selecionada
    setIsModalOpen(true); // Abre o modal de inscrição
  };

  return (
    <>
      <div className="jobs-container">
        <h2>VAGAS DISPONÍVEIS</h2>
        <div className="jobs-list">
          {availableJobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <hr />
              <button className='inscription-btn' onClick={() => openApplicationModal(job)}>
                Inscrever
              </button>
            </div>
          ))}
        </div>
        <div className="pagination">
          <Pagination />
        </div>
      </div>

      {selectedJob && (
        <JobApplicationModal
          jobDetails={selectedJob} // Passa os detalhes da vaga selecionada para o modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

export default AvaliableJobs;
